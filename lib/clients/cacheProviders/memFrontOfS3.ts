import { cacheStack, type ICacheProvider, inMem, type RenamerFn } from "../cache.ts";
import { s3cache, type S3CacheConfig, s3parse, type S3UriParserFn } from "./s3.ts";

export const localizedS3Store = (
	s3c: { params: S3CacheConfig; overrides?: Partial<ICacheProvider>; parser?: S3UriParserFn },
	local: { max?: number },
	renamer?: RenamerFn,
) =>
	cacheStack(
		inMem(local.max ?? 1024, renamer),
		s3cache(s3c.params, s3c.overrides ?? { renameForCache: renamer }, s3c.parser ?? s3parse),
	);
