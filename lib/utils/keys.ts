// similar to grab
// exports JWK + cryptoKeys from the JWK
// using ENV data

import { envVar } from "./vars.ts";
const env = await envVar(">> MISSING <<");

const jwkRsaPub = {
	kty: "RSA",
	alg: "RSA-OAEP-256",
	n: env("RSA_KEY_N"),
	e: env("RSA_KEY_E"),
	key_ops: ["encrypt"],
	ext: true,
} as JsonWebKey;

// console.log("rsa jwk:", jwkRsaPub);

const rsaPubKey = await crypto.subtle.importKey(
	"jwk",
	jwkRsaPub,
	{ name: "RSA-OAEP", hash: { name: "SHA-256" } },
	true,
	["encrypt"],
);

const jwkRsaPriv = {
	kty: "RSA",
	alg: "RSA-OAEP-256",
	e: env("RSA_KEY_E"),
	n: env("RSA_KEY_N"),
	d: env("RSA_KEY_PRIVATE_D"),
	p: env("RSA_KEY_PRIVATE_P"),
	q: env("RSA_KEY_PRIVATE_Q"),
	dp: env("RSA_KEY_PRIVATE_DP"),
	dq: env("RSA_KEY_PRIVATE_DQ"),
	qi: env("RSA_KEY_PRIVATE_QI"),
	key_ops: ["decrypt"],
	ext: true,
} as JsonWebKey;

const rsaPrivKey = await crypto.subtle.importKey(
	"jwk",
	jwkRsaPriv,
	{ name: "RSA-OAEP", hash: { name: "SHA-256" } },
	true,
	["decrypt"],
);

const jwkEcdsaPrivate = {
	kty: "EC",
	crv: "P-384",
	alg: "ES384",
	x: env("JWT_KEY_X"),
	y: env("JWT_KEY_Y"),
	d: env("JWT_KEY_D_PRIVATE"),
	key_ops: ["sign"],
	ext: true,
} as JsonWebKey;

const ecdsaPrivKey = await crypto.subtle.importKey(
	"jwk",
	jwkEcdsaPrivate,
	{ name: "ECDSA", namedCurve: "P-384" },
	true,
	["sign"],
);

const jwkEcdsaPub = {
	"kty": "EC",
	"crv": "P-384",
	"alg": "ES384",
	"x": env("JWT_KEY_X"),
	"y": env("JWT_KEY_Y"),
	"key_ops": ["verify"],
	"ext": true,
} as JsonWebKey;
const ecdsaPubKey = await crypto.subtle.importKey(
	"jwk",
	jwkEcdsaPub,
	{ name: "ECDSA", namedCurve: "P-384" },
	true,
	["verify"],
);

const jwkAesGcm = {
	kty: "oct",
	alg: "A256GCM",
	ext: true,
	k: env("AES_GCM_K"),
	key_ops: ["encrypt", "decrypt"],
} as JsonWebKey;

const aesGcmKey = crypto.subtle.importKey(
	"jwk",
	jwkAesGcm,
	{ name: "AES-GCM", length: 256 },
	true,
	["encrypt", "decrypt"],
);

export const allKeys = {
	jwk: {
		rsa: { seal: jwkRsaPub, open: jwkRsaPriv },
		ecdsa: { verify: jwkEcdsaPub, sign: jwkEcdsaPrivate },
		aesGcm: { secret: jwkAesGcm },
	},
	key: {
		rsa: { seal: rsaPubKey, open: rsaPrivKey },
		ecdsa: { verify: ecdsaPubKey, sign: ecdsaPrivKey },
		aesGcm: { secret: aesGcmKey },
	},
};

export default allKeys;
