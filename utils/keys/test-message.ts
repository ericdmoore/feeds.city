import exampleKeys from "../../tests/lib/parsers/helpers/jwKeys.example.ts";

import * as base64url from "$std/encoding/base64url.ts";

const enc = new TextEncoder();

const payload = {
  param1: true,
  param2: { a: 1, b: 2, c: 3, d: "efghij" },
  nonce1: crypto.randomUUID(),
  secretObj: {
    AWS_KEY: "SOME_EXAMPLE_KEY",
    AWS_SEC: "SOME_EXAMPLE_SEC_THAT_SHOULD_NEVER_BE_IN_CODE",
  },
};

const message = JSON.stringify(payload);
console.log("message", message);

const encoded = enc.encode(message); // NOTE: MAX size is 446 bytes; The whole thing errors out if you hit 447
console.log("encoded", encoded);

const sealingCryptoKey = await window.crypto.subtle.importKey(
  "jwk",
  exampleKeys.rsa.seal as JsonWebKey,
  { name: "RSA-OAEP", hash: { name: "SHA-256" } },
  true,
  ["encrypt"],
);

const encMessage = await crypto.subtle.encrypt(
  { name: "RSA-OAEP" },
  sealingCryptoKey,
  encoded,
);
console.log("encMessage: ", base64url.encode(new Uint8Array(encMessage)));
