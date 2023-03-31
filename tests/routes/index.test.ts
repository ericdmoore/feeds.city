import { assert } from "https://deno.land/std@0.181.0/testing/asserts.ts";

Deno.test("root page gives a 200", async () => {
  const response = await fetch("http://localhost:8000");
  const status_code = response.status;
  assert(status_code === 200);
  response?.body?.cancel();
});