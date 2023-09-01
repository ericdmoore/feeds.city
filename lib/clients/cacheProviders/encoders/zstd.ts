import { assert } from "$std/testing/asserts.ts";
import { PromiseOr } from "$lib/types.ts";
import { type EncModule, type EncModuleRet, makeBytes } from "./mod.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

export const zstd: EncModule = async (compressThreshold = 512) => {
	const {
		init,
		compress: zstdCompress,
		decompress: zstdDecompress,
	} = await import("zstd_wasm");
	// once and only
	await init();

	const to = async (input: Uint8Array | string, contentEncoding = "id" as string) => {
		const bytes = makeBytes(input);
		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await zstdCompress(makeBytes(input)),
				"content-encoding": ["zstd", contentEncoding].join(";"),
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		} else {
			return {
				data: bytes,
				"content-encoding": contentEncoding,
				"content-type": typeof input === "string" ? "string" : "Uint8Array",
			};
		}
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");
		const bytes = makeBytes(v.data);

		if (bytes.length > (compressThreshold as number)) {
			return Promise.resolve({
				data: await zstdCompress(bytes),
				"content-encoding": ["zstd", ...contentEncoding].join(";"),
				"content-type": "Uint8Array",
			} as ValueForCacheInternals);
		} else {
			return Promise.resolve(value);
		}
	};

	const from = async (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();
		assert(encoding === "zstd");

		return Promise.resolve({
			data: await zstdDecompress(makeBytes(value.data)),
			"content-encoding": contentEncoding.join(";"),
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return { to, from, recode } as EncModuleRet;
};
