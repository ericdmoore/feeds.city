// deno-lint-ignore-file no-unused-vars
/**
 * Eviction Types:
 *
 * **LRU** - Least Recently Used
 * LRU strategy, the least recently used items are removed first.
 * This strategy assumes that items that have been used recently will continue to be used in the near future.
 * For example, in a memory cache, you might use a doubly-linked list to keep track of the usage order of items.
 * When you need to evict an item, you remove the item at the tail of the list.
 *
 * **FIFO** - First In, First Out
 * In FIFO, the oldest items in the cache are removed first.
 * This is simpler to implement than LRU but may not be as effective in terms of cache hit rate.
 *
 * **TTL** - Time to Live
 * Items are given a time-to-live when they're inserted into the cache, and they're removed once their TTL expires.
 * This is useful for items that become stale after a certain period.
 *
 * **LFU** - Least Frequently Used (LFU)
 * In LFU, the items that are used the least often are the first to be removed.
 * This strategy can be effective for workloads where some items are accessed more frequently than others over the long term.
 *
 * **Balanced** - Cost-Benefit Balance
 * Estimated Costs:
 * 	- Storage Cost $/mo
 *  - Resource constraint
 * 		- Wallet / Disk Space
 *
 * Estimated Benefits:
 * - (incremental) latency saved benefits (ms)
 *    - vs source
 *    - vs "next layer" down
 *
 * Maximize Benefit (Saved Latecny) / Minimize Costs (Stroage Costs)
 * ^ Presupposes a Predictive Model of the future
 * ^ also presupposes a non-trivial relationship between $ and incremental latency
 *
 * THUS we need a promotion strategy
 *
 * 1. Real Time Reaction - (Pull to Top)
 * 1. Ahead of Time
 * 		- Evented
 * 		- Scheduled
 * 		- ML based
 * 1. Ensemble Approach
 */

//#region imports
import { type PromiseOr } from "$lib/types.ts";
import { LRUCache } from "lru-cache";
import changeEncOf from "$lib/utils/enocdings.ts";
import { makeBytes } from "./cacheProviders/encoders/mod.ts";

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

export type AvailableEncodings = "id" | "base64url" | "hex" | "utf8" | "br" | "gzip" | "zstd";
export interface ValueForCacheInternals {
	data: Uint8Array;
	"content-type": "Uint8Array" | "string";
	"content-encoding": AvailableEncodings | string;
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
export type TransformToBytes<T = Uint8Array> = (data: T) => Promise<ValueForCacheInternals>;
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
	set: (name: string, data: NativeDataType | string) => Promise<ICacheDataFromProvider<NativeDataType>>;
	get: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	peek: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	del: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	has: (name: string) => Promise<boolean>;
}

interface IntraCacheNotifications {
	confirmed: { item: boolean; other: number };
	spaceAvailAfter: { B: number };
}

type EvictionNotifictionFunction = (
	item: ICacheableDataForCache,
	...others: ICacheableDataForCache[]
) => Promise<ICacheEvictionNotification>;
type PromotionNotifictionFunction = (
	item: ICacheableDataForCache,
	...others: ICacheableDataForCache[]
) => Promise<ICachePromotionNotification>;

interface ICachePromotionNotification extends IntraCacheNotifications {
	evictionsRdy: ICacheableDataForCache[];
}

interface ICacheEvictionNotification extends IntraCacheNotifications {
	promotionsRdy: ICacheableDataForCache[];
}

type CancelRegistration = () => void;

// @todo
export interface IEventedCacheProvider<NativeDataType = Uint8Array> {
	provider: string;
	meta: Record<string, unknown>;
	transforms: TransformFunctionGroup<NativeDataType>;
	set: (name: string, data: NativeDataType) => Promise<ICacheDataFromProvider<NativeDataType>>;
	get: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	peek: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	del: (name: string) => Promise<NullableProviderData<NativeDataType>>;
	has: (name: string) => Promise<boolean>;
	events: {
		// @todo
		queues: {
			evictionOutbound: ICacheableDataForCache[];
			promotionInboundn: ICacheableDataForCache[];
		};
		register: {
			forEvictions: (fns: EvictionNotifictionFunction) => CancelRegistration;
			forPromotions: (fns: PromotionNotifictionFunction) => CancelRegistration;
		};
		// these are MY fucntions that I register with others
		// catchers catch the kicked down, and kicked up
		onYourEvictions: EvictionNotifictionFunction;
		onYourPromotions: PromotionNotifictionFunction;
	};
}

