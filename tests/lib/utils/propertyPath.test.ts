// import skip from '../helpers.ts';
import { assertEquals } from "$std/testing/asserts.ts";
import { getPath, type JsonValue, setPath } from "$lib/utils/propertyPath.ts";

Deno.test("getPath - Basic Object", () => {
	const actual = getPath("a.b.c.d", { a: { b: { c: { d: true } } } });
	const expected = true;
	assertEquals(actual, expected);
});

Deno.test("getPath - Basic Object", () => {
	const actual = getPath(["a", "b", "c", "d"], {
		a: { b: { c: { d: true } } },
	});
	const expected = true;
	assertEquals(actual, expected);
});

Deno.test("getPath - Basic Array", () => {
	const actual = getPath("a.1.e.with", {
		a: [{ b: 2 }, { c: 3, d: 4, e: { with: "5" } }],
	});
	const expected = "5";
	assertEquals(actual, expected);
});

Deno.test("Simple Path Miss", () => {
	const actual = getPath("a.e", { a: { b: { c: { d: true } } } });
	const expected = undefined;
	assertEquals(actual, expected);
});

Deno.test("getPath - Long Path Miss", () => {
	const actual = getPath("a.e.c.d", { a: { b: { c: { d: true } } } });
	const expected = undefined;
	assertEquals(actual, expected);
});

Deno.test("getPath - Array Index", () => {
	const actual = getPath("a.b.c.d.1.e", {
		a: { b: { c: { d: [0, { e: "f" }, 2] } } },
	});
	const expected = "f";
	assertEquals(actual, expected);
});

Deno.test("setPath - Object", () => {
	const actual = setPath("a.1.e.with", null, {
		a: [{ b: 2 }, { c: 3, d: 4, e: { with: "5" } }],
	});
	const expected = { a: [{ b: 2 }, { c: 3, d: 4, e: { with: null } }] };
	assertEquals(actual, expected as unknown as JsonValue);
});

Deno.test("setPath - in an Array", () => {
	const actual = setPath("a.0", null, {
		a: [{ b: 2 }, { c: 3, d: 4, e: { with: "5" } }],
	});
	const expected = { a: [null, { c: 3, d: 4, e: { with: "5" } }] };
	assertEquals(actual, expected);
});
