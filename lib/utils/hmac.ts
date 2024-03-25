import encodings from "./encodings.ts";

export type SupportedHashNames = "SHA-1" | "SHA-256" | "SHA-512" | "SHA-384";
export type IoFmtOptions = "hex" | "base64" | "base64url" | "utf8";

// prefer a return value of :: string | Uint8Array
export const hmac = async (
	hashType: SupportedHashNames,
	secret: Uint8Array,
	msg: Uint8Array,
	outputEncoding: IoFmtOptions,
) => {
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		secret.buffer,
		{ name: "HMAC", hash: { name: hashType } },
		false,
		["sign", "verify"],
	);

	const signed = await crypto.subtle.sign(
		{ name: "HMAC" },
		cryptoKey,
		msg.buffer,
	);

	return encodings(new Uint8Array(signed)).from().to(outputEncoding).array();
};
