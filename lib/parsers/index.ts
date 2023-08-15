/**
 * @Author: Eric Moore
 */

import { startFromURL, urlToAST } from "$lib/start.ts";
import type { FuncInterface_Param, FunctionBuilderParamInputs } from "$lib/parsers/enhancementFunctions.ts";
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
	params: unknown,
	config: Record<string, unknown>,
) => Promise<EITHER<AST, ReturnedMessages>>;

type IFeedExportingFn = (
	a: AST,
	params: unknown,
	config: Record<string, unknown>,
	msgs?: ReturnedMessages,
) => Promise<EITHER<EnhanceFeed, ReturnedMessages>>;

type IModuleLoader = (
	s: string,
	config: Record<string, unknown>,
	data?: JsonObject,
) => Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>>;

type ParameterizedFn<EFn> = {
	fn: EFn;
	params: unknown;
	// moduleLoader: never;
};

type EnhancementFunctionInputUnion =
	| FuncInterface_Param
	| ParameterizedFn<UnResolvedEnhacement>
	| LoadableModule
	| ResolvedEnhacementFn;

export type LoadableModule = {
	fn: ExternalSystemAlias;
	params: unknown;
	moduleLoader: IModuleLoader;
};

type IEnhancementLoaderFn = (
	specifier: string,
	config: Record<string, unknown>,
	data?: JsonObject,
) => Promise<EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>>;

type IEnhancementLoaderUnion = { [alias: string]: ResolvedEnhacementFn } | IEnhancementLoaderFn;

export interface PipelineState {
	sourceURL?: string;
	data?: JsonObject;
	config: Record<string, unknown>;
	loadingAST: { fn: IFeedLoaderFn; params: unknown };
	exportingAST: { fn: IFeedExportingFn; params: unknown };
	enhancements: {
		// add a nice loader in here for default
		loaderFunctions: Record<string, IEnhancementLoaderFn[]>;
		// bare specifiers -> map; /
		// http specifiers -> fetch()
		// s3 specifiers -> s3 client
		// relative file specifiers -> readFileSync
		enhancementMap: { [specifier: string]: ResolvedEnhacementFn };
		input: EnhancementFunctionInputUnion[];
		resolved: ParameterizedFn<ResolvedEnhacementFn>[];
	};
}

export type JsonArray = Array<JsonType>;
export type JsonObject = { [property: string]: JsonType };
export type JsonType = string | number | boolean | null | JsonArray | JsonObject;

export type EnhanceFeed = {
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
		enhancementFn: string | EnhancementFunctionInputUnion,
		params?: unknown,
	) => IMiddlwares & IExporters;
	using: (enhancementFnArr: EnhancementFunctionInputUnion[]) => IMiddlwares & IExporters;
	withFunctionAccess: (input: IEnhancementLoaderUnion) => IMiddlwares & IExporters;
	data: (dataToAdd: JsonObject) => IMiddlwares & IExporters;
	config: (configOpt: JsonObject) => IMiddlwares & IExporters;
}

interface ILoaders {
	from: (ast: AST) => IMiddlwares & IExporters;
	fromURL: (urlString: string) => IMiddlwares & IExporters;
	fromString: (string: string, url?: string) => IMiddlwares & IExporters;
	fromCustomLoader: (loaderFn: IFeedLoaderFn) => IMiddlwares & IExporters;
	withFunctionAccess: (input: IEnhancementLoaderUnion) => IMiddlwares & IExporters;
	use: (
		enhancementFn: string | EnhancementFunctionInputUnion,
		params?: unknown,
	) => IMiddlwares & IExporters;
	using: (enhancementFnArr: EnhancementFunctionInputUnion[]) => IMiddlwares & IExporters;
}

interface Specifer_URL {
	kind: "url";
	raw: {
		specifier: string;
		params: unknown;
	};
	parsed: {
		specifier: string;
		params: JsonObject;
		url: URL;
	};
}

