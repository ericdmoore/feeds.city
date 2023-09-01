import { assert } from "$std/testing/asserts.ts";
import { PromiseOr } from "$lib/types.ts";
import { type EncModule, type EncModuleRet, makeBytes } from "./mod.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

export const br: EncModule = async (compressThreshold = 512) => {
	const {
		compress: brCompress,
		decompress: brDecompress,
	} = await import("brotli"); // @see import_map

	const to = async (input: Uint8Array | string, contentEncoding = "id" as string) => {
		const bytes = makeBytes(input);
		if (bytes.length > (compressThreshold as number)) {
			return {
				data: await brCompress(bytes),
				"content-encoding": ["br", ...contentEncoding.split(";")].join(";"),
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

	const from = async (retData: ValueForCacheInternals) => {
		const contentEncodings = retData["content-encoding"].split(";");
		const enc = contentEncodings.shift();

		assert(enc === "br");

		return {
			data: await brDecompress(makeBytes(retData.data)),
			"content-encoding": contentEncodings.join(";"),
			"content-type": retData["content-type"],
		};
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>) => {
		const v = await value;

		if (v.data.length > (compressThreshold as number)) {
			return {
				data: await brCompress(makeBytes(v.data)),
				"content-encoding": ["br", ...v["content-encoding"].split(";")].join(";"),
				"content-type": v["content-type"],
			};
		} else {
			return value;
		}
	};

	return { to, from, recode } as EncModuleRet;
};
