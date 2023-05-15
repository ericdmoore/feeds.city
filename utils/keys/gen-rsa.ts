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
