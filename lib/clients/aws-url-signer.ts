/**
 * Author: Eric D Moore
 *  Ref: https://docs.aws.amazon.com/general/latest/gr/signing_aws_api_requests.html
 *  Ref: https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
 */
import type { HttpRequest as IHttpRequest, RequestSigningArguments } from "@aws-sdk/types";
import type { PromiseOr } from '$lib/types.ts'

import { encode as hexEnc } from "$std/encoding/hex.ts";

import { SignatureV4,  } from '@aws-sdk/signature-v4'
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";


// const decoder = new TextDecoder()
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const hex = (input: string | Uint8Array): string => {
	return typeof input === "string"
		? decoder.decode(hexEnc(encoder.encode(input)))
		: decoder.decode(hexEnc(input));
};

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
			typeof key === "string" 
				? encoder.encode(key) 
				: key,
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"],
		),
		typeof data === "string" 
			? encoder.encode(data) 
			: data,
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
		// const headers = {} as Record<string, string>; //  Object.fromEntries(request.headers.entries()) as Record<string, string>
		const headers = Object.fromEntries(request.headers.entries()) as Record<string, string>

		if (cfg.sessionToken) {
			headers["x-amz-security-token"] = cfg.sessionToken;
		}
		headers["x-amz-date"] = amzdate;
		headers["host"] = host;

		const { canonicalArr, signedArr } = Object.entries(headers)
			.sort((a, z) => a[0].localeCompare(z[0]))
			.reduce((p, [key, value]) => ({
				canonicalArr: [...p.canonicalArr, `${key.toLowerCase()}:${value}`],
				signedArr: [...p.signedArr, `${key.toLowerCase()}`],
			}), { canonicalArr: [] as string[], signedArr: [] as string[] });

		const canonicalHeaders = canonicalArr.join("\n");
		const signedHeaders = signedArr.join(";");

		const body = request.body ? new Uint8Array(await request.arrayBuffer()) : null;
		const payloadHash = await sha256(body ?? new Uint8Array(0));

		const canonicalRequest =
			`${request.method}\n${pathname}\n${canonicalQuerystring}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

		const canonicalRequestDigest = await sha256(canonicalRequest);

		const credentialScope = `${datestamp}/${cfg.region}/${cfg.service}/aws4_request`;

		const stringToSign = `${ALGO}\n${amzdate}\n${credentialScope}\n${canonicalRequestDigest}`;

		const signingKey = await getSignatureKey(
			awsSecretKey,
			datestamp,
			cfg.region,
			cfg.service,
		);

		const signature = await signAwsV4(signingKey, stringToSign);
		headers["Authorization"] =
			`${ALGO} Credential=${awsAccessKeyId}/${credentialScope},`
		  + ` SignedHeaders=${signedHeaders},`
		  + ` Signature=${signature}`;

		return new Request(request.url, {
			headers,
			method: request.method,
			body,
			redirect: request.redirect,
		});
	};
};



export const toRequest = async (promisedInput: PromiseOr<IHttpRequest>):Promise<Request> => {
	const httpReq = await promisedInput
	
	const queryTuples = Object.entries(httpReq.query ?? {})
		.reduce((acc, [key, val] ) => {
			return Array.isArray(val)
				? [...acc, ...val.map(v => [key, v])] as string[][]
				: val === null
					? acc
					: [...acc, [key, val]] as string[][]
		},[] as string[][])
	
	const query = queryTuples
		? `?${new URLSearchParams(queryTuples).toString()}`
		: ''

	const httpReqUrl = `${httpReq.protocol}//`
	+`${httpReq.username ?? ''}${httpReq.password ? `:${httpReq.password}`:'' }`
	+`${httpReq.hostname}${httpReq.port ? `:${httpReq.port}`:''}`
	+`${httpReq.path}`
	+`${query}`
	+`${httpReq.fragment ?? ''}`

	const httpURL = new URL(httpReqUrl)

	return new Request(httpURL,{
		method: httpReq.method, 
		headers: httpReq.headers, 
		body: httpReq.body
	})
}

export const toHttpRequest = async (promisedReq: PromiseOr<Request>): Promise<HttpRequest> => {
	const req = await promisedReq
	
	const inputURL = new URL(req.url)
	const body = await req.text()

	return new HttpRequest({
		method: req.method,
		hostname: inputURL.hostname,
		path: inputURL.pathname,
		protocol: inputURL.protocol,
		fragment: inputURL.hash.length > 0 ? inputURL.hash : undefined,
		username: inputURL.username.length > 0 ? inputURL.username : undefined,
		password: inputURL.password.length > 0 ? inputURL.password : undefined,
		port: inputURL.port ? Number.parseInt(inputURL.port) : undefined,
		headers: Object.fromEntries([['host', inputURL.hostname ],...req.headers.entries()]),
		query: Object.fromEntries(inputURL.searchParams.entries()),
		...(body.length > 0 ? { body } : {body: undefined}),
	})
}

export const sigMaker = (
	accessKeyId: string,
	secretAccessKey: string,
	region: string,
	service: string,
) => {

	const awsSigner = new SignatureV4({
		service,
		region,
		sha256: Sha256,
		credentials: {
		  accessKeyId,
		  secretAccessKey
		},
	  });

	return async (req: PromiseOr<Request>, signingOpts?: RequestSigningArguments ):Promise<Request> => {
		return toRequest(awsSigner.sign(await toHttpRequest(req), signingOpts))
	}
};