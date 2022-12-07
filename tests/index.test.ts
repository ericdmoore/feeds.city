import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getSetCookies } from "$std/http/cookie.ts";

import { config } from "$std/dotenv/mod.ts";


const host = "http://localhost";
const port = 8000;
const path = "/";

const u = `${host}:${port}${path}`;
console.info("\n\n ... be sure to start a dev server from another session\n\n");
const sleep = (ms: number):Promise<number> => new Promise((resolve) => setTimeout(()=>resolve(ms), ms));
await config({ export: true, safe: true }).catch(() => console.error("errored while processsing .env file") );

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
  
  // because of nbf logic, we need to wait a bit before we can use the token
  await sleep(2000)

  const url = new URL(u);
  url.searchParams.append("email", encodeURIComponent("_edm42@bullmoose.cc"));
  url.searchParams.append("token", sessionIDtoken.value);
  url.searchParams.append("status", encodeURIComponent('test'));
  url.searchParams.append("keyID", encodeURIComponent(!Deno.env.get("KEY_D_PRIVATE")));
  // using keyID as a secret  in order to pass in the test cases

  req = new Request(url, { method: "POST" });
  const postResp = await fetch(req);
  // const jssonResp = await postResp.json()
  // console.log(jssonResp)
  
  postResp.body?.cancel()
  assertEquals(postResp.status, 200);
});
