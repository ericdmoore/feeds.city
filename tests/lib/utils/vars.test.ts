import { envVar } from "$lib/utils/vars.ts";
import { assert } from "$std/testing/asserts.ts";

const env = (await envVar())(">> MISSING <<");

Deno.test({
	name: "Basic",
	fn: () => {
		const region = env("AWS_REGION");
		console.log(region);
		assert(region);
	},
});
