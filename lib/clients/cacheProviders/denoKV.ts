/// <reference lib="deno.unstable" />
//#region imports

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

//#endregion imports

export const denoKVcache = (
	config: { maxItems: number; prefix: string },
	transforms?: Partial<{
		renamer: RenamerFn;
		fromBytes: TransformFromBytes;
		toBytes: TransformToBytes;
	}>,
): ICacheProvider => {
	const provider = "Deno:KV";
	const meta = {
		cloud: "Deno Deploy",
		...config,
	};
	const history = new Map<string, number>();
	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = transforms?.fromBytes ?? defaultFromBytes;
	const toBytes = transforms?.toBytes ?? defaultToBytesWithTypeNote;

	const set = async (name: string, data: Uint8Array) => {
		const kvP = Deno.openKv();
		const renamed = await renamer(name);

		// objectHistory.push({name: renamed, ts: Date.now()})
		history.set(renamed, Date.now());

		const payload = {
			meta,
			provider,
			key: { name, renamed },
			value: { data, "content-encoding": "id", "content-type": "Uint8Array", transformed: new Uint8Array() },
		} as ICacheableDataForCache & ICacheDataFromProvider;

		const kv = await kvP;
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
		return payload;
	};
	const get = async (name: string) => {
		const kv = await Deno.openKv();
		const renamed = await renamer(name);
		const res = await kv.get<ICacheableDataForCache>([config.prefix, renamed]);
		history.set(renamed, Date.now());
		kv.close();

		return res.value
			? {
				...res.value,
				value: {
					...res.value.value,
					transformed: await fromBytes(res.value),
				},
			} as ICacheDataFromProvider
			: null;
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
