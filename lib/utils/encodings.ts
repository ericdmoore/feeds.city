import { decode as hexDecode, encode as hexEncode } from "$std/encoding/hex.ts";
import { decode as b64Decode, encode as b64Encode } from "$std/encoding/base64.ts";
import { decode as b58Decode, encode as b58Encode } from "$std/encoding/base58.ts";
import { decode as b64urlDecode, encode as b64urlEncode } from "$std/encoding/base64url.ts";

export type EncodingFormatOptions = "hex" | "base64" | "base58" | "base64url" | "utf8";

export const changeEnc = (input: string | Uint8Array) => {
	const enc = new TextEncoder();
	const dec = new TextDecoder();

	const string = (state: Uint8Array | string) => (): string => typeof state === "string" ? state : dec.decode(state);

	const to = (normArr: Uint8Array) => (toEnc: EncodingFormatOptions = "utf8") => {
		switch (toEnc) {
			case "hex":
				return {
					string: string(hexEncode(normArr)),
					array: () => hexEncode(normArr),
				};
			case "base64":
				return {
					string: string(b64Encode(normArr)),
					array: () => enc.encode(b64Encode(normArr)),
				};
			case "base58":
				return {
					string: string(b58Encode(normArr)),
					array: () => enc.encode(b58Encode(normArr)),
				};
			case "base64url":
				return {
					string: string(b64urlEncode(normArr)),
					array: () => enc.encode(b64Encode(normArr)),
				};
			case "utf8":
				return {
					string: string(normArr),
					array: () => normArr,
				};
			default:
				return new Uint8Array() as never;
		}
	};

	const from = (fromEnc: EncodingFormatOptions = "utf8") => {
		const inputArr = typeof input === "string" ? enc.encode(input) : input;
		const inputStr = typeof input === "string" ? input : dec.decode(input);

		switch (fromEnc) {
			case "hex":
				return { to: to(hexDecode(inputArr)) };
			case "base64":
				return { to: to(b64Decode(inputStr)) };
			case "base58":
				return { to: to(b58Decode(inputStr)) };
			case "base64url":
				return { to: to(b64urlDecode(inputStr)) };
			case "utf8":
				return { to: to(inputArr) };
			default:
				return new Uint8Array() as never;
		}
	};

	/**
	 *
	 * @param fromEncArr
	 * @see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
	 * ```text
	 *    // Multiple, in the order in which they were applied
		  Content-Encoding: deflate, gzip
	 * ```
	 * @see: https://www.rfc-editor.org/rfc/rfc7231#section-3.1.2.2 (2nd FULL paragraph)
	 * Notice the order of the encodings is important. And they are marked left to right order they were applied by the sender
	 */
	const fromCompoundEnc = (...fromEncArr: string[]) => {
		const inputArr = typeof input === "string" ? enc.encode(input) : input;

		const data = fromEncArr
			.reduce((dataArrTransformed, fromEnc) => {
				switch (fromEnc) {
					case "hex":
						return hexDecode(dataArrTransformed);
					case "base64":
						return b64Decode(dec.decode(dataArrTransformed));
					case "base58":
						return b58Decode(dec.decode(dataArrTransformed));
					case "base64url":
						return b64urlDecode(dec.decode(dataArrTransformed));
					case "utf8":
						return dataArrTransformed;
					default:
						return new Uint8Array() as never;
				}
			}, inputArr);

		return { to: to(data) };
	};

	return {
		from,
		fromCompoundEnc,
	};
};

export default changeEnc;
