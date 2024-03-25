import {
	DeleteItemCommand,
	DeleteItemCommandOutput,
	DescribeTableCommand,
	DescribeTableCommandOutput,
	DescribeTimeToLiveCommand,
	DescribeTimeToLiveCommandOutput,
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
	QueryCommand,
	type QueryCommandInput,
	QueryCommandOutput,
	ScanCommand,
	type ScanCommandInput,
	ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";

import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
	type CacheName,
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	type ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
	type NullableProviderData,
	type TransformFromBytes,
	type TransformToBytes,
} from "../cache.ts";

import { encodingWith } from "./encoders/mod.ts";
export interface IDynamoCacheConfig {
	key: string;
	secret: string;
	region: string;
	table: string;
}

export interface DynamoCache extends ICacheProvider<Uint8Array> {
	provider: string;
	meta: {
		size: () => number;
		cloud: "AWS:Dynamo";
		service: "Dynamo";
		region: string;
		describeTable: () => Promise<DescribeTableCommandOutput>;
		describeTTL: () => Promise<DescribeTimeToLiveCommandOutput>;
		deleteItem: (name: string) => Promise<DeleteItemCommandOutput>;
		scan: (input: Omit<ScanCommandInput, "TableName">) => Promise<ScanCommandOutput>;
		query: (input: Omit<QueryCommandInput, "TableName">) => Promise<QueryCommandOutput>;
	};
	transforms: {
		renamer(originalName: string): Promise<CacheName>;
		toBytes: TransformToBytes;
		fromBytes: TransformFromBytes;
	};
	set: (name: string, data: Uint8Array | string) => Promise<ICacheDataFromProvider>;
	get: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	peek: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	del: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	has: (name: string) => Promise<boolean>;
}

export const cache = async (
	dyn: IDynamoCacheConfig,
	transforms?: Partial<{
		renamer: (originalName: string) => Promise<string>;
		fromBytes: (bytes: Uint8Array) => Promise<unknown>;
		toBytes: (d: unknown) => Promise<Uint8Array>;
	}>,
): Promise<DynamoCache> => {
	const dync = new DynamoDBClient({
		region: dyn.region,
		credentials: {
			accessKeyId: dyn.key,
			secretAccessKey: dyn.secret,
		},
	});
	let size = 0;
	const provider = "AWS:Dynamo";
	const meta = {
		cloud: "AWS:Dynamo" as const,
		service: "Dynamo" as const,
		region: dyn.region,
		size: () => Object.freeze(size),
		deleteItem: async (name: string) =>
			dync.send(
				new DeleteItemCommand({
					TableName: dyn.table,
					Key: marshall({ pk: await renamer(name), sk: await renamer(name) }),
				}),
			),
		describeTable: () => dync.send(new DescribeTableCommand({ TableName: dyn.table })),
		describeTTL: () => dync.send(new DescribeTimeToLiveCommand({ TableName: dyn.table })),
		scan: (input: Omit<ScanCommandInput, "TableName">) =>
			dync.send(new ScanCommand({ ...input, TableName: dyn.table })),
		query: (input: Omit<QueryCommandInput, "TableName">) =>
			dync.send(new QueryCommand({ ...input, TableName: dyn.table })),
	};

	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = defaultFromBytes;
	const toBytes = defaultToBytesWithTypeNote;

	const coder = await encodingWith();

	const set = async (name: string, data: Uint8Array | string) => {
		const renamed = await renamer(name);
		const payload = {
			meta,
			provider,
			key: { name, renamed },
			value: await coder.encode(["id", "br"], data),
		} as ICacheableDataForCache;

		await dync.send(
			new PutItemCommand({
				TableName: dyn.table,
				Item: marshall({ ...payload, sk: renamed, pk: renamed }),
			}),
		).then(() => payload)
			.catch((e: unknown) => {
				console.error("cache.ts:412", e);
				return payload;
			});
		size++;
		return {
			...payload,
			value: {
				...payload.value,
				transformed: await fromBytes<Uint8Array>(payload),
			},
		};
	};

	const get = async (name: string): Promise<NullableProviderData<Uint8Array>> => {
		const renamed = await renamer(name);

		return dync.send(
			new GetItemCommand({
				TableName: dyn.table,
				Key: marshall({ pk: renamed, sk: renamed }),
			}),
		).then(async (r) => {
			const dynData = unmarshall(r?.Item ?? {}) as ICacheableDataForCache | undefined;
			// console.log(120,'dynamo.ts',dynData )
			const data = dynData?.value.data;
			return {
				meta,
				provider,
				key: { name, renamed },
				value: {
					data,
					transformed: await fromBytes(dynData),
				},
			} as ICacheDataFromProvider;
		}).catch(() => null);
	};
	const peek = (name: string) => get(name);
	const has = (name: string) => get(name).then((r) => r !== null);
	const del = async (name: string) => {
		const renamed = await renamer(name);
		return dync.send(
			new DeleteItemCommand({
				TableName: dyn.table,
				Key: marshall({ pk: renamed, sk: renamed }),
			}),
		).then(() => {
			size--;
			return {
				meta,
				provider,
				key: { name, renamed },
				value: {
					data: new Uint8Array(),
					transformed: new Uint8Array(),
				},
			} as ICacheDataFromProvider;
		}).catch(() => null);
	};

	return {
		meta,
		provider,
		has,
		del,
		peek,
		get,
		set,
		transforms: {
			renamer,
			toBytes,
			fromBytes,
		},
	};
};

export default cache;
