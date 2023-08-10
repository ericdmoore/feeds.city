import { resolve } from "$std/path/mod.ts";
import { parse } from "$std/dotenv/mod.ts";

export const envVar = async (defaultVal: string, path = "../../../.env") => {
	const p = resolve(import.meta.url, path).split(":")[1]; // crazy `file:` prefix after import.meta.url
	const stat = await Deno.stat(p).catch(()=>({isFile: false}))

	if(stat.isFile){
		const encFileBytes = await Deno.readFile(p)
		const fileString = new TextDecoder().decode(encFileBytes);
		const state = await parse(fileString);
	
		return (key: string) => {
			if(state[key]){
				return state[key]
			}else{
				console.error(`NO ENVAR EXISTS for: ${key}`)
				console.error(`USING given defuaultVal: ${defaultVal}`)
				return defaultVal
			}
		};
	}else{
		console.error(`NO .env FILE FOUND at: ${p}`)
		console.error(`falling back to "Deno.env.get" + the good ol default: ${defaultVal}`)
		return (key:string)=>Deno.env.get(key) ?? defaultVal
	}
};

export default envVar;
