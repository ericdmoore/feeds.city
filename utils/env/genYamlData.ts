#!/usr/bin/env deno run ./utils/env/genExample.ts -A
import { parse } from "$std/dotenv/mod.ts";
import * as path from "$std/path/mod.ts";

const u = new URL(import.meta.url);
const filePath = path.resolve(u.pathname, "../../../.env");
// console.log({filePath});

const realEnvText = await Deno.readTextFile(filePath);
const ENVS = parse(realEnvText);

console.log("Copy paste this to the env: section of deno.yml \n\n\n");

const vars = {
	AWS_DYN_TABLE_MEGA: true,
	AWS_POLLY_BUCKET: true,
	AWS_POLLY_PREFIX: true,
	AWS_REGION: true,
	JWT_KEY_EXT: true,
	JWT_KEY_OPS_PRIVATE: true,
	JWT_KEY_OPS_PUBLIC: true,
};

Object.entries(ENVS)
	.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
	.forEach(([key, _]) => {
		if (key in vars) {
			console.log(`${key}: \${{ vars.${key} }}`);
		} else {
			console.log(`${key}: \${{ secrets.${key} }}`);
		}
	});

console.log("\n\n\n");