interface Specifer_Bare {
	kind: "bare";
	raw: {
		specifier: string;
		params: unknown;
	};
	parsed: {
		specifier: string;
		params: unknown;
	};
}

type SpecifierUnion = Specifer_URL | Specifer_Bare;
type PromisedPotentiallyLoadedEnhancement = Promise<
	EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>
>;

interface LoadFeedMode_Params {
	params: {
		config?: Record<string, unknown>;
		data?: JsonObject;
		defaultModuleLoaderMap?: Record<string, ResolvedEnhacementFn>;
		defaultModuleLoaderFn?: IEnhancementLoaderFn;
	};
}

interface LoadFeedMode_State {
	state: PipelineState;
}

//#endregion Types

export const defaultState = (
	_config = {} as Record<string, unknown>,
	_data: JsonObject = {},
	initEnhancementMap: Record<string, ResolvedEnhacementFn> = {},
	initModuleLoaderFn = enhancementResolver,
) =>
	({
		config: {},
		data: {},
		loadingAST: {
			params: undefined,
			fn: (_params, _config) =>
				Promise.reject(Left(addError({
					from: "ƒn: defaultState",
					loc: import.meta.url,
					situation: "loadingAST.fn was never set",
					complication: "Will not know how to import the initial data set to make an ast",
					implication: "Can not start the whole processing pipeline",
					action: "Adding Error",
					benefit: "",
				}))),
		},
		exportingAST: {
			fn: ((
				_a: AST,
				_params?: unknown,
				_config?: Record<string, unknown>,
			) => Promise.reject("No Exporter has been set")) as IFeedExportingFn,
			params: undefined,
		},
		enhancements: {
			enhancementMap: Object.freeze(initEnhancementMap),
			loaderFunctions: { "*": [initModuleLoaderFn] },
			input: [] as (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
			resolved: [] as ParameterizedFn<ResolvedEnhacementFn>[],
		},
	}) as PipelineState;

export const addWarning = (
	msg: Omit<ISCIPAB, "msgType">,
	existingMsgs: ReturnedMessages = { errors: [], warnings: [] },
) =>
	({
		errors: existingMsgs.errors,
		warnings: existingMsgs.warnings.concat([{ ...msg, msgType: "warning" }]),
	}) as ReturnedMessages;

export const addError = (
	msg: Omit<ISCIPAB, "msgType">,
	existingMsgs: ReturnedMessages = { errors: [], warnings: [] },
) => {
	// console.log("addError", { msg, existingMsgs });
	return {
		warnings: existingMsgs.warnings,
		errors: existingMsgs.errors.concat([{ msgType: "error", ...msg }]),
	} as ReturnedMessages;
};

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
		messages: ReturnedMessages = { warnings: [], errors: [] },
	) => {
		// console.log(183, {ast, data, messages})

		const errorBody = (e: unknown) => ({
			from: `From the enhancementAdapter working on AST-Chain-Fn: ${astChainFn.name}`,
			loc: `${e}`,
			action: "Moving On",
			situation: "The ASTChainFunc threw an error",
			complication: "the funciton failed to perform its task",
			implication: "Zero changes to the feed from this function",
			benefit: "Hopefully get functions will run",
		});

		return astChainFn(i)(ast)
			.then(async (d) => Right(await computableToJson(d)))
			.catch((e) => {
				console.warn("Error Thrown from the adapted AST Chain Func", { e, messages });
				return Left(addError(errorBody(e), messages));
			});
	}) as ResolvedEnhacementFn;
};

//#region ActionLoop
const load = async (
	loaderFn: IFeedLoaderFn,
	params: unknown,
	config: Record<string, unknown>,
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
	params: unknown,
	config: Record<string, unknown>,
	anyMessages?: ReturnedMessages,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
	// what about rejection
	const result = await exporterFn(ast, params, config, anyMessages);
	// console.log(244, "exporting: ", { result });
	return result;
};

