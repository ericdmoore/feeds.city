import { assert, assertEquals } from "$std/testing/asserts.ts";
import { cache } from "$lib/clients/cacheProviders/b2.ts";
import { s3parse } from "$lib/clients/cacheProviders/s3.ts";
import {
	delTest,
	getTest,
	overridesTest,
	peekTest,
	providerHasMetaProperties,
	repeatedFullLifecycle,
	setTest,
	transformsTest,
} from "$tests/lib/clients/cacheProviders/s3.test.ts";
import envVarReader from "$lib/utils/vars.ts";
const envVars = await envVarReader();
const env = await envVars("MISSING");

const b2cacheP = cache(
	{
		key: env("AWS_KEY"),
		secret: env("AWS_SECRET"),
		region: env("AWS_REGION"),
		defaultBucket: env("AWS_POLLY_BUCKET"),
		defualtPrefix: env("AWS_POLLY_PREFIX"),
	},
	{},
	s3parse,
);

Deno.test({
	name: "B2:meta",
	ignore: true,
	fn: providerHasMetaProperties,
});

Deno.test({
	name: "B2:Provider",
	ignore: true,
	fn: async () => {
		const b2Cache = await b2cacheP;
		assert(b2Cache.provider);
		assertEquals(b2Cache.provider, "Backblaze:B2");
	},
});

Deno.test({
	name: "B2:Full Lifecycle two items",
	ignore: true,
	fn: repeatedFullLifecycle("test1", "test2"),
});

Deno.test({
	name: "B2:Set",
	ignore: true,
	fn: setTest,
});

Deno.test({
	name: "B2:Get",
	ignore: true,
	fn: getTest,
});

Deno.test({
	name: "B2:Del",
	ignore: true,
	fn: delTest,
});

Deno.test({
	name: "B2:Peek",
	ignore: true,
	fn: peekTest,
});

Deno.test({
	name: "B2:Overrides",
	ignore: true,
	fn: overridesTest,
});

Deno.test({
	name: "B2:Transforms",
	ignore: true,
	fn: transformsTest,
});
