/**
 * https://www.backblaze.com/cloud-storage/pricing
 * https://www.backblaze.com/docs/cloud-storage
 *
 * has an s3 compat layer for B2
 */

import s3cache, { type S3CacheConfig, type S3UriParserFn } from "$lib/clients/cacheProviders/s3.ts";
import { type ICacheProvider } from "$lib/clients/cache.ts";

export const cache = (
	s3c: Omit<S3CacheConfig, "endpoint">,
	overrides: Partial<ICacheProvider>,
	parserFn: S3UriParserFn,
) =>
	s3cache({ ...s3c, endpoint: "backblazeb2.com" }, overrides, parserFn)
		.then((cacheClient) => {
			return {
				...cacheClient,
				provider: "Backblaze:B2",
				meta: {
					cloud: "Backblaze",
					service: "B2",
					region: cacheClient.meta.region,
					size: cacheClient.meta.size,
				},
			};
		});

export default cache;
