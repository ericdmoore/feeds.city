// https://aws.amazon.com/comprehend/features/
//

// import {
// 	unified,
// 	remarkParse,
// 	remarkRetext,
// 	retextEnglish,
// 	retextKeywords,
// 	retextStringify,
// } from '../../deps.ts';

// export type UnifiedPlugin = unified.Pluggable;
// export type ParseOpts = remarkParse.Options;
// export type BridgeOpts = remarkRetext.Options;
// export type KWOpts = retextKeywords.Options
// export type Keyphrase = retextKeywords.Keyphrase;
// export type Keyword = retextKeywords.Keyword;

// export const determineKeywords = (
// 	parseOpts?: ParseOpts,
// 	kwOpts?: KWOpts,
// ) =>
// 	/**
// 	 * @param input expdeects a text or markdown?
// 	 * @returns
// 	 */
// 	async (input?: string | (() => Promise<string>)) => {
// 		if (!input) {
// 			return {
// 				input: undefined,
// 				bodyTextVersion: undefined,
// 				keywords: undefined,
// 				keyphrases: undefined,
// 			};
// 		}
// 		const vfileWithKW = async (s: string | (() => Promise<string>)) => {
// 			const vf = await unified.unified()
// 				.use(remarkParse.default, parseOpts)
// 				.use(
// 					remarkRetext.default,
// 					unified.unified().use(retextEnglish as any).use(retextKeywords.default, kwOpts)
// 				)
// 				.use(retextStringify.default)
// 				.process(typeof s === 'string' ? s : await s()) as unified.VFileWithOutput<null>;
// 			return vf;
// 		};

// 		const vf = await vfileWithKW(input);
// 		const d = vf.data as { keywords?: Keyword[]; keyphrases?: Keyphrase[] } | undefined;

// 		return {
// 			input,
// 			bodyTextVersion: vf.toString(),
// 			keywords: d?.keywords,
// 			keyphrases: d?.keyphrases,
// 		};
// 	};

// export default determineKeywords();
