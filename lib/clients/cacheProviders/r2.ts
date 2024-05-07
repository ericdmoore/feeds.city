// R2 has an s3 compat latyer
// @see: https://developers.cloudflare.com/r2/api/s3/api/
//
// region: 'auto' (or when necessary use:  "us-east-1")
//
// https://<ACCOUNT_ID>.r2.cloudflarestorage.com
//
// After your token has been successfully created,
// review your Secret Access Key and Access Key ID values.
// These may often be referred to as Client Secret and Client ID, respectively.
//
//

import s3cache, { type S3CacheConfig, type S3UriParserFn } from "$lib/clients/cacheProviders/s3.ts";
import { type ICacheProvider } from "$lib/clients/cache.ts";

export const cache = (
	s3c: Omit<S3CacheConfig, "endpoint">,
	overrides: Partial<ICacheProvider<string | Uint8Array>>,
	parserFn: S3UriParserFn,
) =>
	s3cache({ ...s3c, endpoint: "backblazeb2.com" }, overrides, parserFn)
		.then((cacheClient) => {
			return {
				...cacheClient,
				provider: "Cloudflare:R2",
				meta: {
					cloud: "Cloudflare",
					service: "R2",
					region: cacheClient.meta.region,
					size: cacheClient.meta.size,
				},
			};
		});


// export const cache = async (s3c: ICloudflareCacheConfig): Promise<CloudflareR2Cache> => {
// 	const cache = await S3Cache({
// 		...s3c,
// 		region: "auto",
// 		endpoint: `https://${s3c.accountId}.r2.cloudflarestorage.com/${s3c.defaultBucket}`,
// 	});

// 	const meta = await {
// 		cloud: "Cloudflare",
// 		service: "R2",
// 		region: "auto",
// 		size: cache.meta.size,
// 	};

// 	return {
// 		meta,
// 		provider: "Cloudflare:R2",
// 		get: cache.get,
// 		set: cache.set,
// 		del: cache.del,
// 		has: cache.has,
// 		peek: cache.peek,
// 		transforms: {
// 			renamer: cache.transforms.renamer,
// 			fromBytes: cache.transforms.fromBytes,
// 			toBytes: cache.transforms.toBytes,
// 		},
// 	} as CloudflareR2Cache;
// };

export default cache;
