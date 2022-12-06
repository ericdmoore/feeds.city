import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getSetCookies } from "$std/http/cookie.ts";

const host = "http://localhost";
const port = 8000;
const path = "/";

const u = `${host}:${port}${path}`;

console.info("\n\n ... be sure to start a dev server from another session\n\n");

const sleep = (ms: number):Promise<number> => new Promise((resolve) => setTimeout(()=>resolve(ms), ms));

Deno.test("GET Root", async () => {
  const req = new Request(u, { method: "GET" });
  const resp = await fetch(req);

  // verifies a set-cookie response header
  const cookies = getSetCookies(resp.headers);
  const sessionIDcookie  = cookies.filter(v => v.name === "sessionID")[0] ?? null;

  assert(resp);
  assert(sessionIDcookie);
  assertEquals(resp.status, 200);
  resp.body?.cancel()
});

Deno.test("POST root request", async () => {
  let req = new Request(u, { method: "GET" });
  const resp = await fetch(req);
  const respCookies = getSetCookies(resp.headers);
  const sessionIDtoken = respCookies.filter(v => v.name === "sessionID")[0] ?? null;
  
  assert(resp);
  assert(sessionIDtoken);
  assertEquals(resp.status, 200);
  resp.body?.cancel()
  await sleep(2000)

  const url = new URL(u);
  url.searchParams.append("email", encodeURIComponent("_edm42@bullmoose.cc"));
  url.searchParams.append("token", sessionIDtoken.value);
  req = new Request(url, { method: "POST" });
  const postResp = await fetch(req);
  const jssonResp = await postResp.json()
  // postResp.body?.cancel()
  console.log(jssonResp)
  assertEquals(postResp.status, 200);
  
});
