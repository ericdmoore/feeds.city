const keypair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-384" },
  true,
  ["sign", "verify"],
) as CryptoKeyPair;

const kid = Date.now();

console.log(
  "export const privateECDSA = ",
  JSON.stringify(
    {
      kid,
      ...await crypto.subtle.exportKey("jwk", keypair.privateKey),
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
      ...await crypto.subtle.exportKey("jwk", keypair.publicKey),
    },
    null,
    2,
  ),
);
