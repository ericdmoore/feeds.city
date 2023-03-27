/**
 * Author: Eric D Moore
 *  Ref: https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html
 *  Ref: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
 */

import * as nodeBuffer from "nodeBuffer";

// const decoder = new TextDecoder()
const encoder = new TextEncoder();

export const hex = (input: string | Uint8Array): string =>
  nodeBuffer.Buffer.from(
    typeof input === "string" ? encoder.encode(input).buffer : input.buffer,
  ).toString("hex");

export async function sha256(input: string | Uint8Array): Promise<string> {
  return hex(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        typeof input === "string" ? encoder.encode(input) : input,
      ),
    ),
  );
}

export async function hmacSha256(
  key: string | Uint8Array,
  data: string | Uint8Array,
): Promise<Uint8Array> {
  const mac = await crypto.subtle.sign(
    { name: "HMAC", hash: "SHA-256" },
    await crypto.subtle.importKey(
      "raw",
      typeof key === "string" ? encoder.encode(key) : key,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    ),
    typeof data === "string" ? encoder.encode(data) : data,
  );

  return new Uint8Array(mac);
}

export const toAmz = (date: Date): string =>
  `${date.toISOString().slice(0, 19).replace(/[^\dT]/g, "")}Z`;

export const toDateStamp = (date: Date): string =>
  date.toISOString().slice(0, 10).replace(/[^\d]/g, "");

const AWS4 = new TextEncoder().encode("AWS4");

export async function signAwsV4(
  key: string | Uint8Array,
  msg: string,
): Promise<string> {
  const hash = await hmacSha256(key, msg);
  return hex(hash);
}

export async function getSignatureKey(
  key: string | Uint8Array,
  dateStamp: string,
  region: string,
  service: string,
): Promise<string | Uint8Array> {
  const _key = typeof key === "string" ? encoder.encode(key) : key;
  const paddedKey: Uint8Array = new Uint8Array([...AWS4, ..._key]);
  let mac = await hmacSha256(paddedKey, dateStamp);
  mac = await hmacSha256(mac, region);
  mac = await hmacSha256(mac, service);
  mac = await hmacSha256(mac, "aws4_request");
  return new Uint8Array(mac);
}

export interface Credentials {
  awsAccessKeyId: string;
  awsSecretKey: string;
  sessionToken?: string;
}

export const awsV4Sig = (
  cfg: Credentials & { region: string; service: string },
) => {
  return async (request: Request): Promise<Request> => {
    const ALGO = "AWS4-HMAC-SHA256";
    const date = new Date();
    const amzdate = toAmz(date);
    const datestamp = toDateStamp(date);

    const urlObj = new URL(request.url);
    const { host, pathname, searchParams } = urlObj;
    const { awsAccessKeyId, awsSecretKey } = cfg;

    searchParams.sort();
    const canonicalQuerystring = searchParams.toString();

    const headers = new Headers(request.headers);
    headers.set("x-amz-date", amzdate);
    headers.set("host", host);
    if (cfg.sessionToken) {
      headers.set("x-amz-security-token", cfg.sessionToken);
    }

    let canonicalHeaders = "";
    let signedHeaders = "";

    for (const key of [...headers.keys()].sort()) {
      canonicalHeaders += `${key.toLowerCase()}:${headers.get(key)}\n`;
      signedHeaders += `${key.toLowerCase()};`;
    }
    signedHeaders = signedHeaders.substring(0, signedHeaders.length - 1);

    const body = request.body
      ? new Uint8Array(await request.arrayBuffer())
      : null;
    const payloadHash = await sha256(body ?? new Uint8Array(0));

    const canonicalRequest =
      `${request.method}\n${pathname}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const canonicalRequestDigest = await sha256(canonicalRequest);

    const credentialScope =
      `${datestamp}/${cfg.region}/${cfg.service}/aws4_request`;
    const stringToSign =
      `${ALGO}\n${amzdate}\n${credentialScope}\n${canonicalRequestDigest}`;

    const signingKey = await getSignatureKey(
      awsSecretKey,
      datestamp,
      cfg.region,
      cfg.service,
    );

    const signature = await signAwsV4(signingKey, stringToSign);
    headers.set(
      "Authorization",
      `${ALGO} Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    );

    return new Request(request.url, {
      headers,
      method: request.method,
      body,
      redirect: request.redirect,
    });
  };
};
