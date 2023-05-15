import * as multi from "multiformats";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const sha = (name: AlgorithmIdentifier) => async (data: Uint8Array) =>
  new Uint8Array(await crypto.subtle.digest(name, data));

const sha256 = multi.hasher.from({
  name: "sha2-256",
  code: 0x12,
  encode: sha("SHA-256"),
});

const sha512 = multi.hasher.from({
  name: "sha2-512",
  code: 0x13,
  encode: sha("SHA-512"),
});

const json = () => {
  return {
    name: "json",
    code: 0x0200,
    encode: <T>(node: T) => textEncoder.encode(JSON.stringify(node)),
    decode: <T>(data: Uint8Array) => JSON.parse(textDecoder.decode(data)) as T,
  };
};

export const cidHash = async (
  i: string | Record<string, unknown>,
  hahser: "sha256" | "sha512" = "sha256",
) => {
  return typeof i === "string"
    ? hahser === "sha256"
      ? multi.CID.create(1, 0x00, await sha256.digest(textEncoder.encode(i)))
      : multi.CID.create(1, 0x00, await sha512.digest(textEncoder.encode(i)))
    : hahser === "sha256"
    ? multi.CID.create(1, json().code, await sha256.digest(json().encode(i)))
    : multi.CID.create(1, json().code, await sha512.digest(json().encode(i)));
};

export const cidStr = async (
  i: string | Record<string, unknown>,
  hashlen: "sha256" | "sha512" = "sha256",
) => {
  return (await cidHash(i, hashlen)).toString();
};

export const hashUsingCID = cidStr;
