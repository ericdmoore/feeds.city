import { cacheStack, type ICacheProvider, inMem, type RenamerFn } from "../cache.ts";
import { cache as s3cache, type S3CacheConfig, type S3UriParserFn } from "./s3.ts";

export const cache = async (
	s3c: { params: S3CacheConfig; overrides?: Partial<ICacheProvider>; parser?: S3UriParserFn },
	local: { max?: number },
	renamer?: RenamerFn,
) =>
	cacheStack(
		inMem(local.max ?? 1024, { renamer }),
		await s3cache(s3c.params, s3c.overrides, s3c.parser),
	);

export default cache;
