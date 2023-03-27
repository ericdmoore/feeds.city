import * as dotenv from "$std/dotenv/mod.ts";

export const jwKeyPair = async (): Promise<CryptoKeyPair> => {
  await dotenv.load({ export: true }).catch(() =>
    console.error("errored while processsing .env file")
  );
  const privateKey = await crypto.subtle.importKey(
    "jwk",
    {
      "kty": "EC",
      "crv": "P-384",
      "alg": "ES384",
      "x": Deno.env.get("KEY_X"),
      "y": Deno.env.get("KEY_Y"),
      "d": Deno.env.get("KEY_D_PRIVATE"),
      "key_ops": ["sign"],
      // "ext": false
    },
    { name: "ECDSA", namedCurve: "P-384" },
    true,
    ["sign"],
  );

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    {
      "kty": "EC",
      "crv": "P-384",
      "alg": "ES384",
      "x": Deno.env.get("KEY_X"),
      "y": Deno.env.get("KEY_Y"),
      "key_ops": ["verify"],
      // "ext": false
    },
    { name: "ECDSA", namedCurve: "P-384" },
    true,
    ["verify"],
  );
  return { privateKey, publicKey };
};

export default jwKeyPair;
