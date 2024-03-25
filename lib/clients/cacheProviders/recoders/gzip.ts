import { PromiseOr } from "$lib/types.ts";
import { type EncModule, type EncModuleRet, makeBytes } from "./mod.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

export const gzip: EncModule = async (compressThreshold = 512) => {
	const { gzipEncode, gzipDecode } = await import("gzip_wasm");

	const to = async (input: Uint8Array | string, contentEncoding = "id" as string) => {
		const bytes = makeBytes(input);
		``;
		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await gzipEncode(bytes),
				"content-encoding": ["gzip", ...contentEncoding.split(";")].join(";"),
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
				data: gzipEncode(makeBytes(v.data)),
				"content-encoding": ["gzip", ...contentEncoding].join(";"),
				"content-type": "Uint8Array",
			} as ValueForCacheInternals);
		} else {
			return Promise.resolve(value);
		}
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		// @todo WTF? ???
		if (encoding !== "gzip") {
			// assert(encoding === "gzip");
			return Promise.reject(new Error("gzip encoding not found"));
		}

		return Promise.resolve({
			data: gzipDecode(makeBytes(value.data)),
			"content-encoding": contentEncoding.join(";"),
			"content-type": typeof value.data === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	return { to, recode, from } as EncModuleRet;
};
