/// <reference lib="deno.unstable" />

//#region imports

// because funny-enough, its faster than QuickLRU
// this was inconclusicve and if it was conclusive, it is insignificant since we are talking about microseconds
import { LRUCache } from "lru-cache";
// import QuickLRU from 'quick-lru'

import MurmurHash3 from "imurmurhash";

import {
	DeleteItemCommand,
	DescribeTableCommand,
	DescribeTimeToLiveCommand,
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import {
	DeleteObjectCommand,
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

import { s3UriParse } from "$lib/parsers/s3uri.ts";
import changeEncOf from '$lib/utils/enocdings.ts'
//#endregion imports

//#region interfaces

interface IProviderData {
	name: string;
	renamed: string;
	data: Uint8Array;
	provider: string;
	_: Record<string, unknown>;
}

type CacheName = string;
type NullableProviderData = IProviderData | null;

export interface IProvider {
	provider: string;
	_: Record<string, unknown>;
	renameForCache(formalName: string): Promise<CacheName>;
	set: (name: string, data: Uint8Array) => Promise<IProviderData>;
	get: (name: string) => Promise<NullableProviderData>;
	peek: (name: string) => Promise<NullableProviderData>;
	del: (name: string) => Promise<NullableProviderData>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMeta {
	set: (name: string, data: Uint8Array) => Promise<IProviderData[]>;
	del: (name: string) => Promise<NullableProviderData[]>;
	get: (name: string) => Promise<NullableProviderData>;
	peek: (name: string) => Promise<NullableProviderData>;
	has: (name: string) => Promise<boolean>;
}

export interface IProviderMetaMulti {
	set: (name: string, data: Uint8Array) => Promise<IProviderData[]>;
	get: (name: string) => Promise<NullableProviderData[]>;
	peek: (name: string) => Promise<NullableProviderData[]>;
	del: (name: string) => Promise<NullableProviderData[]>;
	has: (name: string) => Promise<boolean[]>;
}

export interface S3CacheConfig {
	key: string;
	secret: string;
	region: string;
	defaultBucket: string;
	defualtPrefix: string;
}
export type RenamerFn = (s:string)=>Promise<string>
export type S3UriParserFn = (str: string) => { Bucket: string; Key: string };

export interface IDynamoCacheConfig {
	key: string; 
	secret: string; 
	region: string; 
	table: string 
}

//#endregion interfaces

const retriveFromFirstNonNull = (
	action: "get" | "has" | "peek",
	name: string,
	providers: IProvider[],
) => {
	return providers.reduce(async (acc, prov) => {
		const rezAcc = await acc;
		// console.log(`performing ${action} on: ${prov.provider}`)
		return rezAcc !== null ? rezAcc : prov[action](name);
	}, Promise.resolve(null) as Promise<IProviderData | boolean | null>);
}

export const renamerWithMurmurHash3: RenamerFn = (s: string) => {
	const hashState = MurmurHash3();
	return Promise.resolve(hashState.hash(s).result().toString());
};

export const defaultRenamer: RenamerFn = (s: string)=>{
	return Promise.resolve(changeEncOf(s).from('utf8').to('base64url').string())
}

export const inMem = (max = 1000, renamer?: RenamerFn ) => {
	const provider = "RAM";

	// const cache = new QuickLRU<string, IProviderData>({ maxSize:max });
	const cache = new LRUCache<string, IProviderData, unknown>({ updateAgeOnGet: true, max });
	const _ = { inMemory: true, size: () => cache.size };
	
    const renameForCache = renamer ?? defaultRenamer

	const set = async (name: string, data: Uint8Array) => {
		const renamed = await renameForCache(name);
		cache.set(renamed, { name, renamed, data, provider, _ });
		// lru.set(renamed, {name, data, provider, _ })
		return { name, renamed, data, provider, _ };
	};
	const del = async (name: string) => {
		const renamed = await renameForCache(name);
		cache.delete(renamed);
		return { name, renamed, data: new Uint8Array(), provider, _ };
	};
	const get = async (name: string) => cache.get(await renameForCache(name)) ?? null;
	const has = async (name: string) => cache.has(await renameForCache(name));
	const peek = async (name: string) => cache.peek(await renameForCache(name)) ?? null;

	return {
		_,
		provider,
		renameForCache,
		del,
		get,
		set,
		has,
		peek,
	};
};

export const s3cache = (
	s3c: S3CacheConfig,
	override: Partial<IProvider> = {renameForCache: (s)=>Promise.resolve(s)},
    s3Parse: S3UriParserFn = s3UriParse,
) => {
	s3c.defaultBucket = s3c.defaultBucket ?? "";
	s3c.defualtPrefix = s3c.defualtPrefix ?? "";

	const provider = "AWS:S3";
	const _ = { cloud: "AWS", service: "S3", region: s3c.region };

	const s3 = new S3Client({
		region: s3c.region,
		credentials: {
			accessKeyId: s3c.key,
			secretAccessKey: s3c.secret,
		},
	});

    const renameForCache = override.renameForCache ?? defaultRenamer

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

	const set = async (name: string, data: Uint8Array) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renameForCache(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;

		const s3r = await s3.send(
			new PutObjectCommand({
				Bucket,
				Key: sendKey,
				Body: data,
			}),
		);

		return {
			name,
			renamed: await renameForCache(Key),
			provider,
			data,
			_: { ...s3r, cloud: "AWS" },
		} as IProviderData;
	};

	const del = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renameForCache(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;
		await s3.send(new DeleteObjectCommand({ Bucket, Key: sendKey }));
		return {
			name,
			renamed,
			data: new Uint8Array(),
			provider,
			_,
		} as IProviderData;
	};

	const get = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renameForCache(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;
		const s3r = await s3.send(new GetObjectCommand({ Bucket, Key: sendKey }));
		return {
			name,
			renamed,
			provider,
			_: { ...s3r, cloud: "AWS" } as Record<string, unknown>,
			data: await s3r.Body?.transformToByteArray(),
		} as IProviderData;
	};

	const has = async (name: string) => {
		const { Bucket, Key } = defaultedParse(name, {
			Bucket: s3c.defaultBucket,
			Key: s3c.defualtPrefix,
		});
		const renamed = await renameForCache(Key);
		const sendKey = `${s3c.defualtPrefix}/${renamed}`;

		return s3.send(new HeadObjectCommand({ Bucket, Key: sendKey }))
			.then(() => true)
			.catch(() => false);
	};

	const peek = get;

	return {
		_: override._ ?? _,
		provider: override.provider ?? provider,
		has: override.has ?? has,
		del: override.del ?? del,
		peek: override.peek ?? peek,
		get: override.get ?? get,
		set: override.set ?? set,
		renameForCache: override.renameForCache ?? renameForCache,
	};
};

export const denoKVcache = (config: {maxItems: number, prefix: string}, renamer?: RenamerFn ):IProvider=>{
	const provider = "Deno:KV";
	const _ = {
		cloud: "Deno Deploy",
		...config
	}
	const history = new Map<string, number>()
	const renameForCache = renamer ?? defaultRenamer

	const set = async (name: string, data: Uint8Array)=>{
		const kvP = Deno.openKv();
		const renamed = await renameForCache(name)
		
		// objectHistory.push({name: renamed, ts: Date.now()})
		history.set(renamed,Date.now())

		const payload = {
			_,
			name,
			renamed,
			provider,
			data
		}
		

		const kv = await kvP
		await kv.set([config.prefix, renamed], payload);
		
		if(history.size > config.maxItems){
			// too big, delete oldest
			const oldestObj = Object.entries(history)
				.reduce((prior, [name, ts])=>{
				return ts < prior.ts 
					? {name, ts} 
					: prior
			},{name:'', ts: Infinity})

			history.delete(oldestObj.name)
			kv.delete([config.prefix, oldestObj.name])
		}

		kv.close()
		return {
			_,
			name,
			renamed,
			provider,
			data
		}
	}
	const get = async (name: string)=>{
		const kv = await Deno.openKv();
		const renamed = await renameForCache(name)
		const res = await kv.get<IProviderData>([config.prefix, renamed]);
		history.set(renamed,Date.now())
		kv.close();
		return res.value ?? null
	}
	const del = async (name: string)=>{
		const kv = await Deno.openKv();
		const renamed = await renameForCache(name)
		
		await kv.delete([config.prefix, renamed]);
		history.delete(renamed)
		kv.close();

		return {
			_,
			name,
			renamed,
			provider,
			data: new Uint8Array()
		}
	}
	const has = (name: string)=> get(name).then((r)=>r !== null)
	const peek = async (name:string) => {
		const kv = await Deno.openKv();
		const renamed = await renameForCache(name)
		const res = await kv.get<IProviderData>([config.prefix, renamed]);
		// peek doesn't update history
		kv.close();
		return res.value ?? null
	}
	
	return {
		provider,
		_:{},
		del,
		get,
		set,
		has,
		peek,
		renameForCache,
	}
}

export const dynamoCache = (
	dyn: IDynamoCacheConfig,
	renamer?: (s: string) => Promise<string>,
):IProvider => {
	const dync = new DynamoDBClient({
		region: dyn.region,
		credentials: {
			accessKeyId: dyn.key,
			secretAccessKey: dyn.secret,
		},
	});
	const provider = "AWS:Dynamo";
	const _ = {
		cloud: "AWS:Dynamo",
		service: "Dynamo",
		region: dyn.region,
		describeTable: () => dync.send(new DescribeTableCommand({ TableName: dyn.table })),
		describeTTL: () => dync.send(new DescribeTimeToLiveCommand({ TableName: dyn.table }))
	};
	const renameForCache = renamer ?? defaultRenamer;
	const set = async (name: string, data: Uint8Array) => {
		const renamed = await renameForCache(name);
		const payload  = {
			_,
			name,
			renamed,
			data,
			provider,
		} as IProviderData;

		const r = dync.send(
			new PutItemCommand({
				TableName: dyn.table,
				Item: marshall({
					...payload,
					sk: await renameForCache(name),
					pk: await renameForCache(name),
				}),
			}),
		)
		.then( () => payload )
		.catch((e:unknown) => {
			console.error('cache.ts:412', e)
			return payload
		});

		return r
	};
	const payload = (name:string, renamed: string, data: Uint8Array): IProviderData => ({
		_,
		provider,
		name,
		renamed,
		data,
	})	
	const get = async (name: string) => {
		const renamed = await renameForCache(name);

		return dync.send(
			new GetItemCommand({
				TableName: dyn.table,
				Key: marshall({
					pk: renamed,
					sk: renamed,
				}),
			}),
		).then((r) => {
			const { data } = unmarshall(r?.Item ?? {}) ?? { data : null }
			return payload(name, renamed, data) ?? null
		}).catch(() => null);
	};
	const peek = (name: string) => get(name);
	const has = (name: string) => get(name).then((r) => r !== null);
	const del = async (name: string) => {
		const renamed = await renameForCache(name);
		return dync.send(
			new DeleteItemCommand({
				TableName: dyn.table,
				Key: marshall({ pk: renamed, sk: renamed }),
			}),
		).then(() => ({
			_,
			name,
			renamed,
			data: new Uint8Array(),
			provider,
		} as IProviderData)).catch(() => null);
	};

	return {
		_,
		provider,
		has,
		del,
		peek,
		get,
		set,
		renameForCache: renamer ?? renameForCache,
	};
};

export const cacheStack = (...providers: IProvider[]): IProviderMeta => {
	const set = (name: string, data: Uint8Array) =>
		Promise.all(providers.map((prov) => {
			return prov.set(name, data);
		}));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => retriveFromFirstNonNull("get", name, providers) as Promise<IProviderData | null>;
	const has = (name: string) => retriveFromFirstNonNull("has", name, providers) as Promise<boolean>;
	const peek = (name: string) => retriveFromFirstNonNull("peek", name, providers) as Promise<IProviderData | null>;
	return { get, set, del, has, peek };
};

export const cacheArray = (...providers: IProvider[]): IProviderMetaMulti => {
	const set = (name: string, data: Uint8Array) => Promise.all(providers.map((prov) => prov.set(name, data)));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => Promise.all(providers.map((prov) => prov.get(name)));
	const has = (name: string) => Promise.all(providers.map((prov) => prov.has(name)));
	const peek = (name: string) => Promise.all(providers.map((prov) => prov.peek(name)));
	return { get, set, del, has, peek };
};

export const cacheRace = (...providers: IProvider[]): IProviderMeta => {
	const set = (name: string, data: Uint8Array) => Promise.all(providers.map((prov) => prov.set(name, data)));
	const del = (name: string) => Promise.all(providers.map((prov) => prov.del(name)));
	const get = (name: string) => Promise.race(providers.map((prov) => prov.get(name)));
	const has = (name: string) => Promise.race(providers.map((prov) => prov.has(name)));
	const peek = (name: string) => Promise.race(providers.map((prov) => prov.peek(name)));
	return { get, set, del, has, peek };
};

// precomposed stacks
export const localizedS3Store = (s3c:{params: S3CacheConfig, overrides?: Partial<IProvider>, parser?: S3UriParserFn}, local:{max?: number}, renamer?: RenamerFn)=>{
	return cacheStack(
		inMem(local.max ?? 1024, renamer),
		s3cache(s3c.params, s3c.overrides ?? {renameForCache: renamer}, s3c.parser ?? s3UriParse)
	)
}

export const localizedDynamoStore = (dyn:{params: IDynamoCacheConfig}, local: {max?: number}, renamer?: RenamerFn)=>{
	return cacheStack(
		inMem(local.max ?? 1024, renamer),
		dynamoCache(dyn.params, renamer)
	)
}

export default { cacheArray, cacheStack, cacheRace, s3cache, inMem };