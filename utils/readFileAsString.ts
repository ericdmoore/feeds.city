import * as path from "https://deno.land/std@0.161.0/path/mod.ts";

export default async (fromHere: string, toRelativeFilePath: string) => {
  const dec = new TextDecoder();
  const p = path.resolve(fromHere, toRelativeFilePath);

  const file = await Deno.open(p);
  const { size } = await Deno.stat(p);
  const buf = new Uint8Array(size);

  await Deno.read(file.rid, buf);
  return {
    p,
    text: await dec.decode(buf),
    file,
  };
};
