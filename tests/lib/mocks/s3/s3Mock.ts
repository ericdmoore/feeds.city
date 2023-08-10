// mod.ts audit: OK
//
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import {
	GetObjectCommand,
	HeadObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { streamToString } from "$lib/utils/pumpReader.ts";

const encoder = new TextEncoder();
export class Body {
	Body: ReadableStream<Uint8Array>
	constructor(input: Uint8Array){
		this.Body = new Response(input).body!
	}
	valueOf(){return this.Body}
	transformToString() {
		return streamToString(this.Body)
	}
}

export const s3Mock = (
	state: Map<string, Uint8Array> = new Map<string, Uint8Array>(),
) => {
	const headObject = (key: string) => {
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
	}
	const putObject=  (
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
	}
	const getObject=  (key: string) => {
		const data = state.get(key);

		return data
			? new Body(data)
			: Promise.reject({ err: "Object Not Found", code: 404 });
	}
	const send =  (command: PutObjectCommand | HeadObjectCommand | GetObjectCommand) => {
		if ('Body' in command.input) {
			// console.log(63,'put', command.input);
			return putObject(`${command.input.Bucket}/${command.input.Key}`, (command as PutObjectCommand).input.Body);
		} else if (command instanceof HeadObjectCommand) {
			// console.log(65, 'head', command.input);
			return headObject(`${command.input.Bucket}/${command.input.Key}`);
		} else {
			// console.log(67, 'get', command.input);
			return getObject(`${command.input.Bucket}/${command.input.Key}`);
		}
	}

	return {
		send,
		getObject,
		putObject,
		headObject
	}
};
