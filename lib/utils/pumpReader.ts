import { copy, readableStreamFromReader, readerFromStreamReader } from "$std/streams/mod.ts";
import { StringReader, StringWriter } from "$std/io/mod.ts";

const dec = new TextDecoder();

export const readToString = async (
	rs: ReadableStream<Uint8Array>,
) => {
	const tds = new TextDecoderStream();
	let result = "";
	for await (const line of rs.pipeThrough(tds)) {
		result = result + line;
	}
	return result;
};

export const streamToString = async (
	rs: ReadableStream<Uint8Array>,
	_result = "",
): Promise<string> => {
	const writer = new StringWriter();
	await copy(readerFromStreamReader(rs.getReader()), writer);
	return writer.toString();
};

export const readStream = (
	stream: ReadableStream<Uint8Array>,
	init = "",
): Promise<string> => {
	const concatToString = (
		reader: ReadableStreamDefaultReader<Uint8Array>,
		init: string,
	) => {
		return (i: { done: boolean; value?: Uint8Array }): Promise<string> => {
			return !i.done && i.value
				? reader.read().then(concatToString(reader, init + dec.decode(i.value)))
				: Promise.resolve(init);
		};
	};
	const reader = stream.getReader();
	return reader.read().then(concatToString(reader, init));
};

export const stringToStream = (input: string): ReadableStream<Uint8Array> =>
	readableStreamFromReader(new StringReader(input));

export const drainStream = async (
	input: ReadableStream<Uint8Array>,
): Promise<Uint8Array> => {
	let init = new Uint8Array();

	const w = {
		write: (p: Uint8Array): Promise<number> => {
			init = new Uint8Array([...init, ...p]);
			return Promise.resolve(init.byteLength);
		},
	};
	await copy(readerFromStreamReader(input.getReader()), w);
	return init;
};

export default readToString;
