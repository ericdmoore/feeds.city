/// <reference lib="deno.unstable" />
//#region imports

import { assert } from "$std/testing/asserts.ts";
import {
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
	type RenamerFn,
	type TransformFromBytes,
	type TransformToBytes,
} from "../cache.ts";
import { encodingWith } from "./recoders/mod.ts";

//#endregion imports

export const denoKVcache = async (
	config: { maxItems: number; prefix: string },
	transforms?: Partial<{
		renamer: RenamerFn;
		fromBytes: TransformFromBytes;
		toBytes: TransformToBytes;
	}>,
): Promise<ICacheProvider> => {
	const provider = "Deno:KV";

	const coder = await encodingWith();
	const history = new Map<string, number>();
	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = transforms?.fromBytes ?? defaultFromBytes;
	const toBytes = transforms?.toBytes ?? defaultToBytesWithTypeNote;
	const meta = {
		cloud: "Deno Deploy",
		size: () => history.size,
		...config,
	};
	const set = async (name: string, data: Uint8Array | string) => {
		const kv = await Deno.openKv();
		const renamed = await renamer(name);

		// objectHistory.push({name: renamed, ts: Date.now()})
		history.set(renamed, Date.now());

		const payload = {
			meta,
			provider,
			key: { name, renamed },
			value: {
				...await coder.encode(["id", "br", "base64url"], data),
			},
		} as ICacheableDataForCache;

		// const kv = await kvP;
		await kv.set([config.prefix, renamed], payload);

		if (history.size > config.maxItems) {
			// too big, delete oldest
			const oldestObj = Object.entries(history)
				.reduce((prior, [name, ts]) => {
					return ts < prior.ts ? { name, ts } : prior;
				}, { name: "", ts: Infinity });

			history.delete(oldestObj.name);
			kv.delete([config.prefix, oldestObj.name]);
		}

		kv.close();
		return {
			...payload,
			value: {
				...payload.value,
				transformed: await fromBytes(payload),
			},
		} as ICacheDataFromProvider;
	};
	const get = async (name: string) => {
		const kv = await Deno.openKv();
		const renamed = await renamer(name);

		const res = await kv.get<ICacheableDataForCache>([config.prefix, renamed]);
		kv.close();

		if (res.value) {
			history.set(renamed, Date.now());
			return {
				...res.value,
				value: {
					...await coder.decode(res.value.value),
					transformed: await fromBytes(res.value),
				},
			} as ICacheDataFromProvider;
		} else {
			return null;
		}
	};
	const del = async (name: string) => {
		const kv = await Deno.openKv();
		const renamed = await renamer(name);

		await kv.delete([config.prefix, renamed]);
		history.delete(renamed);
		kv.close();

		return {
			meta,
			provider,
			key: { name, renamed },
			value: { data: new Uint8Array(), transformed: new Uint8Array() },
		};
	};
	const has = (name: string) => get(name).then((r) => r !== null);
	const peek = async (name: string) => {
		const kv = await Deno.openKv();
		const renamed = await renamer(name);
		const res = await kv.get<ICacheDataFromProvider>([config.prefix, renamed]);
		// peek doesn't update history
		kv.close();
		return res.value ?? null;
	};

	return {
		provider,
		meta,
		del,
		get,
		set,
		has,
		peek,
		transforms: {
			renamer,
			fromBytes,
			toBytes,
		},
	};
};
