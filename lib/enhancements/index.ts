// deno-lint-ignore-file
// deno-lint-ignore-file require-await
import type { ASTComputable, ASTJson, PromiseOr } from "../types.ts";
export type Dict<T> = { [key: string]: T };
export type AST = ASTComputable | ASTJson;
export type ASTChainFunc = (
	i: unknown,
) => (ast: PromiseOr<AST>) => Promise<AST>;
export type CloudChangeFunction = (...inputs: unknown[]) => Promise<string>;
export interface ProviderFunctions {
	install: CloudChangeFunction;
	remove: CloudChangeFunction;
}

export interface ProviderParamSchemas {
	install: string;
	remove: string;
}

export interface EnhancementModuleInputChangeSetInstallFunctions {
	install: CloudChangeFunction;
	remove: CloudChangeFunction;
	aws: ProviderFunctions;
	azure: ProviderFunctions;
	gcloud: ProviderFunctions;
}

export interface EnhancementModuleCloudParamSchemas {
	install: string;
	remove: string;
	aws: ProviderParamSchemas;
	gcloud: ProviderParamSchemas;
	azure: ProviderParamSchemas;
}

export interface EnhancementModule {
	run: ASTChainFunc;
	cloud?: EnhancementModuleInputChangeSetInstallFunctions;
	paramsSchema: {
		run: string;
		cloud?: EnhancementModuleCloudParamSchemas;
	};
}

export interface EnhancementModuleInput {
	run: ASTChainFunc;
	cloud: Partial<EnhancementModuleInputChangeSetInstallFunctions>;
	paramSchema: {
		run: string;
		cloud: Partial<EnhancementModuleCloudParamSchemas>;
	};
}

export const composeASTChains =
	(chain: ASTChainFunc[] = [], params: unknown[] = []) => async (ast: PromiseOr<AST>) =>
		chain.reduce(async (ast: Promise<AST>, fn: ASTChainFunc, i) => {
			return fn(params[i])(await ast);
		}, Promise.resolve(ast));

export const EnhancementModule = (
	opts: EnhancementModuleInput,
): EnhancementModule => {
	const run = opts.run ?? ((_i: unknown) => async (ast) => ast) as ASTChainFunc;

	const cloud = (
		input: Partial<EnhancementModuleInputChangeSetInstallFunctions>,
	): EnhancementModuleInputChangeSetInstallFunctions => {
		const aws = input.aws ??
			{ install: async () => "", remove: async () => "" };
		const azure = input.azure ??
			{ install: async () => "", remove: async () => "" };
		const gcloud = input.gcloud ??
			{ install: async () => "", remove: async () => "" };
		const install: CloudChangeFunction = input.install ||
			(async () => "") as CloudChangeFunction;
		const remove: CloudChangeFunction = input.remove ||
			(async () => "") as CloudChangeFunction;

		return {
			aws,
			azure,
			gcloud,
			install,
			remove,
		} as EnhancementModuleInputChangeSetInstallFunctions;
	};

	const paramSchema = (
		input: { run: string; cloud: Partial<EnhancementModuleCloudParamSchemas> },
	): { run: string; cloud: EnhancementModuleCloudParamSchemas } => {
		return {
			run: input.run ?? "",
			cloud: {
				install: input?.cloud?.install ?? "",
				remove: input?.cloud?.remove ?? "",
				aws: input?.cloud?.aws ?? { install: "", remove: "" },
				azure: input?.cloud?.azure ?? { install: "", remove: "" },
				gcloud: input?.cloud?.gcloud ?? { install: "", remove: "" },
			},
		};
	};

	return {
		run,
		cloud: cloud(opts.cloud),
		paramsSchema: paramSchema(opts.paramSchema),
	};
};

