// deno-lint-ignore no-unused-vars
import skip from "../../helpers.ts";
import { txtorCData } from "$lib/parsers/helpers/composedPrimitives.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test("Pick Inner Text", () => {
  const actual = txtorCData("bad", { _text: "Pick Me" });
  const expected = "Pick Me";
  assertEquals(actual, expected);
});

Deno.test("Pick Inner Text or CData", () => {
  const actual = txtorCData("bad", { _cdata: "Now Pick Me" });
  const expected = "Now Pick Me";
  assertEquals(actual, expected);
});

Deno.test("Prefer Inner Text to CData", () => {
  const actual = txtorCData("bad", { _cdata: "CDATÀ", _text: "Winner" });
  const expected = "Winner";
  assertEquals(actual, expected);
});
