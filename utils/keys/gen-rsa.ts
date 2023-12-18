async function generateRSAKeyPair() {
	return await crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: { name: "SHA-256" },
		} as RsaHashedImportParams,
		true,
		["encrypt", "decrypt"],
	) as CryptoKeyPair;
}

const keyPair = await generateRSAKeyPair();
export const publicRSA = await crypto.subtle.exportKey(
	"jwk",
	keyPair.publicKey,
);
export const privateRSA = await crypto.subtle.exportKey(
	"jwk",
	keyPair.privateKey,
);

console.log("const publicRSA = ", JSON.stringify(publicRSA, null, 2));
console.log("const privateRSA = ", JSON.stringify(privateRSA, null, 2));

console.log('\n\nCopy paste this section into the .env file\n\n\n')
console.log(`## RSA
#
# $> deno run utils/keys/gen-rsa.ts
RSA_KEY_E=${privateRSA.e}
RSA_KEY_N="${privateRSA.n}"
RSA_KEY_PRIVATE_D="${privateRSA.d}"
RSA_KEY_PRIVATE_DP="${privateRSA.dp}"
RSA_KEY_PRIVATE_DQ="${privateRSA.dq}"
RSA_KEY_PRIVATE_P="${privateRSA.p}"
RSA_KEY_PRIVATE_Q="${privateRSA.q}"
RSA_KEY_PRIVATE_QI="${privateRSA.qi}"
`)
