import { resolve } from "$std/path/mod.ts";
import { parse } from "$std/dotenv/mod.ts";


export const envVar = async (defaultVal: string, path = "../../../.env") => {
	// const envfileURL = new URL()
	const p = resolve(import.meta.url, path); // crazy `file:` prefix after import.meta.url
	console.log(`>> dot env File: ${p}`);

	const fileString = await Deno.readTextFile(new URL(p));
	const state = await parse(fileString);

	const stat = await Deno.stat(p)
		.then((s) => s, () => ({ isFile: false }))
		.catch(() => ({ isFile: false }));

	// console.log(`envVar: ${stat}`);

	if (stat.isFile) {
		return (key: string) => {
			if (state[key]) {
				return state[key];
			} else {
				console.error(`NO ENVAR EXISTS for: ${key}`);
				console.error(`USING given defuaultVal: ${defaultVal}`);
				return defaultVal;
			}
		};
	} else {
		console.error(`NO .env FILE FOUND at: ${p}`);
		console.error(`falling back to "Deno.env.get" + the good ol default: ${defaultVal}`);
		return (key: string) => {
			const ret = Deno.env.get(key)
			if(ret){
				return ret
			}else{
				console.error(`NO ENVAR EXISTS for: ${key}`);
				console.error(`USING given defuaultVal: ${defaultVal}`);
				return defaultVal
			}
		};
	}
};

export default envVar;
