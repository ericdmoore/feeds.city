import { dotenv, path } from "../../deps.ts";
type Dict<T> = { [key: string]: T };

export const envVar =
  (defaultVal: string) => async (key: string): Promise<string> => {
    const p = path.resolve(import.meta.url, "../.env").split(":")[1]; // crazy `file:` prefix after import.meta.url
    const configState = await dotenv.config({
      path: p,
      safe: true,
      allowEmptyValues: false,
      export: true,
    }) as Dict<string>;

    Object.entries(configState)
      .forEach(([key, value]) => {
        Deno.env.set(key, value);
      });

    return Deno.env.get(key) ?? defaultVal;
  };

export default envVar;

// (async ()=>{
// 	console.log(await envVar('')('REGION'))
// })()
