import { PromiseOr } from "$lib/types.ts";
import { type EncModule, type EncModuleRet, makeBytes } from "./mod.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

export const snappy: EncModule = async (compressThreshold = 512) => {
	const { compress, uncompress } = await import("snappy");

	const to = async (input: Uint8Array | string, contentEncoding = "id" as string) => {
		const bytes = makeBytes(input);

		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await compress(bytes),
				"content-encoding": ["snappy", ...contentEncoding.split(";")].join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			} as ValueForCacheInternals;
		} else {
			return {
				data: bytes,
				"content-encoding": contentEncoding,
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			} as ValueForCacheInternals;
		}
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");

		if (v.data.length > (compressThreshold as number)) {
			return Promise.resolve({
				data: await compress(makeBytes(v.data)),
				"content-encoding": ["snappy", ...contentEncoding].join(";"),
				"content-type": "Uint8Array",
			} as ValueForCacheInternals);
		} else {
			return Promise.resolve(value);
		}
	};

	const from = async (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "snappy") {
			// assert(encoding === "snappy");
			return Promise.reject(new Error("snappy encoding not found"));
		}

		return Promise.resolve({
			data: await uncompress(makeBytes(value.data)),
			"content-encoding": contentEncoding.join(";"),
			"content-type": typeof value.data === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	return { to, recode, from } as EncModuleRet;
};
