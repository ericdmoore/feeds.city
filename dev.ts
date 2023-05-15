#!/usr/bin/env -S deno run -A --watch=static/,routes/

// deno-lint-ignore no-unused-vars
import * as debug from "preact/debug";
import dev from "$fresh/dev.ts";
await dev(import.meta.url, "./main.ts");