// import * as addHash from "./addHash/index.ts";
// import * as addKeywordComparison from "./addKeywordComparison/index.ts";
// import * as addKeywordDigest from "./addKeywordDigest/index.ts";
// import * as addLoadRaw from "./addHash/index.ts";
// import * as addLighthouseReport from "./addLighthouseReport/index.ts";
// import * as addPostLinks from "./addPostLinks/index.ts";
// import * as addSeoNotes from "./addSeoNotes/index.ts";
// import * as addSubscribbables from "./addSubscribables/index.ts";
// import * as addVoiceTotext from "./addVoice2text/index.ts";
// import * as addTranslation from "./addTranslation/index.ts";
// import * as removeAds from "./removeAds/index.ts";
// import * as setPath from "./setPath/index.ts";
// import * as filterBy from "./filterBy/index.ts";

// import * as addText2voice from './addText2voice.ts'
// import * as filterByTags from './filterByTags.ts'
// import * as filterOlderThanLastRead from './filterOlderThanLastRead.ts'
// import * as findBrokenLinks from './findBrokenLinks/index.ts'
// import * as preview from './preview/index.ts'
// import * as annotateWIthBackLinks from './annotateWIthBackLinks/index.ts'
// import * as scoreAsDuplicate from './scoreAsDuplicate/index.ts'
// import * as manageTags from './manageTags.ts'

// export const moduleMap = {
//   // URL string - {f: func, param: JSON Schema String}
//   hash: addHash.enhancementModule,
//   h: addHash.enhancementModule,
//   compareKeywords: addKeywordComparison.enhancementModule,
//   digestKeywords: addKeywordDigest.enhancementModule,
//   keywordReport: addKeywordDigest.enhancementModule,
//   page: addLoadRaw.enhancementModule,
//   article: addLoadRaw.enhancementModule,
//   a: addLoadRaw.enhancementModule,
//   addLinks: addPostLinks.enhancementModule,
//   l: addPostLinks.enhancementModule,
//   set: setPath.enhancementModule,
//   lighthouse: addLighthouseReport.enhancementModule,
//   addPostLinks: addPostLinks,
//   addSeoTodos: addSeoTodos,
//   addSubscribbables: addSubscribbables,
//   addFollowable: addSubscribbables.enhancementModule,
//   addSubable: addSubscribbables.enhancementModule,
//   polly: addVoiceTotext.enhancementModule,
//   addVoice: addVoiceTotext.enhancementModule,
//   addVoiceTotext: addVoiceTotext.enhancementModule,
//   addTransaltions: addTranslation.enhancementModule,
//   translate: addTranslation.enhancementModule,
//   removeAds: removeAds.enhancementModule,
//   r: removeAds.enhancementModule,
//   filterBy: filterBy.enhancementModule,
//   addSeo: addSeoNotes.enhancementModule,
//   seo: addSeoNotes.enhancementModule,
//   annotateWIthBackLinks: annotateWIthBackLinks,
//   filterByCategory: filterByCategory,
//   filterByTags: filterByTags,
//   filterOlderThanLastRead: filterOlderThanLastRead,
//   findBrokenLinks: findBrokenLinks,
//   index: index,
//   manageTags: manageTags,
//   preview: preview,
//   removeAds: removeAds,
//   scoreAsDuplicate: scoreAsDuplicate,
//   setPath: setPath,
// } as Dict<EnhancementModule>;
// export default moduleMap;

export * as addHash from "./addHash/index.ts";
export * as addKeywordComparison from "./addKeywordComparison/index.ts";
export * as addKeywordDigest from "./addKeywordDigest/index.ts";
export * as addLoadRaw from "./addHash/index.ts";
export * as addLighthouseReportHistory from "./addLighthouseReport/index.ts";
export * as addPostLinks from "./addPostLinks/index.ts";
export * as addSeoTodos from "./addSeoNotes/index.ts";
export * as addSubscribbables from "./addSubscribables/index.ts";
export * as addTranslation from "./addTranslation/index.ts";
export * as addVoiceTotext from "./addVoice2text/index.ts";
export * as filterBy from "./filterBy/index.ts";
export * as findBrokenLinks from "./findBrokenLinks/index.ts";
export * as removeAds from "./removeAds/index.ts";
export * as setPath from "./setPath/index.ts";
export * as scoreAsDuplicate from "./scoreAsDuplicate/index.ts";
// export * as addText2voice from "./addText2voice/index.ts";
// export * as annotateWIthBackLinks from "./annotateWIthBackLinks/index.ts";
