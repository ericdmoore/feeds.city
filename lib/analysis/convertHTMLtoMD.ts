// import { unified, rehypeParse, rehypeRemark, remarkStringify } from '../../deps.ts';

// export type UnifiedPlugin = unified.Pluggable;
// export type ParseOpts = rehypeParse.Options;
// export type StringifyOpts = remarkStringify.Options;
// export type BridgeOpts = rehypeRemark.Options;

// export const applyRemarkRetextPlugins = (
// 	parserOPts?: ParseOpts,
// 	bridgeOpts?: unknown,
// 	stringifyOpts?: StringifyOpts,
// 	cfg: { rehypePlugins: UnifiedPlugin[]; remarkPlugins: UnifiedPlugin[] } = {
// 		rehypePlugins: [],
// 		remarkPlugins: [],
// 	},
// ) =>
// 	async <T extends string | undefined>(
// 		input: T,
// 	): Promise<T extends string ? string : undefined> => {
// 		if (input) {
// 			const vf = await unified.unified()
// 				.use(rehypeParse.default, parserOPts)
// 				.use(cfg.rehypePlugins)
// 				.use(rehypeRemark.default, bridgeOpts)
// 				.use(cfg.remarkPlugins)
// 				.use(remarkStringify.default, stringifyOpts)
// 				.process(input);
// 			return vf.toString() as T extends string ? string : undefined;
// 		} else {
// 			return undefined as T extends string ? string : undefined;
// 		}
// 	};

// export default applyRemarkRetextPlugins();
