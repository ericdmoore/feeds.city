const keypair = await crypto.subtle.generateKey(
  { name: "ECDSA", namedCurve: "P-384" },
  true,
  ["sign", "verify"],
) as CryptoKeyPair;
console.log(
  "\n\n Private key:",
  JSON.stringify(
    await crypto.subtle.exportKey("jwk", keypair.privateKey),
    null,
    2,
  ),
);
console.log(
  "\n\n Public key:",
  JSON.stringify(
    await crypto.subtle.exportKey("jwk", keypair.publicKey),
    null,
    2,
  ),
);
