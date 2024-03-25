// import {assert} from '$std/testing/asserts.ts'
import { type PromiseOr } from "$lib/types.ts";
import { type EncModule, type EncModuleRet, makeBytes, makeString } from "./mod.ts";
import { type ValueForCacheInternals } from "../../cache.ts";

export const base64url: EncModule = async () => {
	const { encode, decode } = await import("$std/encoding/base64url.ts");

	const to = (input: Uint8Array | string, contentEncoding = "id" as string): Promise<ValueForCacheInternals> => {
		return Promise.resolve({
			data: makeBytes(encode(makeBytes(input))),
			"content-encoding": ["base64url", ...contentEncoding.split(";")].join(";"),
			"content-type": typeof input === "string" ? "string" : "Uint8Array",
		} as ValueForCacheInternals);
	};

	const recode = async (value: PromiseOr<ValueForCacheInternals>): Promise<ValueForCacheInternals> => {
		const v = await value;
		const contentEncoding = v["content-encoding"].split(";");

		return Promise.resolve({
			data: makeBytes(encode(makeBytes(v.data))),
			"content-encoding": ["base64url", ...contentEncoding].join(";"),
			"content-type": v["content-type"],
		} as ValueForCacheInternals);
	};

	const from = (value: ValueForCacheInternals): Promise<ValueForCacheInternals> => {
		const contentEncoding = value["content-encoding"].split(";");
		const encoding = contentEncoding.shift();

		if (encoding !== "base64url") {
			return Promise.reject(new Error("base64url encoding not found"));
		}

		return Promise.resolve({
			data: makeBytes(decode(makeString(value.data))),
			"content-encoding": contentEncoding.join(";"),
			"content-type": value["content-type"],
		} as ValueForCacheInternals);
	};

	return { to, from, recode } as EncModuleRet;
};
