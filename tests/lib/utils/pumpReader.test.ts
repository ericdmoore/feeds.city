import { assertEquals } from "$std/testing/asserts.ts";
import { readStream, readToString, streamToString, stringToStream } from "$lib/utils/pumpReader.ts";

const _dec = new TextDecoder();
const enc = new TextEncoder();

interface IStreamingOptions {
	start: number;
	chunkSize: number;
}

const _rsString = (
	s: string,
	opts: IStreamingOptions = { start: 0, chunkSize: 64 },
) => {
	let local_start = opts.start;
	return new ReadableStream<string>({
		pull: (c) => {
			const chunk = c.desiredSize ?? opts.chunkSize;
			c.enqueue(s.slice(local_start, local_start + chunk));
			local_start += chunk;
			if (local_start >= s.length) c.close();
		},
	});
};

const rsUint8Array = (
	s: string,
	opts: IStreamingOptions = { start: 0, chunkSize: 64 },
) => {
	let local_start = opts.start;

	return new ReadableStream<Uint8Array>({
		pull: (c) => {
			const chunk = c.desiredSize ?? opts.chunkSize;
			const rdyForEnc = s.slice(local_start, local_start + chunk);
			const encoded = enc.encode(rdyForEnc);

			// console.log({local_start, rdyForEnc, encoded, chunk})
			c.enqueue(encoded);

			local_start += chunk;
			if (local_start >= s.length) c.close();
		},
	});
};

Deno.test("test1.readStream", async () => {
	const s = "Hello World!";

	const rsS1 = rsUint8Array(s);
	const rsS2 = stringToStream(s);

	const streamedStr1 = await readStream(rsS1);
	const streamedStr2 = await readStream(rsS2);

	assertEquals(streamedStr1, s);
	assertEquals(streamedStr2, s);
});

Deno.test("test2.readToString", async () => {
	const s = "Hello World!";
	const rsS = rsUint8Array(s);
	const streamedStr = await readToString(rsS);
	assertEquals(streamedStr, s);
});

Deno.test("test3.streamToString", async () => {
	const s = "Hello World!";
	const rsS = rsUint8Array(s);
	const streamedStr = await streamToString(rsS);
	assertEquals(streamedStr, s);
});
