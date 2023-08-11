//#region imports

import { LRUCache } from "lru-cache";
import MurmurHash3 from "imurmurhash";
import changeEncOf from '$lib/utils/enocdings.ts'

//#endregion imports

//#region interfaces

interface CacheValueExpression <T>{
	data: Uint8Array
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

export interface ICacheableDataForCache {
	provider: string;
	meta: Record<string, unknown>;
	key: CacheKey
	value: { 
		inputType: string
		data: Uint8Array 
	} 
}

export interface ICacheDataFromProvider<T = Uint8Array> {
	provider: string;
	meta: Record<string, unknown>;
	key: CacheKey
	value: CacheValueExpression<T>
}

type CacheName = string;
type NullableProviderData = ICacheDataFromProvider | null;

export type RenamerFn = (s:string)=>Promise<string>
export type TransformToBytes = (data: unknown | Uint8Array)=>Promise <ValueInCache>
export type TransformFromBytes = <T>(retrieved?: ICacheableDataForCache)=>Promise<T | null>

export interface ICacheProvider {
	provider: string;
	meta: Record<string, unknown>;
	transforms: {
		renameForCache(originalName: string): Promise<CacheName>;
		toBytes: TransformToBytes
		fromBytes: TransformFromBytes
	}
	set: (name: string, data: Uint8Array) => Promise<ICacheDataFromProvider>;
	get: (name: string) => Promise<NullableProviderData>;
	peek: (name: string) => Promise<NullableProviderData>;
	del: (name: string) => Promise<NullableProviderData>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMeta {
	set: (name: string, data: Uint8Array) => Promise<ICacheDataFromProvider[]>;
	del: (name: string) => Promise<NullableProviderData[]>;
	get: (name: string) => Promise<NullableProviderData>;
	peek: (name: string) => Promise<NullableProviderData>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMetaMulti {
	set: (name: string, data: Uint8Array) => Promise<ICacheDataFromProvider[]>;
	get: (name: string) => Promise<NullableProviderData[]>;
	peek: (name: string) => Promise<NullableProviderData[]>;
	del: (name: string) => Promise<NullableProviderData[]>;
	has: (name: string) => Promise<boolean[]>;
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
}

export const renamerWithMurmurHash3: RenamerFn = (s: string) => {
	const hashState = MurmurHash3();
	return Promise.resolve(hashState.hash(s).result().toString());
};

export const defaultRenamer: RenamerFn = (s: string)=> Promise.resolve(changeEncOf(s).from('utf8').to('base64url').string());
export const defaultFromBytes: TransformFromBytes = (retrieved?: ICacheableDataForCache) => {
	if(!retrieved?.value.data){
		return null
	} else if (retrieved.value.inputType !== 'Uint8Array'){
		const dec = new TextDecoder()
		return JSON.parse(dec.decode(retrieved.value.data))
	} else{
		return retrieved.value.data
	}
}

export const defaultToBytesWithTypeNote: TransformToBytes = (input: unknown | Uint8Array ) => {
	const enc = new TextEncoder()
	return input instanceof Uint8Array 
		? Promise.resolve({ data: input, inputType: 'Uint8Array'} as ValueInCache)
		: Promise.resolve({ data: enc.encode(JSON.stringify(input)), inputType: 'other'} as ValueInCache)
}

export const makeKey = async (name: string, renamer: RenamerFn) => ({name, renamed: await renamer(name) }) as CacheKey

export const inMem = (max = 1000, transform? :{renamer?: RenamerFn, fromBytes?:TransformFromBytes, toBytes?:TransformToBytes } ):ICacheProvider => {
	const provider = "RAM";

	const cache = new LRUCache<string, ICacheableDataForCache, unknown>({ updateAgeOnGet: true, max });
	const meta = { inMemory: true, size: () => cache.size };
    const renameForCache = transform?.renamer ?? defaultRenamer
	const fromBytes = transform?.fromBytes ?? defaultFromBytes
	const toBytes = transform?.toBytes ?? defaultToBytesWithTypeNote

	const set = async (name: string, data: unknown | Uint8Array): Promise<ICacheDataFromProvider>=> {
		const ret = {
			provider, meta, data,
			key : await makeKey(name, renameForCache),
			value: {
				data,
				transformed: new Uint8Array(),
				inputType: data instanceof Uint8Array ? 'Uint8Array' : 'other',
			}
		} as ICacheableDataForCache & ICacheDataFromProvider

		cache.set(ret.key.renamed, ret);
		return ret
	};

	const del = async (name: string) => {
		const renamed = await renameForCache(name);
		cache.delete(renamed);
		return {
			provider, meta,
			key: { name, renamed },
			value: { 
				data: new Uint8Array(), 
				transformed: new Uint8Array() 
			}  
		} as ICacheDataFromProvider<Uint8Array>;
	};

	const get = async (name: string): Promise<NullableProviderData> => {
		const retr = cache.get(await renameForCache(name))
		if(!retr){
			return null
		}else{
			return {
				meta, provider,
				key: await makeKey(name, renameForCache),
				value:{
					data: retr.value.data,
					transformed: await fromBytes(retr) 
				}
			}
		}
	}
	const has = async (name: string) => cache.has(await renameForCache(name));

	const peek = async (name: string):Promise<NullableProviderData> => {
		const retr = cache.peek(await renameForCache(name))
		if(!retr){
			return null
		}else{
			return {
				meta,
				provider,
				key: await makeKey(name, renameForCache),
				value:{ 
					data: retr.value.data, 
					transformed: await fromBytes(retr) 
				}
			}
		}
	}

	return {
		meta,
		provider,
		get, 
		set, 
		peek,
		has, 
		del,
		transforms:{ 
			renameForCache, 
			fromBytes, 
			toBytes 
		},
	};
};

export const cacheStack = (...providers: ICacheProvider[]): IProviderMeta => {
	const set = (name: string, data: Uint8Array) =>
		Promise.all(providers.map((prov) => {
			return prov.set(name, data);
		}));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => retriveFromFirstNonNull("get", name, providers) as Promise<ICacheDataFromProvider | null>;
	const has = (name: string) => retriveFromFirstNonNull("has", name, providers) as Promise<boolean>;
	const peek = (name: string) => retriveFromFirstNonNull("peek", name, providers) as Promise<ICacheDataFromProvider | null>;
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

export default { cacheArray, cacheStack, cacheRace, inMem };