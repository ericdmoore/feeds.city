import type { ConnInfo } from "$std/http/server.ts";

import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getSetCookies } from "$std/http/cookie.ts";
import { ServerContext } from "$fresh/server.ts";
import { envVar } from "$lib/utils/vars.ts";
import MANIFEST from "../../fresh.gen.ts";

const host = "http://localhost";
const port = 8000;

const urlPath = (path: string) => `${host}:${port}${path}`;

const CONN_INFO = {
	localAddr: { transport: "tcp", hostname: "0.0.0.0", port: 80 },
	remoteAddr: { transport: "tcp", hostname: "1.0.0.0", port: 80 },
} as ConnInfo;

console.info("\n\n ... be sure to start a dev server from another session\n\n");

const sleep = (ms: number): Promise<number> =>
	new Promise((resolve) => setTimeout(() => resolve(ms), ms));

// const badTeaPotResponse = async (resp: Request, _ctx: Partial<HandlerContext<any, Record<string, unknown>>> ):Promise<Response> => {
// 	return new Response(await resp.text(),{ status: 418 })
// }

Deno.test("GET Root (Frontpage)", async () => {
	const req = new Request(urlPath("/"), { method: "GET" });
	const ctx = await ServerContext.fromManifest(MANIFEST, { plugins: [] });
	const resp = await ctx.handler()(req, CONN_INFO);

	// verifies a set-cookie response header
	const cookies = getSetCookies(resp.headers);
	const sessionIDcookie = cookies.filter((v) => v.name === "sessionID")[0] ?? null;

	// console.log({ resp, cookies, sessionIDcookie, body: await resp.text() })

	assert(resp);
	assert(sessionIDcookie);
	assertEquals(resp.status, 200);

	/*
	- Asserts for the the islands?
	- Im unsure if the island gets built / hydrated
	- If it is, What types of testing apparatus would be needed to digin to the html response
	*/

	resp.body?.cancel();
});

Deno.test("POST the root to Join waitlist ", async () => {
	const env = await envVar("MISSING");
	const req1 = new Request(urlPath("/"), { method: "GET" });
	const ctx = await ServerContext.fromManifest(MANIFEST, { plugins: [] });
	const getResp = await ctx.handler()(req1, CONN_INFO);

	const respCookies = getSetCookies(getResp.headers);
	const sessionIDtoken = respCookies.filter((v) => v.name === "sessionID")[0] ??
		null;

	assert(getResp);
	assert(sessionIDtoken);
	assertEquals(getResp.status, 200);
	getResp.body?.cancel();

	// because of nbf logic, we need to wait a bit before we can use the token
	await sleep(2000);

	const url = new URL(req1.url);
	url.searchParams.append("email", encodeURIComponent("_edm42@bullmoose.cc"));
	url.searchParams.append("token", sessionIDtoken.value);
	url.searchParams.append("status", encodeURIComponent("test"));
	url.searchParams.append(
		"keyID",
		encodeURIComponent(!env("KEY_D_PRIVATE")),
	);
	// using keyID as a secret  in order to pass in the test cases

	console.log({ url });
	const req2 = new Request(url, { method: "POST" });
	const postResp = await ctx.handler()(req2, CONN_INFO);

	// const jssonResp = await postResp.json()
	// console.log(jssonResp)

	assertEquals(postResp.status, 200);
	postResp.body?.cancel();
});

Deno.test({
	ignore: true,
	name: "Repeat Join Requests",
	fn: async () => {
		const env = await envVar("MISSING");

		//initial front page
		const req1 = new Request(urlPath("/"), { method: "GET" });
		const ctx = await ServerContext.fromManifest(MANIFEST, { plugins: [] });
		const getResp = await ctx.handler()(req1, CONN_INFO);

		const respCookies = getSetCookies(getResp.headers);
		const sessionIDtoken = respCookies.filter((v) => v.name === "sessionID")[0] ?? null;

		const randNum = 10 ^ 6 * Math.random();

		const postURL = new URL(req1.url);
		postURL.searchParams.append("email", encodeURIComponent(`testID_${randNum}@test.com`));
		postURL.searchParams.append("token", sessionIDtoken.value);
		postURL.searchParams.append("status", encodeURIComponent("test"));
		postURL.searchParams.append("keyID", encodeURIComponent(!env("KEY_D_PRIVATE")));
		// using keyID as a secret  in order to pass in the test cases

		const firstpostResp = await ctx.handler()(new Request(postURL, { method: "POST" }), CONN_INFO);
		await sleep(1000);
		const secondpostResp = await ctx.handler()(new Request(postURL, { method: "POST" }), CONN_INFO);

		assert(firstpostResp.json() !== secondpostResp.json());
	},
});
