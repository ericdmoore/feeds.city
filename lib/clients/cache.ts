//#region imports

import { type PromiseOr } from "$lib/types.ts";
import { LRUCache } from "lru-cache";
import MurmurHash3 from "imurmurhash";
import changeEncOf from "$lib/utils/enocdings.ts";
import { assert } from "$std/testing/asserts.ts";

//#endregion imports

//#region interfaces

interface CacheValueExpression<T> {
	data: Uint8Array;
	transformed: T | null;
}

interface CacheKey {
	name: string;
	renamed: string;
}

interface ValueInCache {
	data: Uint8Array;
	inputType: string;
}

export type AvailableEncodings = "id" | "base64url" | "hex" | "utf8" | "br" | "gzip" | "zstd" | string;
interface ValueForCacheInternals {
	data: Uint8Array;
	"content-type": "Uint8Array" | "string";
	"content-encoding": AvailableEncodings;
}
type AbstractDecodeFunction = (value: ValueForCacheInternals) => Promise<ValueForCacheInternals>;
export interface ICacheableDataForCache {
	provider: string;
	meta: Record<string, unknown>;
	key: CacheKey;
	value: ValueForCacheInternals;
}

export interface ICacheDataFromProvider<T = Uint8Array> {
	provider: string;
	meta: Record<string, unknown>;
	key: CacheKey;
	value: CacheValueExpression<T>;
}

export type CacheName = string;
export type NullableProviderData<T> = ICacheDataFromProvider<T> | null;

export type RenamerFn = (s: string) => Promise<string>;
export type TransformToBytes<T = Uint8Array> = (data: T) => Promise<ValueInCache>;
export type TransformFromBytes = <ReturnType>(retrieved?: ICacheableDataForCache) => Promise<ReturnType | null>;

