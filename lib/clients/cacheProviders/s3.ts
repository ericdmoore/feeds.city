/**
 * @ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutBucketIntelligentTieringConfigurationCommand/
 * This client assumes a created bucket.
 * This bucket that might have a lifecycle policy to optimize storage classes - https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html
 * IntelligentTiering Config - https://docs.aws.amazon.com/AmazonS3/latest/API/API_IntelligentTieringConfiguration.html
 */

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

import { s3UriParse } from "$lib/parsers/s3uri.ts";

import {
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	// type TransformFromBytes,
	// type TransformToBytes,
	// type ValueForCacheInternals,
	type ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
} from "../cache.ts";

import { encodingWith } from "./recoders/mod.ts";
//#region interfaces

export interface S3CacheConfig {
	key: string;
	secret: string;
	region: string;
	defaultBucket: string;
	defualtPrefix: string;
	endpoint?: string;
}

export type S3UriParserFn = (str: string) => { Bucket: string; Key: string };
export const s3parse = s3UriParse;
//#endregion interfaces

export const cache = async (
	s3c: S3CacheConfig,
	overrides: Partial<ICacheProvider<string | Uint8Array>> = {
		transforms: {
			renamer: (s) => Promise.resolve(s),
			toBytes: defaultToBytesWithTypeNote,
			fromBytes: defaultFromBytes,
		},
	},
	s3Parse: S3UriParserFn = s3UriParse,
): Promise<ICacheProvider<string | Uint8Array>> => {
	s3c.defaultBucket = s3c.defaultBucket ?? "";
	s3c.defualtPrefix = s3c.defualtPrefix ?? "";

	const provider = "AWS:S3";
	const coder = await encodingWith();

	let handledItems = 0;

	const meta = {
		cloud: "AWS",
		service: "S3",
		region: s3c.region,
		size: () => handledItems,
	};

	const s3 = new S3Client({
		region: s3c.region,
		endpoint: s3c.endpoint,
		credentials: {
			accessKeyId: s3c.key,
			secretAccessKey: s3c.secret,
		},
	});

	const renamer = overrides.transforms?.renamer ?? defaultRenamer;
	const toBytes = overrides.transforms?.toBytes ?? defaultToBytesWithTypeNote;
	const fromBytes = overrides.transforms?.fromBytes ?? defaultFromBytes;

	const defaultedParse = (
		name: string,
		defaultVals: { Bucket: string; Key: string },
	): { Bucket: string; Key: string } => {
		try {
			return s3Parse(name);
		} catch (_) {
			return {
				Bucket: defaultVals.Bucket,
				Key: name,
			};
		}
	};

	const set = async (locationName: string, inputData: Uint8Array | string) => {
		const { Bucket, Key } = defaultedParse(locationName, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renamer(Key);
		const sendKey = `${Bucket}/${renamed}`;
		const value = await toBytes(inputData);

		const dataToS3 = {
			meta,
			provider,
			key: { name: locationName, renamed },
			value,
		};

		const s3r = await s3.send(
			new PutObjectCommand({ Bucket, Key: sendKey, Body: JSON.stringify(dataToS3) }),
		);
		handledItems++;

		const ret = {
			provider,
			meta: { cloud: "AWS", s3resp: s3r },
			key: {
				name: locationName,
				renamed: await renamer(Key),
			},
			value,
		};

		return {
			...ret,
			value: {
				...ret.value,
				transformed: await fromBytes<Uint8Array>(ret),
			},
		};
	};

	const del = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renamer(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;
		handledItems--;
		await s3.send(new DeleteObjectCommand({ Bucket, Key: sendKey }));
		return {
			meta,
			provider,
			key: { name, renamed },
			value: {
				data: new Uint8Array(),
				transformed: new Uint8Array(),
			},
		};
	};

	const get = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renamer(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;
		const s3r = await s3.send(new GetObjectCommand({ Bucket, Key: sendKey }));

		const s3CacheInternals = JSON.parse(await s3r.Body?.transformToString() ?? "") as ICacheableDataForCache;
		const value = await coder.decode(s3CacheInternals.value);

		const synthValueFromCache = {
			provider,
			meta: { ...s3r, cloud: "AWS" } as Record<string, unknown>,
			key: { name, renamed },
			value,
		} as ICacheableDataForCache;

		const transformed = await fromBytes(synthValueFromCache);

		return {
			...synthValueFromCache,
			value: {
				...synthValueFromCache.value,
				transformed,
			},
		} as ICacheDataFromProvider;
	};

	const has = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renamer(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;

		return s3.send(new HeadObjectCommand({ Bucket, Key: sendKey }))
			.then(() => true)
			.catch(() => false);
	};

	const peek = get;

	return {
		meta,
		provider,
		has,
		peek,
		get,
		del,
		set,
		transforms: { renamer, fromBytes, toBytes },
		...overrides,
	};
};

export default cache;