// deno-lint-ignore require-await
const enhancementResolver: IEnhancementLoaderFn = async (
	enhancemenSpecifier: string,
	config?: Record<string, unknown>,
	_data?: JsonObject,
) => {
	if (enhancemenSpecifier.startsWith("http")) {
		return (import(enhancemenSpecifier)
			.then((mod) =>
				Right(
					{ fn: mod.default ?? mod.fn, params: undefined } as ParameterizedFn<ResolvedEnhacementFn>,
				)
			)
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
			)) as Promise<EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>>;
	} else {
		if (config?.moduleMap) {
			const moduleMap = config.moduleMap as Record<string, ResolvedEnhacementFn>;
			return moduleMap?.[enhancemenSpecifier]
				? Right(
					{ fn: moduleMap[enhancemenSpecifier], params: undefined } as ParameterizedFn<
						ResolvedEnhacementFn
					>,
				)
				: Left(addError({
					from: "loading an enhancement module",
					loc: "uanable to find module",
					situation: "",
					action: "",
					benefit: "",
					complication: "",
					implication: "",
				})) as EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>;
		} else {
			// console.log(266, "resolveEnhancement: ", { enhancementModules });
			return Left(
				addError({
					from: "resolveEnhancement",
					loc: "loading an enhancement module",
					action: "",
					benefit: "",
					implication: "Cannot find the enhancement",
					complication: "unable to lookup as HTTP address, and no dicitonary with which to lookup the specifier",
					situation: "bare specifier provided with moduleMap",
				}),
			) as EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>;
		}
	}
};
// Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>>

const attemptToLoadModuleWithLoaders =
	(loaders: IEnhancementLoaderFn[], config: Record<string, unknown>, data?: JsonObject) =>
	async (moduleToAttempt: FuncInterface_Param): PromisedPotentiallyLoadedEnhancement => {
		const startingError = Either<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>(
			Left(addError({
				from: "attemptToLoadModuleWithLoaders",
				loc: "line:356",
				situation: "Could Not Load Module From Any Loader",
				complication: "Can not use desired enhancement without loading the  module/function",
				implication: "No enhancement will be applied",
				action: "Skipping This Enhancement in attempts to optimistically continue with the others",
				benefit: "The pipeline will continue, hopefully only in degraded state",
			})),
		);

		const { fname, params } = moduleToAttempt;
		let maybeLoaded = Promise.resolve(startingError);

		for (const thisLoaderFn of loaders) {
			const maybeMod = await maybeLoaded;
			if (isRight(maybeMod)) {
				const { fn } = maybeMod.right;
				return Right({ fn, params });
			} else {
				maybeLoaded = thisLoaderFn(fname, config, data);
			}
		}

		return maybeLoaded;
	};

const resolveFuncInterfaceParam = async (
	state: PipelineState,
	input: FuncInterface_Param,
): PromisedPotentiallyLoadedEnhancement => {
	const { fname, params } = input;
	const specifier = await parseSpecifier(fname, params);

	if (specifier.kind === "bare") {
		return fname in state.enhancements.enhancementMap
			? Right({
				fn: state.enhancements.enhancementMap[fname],
				params: params,
			})
			: attemptToLoadModuleWithLoaders(
				[
					...state.enhancements.loaderFunctions[fname],
					...(state.enhancements.loaderFunctions["*"] ?? []),
				],
				state.config,
				state.data,
			)(input);
	} else {
		return fname in state.enhancements.enhancementMap
			? Right({
				fn: state.enhancements.enhancementMap[fname],
				params: params,
			})
			: attemptToLoadModuleWithLoaders(
				[
					...(state.enhancements.loaderFunctions[fname] ?? []),
					...(state.enhancements.loaderFunctions[specifier.parsed.url.protocol] ?? []),
					...(state.enhancements.loaderFunctions["*"] ?? []),
				],
				state.config,
				state.data,
			)(input);
	}
};

