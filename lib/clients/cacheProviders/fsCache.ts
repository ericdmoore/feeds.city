/**
 * Need a heuristic/policy of when to swap item/data between tiers
 * It is assumed that the swapping happens during the fallbacks/spillovers
 *
 * "Cost Minimization & Popularity Maximizing" seem to be two sides/names of the same coin/idea
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
	type TransformFunctionGroup,
} from "../cache.ts";

import { join } from "$std/path/mod.ts";
import { JSONC } from "JSONC";
// import changeEnc from "$lib/utils/enocdings.ts";
import { encodingWith } from "./recoders/mod.ts";

export type NamedNumber = [string, number];
export type FsCacheConfig = {
	relativeDir: string;
	// mountables?: IFS[];
	usingExtention?: string | null;
	maxItems?: number;
};

export const cache = async (
	input: FsCacheConfig,
	transforms?: Partial<TransformFunctionGroup>,
) => {
	// ): Promise<ICacheProvider> => {
	const provider = "Local Filesystem";
	const withInput = {
		maxItems: Infinity,
		mountables: [],
		usingExtention: "",
		...input,
	} as Required<FsCacheConfig>;

	let size = 0;
	// const withMountables = withInput.mountables.length > 0;
	const itemHistory = {} as { [name: string]: number };

	await Deno.mkdir(withInput.relativeDir, { recursive: true });
	const coder = await encodingWith();

	const meta = {
		input,
		cacheItemSize: () => Object.freeze(size),
		showHistory: () => Object.freeze(itemHistory),
		youngestItem: () => {
			return Object
				.entries(itemHistory)
				.sort(([_, valA], [__, valZ]) => valZ - valA)[0];
		},
		oldestItem: () => {
			return Object
				.entries(itemHistory)
				.sort(([_, valA], [__, valZ]) => valA - valZ)[0];
		},
	};

	const dec = new TextDecoder();

	const renamer = transforms?.renamer ?? defaultRenamer;
	const fromBytes = transforms?.fromBytes ?? defaultFromBytes;
	const toBytes = transforms?.toBytes ?? bytestoJsonWithTypeNote;

	// let unionFs = new Union();
	// for (const fs of withInput.mountables) {
	// 	unionFs = unionFs.use(fs);
	// }

	const get = (updateHistory: boolean) => async (name: string) => {
		const renamed = await renamer(name);
		const cacehDataString = await Deno.readTextFile(join(withInput.relativeDir, `${renamed}.jsonc`)).catch(() => null);

		if (!cacehDataString) {
			return null;
		} else {
			const encodedCachedData = JSONC.parse(cacehDataString) as ICacheableDataForCache;
			const value = await coder.decode(encodedCachedData.value);
			const unencodedValueInCache: ICacheableDataForCache = { ...encodedCachedData, value };

			const payload = {
				provider,
				meta,
				key: { name, renamed },
				value: {
					...value,
					transformed: await fromBytes(unencodedValueInCache),
				},
			} as ICacheDataFromProvider;

			if (updateHistory) {
				itemHistory[renamed] = Date.now();
				size++;
			}
			return payload;
		}
	};

	const set = async (name: string, data: Uint8Array | string) => {
		const renamed = await renamer(name);

		const payloadForCache = {
			provider,
			meta,
			key: { name, renamed },
			value: {
				...await coder.encode(["id", "br", "base64url"], data),
				transformed: new Uint8Array(),
			},
		} as ICacheableDataForCache & ICacheDataFromProvider;

		const dataToWrite = JSON.stringify(
			{
				...payloadForCache,
				value: {
					...payloadForCache.value,
					data: dec.decode(payloadForCache.value.data),
				},
			},
		);

		// console.log(dataToWrite);

		await Deno.writeTextFile(join(withInput.relativeDir, `${renamed}.jsonc`), dataToWrite);
		// withMountables && await promisify(unionFs.writeFile)(path + ".json", JSON.stringify(dataToWrite));

		// udpate history
		if (!(renamed in itemHistory)) {
			size++;
			itemHistory[renamed] = Date.now();
		}

		// constrain queue if needed
		if (size > withInput.maxItems) {
			const [nameKey] = meta.oldestItem();
			console.warn(`>> Cache is full, attempting to remove: ${nameKey}`);

			// THIS IS WHERE YOU CAN DO MORE INTERESTING COORDINATIONS
			// Give this to another cache to hold
			// but are they ready for it?
			// What would you need from the other cache before you send it?

			// @Me(Upper): @Lower, Please make space, im going to evict this item, I'd like you to have it
			// @Lower: Thats nice, give me a sec
			// @Me(Upper): Eneueue Item, try again later
			// WHEN is later???
			//
			// - OR -
			// @UperTier:
			// send it over
			// I have X space going forward,
			// I have Y items that you should likely grab from me

			await del(nameKey, false);
		}

		return payloadForCache;
	};
	const has = (name: string) => get(true)(name).then((data) => !!data).catch(() => false);
	const del = async (name: string, renameMe = true) => {
		const renamed = renameMe ? await renamer(name) : name;
		const path = join(withInput.relativeDir, `${renamed}.jsonc`);
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
