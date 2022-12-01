import { assert, assertEquals } from "$std/testing/asserts.ts";
import { getCookies } from "$std/http/cookie.ts";

const host = "http://localhost";
const port = 8000;
const path = "/";

const u = `${host}:${port}${path}`;

console.info("\n\n ... be sure to start a dev server from another session\n\n");

Deno.test("GET Root", async () => {
  const req = new Request(u, { method: "GET" });
  const resp = await fetch(req);
  const cookies = getCookies(resp.headers);

  console.log({ resp, cookies });
  assert(resp);
  assertEquals(resp.status, 200);
  assert(cookies?.sessionID);
});

Deno.test("POST root request", async () => {
  let req = new Request(u, { method: "GET" });
  const resp = await fetch(req);

  const cookies = getCookies(resp.headers);
  const token = resp.headers.get("sessionID");

  assert(resp);
  assert(token);
  assert(cookies?.sessionID);
  assertEquals(resp.status, 200);

  const url = new URL(u);
  url.searchParams.append("email", encodeURIComponent("_edm42@bullmoose.cc"));
  url.searchParams.append("token", token);
  req = new Request(url, { method: "POST" });
  const postResp = await fetch(req);
  assertEquals(postResp.status, 200);
});
