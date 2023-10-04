import { assertEquals } from "$std/testing/asserts.ts";
import flipColor from "$lib/utils/colors/flipColorNumber.ts";

Deno.test("flip 50", () => {
	const pairs = [
		[50, 900],
		[100, 800],
		[200, 700],
		[300, 600],
		[400, 500],
		[500, 400],
		[600, 300],
		[700, 200],
		[800, 100],
		[900, 50],
	];
	pairs.forEach(([input, output]) => {
		assertEquals(flipColor(input), output);
	});
});

Deno.test("double flip is unchanged", () => {
	const allOptions = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

	allOptions.forEach((n) => {
		assertEquals(flipColor(flipColor(n)), n);
	});
});
