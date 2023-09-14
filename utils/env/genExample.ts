#!/usr/bin/env deno run ./utils/env/genExample.ts -A
import { parse } from "$std/dotenv/mod.ts";
import * as path from "$std/path/mod.ts";

const u = new URL(import.meta.url)
const filePath = path.resolve(u.pathname, '../../../.env') 
// console.log({filePath});

const realEnvText = await Deno.readTextFile(filePath)
const ENVS = parse(realEnvText);

console.log('# rename as .env');
Object.entries(ENVS)
	.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
	.forEach(([k, _], i) => {
		console.log(`${k}=EXAMPLE_VALUE__${i + 1}`);
	});
