import * as base64url from "$std/encoding/base64url.ts";
import jwKeyExamples from "../../tests/lib/parsers/helpers/jwKeys.example.ts";

const enc = new TextEncoder();

const pubCryhptoKey = await window.crypto.subtle.importKey(
	"jwk",
	jwKeyExamples.rsa.seal,
	{ name: "RSA-OAEP", hash: { name: "SHA-256" } },
	false,
	["encrypt"],
);

// 334 is the max length of a message that can be encrypted with the public key - using base64url encoding
const message = base64url.encode(crypto.getRandomValues(new Uint8Array(334))); // 446 after encoding, 447 = bad
console.log("message.length :>", message.length);
console.log("message :>", message);

const encoded = enc.encode(message);
console.log("encoded", encoded);

const encMessage = await crypto.subtle.encrypt(
	{ name: "RSA-OAEP" },
	pubCryhptoKey,
	encoded,
);
console.log("encMessage", base64url.encode(new Uint8Array(encMessage)));
