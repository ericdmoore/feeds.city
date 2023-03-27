import {
  Buffer,
  copy,
  readableStreamFromReader,
  readerFromStreamReader,
  StringReader,
} from "../../deps.ts";

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
  result = "",
): Promise<string> => {
  const ws = new WritableStream<string>({
    write(chunk) {
      // console.log(chunk);
      result = result + chunk;
    },
  });
  const dest = ws.getWriter();
  // const src = rs.pipeThrough(new TextDecoderStream()).getReader()
  // const whatisThis = await copy(src, dest)
  for await (const line of rs.pipeThrough(new TextDecoderStream())) {
    await dest.write(line);
  }
  dest.close();
  return result;
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
  const buf = new Buffer();
  await copy(readerFromStreamReader(input.getReader()), buf);
  return buf.bytes();
};

export default readToString;
