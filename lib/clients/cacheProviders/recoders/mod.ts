import { type PromiseOr } from "$lib/types.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

import { br } from "./br.ts";
import { zstd } from "./zstd.ts";
import { gzip } from "./gzip.ts";
import { snappy } from "./snappy.ts";
import { base64url } from "./b64url.ts";

export type AvailableEncodings = "id" | "base64url" | "hex" | "utf8" | "br" | "gzip" | "snappy" | "zstd";

export type EncModule = (...i: unknown[]) => Promise<EncModuleRet>;

export interface EncModuleRet {
	to: (input: Uint8Array | string, contentEncoding?: string) => Promise<ValueForCacheInternals>;
	from: (input: ValueForCacheInternals) => Promise<ValueForCacheInternals>;
	recode: (input: PromiseOr<ValueForCacheInternals>) => Promise<ValueForCacheInternals>;
}

//#endregion interfaces

export const makeBytes = (input: Uint8Array | string) => {
	const enc = new TextEncoder();
	return typeof input === "string" ? enc.encode(input) : input;
};

export const makeString = (input: Uint8Array | string) => {
	const dec = new TextDecoder();
	return typeof input === "string" ? input : dec.decode(input);
};

export const id: EncModule = () => {
	const to = (input: Uint8Array | string, contentEncoding = "id" as string) => {
		return Promise.resolve({
			data: makeBytes(input),
			"content-encoding": contentEncoding,
			"content-type": typeof input === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");

		return Promise.resolve({
			data: makeBytes(v.data),
			"content-encoding": ["id", ...contentEncoding].join(";"),
			"content-type": "Uint8Array",
		} as ValueForCacheInternals);
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "id") {
			return Promise.reject(new Error("id encoding not found"));
		}

		return Promise.resolve({
			data: makeBytes(value.data),
			"content-encoding": "id",
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return Promise.resolve({ to, recode, from });
};

export const encoderMap = async (compressThreshold = 512) => ({
	id: await id(),
	br: await br(compressThreshold),
	snappy: await snappy(compressThreshold),
	gzip: await gzip(compressThreshold),
	zstd: await zstd(compressThreshold),
	base64url: await base64url(),
} as Record<AvailableEncodings, EncModuleRet>);

export const encodingWith = async (encodingmap?: PromiseOr<Record<string, EncModuleRet>>) => {
	const encMap = await (encodingmap ? encodingmap : encoderMap());

	const encode = (encodingRequests: AvailableEncodings[], inputData: Uint8Array | string) => {
		const en = encodingRequests.shift()!;

		return encodingRequests.reduce(
			(cacheVal, enNext) => encMap[enNext].recode(cacheVal),
			encMap[en].to(inputData),
		);
	};

	const recode = (encodingRequests: AvailableEncodings[], valInCache: ValueForCacheInternals) => {
		const encodings = valInCache["content-encoding"]
			.split(";")
			.concat(encodingRequests) as AvailableEncodings[];
		const en = encodings.shift()!;

		return encodings.reduce(
			async (cacheVal, enNext) => encMap[enNext].recode(await cacheVal),
			encMap[en].from(valInCache),
		);
	};

	const decode = (valInCache: ValueForCacheInternals) => {
		// console.log('valInCache["content-encoding"]', valInCache["content-encoding"])

		const encodings = valInCache["content-encoding"].split(";") as AvailableEncodings[];
		const en = encodings.shift()!;

		return encodings.reduce(
			async (cacheVal, enNext) => encMap[enNext].from(await cacheVal),
			encMap[en].from(valInCache),
		);
	};

	return { encode, decode, recode };
};

export default { id, br, zstd, gzip, snappy, base64url, encoderMap, encodingWith };