const resolveUnresolvedEnhancement = async (
	state: PipelineState,
	input: ParameterizedFn<UnResolvedEnhacement>,
): PromisedPotentiallyLoadedEnhancement => {
	const { fn, params } = input;

	if (typeof fn === "string") {
		const specifier = await parseSpecifier(fn, params);
		if (specifier.kind === "bare") {
			return fn in state.enhancements.enhancementMap
				? Right({
					fn: state.enhancements.enhancementMap[fn],
					params: params,
				})
				: attemptToLoadModuleWithLoaders(
					[
						...state.enhancements.loaderFunctions[fn],
						...(state.enhancements.loaderFunctions["*"] ?? []),
					],
					state.config,
					state.data,
				)({ fname: fn, params: params as FunctionBuilderParamInputs });
		} else {
			return fn in state.enhancements.enhancementMap
				? Right({
					fn: state.enhancements.enhancementMap[fn],
					params: params,
				})
				: attemptToLoadModuleWithLoaders(
					[
						...(state.enhancements.loaderFunctions[fn] ?? []),
						...(state.enhancements.loaderFunctions[specifier.parsed.url.protocol] ?? []),
						...(state.enhancements.loaderFunctions["*"] ?? []),
					],
					state.config,
					state.data,
				)({ fname: fn, params: params as FunctionBuilderParamInputs });
		}
	} else {
		return Right({ fn, params });
	}
};

const resolveLoadableModule = async (
	state: PipelineState,
	input: LoadableModule,
): PromisedPotentiallyLoadedEnhancement => {
	const r = await input.moduleLoader(
		input.fn,
		Object.freeze(state.config),
		Object.freeze(state.data),
	);
	return isRight(r)
		? Right({
			fn: r.right,
			params: input.params,
		})
		: r;
};

const resolveResolvedEnhancement = (
	_state: PipelineState,
	input: ResolvedEnhacementFn,
): PromisedPotentiallyLoadedEnhancement => Promise.resolve(Right({ fn: input, params: undefined }));

const resolveAllEnhancements = async (
	state: PipelineState,
): Promise<Either<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[]> => {
	// Supporting multi proto loading
	// input
	// mapStart => {name: [ string | loaded enhancement function ] }
	// string must be an 'HTTP' address of a loadable enhancementFunction
	//
	// loaderFunctionMap => { specifierTestString: Function }
	//
	//
	// mapResolved => {name: enhnacementFunction}
	//

	// how to select a loader??
	//  regsiter a regex tester function - only run those that pass?
	//  but then if multiple pass?
	//
	// or just have a list and run them sequentially until thr first once passes - then return
	// if none pass, then return an error

	const allEnhancements = await Promise.all(
		state.enhancements.input.map((eMod) => {
			// eMod
			// FuncInterface_Param 	| ParameterizedFn<UnResolvedEnhacement> | LoadableModule | ResolvedEnhacementFn;
			// fname 				| fn									| loaderFn		 | typeof X === 'function'

			if (typeof eMod === "function") {
				return resolveResolvedEnhancement(state, eMod);
			} else if ("fname" in eMod) {
				return resolveFuncInterfaceParam(state, eMod);
			} else if ("fn" in eMod) {
				return resolveUnresolvedEnhancement(state, eMod);
			} else {
				return resolveLoadableModule(state, eMod);
			}
		}),
	) as EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[];

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
			return isLeft(result)
				? [ast, Left(mergeMessages(result.left, errs.left))] as [RIGHT<AST>, LEFT<ReturnedMessages>]
				: [result, errs] as [RIGHT<AST>, LEFT<ReturnedMessages>];
		},
		Promise.resolve([
			Right(ast),
			Left({ errors: [], warnings: [] }),
		]) as Promise<[RIGHT<AST>, LEFT<ReturnedMessages>]>,
	);
	// console.log(334, "runAllenhancements: ", { result });
	return result;
};

const runEverything = async (
	state: PipelineState,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
	const ast = await load(
		state.loadingAST.fn,
		state.loadingAST.params,
		state.config,
	);

	const eitherModuleOrMessgage = await resolveAllEnhancements(
		state,
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
	// 	eitherModuleOrMessgage,
	// 	enhancementsModules,
	// 	errMessages,
	// 	ast,
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
				state.exportingAST.fn,
				finishedAST.right,
				state.exportingAST.params,
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
			// console.log(395, "Exporting w/ Messages", { ast, errMessages });

			return exporting(
				state.exportingAST.fn,
				ast.right,
				state.exportingAST.params,
				state?.config,
				errMessages,
			);
		}
	}
};