export interface TransformFunctionGroup<NativeDataType = Uint8Array> {
	renamer: RenamerFn;
	toBytes: TransformToBytes<NativeDataType>;
	fromBytes: TransformFromBytes;
}
export interface ICacheProvider<NativeDataType = Uint8Array> {
	provider: string;
	meta: Record<string, unknown>;
	transforms: TransformFunctionGroup<NativeDataType>;
	set: (name: string, data: NativeDataType) => Promise<ICacheDataFromProvider<NativeDataType>>;
	get: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	peek: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	del: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMeta<NativeDataType = Uint8Array> {
	set: (name: string, data: NativeDataType) => Promise<ICacheDataFromProvider<NativeDataType>[]>;
	del: (name: string) => Promise<NullableProviderData<NativeDataType>[]>;
	get: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	peek: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMetaMulti<NativeDataType = Uint8Array> {
	set: (name: string, data: NativeDataType) => Promise<ICacheDataFromProvider[]>;
	get: (name: string) => Promise<NullableProviderData<NativeDataType>[]>;
	peek: (name: string) => Promise<NullableProviderData<NativeDataType>[]>;
	del: (name: string) => Promise<NullableProviderData<NativeDataType>[]>;
	has: (name: string) => Promise<boolean[]>;
}

type EncModule = (...i: unknown[]) => Promise<EncModuleRet>;

interface EncModuleRet {
	to: (input: Uint8Array | string, contentEncoding?: string[]) => Promise<ValueForCacheInternals>;
	from: (input: ValueForCacheInternals) => Promise<ValueForCacheInternals>;
	recode: (input: PromiseOr<ValueForCacheInternals>) => Promise<ValueForCacheInternals>;
}

//#endregion interfaces

export const makeBytes = (input: Uint8Array | string) => {
	const enc = new TextEncoder();
	return typeof input === "string" ? enc.encode(input) : input;
};

export const makeString = (input: Uint8Array | string) => {
	const dec = new TextDecoder();
	return typeof input === "string" ? input : dec.decode(input);
};

export const id: EncModule = () => {
	const to = (input: Uint8Array | string, contentEncoding = ["id"] as string[]) => {
		return Promise.resolve({
			data: makeBytes(input),
			"content-encoding": contentEncoding.join(";"),
			"content-type": typeof input === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");
		return Promise.resolve({
			data: makeBytes(v.data),
			"content-encoding": ["id", ...contentEncoding].join(";"),
			"content-type": "Uint8Array",
		} as ValueForCacheInternals);
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "id") {
			return Promise.reject(new Error("id encoding not found"));
		}

		return Promise.resolve({
			data: makeBytes(value.data),
			"content-encoding": contentEncoding.join(";"),
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return Promise.resolve({ to, recode, from });
};

export const gzip: EncModule = async (compressThreshold = 512) => {
	const { gzipEncode, gzipDecode } = await import("gzip_wasm");

	const to = async (input: Uint8Array | string, contentEncoding = ["id"] as string[]) => {
		const bytes = makeBytes(input);

		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await gzipEncode(bytes),
				"content-encoding": ["gzip", ...contentEncoding].join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			} as ValueForCacheInternals;
		} else {
			return {
				data: bytes,
				"content-encoding": contentEncoding.join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			} as ValueForCacheInternals;
		}
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");
		return Promise.resolve({
			data: gzipEncode(makeBytes(v.data)),
			"content-encoding": ["gzip", ...contentEncoding].join(";"),
			"content-type": "Uint8Array",
		} as ValueForCacheInternals);
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "base64url") {
			return Promise.reject(new Error("base64url encoding not found"));
		}

		return Promise.resolve({
			data: gzipDecode(makeBytes(value.data)),
			"content-encoding": contentEncoding.join(";"),
			"content-type": typeof value.data === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	return { to, recode, from };
};

export const br = async (compressThreshold = 512) => {
	const { compress: brCompress, decompress: brDecompress } = await import("brotli");

	const to = async (input: Uint8Array | string, contentEncoding = ["id"] as string[]) => {
		const bytes = makeBytes(input);
		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await brCompress(bytes),
				"content-encoding": ["br", ...contentEncoding].join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		} else {
			return {
				data: bytes,
				"content-encoding": contentEncoding.join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		}
	};

	const from = async (retData: ValueForCacheInternals) => {
		const contentEncodings = retData["content-encoding"].split(";");
		const enc = contentEncodings.shift();

		assert(enc === "br");

		return {
			data: await brDecompress(makeBytes(retData.data)),
			"content-encoding": contentEncodings.join(";"),
			"content-type": retData["content-type"],
		};
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>) => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");

		return {
			data: await brCompress(makeBytes(v.data)),
			"content-encoding": ["br", ...contentEncoding].join(";"),
			"content-type": v["content-type"],
		};
	};

	return { to, from, recode };
};

export const zstd = async (compressThreshold = 512) => {
	const {
		compress: zstdCompress,
		decompress: zstdDecompress,
	} = await import("zstd_wasm");

	const to = async (input: Uint8Array | string, contentEncoding = "id" as string) => {
		const bytes = makeBytes(input);
		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await zstdCompress(makeBytes(input)),
				"content-encoding": ["zstd", contentEncoding].join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		} else {
			return {
				data: bytes,
				"content-encoding": contentEncoding,
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		}
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");
		const bytes = makeBytes(v.data);

		if (bytes.length > (compressThreshold as number)) {
			return Promise.resolve({
				data: await zstdCompress(bytes),
				"content-encoding": ["zstd", ...contentEncoding].join(";"),
				"content-type": "Uint8Array",
			} as ValueForCacheInternals);
		} else {
			return Promise.resolve({
				data: bytes,
				"content-encoding": contentEncoding.join(";"),
				"content-type": "Uint8Array",
			} as ValueForCacheInternals);
		}
	};

	const from = async (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();
		assert(encoding === "zstd");

		return Promise.resolve({
			data: await zstdDecompress(makeBytes(value.data)),
			"content-encoding": contentEncoding.join(";"),
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return { to, from, recode };
};

export const base64url = async () => {
	const { encode, decode } = await import("$std/encoding/base64url.ts");

	const to = (input: Uint8Array | string, contentEncoding = "id" as string): Promise<ValueForCacheInternals> => {
		return Promise.resolve({
			data: makeBytes(encode(makeBytes(input))),
			"content-encoding": ["base64url", ...contentEncoding].join(";"),
			"content-type": typeof input === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");

		return Promise.resolve({
			data: makeBytes(encode(makeBytes(v.data))),
			"content-encoding": ["base64url", ...contentEncoding].join(";"),
			"content-type": v["content-type"],
		} as ValueForCacheInternals);
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "base64url") {
			return Promise.reject(new Error("base64url encoding not found"));
		}

		return Promise.resolve({
			data: makeBytes(decode(makeString(value.data))),
			"content-encoding": contentEncoding.join(";"),
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return { to, from, recode };
};

const encoderMap = async () => ({
	br: await br(),
	id: await id(),
	gzip: await gzip(),
	zstd: await zstd(),
	base64url: await base64url(),
} as Record<AvailableEncodings, EncModuleRet>);

export const encodingWith = async (encodingmap?: PromiseOr<Record<string, EncModuleRet>>) => {
	const encMap = encodingmap ? await encodingmap : await encoderMap();

	const encode = (encodingWith: string[], data: Uint8Array) => {
		const en = encodingWith.shift()!;
		return encodingWith.reduce((cacheVal, enNext) => encMap[enNext].recode(cacheVal), encMap[en].to(data));
	};

	const decode = (valInCache: ValueForCacheInternals) => {
		const encodings = valInCache["content-encoding"].split(";");
		const en = encodings.shift()!;

		return encodings.reduce(
			async (cacheVal, enNext) => encMap[enNext].from(await cacheVal),
			encMap[en].from(valInCache),
		);
	};

	return { encode, decode };
};

const retriveFromFirstNonNull = (
	action: "get" | "has" | "peek",
	name: string,
	providers: ICacheProvider[],
) => {
	return providers.reduce(async (acc, prov) => {
		const rezAcc = await acc;
		return rezAcc !== null ? rezAcc : prov[action](name);
	}, Promise.resolve(null) as Promise<ICacheDataFromProvider | boolean | null>);
};

export const renamerWithMurmurHash3: RenamerFn = (s: string) => {
	const hashState = MurmurHash3();
	return Promise.resolve(hashState.hash(s).result().toString());
};

export const defaultRenamer: RenamerFn = (s: string) =>
	Promise.resolve(changeEncOf(s).from("utf8").to("base64url").string());

export const defaultFromBytes: TransformFromBytes = (retrieved?: ICacheableDataForCache) => {
	if (!retrieved?.value.data) {
		return null;
	} else if (retrieved.value["content-type"] !== "Uint8Array") {
		const dec = new TextDecoder();
		return typeof retrieved.value.data === "string"
			? JSON.parse(retrieved.value.data)
			: JSON.parse(dec.decode(retrieved.value.data));
	} else {
		return retrieved.value.data;
	}
};

export const bytestoJsonWithTypeNote: TransformToBytes = (input: unknown | Uint8Array) => {
	const enc = new TextEncoder();
	return input instanceof Uint8Array
		? Promise.resolve({
			data: enc.encode(changeEncOf(input).from("utf8").to("base64").string()),
			inputType: "Uint8Array",
		} as ValueInCache)
		: Promise.resolve({
			data: enc.encode(JSON.stringify(input)),
			inputType: "other",
		} as ValueInCache);
};

export const defaultToBytesWithTypeNote: TransformToBytes = (input: unknown | Uint8Array) => {
	const enc = new TextEncoder();
	return input instanceof Uint8Array
		? Promise.resolve({ data: input, inputType: "Uint8Array" } as ValueInCache)
		: Promise.resolve({ data: enc.encode(JSON.stringify(input)), inputType: "other" } as ValueInCache);
};

export const makeKey = async (name: string, renamer: RenamerFn) => ({ name, renamed: await renamer(name) }) as CacheKey;

export const inMem = (
	max = 1000,
	transform?: { renamer?: RenamerFn; fromBytes?: TransformFromBytes; toBytes?: TransformToBytes },
): ICacheProvider => {
	const provider = "RAM";

	const cache = new LRUCache<string, ICacheableDataForCache, unknown>({ updateAgeOnGet: true, max });
	const meta = { inMemory: true, size: () => cache.size };
	const renamer = transform?.renamer ?? defaultRenamer;
	const fromBytes = transform?.fromBytes ?? defaultFromBytes;
	const toBytes = transform?.toBytes ?? defaultToBytesWithTypeNote;

	const set = async (name: string, data: unknown | Uint8Array): Promise<ICacheDataFromProvider> => {
		const ret = {
			provider,
			meta,
			data,
			key: await makeKey(name, renamer),
			value: {
				data,
				"content-type": data instanceof Uint8Array ? "Uint8Array" : "other",
				"content-encoding": "base64",
				transformed: new Uint8Array(),
			},
		} as ICacheableDataForCache & ICacheDataFromProvider;

		cache.set(ret.key.renamed, ret);
		return ret;
	};

	const del = async (name: string) => {
		const renamed = await renamer(name);
		cache.delete(renamed);
		return {
			provider,
			meta,
			key: { name, renamed },
			value: {
				data: new Uint8Array(),
				transformed: new Uint8Array(),
			},
		} as ICacheDataFromProvider<Uint8Array>;
	};

	const get = async (name: string): Promise<NullableProviderData<Uint8Array>> => {
		const retr = cache.get(await renamer(name));
		if (!retr) {
			return null;
		} else {
			return {
				meta,
				provider,
				key: await makeKey(name, renamer),
				value: {
					data: makeBytes(retr.value.data),
					transformed: await fromBytes(retr),
				},
			};
		}
	};
	const has = async (name: string) => cache.has(await renamer(name));

	const peek = async (name: string): Promise<NullableProviderData<Uint8Array>> => {
		const retr = cache.peek(await renamer(name));
		if (!retr) {
			return null;
		} else {
			return {
				meta,
				provider,
				key: await makeKey(name, renamer),
				value: {
					data: makeBytes(retr.value.data),
					transformed: await fromBytes(retr),
				},
			};
		}
	};

	return {
		meta,
		provider,
		get,
		set,
		peek,
		has,
		del,
		transforms: {
			renamer,
			fromBytes,
			toBytes,
		},
	};
};

export const cacheStack = (...providers: ICacheProvider[]): IProviderMeta => {
	const set = (name: string, data: Uint8Array) =>
		Promise.all(providers.map((prov) => {
			return prov.set(name, data);
		}));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) =>
		retriveFromFirstNonNull("get", name, providers) as Promise<ICacheDataFromProvider | null>;
	const has = (name: string) => retriveFromFirstNonNull("has", name, providers) as Promise<boolean>;
	const peek = (name: string) =>
		retriveFromFirstNonNull("peek", name, providers) as Promise<ICacheDataFromProvider | null>;
	return { get, set, del, has, peek };
};

export const cacheArray = (...providers: ICacheProvider[]): IProviderMetaMulti => {
	const set = (name: string, data: Uint8Array) => Promise.all(providers.map((prov) => prov.set(name, data)));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => Promise.all(providers.map((prov) => prov.get(name)));
	const has = (name: string) => Promise.all(providers.map((prov) => prov.has(name)));
	const peek = (name: string) => Promise.all(providers.map((prov) => prov.peek(name)));
	return { get, set, del, has, peek };
};

export const cacheRace = (...providers: ICacheProvider[]): IProviderMeta => {
	const set = (name: string, data: Uint8Array) => Promise.all(providers.map((prov) => prov.set(name, data)));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => Promise.race(providers.map((prov) => prov.get(name)));
	const has = (name: string) => Promise.race(providers.map((prov) => prov.has(name)));
	const peek = (name: string) => Promise.race(providers.map((prov) => prov.peek(name)));
	return { get, set, del, has, peek };
};

/**
 * # Tiered Cache
 * Given a set of Cache Providers
 * @param providers
 * @returns
 */
export const tiered = (...providers: ICacheProvider[]): IProviderMeta => {
	const get = (name: string) => Promise.race(providers.map((prov) => prov.get(name)));
	const set = (name: string, data: Uint8Array) => Promise.all(providers.map((prov) => prov.set(name, data)));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const has = (name: string) => Promise.race(providers.map((prov) => prov.has(name)));
	const peek = (name: string) => Promise.race(providers.map((prov) => prov.peek(name)));
	return { get, set, del, has, peek };
};

export default { cacheArray, cacheStack, cacheRace, inMem };
