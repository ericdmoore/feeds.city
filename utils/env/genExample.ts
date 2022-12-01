import { parse } from "$std/dotenv/mod.ts";
import * as path from "$std/path/mod.ts";
import readFileAsString from '../readFileAsString.ts'

const {text, file} = await readFileAsString(
    path.fromFileUrl(import.meta.url), 
    '../../../.env'
)
const ENVS = parse(text)

Object.entries(ENVS)
    .forEach(([k,_],i) => {
        console.log(`${k}=EXAMPLE_VALUE-${i+1}`)
    })

Deno.close(file.rid);