/**
 * @Author: Eric Moore
 */

import { startFromURL, urlToAST } from "$lib/start.ts";

import type { Either as EITHER, Left as LEFT, PromiseOr, Right as RIGHT } from "$lib/types.ts";

import { Either, isLeft, isRight, Left, Right } from "$lib/types.ts";
import { type AST, type ASTjson, computableToJson } from "$lib/parsers/ast.ts";

import * as atom from "./atom.ts";
import * as rss from "./rss.ts";
import * as jsonfeed from "./jsonFeed.ts";

export * as atom from "./atom.ts";
export * as rss from "./rss.ts";
export * as jsonfeed from "./jsonFeed.ts";
export * as sitemap from "./sitemap.ts";

import { type ASTChainFunc } from "../enhancements/index.ts";

//#region Types

export interface ISCIPAB {
	from: string; // FeedFunc
	loc: string; // DataLocation
	msgType: "warning" | "error";
	situation: string; //  (what happened)
	complication: string; // (why its a problem)
	implication: string; // (why you might care)
	action: string; // (what we did to help you)
	benefit: string; // (hopefully you like it - because)
}
export type ReturnedMessages = {
	warnings: ISCIPAB[];
	errors: ISCIPAB[];
};

export type ResolvedEnhacementFn = (
	i: unknown,
) => (
	ast: PromiseOr<AST>,
	data?: JsonObject,
	existingMsgs?: ReturnedMessages,
) => Promise<EITHER<AST, ReturnedMessages>>;

type ModuleLocationURLstring = string;
type ExternalSystemAlias = string;
type UnResolvedEnhacement = ModuleLocationURLstring | ResolvedEnhacementFn;

type IFeedLoaderFn = (
	params?: unknown,
	config?: JsonObject,
) => Promise<EITHER<AST, ReturnedMessages>>;

type IFeedExportingFn = (
	a: AST,
	params?: unknown,
	config?: JsonObject,
	msgs?: ReturnedMessages,
) => Promise<EITHER<EnhanceFeed, ReturnedMessages>>;

type IModuleLoader = (
	s: string,
	data?: JsonObject,
	config?: JsonObject,
) => Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>>;

type ParameterizedFn<EFn> = {
	fn: EFn;
	params: unknown;
	moduleLoader: never;
};

type LoadableModule = {
	fn: ExternalSystemAlias;
	params: unknown;
	moduleLoader: IModuleLoader;
};

interface PipelineState {
	sourceURL?: string;
	data?: JsonObject;
	config?: JsonObject;
	loading: { fn: IFeedLoaderFn; params: unknown };
	exporting: { fn: IFeedExportingFn; params: unknown };
	enhancements: {
		input: (ParameterizedFn<ResolvedEnhacementFn> | LoadableModule)[];
		resolved: ParameterizedFn<ResolvedEnhacementFn>[];
	};
}

type JsonArray = Array<JsonType>;
type JsonObject = { [property: string]: JsonType };
type JsonType = string | number | boolean | null | JsonArray | JsonObject;

type EnhanceFeed = {
	string: string;
	ast: ASTjson;
	messages: ReturnedMessages;
};

interface IExporters {
	toAtom: (exportingParams?: unknown) => Promise<EnhanceFeed>;
	toCity: (exportingParams?: unknown) => Promise<EnhanceFeed>;
	toJsonFeed: (exportingParams?: unknown) => Promise<EnhanceFeed>;
	toRSS: (exportingParams?: unknown) => Promise<EnhanceFeed>;
	toCustomExport: (
		exportFn: IFeedExportingFn,
		params?: unknown,
	) => Promise<EnhanceFeed>;
	state: () => PipelineState;
}

