import { resolve } from "$std/path/mod.ts";
import { parse } from "$std/dotenv/mod.ts";
import { LRUCache } from 'lru-cache'


const cache = new LRUCache<string, string>({max:8})


export const envVar = async (path = "../../../.env") => {
	const u = new URL(import.meta.url).pathname;
	const p = resolve(u, path); // crazy `file:` prefix after import.meta.url

	console.log(`>> using envFile: ${p}`);

	const stat = await Deno.stat(p)
		.then((s) => s, () => ({ isFile: false }))
		.catch(() => ({ isFile: false }));

	if (cache.has(path) || stat.isFile) {		
		
		let fileString: string 
		if(cache.has(path)){	
			fileString = cache.get(path) as string
		}else{
			fileString = await Deno.readTextFile(p);
			cache.set(path, fileString)
		}
		
		const state = await parse(fileString);

		return (defaultVal: string) => (key: string) => {
			if (state[key]) {
				return state[key];
			} else {
				console.error(`NO VARENV EXISTS for: ${key}`);
				console.error(`USING given defuaultVal: ${defaultVal}`);
				return defaultVal;
			}
		};
	}else{
		
		console.error(`NO .env FILE FOUND at: ${p}`)
		console.error(`falling back to "Deno.env.get"`);
		return (defaultVal: string) => (key: string) => {
			const ret = Deno.env.get(key);
			if (ret) {
				return ret;
			} else {
				console.error(`>> NO ENVAR EXISTS for: ${key}`);
				console.error(`USING given defuaultVal: ${defaultVal}`);
				return defaultVal;
			}
		};
	}
};

export default envVar;