//#endregion ActionLoop

const withFunctionAccess = (state: PipelineState) =>
( // accessfunctionForEnhancement OR enhancementMap
	input: IEnhancementLoaderFn | Record<string, ResolvedEnhacementFn>,
): IMiddlwares & IExporters => {
	const nextState = {
		...state,
		enhancements: {
			...state.enhancements,
			...(typeof input === "function"
				// loader get applied with specifiers - and the specifiers becomes the name - in the map
				? { loaderFunctions: { ...state.enhancements.loaderFunctions, "*": input } }
				// maps are already loaded and named
				: { defaultFunctionMap: { ...state.enhancements.enhancementMap, ...input } }),
		},
	} as PipelineState;

	return {
		use: use(nextState),
		using: using(nextState),
		withFunctionAccess: withFunctionAccess(nextState),

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

const using =
	(state: PipelineState) => (enhancementFnArr: EnhancementFunctionInputUnion[]): IMiddlwares & IExporters => {
		const nextState = enhancementFnArr.reduce((curState, elem) => {
			if ("fname" in elem) {
				return {
					...curState,
					enhancements: {
						...curState.enhancements,
						input: [...curState.enhancements.input, {
							fn: elem.fname,
							params: elem.params,
							moduleLoader: state.enhancements.loaderFunctions,
						}],
					},
				} as PipelineState;
			} else {
				return {
					...curState,
					enhancements: {
						...curState.enhancements,
						input: [...curState.enhancements.input, { ...elem, moduleLoader: enhancementResolver }],
					},
				} as PipelineState;
			}
		}, state as PipelineState);

		return {
			use: use(nextState),
			withFunctionAccess: withFunctionAccess(nextState),
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

const tryJsonParse = (s: string): JsonType => {
	try {
		return JSON.parse(`${s}`) as JsonObject;
	} catch {
		return null;
	}
};

const checkParsingRulesFor = (s: string): boolean => {
	const startsWithNumber = /^[0-9].*/gi.test(s);
	const startsWithCurly = /^\{.*$/gi.test(s);
	const startsWithBracket = /^\[.*$/gi.test(s);
	const isNullString = s === "null";
	return startsWithNumber ||
		startsWithCurly ||
		startsWithBracket ||
		isNullString;
};

/**
 * Getting a strange Deno/Typescript erorr when trying to use the url.SearchParams.entries
 */
export const parseSearchString = (s: string | URLSearchParams): JsonObject => {
	// console.log(773, 'parseSearchString', {str : s})
	if (typeof s === "string") {
		if (s === "") {
			return {};
		} else {
			s = s.startsWith("?") ? s.slice(1) : s;
			const entries = s.split("&")
				.map((ts) => ts.split("="))
				.map(([key, val]) => {
					// console.log(762, 'map', {key, val})
					return [key, checkParsingRulesFor(val) ? tryJsonParse(val) : val];
				});
			return Object.fromEntries(entries);
		}
	} else {
		const acc = {} as JsonObject;
		s.forEach((val, key) => {
			// console.log(765, ' checkParsingRulesFor:',  checkParsingRulesFor(val))
			acc[key] = checkParsingRulesFor(val) ? tryJsonParse(val) : val;
		});
		return acc;
	}
};

export const parseSpecifier = (specifier: string, params?: unknown): SpecifierUnion => {
	if (specifier.includes("://")) {
		const u = new URL(specifier);
		return {
			kind: "url",
			raw: { specifier, params },
			parsed: {
				url: u,
				specifier: u.href,
				params: parseSearchString(u.search),
			},
		};
	} else {
		return {
			kind: "bare",
			raw: { specifier: specifier, params },
			parsed: { specifier, params },
		};
	}
};

const use = (state: PipelineState) =>
(
	enhancementFn: string | EnhancementFunctionInputUnion,
	params?: unknown,
): IMiddlwares & IExporters => {
	const resolveableEnhancementMod = typeof enhancementFn === "string"
		// give strings the default loader
		? {
			fname: enhancementFn,
			params,
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
		withFunctionAccess: withFunctionAccess(nextState),
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

const data = (state: PipelineState) => (dataToAdd: JsonObject): IMiddlwares & IExporters => {
	const nextState = { ...state, data: dataToAdd } as PipelineState;

	return {
		use: use(nextState),
		using: using(nextState),
		withFunctionAccess: withFunctionAccess(nextState),
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

const config = (state: PipelineState) => (configOpt: JsonObject): IMiddlwares & IExporters => {
	// maybe config can piece by piece update the State Obj?
	const nextState = { ...state, config: configOpt };
	return {
		use: use(nextState),
		using: using(nextState),
		withFunctionAccess: withFunctionAccess(nextState),
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

const toJsonFeed = (state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
	state.exportingAST.params = exportingParams;
	state.exportingAST.fn = (async (ast, _param, _config, messages) => {
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

const toAtom = (state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
	state.exportingAST.params = exportingParams;
	state.exportingAST.fn = (async (ast, _param, _config, messages) => {
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

const toRSS = (state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
	state.exportingAST.params = exportingParams;
	state.exportingAST.fn = (async (ast, _param, _config, messages) => {
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
						implication: "You will not have anything to see, and not enough information to make a good guess at intent",
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

const toCity = (state: PipelineState) => (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
	state.exportingAST.params = exportingParams;
	state.exportingAST.fn = (async (ast, _param, _config, messages) => {
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
						implication: "You will not have anything to see, and not enough information to make a good guess at intent",
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
		state.exportingAST = { fn: exportFn, params };

		return runEverything(state)
			.then((final) => isRight(final) ? Promise.resolve(final.right) : Promise.reject(final.left));
	};

//#region Loader

/**
 * @param initalState
 */
const from = (initalState: PipelineState) => (ast: AST) => {
	const nextState: PipelineState = {
		...initalState,
		loadingAST: { fn: () => Promise.resolve(Right(ast)), params: undefined },
	};

	const ret: IMiddlwares & IExporters = {
		use: use(nextState),
		using: using(nextState),
		withFunctionAccess: withFunctionAccess(nextState),

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
const fromString = (initalState: PipelineState) => (str: string, url = "http://example.com/pretendFeed.json") => {
	const nextState: PipelineState = {
		...initalState,
		sourceURL: url,
		loadingAST: {
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
		withFunctionAccess: withFunctionAccess(nextState),

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
		loadingAST: {
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
		withFunctionAccess: withFunctionAccess(nextState),

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
const fromCustomLoader = (initalState: PipelineState) => (loaderFn: IFeedLoaderFn, params?: unknown) => {
	const nextState: PipelineState = {
		...initalState,
		loadingAST: {
			fn: loaderFn,
			params,
		},
	};
	// console.log(777, { nextState });
	const ret: IMiddlwares & IExporters = {
		use: use(nextState),
		using: using(nextState),
		withFunctionAccess: withFunctionAccess(nextState),

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

export const loadFeed = (input?: LoadFeedMode_Params | LoadFeedMode_State): ILoaders => {
	const startingState: PipelineState = input
		? "params" in input && input.params
			? defaultState(
				input.params?.config,
				input.params?.data,
				input.params?.defaultModuleLoaderMap,
				input.params?.defaultModuleLoaderFn,
			)
			: (input as LoadFeedMode_State).state
		: defaultState();

	return {
		use: use(startingState),
		using: using(startingState),
		withFunctionAccess: withFunctionAccess(startingState),
		from: from(startingState),
		fromCustomLoader: fromCustomLoader(startingState),
		fromString: fromString(startingState),
		fromURL: fromURL(startingState),
	};
};

export default loadFeed;
