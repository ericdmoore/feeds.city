const kid = Date.now();

export const keyPairRSA = await crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    hash: { name: "SHA-256" },
  } as RsaHashedImportParams,
  true,
  ["encrypt", "decrypt"],
) as CryptoKeyPair;

export const aesSecret = await window.crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256,
  },
  true,
  ["encrypt", "decrypt"],
) as CryptoKey;

export const signVerifyKeypair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-384" },
  true,
  ["sign", "verify"],
) as CryptoKeyPair;

console.log(
  "export const privateECDSA = ",
  JSON.stringify(
    {
      kid,
      ...await crypto.subtle.exportKey("jwk", signVerifyKeypair.privateKey),
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
      ...await crypto.subtle.exportKey("jwk", signVerifyKeypair.publicKey),
    },
    null,
    2,
  ),
);

const aesGcmJWK = await crypto.subtle.exportKey("jwk", aesSecret);
const publicRSA = await crypto.subtle.exportKey("jwk", keyPairRSA.publicKey);
const privateRSA = await crypto.subtle.exportKey("jwk", keyPairRSA.privateKey);

console.log(
  "\n\nexport const aesGcmJWK = ",
  JSON.stringify(aesGcmJWK, null, 2),
);
console.log(
  "\n\nexport const publicRSA = ",
  JSON.stringify(publicRSA, null, 2),
);
console.log(
  "\n\nexport const privateRSA = ",
  JSON.stringify(privateRSA, null, 2),
);

console.log(`
export default { 
  aes: { gcm256secret: aesGcmJWK as JsonWebKey }, // symetiric secret (session keys)
  rsa: { seal: publicRSA as JsonWebKey, open: privateRSA as JsonWebKey }, // used for new session keys
  ecdsa: {verify: publicECDSA as JsonWebKey, sign: privateECDSA as JsonWebKey } // signs JWTs and other things
};
`);
