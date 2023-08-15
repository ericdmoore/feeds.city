import {
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	type ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
	type TransformFunctionGroup,
} from "../cache.ts";

import { join } from "$std/path/mod.ts";
import { promisify } from "node:util";
import { type IFS, ufs } from "unionfs";

export type LocalDir = { relativeDir: string; mountables?: IFS[] };

export const cache = (input: LocalDir, transforms?: Partial<TransformFunctionGroup>): ICacheProvider => {
	const provider = "This Filesystem";
	const meta = {
		input,
		cacheItemSize: () => {},
		youngestItem: () => {},
		oldestItem: () => {},
	};
	const dec = new TextDecoder();

	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = transforms?.fromBytes ?? defaultFromBytes;
	const toBytes = transforms?.toBytes ?? defaultToBytesWithTypeNote;

	const get = async (name: string) => {
		const renamed = await renamer(name);
		const path = join(input.relativeDir, renamed);

		if (input.mountables) {
			for (const fs of input.mountables) {
				ufs.use(fs);
			}
		}

		const cacehDataBytees = await Deno.readFile(path);
		const cachedData = JSON.parse(dec.decode(cacehDataBytees));

		const payload = {
			provider,
			meta,
			key: { name, renamed },
			value: await fromBytes(cachedData),
		} as ICacheDataFromProvider;

		return payload;
	};
	const set = async (name: string, data: Uint8Array) => {
		const renamed = await renamer(name);
		const path = join(input.relativeDir, renamed);

		const payload = {
			provider,
			meta,
			key: { name, renamed },
			value: { ...await toBytes(data), transformed: new Uint8Array() },
		} as ICacheableDataForCache & ICacheDataFromProvider;

		const dataToWrite = JSON.stringify(payload);

		await Deno.writeFile(
			path + ".json",
			new Blob([dataToWrite], { type: "application/json" }).stream(),
			{ createNew: true, append: false },
		);
		await promisify(ufs.writeFile)(path + ".json", JSON.stringify(dataToWrite));
		return payload;
	};
	const peek = get;
	const has = (name: string) => get(name).then((data) => !!data).catch(() => false);
	const del = async (name: string) => {
		const renamed = await renamer(name);
		const path = join(input.relativeDir, renamed);
		await Deno.remove(path);

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

	return {
		get,
		set,
		peek,
		has,
		del,
		provider,
		meta,
		transforms: {
			renamer,
			toBytes,
			fromBytes,
		},
	};
};

export default cache;
