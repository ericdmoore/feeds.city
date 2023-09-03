import { envVar } from "$lib/utils/vars.ts";
import { assert } from "$std/testing/asserts.ts";

Deno.bench({
	name: "Basic",
	fn: async () => {
		const env = (await envVar())(">> MISSING <<");
		const region = env("AWS_REGION");
		assert(region);
	},
});
