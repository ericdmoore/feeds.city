/**
 * Need a heuristic/policy of when to swap item/data between tiers
 * It is assumed that the swapping happens during the fallbacks/spillovers
 *
 * "Cost Minimization & Popularity Maximizing" seem to be two sides of the same coin
 * Non-Relative / Comparable figures could be used to determine which and how many to swap.
 *
 * times = [ts, ts, ts, ts, ts]
 * times ==> to a score
 * via
 * times.map( t => (Date.now() - t) / 60_000 )
 * 1 / Age ^ 1.8 :  "Minutes/Hours Since Last Touch"
 *
 * ∑ Votes each Discounted by it's age
 * ∆ Latency Benefit
 * ∆ Throughput Benefit
 *
 * ∑ (Expected Benefits / Expected Cost) = Benefit Ratio Score
 *
 * Score = (P-1) / ((Tnow - Tsent)+2)^G
 *
 * P = points of an item (and -1 is to negate submitters vote)
 * T = time since submission (in hours)
 * G = Gravity, defaults to 1.8 in news.arc
 */

import {
	bytestoJsonWithTypeNote,
	defaultFromBytes,
	defaultRenamer,
	type ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
	type TransformFunctionGroup,
} from "../cache.ts";

import { join } from "$std/path/mod.ts";
import { promisify } from "node:util";
import { type IFS, Union } from "unionfs";
import changeEnc from "$lib/utils/enocdings.ts";

export type NamedNumber = [string, number];
export type FsCacheConfig = {
	relativeDir: string;
	mountables?: IFS[];
	maxItems?: number;
};

export const cache = async (
	input: FsCacheConfig,
	transforms?: Partial<TransformFunctionGroup>,
): Promise<ICacheProvider> => {
	const provider = "Local Filesystem";
	const withInput = {
		maxItems: Infinity,
		mountables: [],
		...input,
	} as Required<FsCacheConfig>;

	let size = 0;
	const withMountables = withInput.mountables.length > 0;
	const itemHistory = {} as { [name: string]: number };

	await Deno.mkdir(withInput.relativeDir, { recursive: true });

	const meta = {
		input,
		cacheItemSize: () => size,
		youngestItem: () => {
			const data = Object.entries(itemHistory);
			return data.sort(([_, valA], [__, valZ]) => valZ - valA)[0];
		},
		oldestItem: () => {
			const data = Object.entries(itemHistory);
			return data.sort(([_, valA], [__, valZ]) => valA - valZ)[0];
		},
	};

	const dec = new TextDecoder();

	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = transforms?.fromBytes ?? defaultFromBytes;
	const toBytes = transforms?.toBytes ?? bytestoJsonWithTypeNote;

	let unionFs = new Union();
	for (const fs of withInput.mountables) {
		unionFs = unionFs.use(fs);
	}

	const get = (updateHistory: boolean) => async (name: string) => {
		const renamed = await renamer(name);
		const path = join(withInput.relativeDir, renamed);

		const cacehDataBytees = await Deno.readFile(path).catch(async () => {
			if (withMountables) {
				const globalBuffer = await promisify(unionFs.readFile)(path);
				return new Uint8Array(globalBuffer.buffer);
			} else {
				return null;
			}
		});

		if (!cacehDataBytees) {
			return null;
		} else {
			const cachedData = JSON.parse(dec.decode(cacehDataBytees));

			const payload = {
				provider,
				meta,
				key: { name, renamed },
				value: await fromBytes(cachedData),
			} as ICacheDataFromProvider;

			if (updateHistory) {
				itemHistory[renamed] = Date.now();
				size++;
			}
			return payload;
		}
	};

	const set = async (name: string, data: Uint8Array) => {
		const renamed = await renamer(name);
		const path = join(withInput.relativeDir, renamed);

		const payload = {
			provider,
			meta,
			key: { name, renamed },
			value: {
				"content-type": "Uint8Array",
				"content-encoding": "id",
				...await toBytes(data),
				transformed: new Uint8Array(),
			},
		} as ICacheableDataForCache & ICacheDataFromProvider;

		const dataToWrite = JSON.stringify(
			{
				...payload,
				value: {
					data: changeEnc(payload.value.data).from("utf8").to("base64").string(),
					"content-type": "Uint8Array",
					"content-encoding": "base64",
				},
			},
			null,
			2,
		);

		console.log({ payload });
		console.log(dataToWrite);

		await Deno.writeTextFile(path + ".json", dataToWrite);
		withMountables && await promisify(unionFs.writeFile)(path + ".json", JSON.stringify(dataToWrite));

		// udpate history
		itemHistory[renamed] = Date.now();
		if (!(renamed in itemHistory)) size++;

		// constrain queue if needed
		if (size > withInput.maxItems) {
			const [nameKey] = meta.oldestItem();
			await del(nameKey);
		}

		return payload;
	};
	const has = (name: string) => get(true)(name).then((data) => !!data).catch(() => false);
	const del = async (name: string) => {
		const renamed = await renamer(name);
		const path = join(withInput.relativeDir, renamed);
		await Deno.remove(path);

		delete itemHistory[renamed];
		size--;

		return {
			meta,
			provider,
			key: { name, renamed },
			value: { data: new Uint8Array(), transformed: new Uint8Array() },
		};
	};

	return {
		set,
		has,
		del,
		get: get(true),
		peek: get(false),
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
