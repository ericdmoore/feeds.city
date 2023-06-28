import type {ConnInfo} from "$std/http/server.ts"
import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getSetCookies } from "$std/http/cookie.ts";
import { ServerContext } from "$fresh/server.ts";

import MANIFEST from "../fresh.gen.ts"
import { load } from "$std/dotenv/mod.ts";

const host = "http://localhost";
const port = 8000;

const urlPath = (path:string) => `${host}:${port}${path}`

const CONN_INFO = {
	localAddr: { transport: "tcp", hostname: "0.0.0.0", port: 80 },
	remoteAddr: { transport: "tcp", hostname: "1.0.0.0", port: 80 }
} as ConnInfo

console.info("\n\n ... be sure to start a dev server from another session\n\n");

const sleep = (ms: number): Promise<number> =>
	new Promise((resolve) => setTimeout(() => resolve(ms), ms));

await load({ export: true }).catch(() => console.error("errored while processsing .env file"));

// const badTeaPotResponse = async (resp: Request, _ctx: Partial<HandlerContext<any, Record<string, unknown>>> ):Promise<Response> => {
// 	return new Response(await resp.text(),{ status: 418 })
// }

Deno.test("GET Root", async () => {
	const req = new Request( urlPath('/'), { method: "GET" });
	const ctx = await ServerContext.fromManifest(MANIFEST, { plugins: [] })
	const resp = await ctx.handler()(req, CONN_INFO)

	// verifies a set-cookie response header
	const cookies = getSetCookies(resp.headers);
	const sessionIDcookie = cookies.filter((v) => v.name === "sessionID")[0] ?? null;
	
	// console.log({ resp, cookies, sessionIDcookie, body: await resp.text() })

	assert(resp);
	assert(sessionIDcookie);
	assertEquals(resp.status, 200);
	resp.body?.cancel();
});

Deno.test("POST root request", async () => {
	const req1 = new Request(urlPath('/'), { method: "GET" });
	const ctx = await ServerContext.fromManifest(MANIFEST, { plugins: [] })
	const resp = await ctx.handler()(req1, CONN_INFO)

	
	// const resp = await fetch(req1);
	const respCookies = getSetCookies(resp.headers);
	const sessionIDtoken = respCookies.filter((v) => v.name === "sessionID")[0] ??
		null;

	assert(resp);
	assert(sessionIDtoken);
	assertEquals(resp.status, 200);
	resp.body?.cancel();

	// because of nbf logic, we need to wait a bit before we can use the token
	await sleep(2000);

	const url = new URL(req1.url);
	url.searchParams.append("email", encodeURIComponent("_edm42@bullmoose.cc"));
	url.searchParams.append("token", sessionIDtoken.value);
	url.searchParams.append("status", encodeURIComponent("test"));
	url.searchParams.append(
		"keyID",
		encodeURIComponent(!Deno.env.get("KEY_D_PRIVATE")),
	);
	// using keyID as a secret  in order to pass in the test cases

	console.log({url})
	const req2 = new Request(url, { method: "POST" });
	const postResp = await ctx.handler()(req2, CONN_INFO)

	// const jssonResp = await postResp.json()
	// console.log(jssonResp)

	assertEquals(postResp.status, 200);
	postResp.body?.cancel();
});
