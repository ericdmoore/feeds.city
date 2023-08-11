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
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	type ICacheDataFromProvider,
	type ICacheProvider,
} from "../cache.ts";

export interface IDynamoCacheConfig {
	key: string;
	secret: string;
	region: string;
	table: string;
}

export const dynamoCache = (
	dyn: IDynamoCacheConfig,
	transforms: {
		renamer?: (originalName: string) => Promise<string>;
		fromBytes: (bytes: Uint8Array) => Promise<unknown>;
		toBytes: (d: unknown) => Promise<Uint8Array>;
	},
): ICacheProvider => {
	const dync = new DynamoDBClient({
		region: dyn.region,
		credentials: {
			accessKeyId: dyn.key,
			secretAccessKey: dyn.secret,
		},
	});
	const provider = "AWS:Dynamo";
	const meta = {
		cloud: "AWS:Dynamo",
		service: "Dynamo",
		region: dyn.region,
		describeTable: () => dync.send(new DescribeTableCommand({ TableName: dyn.table })),
		describeTTL: () => dync.send(new DescribeTimeToLiveCommand({ TableName: dyn.table })),
	};

	const renameForCache = transforms.renamer ?? defaultRenamer;
	const fromBytes = defaultFromBytes;
	const toBytes = defaultToBytesWithTypeNote;

	const set = async (name: string, data: Uint8Array) => {
		const renamed = await renameForCache(name);
		const payload = {
			meta,
			provider,
			key: {
				name,
				renamed,
			},
			value: {
				data,
				inputType: "Uint8Array",
				transformed: new Uint8Array(),
			},
		} as ICacheDataFromProvider;

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
			.then(() => payload)
			.catch((e: unknown) => {
				console.error("cache.ts:412", e);
				return payload;
			});

		return r;
	};

	const payload = (name: string, renamed: string, data: Uint8Array): ICacheDataFromProvider => ({
		meta,
		provider,
		key: { name, renamed },
		value: { data, transformed: new Uint8Array() },
	});

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
			const { data } = unmarshall(r?.Item ?? {}) ?? { data: null };
			return payload(name, renamed, data) ?? null;
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
			meta,
			provider,
			key: { name, renamed },
			value: {
				data: new Uint8Array(),
				transformed: new Uint8Array(),
			},
		} as ICacheDataFromProvider))
			.catch(() => null);
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
			renameForCache,
			toBytes,
			fromBytes,
		},
	};
};
