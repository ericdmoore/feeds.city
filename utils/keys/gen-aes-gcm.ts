const key = await window.crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256
  },
  true,
  ["encrypt", "decrypt"]
) as CryptoKey;

export const aesGcmJWK = await crypto.subtle.exportKey('jwk', key);

console.log('const aesGcmJKW = ', JSON.stringify(aesGcmJWK, null, 2))
