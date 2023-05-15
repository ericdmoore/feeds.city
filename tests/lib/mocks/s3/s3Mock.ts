// mod.ts audit: OK
//
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "https://esm.sh/@aws-sdk/client-s3@3.329.0?deno-std=0.172.0&dts";

const encoder = new TextEncoder();

export const s3Mock = (
  state: Map<string, Uint8Array> = new Map<string, Uint8Array>(),
) => ({
  headObject: (key: string) => {
    const res = state.get(key) ?? new Uint8Array();
    return {
      contentLength: res.length,
      deleteMarker: false,
      etag: hmac("sha256", res, res, undefined, "hex") as string,
      lastModified: new Date(), // res.headers.get("Last-Modified")!),
      missingMeta: 0,
      storageClass: "STANDARD",
      taggingCount: 0,
      cacheControl: undefined,
      contentDisposition: undefined,
      contentEncoding: undefined,
      contentLanguage: undefined,
      contentType: undefined,
      expires: undefined,
      legalHold: false,
      lockMode: undefined,
      lockRetainUntil: undefined,
      partsCount: undefined,
      replicationStatus: undefined,
      versionId: undefined,
      websiteRedirectLocation: undefined,
    };
  },
  putObject: (
    key: string,
    data: unknown | string | Uint8Array,
  ): Promise<Uint8Array> => {
    const val = typeof data === "string"
      ? encoder.encode(data)
      : data instanceof Uint8Array
      ? data
      : encoder.encode(JSON.stringify(data));
    state.set(key, val);
    return Promise.resolve(val);
  },
  getObject: (key: string) => {
    const data = state.get(key);
    return data
      ? { body: new Response(data).body! }
      : Promise.reject({ err: "Object Not Found", code: 404 });
  },
  send: (command: PutObjectCommand | HeadObjectCommand | GetObjectCommand) => {
    if (command instanceof PutObjectCommand) {
      console.log(command);
    } else if (command instanceof HeadObjectCommand) {
      console.log(command);
    } else {
      console.log(command);
    }

    switch (command.constructor) {
      case PutObjectCommand:
        return Promise.resolve(null);
      case HeadObjectCommand:
        return Promise.resolve(null);
      case GetObjectCommand:
        return Promise.resolve(null);
      default:
        return null as never;
    }
  },
});
