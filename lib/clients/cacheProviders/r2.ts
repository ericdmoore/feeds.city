// R2 has an s3 compat latyer
// @see: https://developers.cloudflare.com/r2/api/s3/api/
//
// region: auto (or when necessart use:  "us-east-1")
//
// https://<ACCOUNT_ID>.r2.cloudflarestorage.com
//
// After your token has been successfully created,
// review your Secret Access Key and Access Key ID values.
// These may often be referred to as Client Secret and Client ID, respectively.
//
//

import { type ICacheProvider } from "../cache.ts";
import { cache as S3Cache, type S3CacheConfig } from "./s3.ts";

interface ICloudflareCacheConfig extends Omit<S3CacheConfig, "endpoint" | "region"> {
	accountId: string;
}

interface CloudflareR2Cache extends ICacheProvider {
	meta: {
		cloud: string;
		service: string;
		region: string;
		itemHandledCount: () => number;
	};
}

export const cache = (s3c: ICloudflareCacheConfig): CloudflareR2Cache => {
	const cache = S3Cache({
		...s3c,
		region: "auto",
		endpoint: `https://${s3c.accountId}.r2.cloudflarestorage.com/${s3c.defaultBucket}`,
	});

	let handledItems = 0;

	const meta = {
		cloud: "Cloudflare",
		service: "R2",
		region: "auto",
		itemHandledCount: () => handledItems,
	};

	return {
		meta,
		provider: "Cloudflare:R2",
		get: cache.get,
		set: (name: string, data: Uint8Array) =>
			cache.set(name, data).finally(() => {
				handledItems++;
			}),
		del: (name: string) =>
			cache.del(name).finally(() => {
				handledItems--;
			}),
		has: cache.has,
		peek: cache.peek,
		transforms: {
			renamer: cache.transforms.renamer,
			fromBytes: cache.transforms.fromBytes,
			toBytes: cache.transforms.toBytes,
		},
	};
};

export default cache;