/** */

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

export const renamerWithSha1: RenamerFn = async (s: string) => {
	const enc = new TextEncoder();
	const hash = new Uint8Array(await crypto.subtle.digest("sha-1", enc.encode(s)));
	return Promise.resolve(changeEncOf(hash).from("utf8").to("base64url").string());
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
			data: changeEncOf(input).from("utf8").to("base64url").array(),
			"content-type": "Uint8Array",
			"content-encoding": "base64url;id",
		})
		: Promise.resolve({
			data: enc.encode(JSON.stringify(input)),
			"content-type": "string",
			"content-encoding": "id",
		});
};

export const defaultToBytesWithTypeNote: TransformToBytes = (input: unknown | Uint8Array) => {
	const enc = new TextEncoder();
	return input instanceof Uint8Array
		? Promise.resolve({
			data: changeEncOf(input).from("utf8").to("base64url").array(),
			"content-type": "Uint8Array",
			"content-encoding": "base64url;id",
		})
		: Promise.resolve({
			data: enc.encode(JSON.stringify(input)),
			"content-type": "string",
			"content-encoding": "id",
		});
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
				"content-encoding": "base64" as AvailableEncodings,
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
	const set = (name: string, data: string | Uint8Array) =>
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
 * @todo lots of work needed here
 * is it just a pull to top, and spills down, with age?
 *    would you ever not pull to top?
 *
 * @param providers
 */
export const tiered = (...providers: ICacheProvider[]): IProviderMeta => {
	const meta = {
		findWithinTiers: (_name: string) => 0,
	};

	const get = (_name: string) => {
		// get -> provider[0]
		// 	  found -> return
		// 	  null -> go to next (provider[1] )
		//
		// OK GREAT -- found it - BUT!!!
		// how to we make sure the mostRecentItem is promoted to the fastest/top provider?
		// so that its slow ONCE and subsequent
		//
		// onItemSqueezeOut
		// onSideChannelAddItem
		// respondWithAvailableSpace
		//

		return Promise.resolve(null);
	};
	const set = (name: string, data: Uint8Array) => {
		return Promise.resolve([{
			provider: "",
			meta: {},
			key: { name, renamed: name },
			value: {
				data,
				transformed: data,
			},
		}]);
	};
	const del = (name: string) => {
		return Promise.resolve([{
			provider: "",
			meta: {},
			key: { name, renamed: name },
			value: {
				data: new Uint8Array(),
				transformed: new Uint8Array(),
			},
		}]);
	};
	const has = (_name: string) => {
		return Promise.resolve(false);
	};
	const peek = (_name: string) => {
		return Promise.resolve(null);
	};
	return { get, set, del, has, peek };
};

/**
 * @param fastProvider
 * @param slowProvider
 *
 *       		  Promotions
 * 		     	  ^
 * 		     	  |
 * 		     	  |
 * 	+-----------------------+
 *  |  Fast Expensive Cache |
 *  +-----------------------+
 * 	     |        ^
 *  Evictions	  |
 *       |        Promotions
 *       |        |
 *       v        |
 *  +-----------------------+
 *  |  Slow + Cheap Cache   |
 *  +-----------------------+
 *       |
 *       |
 *       v
 *  Evictions
 */
const connectProviderEvents = <T>(fastProvider: IEventedCacheProvider<T>, slowProvider: IEventedCacheProvider<T>) => {
	fastProvider.events.register.forEvictions(slowProvider.events.onYourEvictions);
	slowProvider.events.register.forPromotions(fastProvider.events.onYourPromotions);
	// fastProvider promotions are unconnected
	// slow provider evictions are are unconnected
	//
	//
	//
	//

	return {};
};

const addEventFunctionsToProviders = <T>(inputProvider: ICacheProvider<T>): IEventedCacheProvider<T> => {
	/**
	 * Type '{ get: (name: string) => Promise<NullableProviderData<T>>;
	 * has: (name: string) => Promise<boolean>;
	 * peek: (name: string) => Promise<NullableProviderData<T>>;
	 * del: (name: string) => Promise<...>;
	 * set: (name: string, data: T) => Promise<...>;
	 * events: { ...; }; }' is missing the following properties from type 'IEventedCacheProvider<T>':
	 * provider, meta, transforms
	 */

	const notifyListForEvictions = {} as Record<symbol, EvictionNotifictionFunction>;
	const notifyListForPromotions = {} as Record<symbol, PromotionNotifictionFunction>;

	let availableSpaceInBytes = 0;
	let availableSpaceInItems = 0;

	const _evict = () => {};

	const _promote = () => {};

	return {
		provider: inputProvider.provider,
		meta: inputProvider.meta,
		transforms: inputProvider.transforms,
		get: (name: string) => {
			return inputProvider.get(name);
		},
		has: inputProvider.has,
		peek: inputProvider.peek,
		del: async (name: string) => {
			const ret = await inputProvider.del(name);
			availableSpaceInBytes += ret?.value.data.byteLength ?? 0;
			availableSpaceInItems++;

			return ret;
		},
		set: async (name: string, data: T) => {
			const d = await inputProvider.transforms.toBytes(data);
			const ret = await inputProvider.set(name, data);

			availableSpaceInBytes -= d.data.byteLength ?? 0;
			availableSpaceInItems--;

			return ret;
		},
		events: {
			queues: {
				evictionOutbound: [],
				promotionInboundn: [],
			},
			register: {
				forEvictions: (fn: EvictionNotifictionFunction) => {
					const sym = Symbol();
					notifyListForEvictions[sym] = fn;
					return () => {
						delete notifyListForEvictions[sym];
					};
				},
				forPromotions: (fn: PromotionNotifictionFunction) => {
					const sym = Symbol();
					notifyListForPromotions[sym] = fn;
					return () => {
						delete notifyListForPromotions[sym];
					};
				},
			},
			// catchers catch the kicked down, and kicked up
			onYourEvictions: (item: ICacheableDataForCache, ...otherRdyEvictions: ICacheableDataForCache[]) => {
				let acceptitem = false;
				let othersAccepted = 0;

				if (item.value.data.byteLength <= availableSpaceInBytes) {
					acceptitem = true;
					const [sumOtherEvicReq, accumulatedItemList] = otherRdyEvictions
						.map((evic) => evic.value.data.byteLength)
						.reduce((acc, curBytes, i) => {
							const [totalBytes, accArr] = acc;
							return [
								totalBytes + curBytes,
								accArr.concat([i + 1, totalBytes + curBytes]),
							] as [number, Array<[number, number]>];
						}, [0, [[0, 0]]] as [number, Array<[number, number]>]);

					let sizeToOccupy = 0;
					if (item.value.data.byteLength + sumOtherEvicReq <= availableSpaceInBytes) {
						othersAccepted = accumulatedItemList.length - 1; // because of the 0,0 element added
						sizeToOccupy = sumOtherEvicReq;
					} else {
						othersAccepted = 0;

						accumulatedItemList.forEach(([itemCount, totalSizeForThisItemCount]) => {
							if ((availableSpaceInBytes - item.value.data.byteLength) >= totalSizeForThisItemCount) {
								othersAccepted = itemCount;
								sizeToOccupy = totalSizeForThisItemCount;
							}
						});
					}
					availableSpaceInBytes -= item.value.data.byteLength;
					availableSpaceInBytes -= sizeToOccupy;
				} else {
					acceptitem = false;
					othersAccepted = 0;
				}

				return Promise.resolve({
					confirmed: { item: acceptitem, other: othersAccepted },
					spaceAvailAfter: { B: availableSpaceInBytes },
					promotionsRdy: [],
				});
			},
			onYourPromotions: (_item: ICacheableDataForCache, ..._otherRdyPromotions: ICacheableDataForCache[]) =>
				Promise.resolve({
					confirmed: { item: false, other: 0 },
					spaceAvailAfter: { B: 0 },
					evictionsRdy: [],
				}),
		},
	};
};

export default { cacheArray, cacheStack, cacheRace, inMem };
