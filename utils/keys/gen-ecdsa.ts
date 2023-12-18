//
//
const keypair = await crypto.subtle.generateKey(
	{ name: "ECDSA", namedCurve: "P-384" },
	true,
	["sign", "verify"],
) as CryptoKeyPair;

const kid = Date.now();


const privJwkKey = await crypto.subtle.exportKey("jwk", keypair.privateKey)
const pubJwkKey = await crypto.subtle.exportKey("jwk", keypair.publicKey)

console.log(
	"export const privateECDSA = ",
	JSON.stringify(
		{
			kid,
			...privJwkKey
		},
		null,
		2,
	),
);

console.log(
	"export const publicECDSA = ",
	JSON.stringify(
		{
			kid,
			...pubJwkKey
		},
		null,
		2,
	),
);


console.log('\n\nCopy paste this section into the .env file\n\n\n')
console.log(`## JWT
# $> deno run utils/keys/gen-ecdsa.ts
JWT_KEY_ALG=${privJwkKey.alg}
JWT_KEY_CRV=${privJwkKey.crv}
JWT_KEY_D_PRIVATE=${privJwkKey.d}
JWT_KEY_EXT=${privJwkKey.ext}
JWT_KEY_ID=${kid}
JWT_KEY_KTY=${privJwkKey.kty}
JWT_KEY_OPS_PRIVATE=${privJwkKey.key_ops}
JWT_KEY_OPS_PUBLIC=${pubJwkKey.key_ops}
JWT_KEY_X=${privJwkKey.x}
JWT_KEY_Y=${privJwkKey.y}
`)
