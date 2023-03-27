// import { unified, remarkParse, remarkRetext, retextStringify } from '../../deps.ts';

// export type UnifiedPlugin = unified.Pluggable;
// export type ParseOpts = remarkParse.Options;
// export type BridgeOpts = remarkRetext.Options;

// export const applyRetextPlugins = (
// 	parseOpts?: ParseOpts,
// 	cfg: { retextPlugins: UnifiedPlugin[]; remarkPlugins: UnifiedPlugin[] } = {
// 		retextPlugins: [],
// 		remarkPlugins: [],
// 	},
// ) =>
// 	async (input: string[]): Promise<string[]> => {
// 		return Promise.all(input.map(async (s) => {
// 			const vf = await unified.unified()
// 				.use(remarkParse.default, parseOpts)
// 				.use(cfg.remarkPlugins)
// 				.use(
// 					remarkRetext.default,
// 					unified.unified().use(retextEnglish as any).use(cfg.retextPlugins),
// 				)
// 				.use(cfg.retextPlugins)
// 				.use(retextStringify.default)
// 				.process(s);
// 			return vf.toString();
// 		}));
// 	};

// export default applyRetextPlugins();