interface IMiddlwares {
	use: (
		enhancementFn: string | ResolvedEnhacementFn | LoadableModule,
		params?: unknown,
	) => IMiddlwares & IExporters;
	using: (
		enhancementFnArr: (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
	) => IMiddlwares & IExporters;
	data: (dataToAdd: JsonObject) => IMiddlwares & IExporters;
	config: (configOpt: JsonObject) => IMiddlwares & IExporters;
}

interface ILoaders {
	from: (ast: AST) => IMiddlwares & IExporters;
	fromURL: (urlString: string) => IMiddlwares & IExporters;
	fromString: (string: string, url?: string) => IMiddlwares & IExporters;
	fromCustomLoader: (loaderFn: IFeedLoaderFn) => IMiddlwares & IExporters;
	use: (
		enhancementFn: string | ResolvedEnhacementFn | LoadableModule,
		params?: unknown,
	) => IMiddlwares & IExporters;
	using: (
		enhancementFnArr: (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
	) => IMiddlwares & IExporters;
}

//#endregion Types

export const addWarning = (
	msg: Omit<ISCIPAB, "msgType">,
	existingMsgs: ReturnedMessages = { errors: [], warnings: [] },
) =>
	({
		errors: existingMsgs.errors,
		warnings: [...existingMsgs.warnings, { ...msg, msgType: "warning" }],
	}) as ReturnedMessages;

export const addError = (
	msg: Omit<ISCIPAB, "msgType">,
	existingMsgs: ReturnedMessages = { errors: [], warnings: [] },
) =>
	({
		warnings: existingMsgs.warnings,
		errors: [...existingMsgs.errors, { ...msg, msgType: "error" }],
	}) as ReturnedMessages;

export const mergeMessages = (
	a: ReturnedMessages,
	b: ReturnedMessages = { errors: [], warnings: [] },
): ReturnedMessages => ({
	errors: [...a.errors, ...b.errors],
	warnings: [...a.warnings, ...b.warnings],
});

export const enhancementAdapter = (astChainFn: ASTChainFunc) => {
	// console.log(175, 'Adapter INIT ', {astChainFn})

	return ((i: unknown) =>
	(
		ast: PromiseOr<AST>,
		_data?: JsonObject,
		messages?: ReturnedMessages,
	) => {
		// console.log(183, {ast, data, messages})

		return astChainFn(i)(ast)
			.then(async (d) => Right(await computableToJson(d)))
			.catch((e) =>
				Left(
					addError({
						from: `From the enhancementAdapter working on AST-Chain-Fn: ${astChainFn.name}`,
						loc: e.toString(),
						action: "Moving On",
						situation: "The ASTChainFunc threw an error",
						complication: "the funciton failed to perform its task",
						implication: "Zero changes to the feed from this function",
						benefit: "Hopefully get functions will run",
					}, messages),
				)
			);
	}) as ResolvedEnhacementFn;
};

//#region ActionLoop
const load = async (
	loaderFn: IFeedLoaderFn,
	params?: unknown,
	config?: JsonObject,
): Promise<EITHER<AST, ReturnedMessages>> => {
	const result = await loaderFn(params, config);

	return isLeft(result)
		? Left(
			addError({
				from: "load",
				loc: "load",
				situation: "Loader Function Failed",
				complication: "All Processing Starts with this feed",
				implication: "It did not load, so nothing else can run on that feed",
				action: "No guesswork makes sense unless there is a feed ",
				benefit: "No worries of guessing wrong",
			}, result.left),
		)
		: Right(result.right as AST);
};

const exporting = async (
	exporterFn: IFeedExportingFn,
	ast: AST,
	params?: unknown,
	config?: JsonObject,
	anyMessages?: ReturnedMessages,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
	// what about rejection
	const result = await exporterFn(ast, params, config, anyMessages);
	// console.log(244, "exporting: ", { result });
	return result;
};

const resolveEnhancement = async (
	enhancementURL: string,
	_data?: JsonObject,
	_config?: JsonObject,
): Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>> => {
	const enhancementModules = await import(enhancementURL)
		.then((mod) => Right(mod))
		.catch((er) =>
			Left(
				addError({
					from: "loading an enhancement module",
					loc: er.toString(),
					situation: "",
					action: "",
					benefit: "",
					complication: "",
					implication: "",
				}),
			)
		) as EITHER<{ [key: string]: unknown }, ReturnedMessages>;

	// console.log(266, "resolveEnhancement: ", { enhancementModules });

	return isLeft(enhancementModules)
		? Left(
			addError({
				from: "resolveEnhancement",
				loc: "loading an enhancement module",
				action: "",
				benefit: "",
				complication: "",
				implication: "",
				situation: "",
			}, enhancementModules.left),
		)
		: Right(
			(enhancementModules.right?.enhancement ??
				enhancementModules.right?.fn) as ResolvedEnhacementFn,
		);
};

const resolveAllEnhancements = async (
	enhancementArr: (ParameterizedFn<ResolvedEnhacementFn> | LoadableModule)[],
	data?: JsonObject,
	config?: JsonObject,
): Promise<
	Either<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[]
> => {
	const allEnhancements = await Promise.all(
		enhancementArr.map(async ({ fn, params, moduleLoader }) => {
			if (typeof fn === "string") {
				const result = await moduleLoader(fn, data, config);
				return result.left ? Left(result.left) : Right({ fn: result.right, params, moduleLoader });
			} else {
				return Right({ fn, params });
			}
		}),
	) as EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[];
	// console.log(308, "resolve ALL Enhancements: ", { allEnhancements });
	return allEnhancements;
};

const runAllenhancements = (
	enhancementArr: ParameterizedFn<ResolvedEnhacementFn>[],
	ast: AST,
	data?: JsonObject,
) => {
	const result = enhancementArr.reduce(
		async (acc, { fn, params }) => {
			const [ast, errs] = await acc;
			const result = await fn(params)(await ast.right, data, errs.left);
			return result.left
				? [ast, Left(mergeMessages(result.left, errs.left))] as [
					RIGHT<AST>,
					LEFT<ReturnedMessages>,
				]
				: [result, errs] as [RIGHT<AST>, LEFT<ReturnedMessages>];
		},
		Promise.resolve([
			Right(ast),
			Left({} as ReturnedMessages),
		]) as Promise<[RIGHT<AST>, LEFT<ReturnedMessages>]>,
	);
	// console.log(334, "runAllenhancements: ", { result });
	return result;
};

const runEverything = async (
	state: PipelineState,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
	const ast = await load(
		state.loading.fn,
		state.loading.params,
		state.config,
	);

	const eitherModuleOrMessgage = await resolveAllEnhancements(
		state.enhancements.input,
		state?.data,
		state.config,
	);

	const enhancementsModules = eitherModuleOrMessgage
		.filter(isRight)
		.map((elem) => elem.right) as ParameterizedFn<ResolvedEnhacementFn>[];

	const errMessages = eitherModuleOrMessgage
		.filter(isLeft)
		.reduce(
			(acc, msg) => mergeMessages(msg.left, acc),
			{ errors: [], warnings: [] } as ReturnedMessages,
		);

	// console.log(357, "runEverything: ", {
	//   eitherModuleOrMessgage,
	//   enhancementsModules,
	//   errMessages,
	//   ast,
	// });

	// console.log(370, "AST + Modules Loaded", ast, enhancementsModules.length);

	// console.log( 366, 'isRight:', isRight(ast) )
	// console.log( 367, 'errMessages.errors.length:', errMessages.errors.length )

	if (ast.right && errMessages.errors.length === 0) {
		state.enhancements.resolved = enhancementsModules;
		state.enhancements.input = [];

		const [finishedAST, messages] = await runAllenhancements(
			state.enhancements.resolved,
			ast.right,
			state?.data,
		);

		// console.log(376, "AST + Messages", {messages});

		if (finishedAST.right) {
			// console.log(382, "Pre Exporting", finishedAST.right);

			return exporting(
				state.exporting.fn,
				finishedAST.right,
				state.exporting.params,
				state?.config,
			);
		} else {
			// console.log(392, "finished AST was a LEFT", messages.left);
			return Left(messages.left);
		}
	} else {
		// console.log(396, "AST left || errMessages", errMessages);
		if (isLeft(ast)) {
			return Left(mergeMessages(ast.left, errMessages));
		} else {
			console.log(395, "Exporting w/ Messages", { ast, errMessages });

			return exporting(
				state.exporting.fn,
				ast.right,
				state.exporting.params,
				state?.config,
				errMessages,
			);
		}
	}
};

//#endregion ActionLoop

const using = (state: PipelineState) =>
(
	enhancementFnArr: (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
): IMiddlwares & IExporters => {
	const nextState = {
		...state,
		enhancements: {
			...state.enhancements,
			input: [...state.enhancements.input, ...enhancementFnArr],
		},
	} as PipelineState;

	return {
		use: use(nextState),
		using: using(nextState),
		data: data(nextState),
		state: extractState(nextState),
		config: config(nextState),
		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
};

const use = (state: PipelineState) =>
(
	enhancementFn: string | ResolvedEnhacementFn | LoadableModule,
	params?: unknown,
): IMiddlwares & IExporters => {
	const resolveableEnhancementMod = typeof enhancementFn === "string"
		// give strings the default loader
		? {
			fn: enhancementFn,
			params,
			moduleLoader: (id: string, d?: JsonObject, c?: JsonObject) => resolveEnhancement(id, d, c),
		}
		: {
			fn: enhancementFn,
			params,
		};

	const nextState = {
		...state,
		enhancements: {
			...state.enhancements,
			input: [
				...state.enhancements.input,
				resolveableEnhancementMod,
			],
		},
	} as PipelineState;

	// console.log(460, 'nextState after `use`:', {nextState})

	return {
		use: use(nextState),
		using: using(nextState),

		state: extractState(nextState),
		data: data(nextState),
		config: config(nextState),

		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
};

const extractState = (state: PipelineState) => () => {
	return Object.freeze(state);
};

const data = (state: PipelineState) =>
(
	dataToAdd: JsonObject,
): IMiddlwares & IExporters => {
	const nextState = {
		...state,
		data: dataToAdd,
	} as PipelineState;

	return {
		use: use(nextState),
		using: using(nextState),
		data: data(nextState),
		state: extractState(nextState),
		config: config(nextState),
		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
};

const config = (state: PipelineState) =>
(
	configOpt: JsonObject,
): IMiddlwares & IExporters => {
	// maybe config can piece by piece update the State Obj?
	const nextState = {
		...state,
		config: configOpt,
	};
	return {
		use: use(nextState),
		using: using(nextState),
		data: data(nextState),
		state: extractState(nextState),
		config: config(nextState),
		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
};

const toJsonFeed =
	(state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
		state.exporting.params = exportingParams;
		state.exporting.fn = (async (ast, _param, _config, messages) => {
			// console.log(528, "to JSON feed");

			const resp = await jsonfeed.JsonFeed<jsonfeed.RespStruct>(
				{},
				state?.sourceURL ?? "",
			)
				.fromAST(ast)
				.then((resp) => Right(resp))
				.catch((err) =>
					Left(addError({
						from: "Exporting To JsonFeed",
						loc: err.toString(),
						situation: "unable to export to JSON Feed from the incoming AST",
						implication: "Not Sure what to do with the AST",
						complication: "There will be nothing to show",
						action: "",
						benefit: "",
					}, messages))
				);

			// console.log(538, { resp });

			if (isRight(resp)) {
				const string = jsonfeed.JsonFeed(resp.right, resp.right.feed_url)
					.toString();

				return Right({
					ast: await computableToJson(ast),
					messages: messages ?? { errors: [], warnings: [] },
					string,
				});
			} else {
				return Left(
					mergeMessages(
						resp.left,
						addError({
							from: "exporting jsonFeed",
							loc: "exporting jsonFeed",
							situation: "Error occured during the export of the ast to jsonFeed",
							complication: "Not sure how to show the ast",
							implication: "You will not have anything to see",
							action: ">>  Try another export?",
							benefit: "so that you can see something?",
						}, resp.left),
					),
				);
			}
		}) as IFeedExportingFn;

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

const toAtom =
	(state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
		state.exporting.params = exportingParams;
		state.exporting.fn = (async (ast, _param, _config, messages) => {
			const resp = await atom.Atom<atom.RespStruct>({}, "").fromAST(ast)
				.then((resp) => Right(resp))
				.catch((err) =>
					Left(addError({
						from: "exporting Atom",
						loc: `${err}`,
						situation: "Error occured during the export of the ast to Atom Feed",
						complication: "Not sure how to show the ast",
						implication: "You will not have anything to see",
						action: ">>  Try another export?",
						benefit: "so that you can see something?",
					}, messages))
				);

			if (isRight(resp)) {
				const string = atom.Atom(
					resp.right,
					Array.isArray(resp.right.feed.link)
						// deno-lint-ignore no-explicit-any
						? (resp.right.feed.link as any[])[0]._attributes.href
						// deno-lint-ignore no-explicit-any
						: (resp.right.feed.link as any)._attributes.href ?? "",
				).toString();

				return Right({
					ast: await computableToJson(ast),
					string,
					messages,
				});
			} else {
				return Left(
					mergeMessages(
						resp.left,
						addError({
							from: "exporting Atom",
							loc: "exporting Atom",
							situation: "Error occured during the export of the ast to Atom Feed",
							complication: "Not sure how to show the ast",
							implication: "You will not have anything to see",
							action: ">>  Try another export?",
							benefit: "so that you can see something?",
						}, resp.left),
					),
				);
			}
		}) as IFeedExportingFn;

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

const toRSS =
	(state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
		state.exporting.params = exportingParams;
		state.exporting.fn = (async (ast, _param, _config, messages) => {
			const resp = await rss.Rss<rss.RespStruct>({}, "")
				.fromAST(ast)
				.then((d) => Right(d))
				.catch((er) =>
					Left(
						addError({
							from: "exporting RSS",
							loc: `${er}`,
							situation: "Error occured during the export of the ast to RSS Feed",
							complication: "Not sure how to show the ast",
							implication:
								"You will not have anything to see, and not enough information to make a good guess at intent",
							action: "No inferred action can be taken",
							benefit: "No guessing will be required of the user",
						}),
					)
				);
			if (isRight(resp)) {
				const string = rss.Rss(
					resp.right,
					typeof resp.right.rss.channel.link === "string"
						? resp.right.rss.channel.link
						: resp.right.rss.channel.link._text ?? "",
				).toString();

				return Right({
					ast: await computableToJson(ast),
					string,
					messages,
				} as EnhanceFeed);
			} else {
				return Left(resp.left);
			}
		}) as IFeedExportingFn;

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

const toCity =
	(state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
		state.exporting.params = exportingParams;
		state.exporting.fn = (async (ast, _param, _config, messages) => {
			const resp = await jsonfeed.JsonFeed<jsonfeed.RespStruct>(
				{},
				state?.sourceURL ?? "",
			).fromAST(ast)
				.then((d) => Right(d))
				.catch((er) =>
					Left(
						addError({
							from: "exporting City Feed",
							loc: `${er}`,
							situation: "Error occured during the export of the ast to City Feed",
							complication: "Not sure how to show the ast",
							implication:
								"You will not have anything to see, and not enough information to make a good guess at intent",
							action: "No inferred action can be taken",
							benefit: "No guessing will be required of the user",
						}),
					)
				);

			if (isRight(resp)) {
				const string = JSON.stringify(resp.right);

				return Right({
					ast: await computableToJson(ast),
					string,
					messages,
				} as EnhanceFeed);
			} else {
				return Left(resp.left);
			}
		}) as IFeedExportingFn;

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

const toCustomExport =
	(state: PipelineState) => (exportFn: IFeedExportingFn, params: unknown): Promise<EnhanceFeed> => {
		state.exporting = { fn: exportFn, params };

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

const defaultState = () =>
	({
		loading: {
			fn: ((_params?: unknown, _data?: JsonObject, _config?: JsonObject) =>
				Promise.reject("No Loader has been set")) as IFeedLoaderFn,
			params: undefined,
		},
		exporting: {
			fn: ((
				_a: AST,
				_params?: unknown,
				_config?: JsonObject,
			) => Promise.reject("No Exporter has been set")) as IFeedExportingFn,
			params: undefined,
		},
		enhancements: {
			input: [] as (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
			resolved: [] as ParameterizedFn<ResolvedEnhacementFn>[],
		},
	}) as PipelineState;

//#region Loader

/**
 * @param initalState
 */
const from = (initalState: PipelineState) => (ast: AST) => {
	const nextState: PipelineState = {
		...initalState,
		loading: {
			fn: () => Promise.resolve(Right(ast)),
			params: undefined,
		},
	};

	const ret: IMiddlwares & IExporters = {
		use: use(nextState),
		using: using(nextState),

		state: extractState(nextState),
		data: data(nextState),
		config: config(nextState),

		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
	return ret;
};

/**
 * @param initalState
 */
const fromString =
	(initalState: PipelineState) => (str: string, url = "http://example.com/pretendFeed.json") => {
		const nextState: PipelineState = {
			...initalState,
			sourceURL: url,
			loading: {
				fn: () =>
					urlToAST({ url, txt: str })
						.then((d) => Right(d))
						.catch((er) =>
							Left(
								addError({
									from: "from String",
									loc: `${er}`,
									situation: "Error occured while bootstrapping the AST from a string",
									complication: "Not sure how to get an ast",
									implication:
										"You will not have anything to see, and not enough information to make a good guess at intent",
									action: "No inferred action can be taken",
									benefit: "No guessing will be required of the user",
								}),
							)
						),
				params: undefined,
			},
		};

		const ret: IMiddlwares & IExporters = {
			use: use(nextState),
			using: using(nextState),

			state: extractState(nextState),
			data: data(nextState),
			config: config(nextState),

			toAtom: toAtom(nextState),
			toCity: toCity(nextState),
			toJsonFeed: toJsonFeed(nextState),
			toRSS: toRSS(nextState),
			toCustomExport: toCustomExport(nextState),
		};
		return ret;
	};

/**
 * ## From URL
 * Load a Feed from a URL or a URL string
 *
 * @param url
 */
const fromURL = (initalState: PipelineState) => (url: string | URL) => {
	const urlString = typeof url === "string" ? url : url.href;

	const nextState: PipelineState = {
		...initalState,
		sourceURL: urlString,
		loading: {
			fn: async () =>
				urlToAST(await startFromURL(urlString))
					.then((d) => Right(d))
					.catch((er) =>
						Left(
							addError({
								from: "importing from URL",
								loc: `${er}`,
								situation: "Error occured during the import of an ast from a feed URL",
								complication: "Not sure how to show the ast",
								implication:
									"You will not have anything to see, and not enough information to make a good guess at intent",
								action: "No inferred action can be taken",
								benefit: "No guessing will be required of the user",
							}),
						)
					),
			params: undefined,
		},
	};

	// console.log(838, { nextState });

	const ret: IMiddlwares & IExporters = {
		use: use(nextState),
		using: using(nextState),

		state: extractState(nextState),
		data: data(nextState),
		config: config(nextState),

		toAtom: toAtom(nextState),
		toCity: toCity(nextState),
		toJsonFeed: toJsonFeed(nextState),
		toRSS: toRSS(nextState),
		toCustomExport: toCustomExport(nextState),
	};
	return ret;
};

/**
 * ## From Custom Loader
 * @param initalState
 */
const fromCustomLoader =
	(initalState: PipelineState) => (loaderFn: IFeedLoaderFn, params?: unknown) => {
		const nextState: PipelineState = {
			...initalState,
			loading: {
				fn: loaderFn,
				params,
			},
		};
		// console.log(777, { nextState });
		const ret: IMiddlwares & IExporters = {
			use: use(nextState),
			using: using(nextState),

			state: extractState(nextState),
			data: data(nextState),
			config: config(nextState),

			toAtom: toAtom(nextState),
			toCity: toCity(nextState),
			toJsonFeed: toJsonFeed(nextState),
			toRSS: toRSS(nextState),
			toCustomExport: toCustomExport(nextState),
		};
		return ret;
	};

//#endregion Loader

export const loadFeed = (initalState = defaultState()): ILoaders => {
	return {
		use: use(initalState),
		using: using(initalState),
		from: from(initalState),
		fromCustomLoader: fromCustomLoader(initalState),
		fromString: fromString(initalState),
		fromURL: fromURL(initalState),
	};
};

export default loadFeed;
