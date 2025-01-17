/**
 * S3 Tests	for the AWS S3 Cache Provider
 *
 * > FYI these tests are also used by the R2, B2, \n and all other S3 Compat Cache Providers as well
 */

import { assert, assertEquals } from "$std/testing/asserts.ts";
import { cache as s3cacher, s3parse } from "$lib/clients/cacheProviders/s3.ts";
import envVarReader from "$lib/utils/vars.ts";
const envVars = await envVarReader();
const env = await envVars("MISSING");

const s3cacheP = s3cacher(
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

export const providerHasMetaProperties = async () => {
	const s3cache = await s3cacheP;
	assertEquals(s3cache.meta.cloud, "AWS");
	assertEquals(s3cache.meta.service, "S3");
	assertEquals(s3cache.meta.region, env("AWS_REGION"));
	assert(s3cache.meta.size);
	assertEquals(typeof s3cache.meta.size, "function");
	const size = s3cache.meta.size as () => number;
	assertEquals(typeof size(), "number");
};

Deno.test({
	name: "meta",
	fn: providerHasMetaProperties,
});

Deno.test({
	name: "provider",
	fn: async () => {
		const s3cache = await s3cacheP;
		assertEquals(s3cache.provider, "AWS:S3");
	},
});

export const repeatedFullLifecycle = <T>(...items: T[]) => async (t: Deno.TestContext) => {
	const _dec = new TextDecoder();
	const _enc = new TextEncoder();

	const s3cache = await s3cacher(
		{
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			defaultBucket: env("AWS_POLLY_BUCKET"),
			defualtPrefix: "__lifecycleTest__" + env("AWS_POLLY_PREFIX"),
		},
		{},
		s3parse,
	);

	await t.step("1. Sets", async () => {
		//Repeated sets
		console.log("\n\n>> Group of SETS");

		// Rate limit this promise all
		// p-limit or p-throttle is a good option
		const rets = await Promise.all(
			items.map((item, n) => s3cache.set(`test_${n}`, `${item}`)),
		);

		// asserts
		for (const [_n, ret] of rets.entries()) {
			// console.log('SET-assert:', _n, ret);
			assert(ret.meta.s3resp);
		}
	});

	await t.step("2. Gets", async () => {
		//repeated gets

		console.log("\n\n>> Group of GETS");
		const rets = await Promise.all(
			items.map((_item, n) => s3cache.get(`test_${n}`)),
		);

		// assertions
		for (const [_i, ret] of rets.entries()) {
			console.log("GET-assert:", _i, ret);
			assert(ret?.key.name);
			assert(ret?.key.renamed);
			assert(ret?.meta);
			assert(ret?.provider);
			assert(ret?.value);
			// assertEquals(ret?.value.data, enc.encode(`${items[_i]}`));
		}
		assertEquals(rets.length, items.length);
	});

	await t.step("3. Size should eq items length", () => {
		//size
		assertEquals(s3cache.meta.size(), items.length);
	});

	await t.step("4. Dels", async () => {
		//repated dels
		console.log("\n\n>> Group of DELs");
		for (const [n, _] of items.entries()) {
			const ret = await s3cache.del(`test_${n}`);
			console.log("Del:", n, ret);
			assert(!ret?.value.data);
		}
	});

	await t.step("5. Size should eq 0 - and GETs should be null", async () => {
		//size
		console.log("size: ", s3cache.meta.size());
		for (const [n, _] of items.entries()) {
			const ret = await s3cache.get(`test_${n}`);
			assert(!ret);
		}
		assertEquals(s3cache.meta.size(), 0);
	});
};

Deno.test({
	ignore: true,
	name: "S3:Full Lifecycle two items",
	fn: repeatedFullLifecycle(
		"but first test me ",
		"and test me too",
	),
});

const hasTest = async () => {
	const s3cache = await s3cacher(
		{
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			defaultBucket: env("AWS_POLLY_BUCKET"),
			defualtPrefix: "_hasTest_" + env("AWS_POLLY_PREFIX"),
		},
		{},
		s3parse,
	);
	await s3cache.set("test1", "test1");
	const has = await s3cache.has("test1");
	assertEquals(s3cache.meta.size(), 1);
	assert(has, "s3Cache should be true as it was SET in line 109");
	await s3cache.del("test1");
	assertEquals(s3cache.meta.size(), 0);
};

Deno.test({
	name: "has",
	ignore: true,
	fn: hasTest,
});

export const peekTest = async () => {};
Deno.test({
	name: "peek",
	ignore: true,
	fn: peekTest,
});

export const getTest = async () => {};
Deno.test({
	name: "get",
	ignore: true,
	fn: getTest,
});

export const delTest = async () => {};
Deno.test({
	name: "del",
	ignore: true,
	fn: delTest,
});

export const setTest = async () => {};
Deno.test({
	name: "set",
	ignore: true,
	fn: setTest,
});

export const transformsTest = async () => {};
Deno.test({
	name: "transforms",
	ignore: true,
	fn: transformsTest,
});

export const overridesTest = async () => {};
Deno.test({
	name: "overrides",
	ignore: true,
	fn: overridesTest,
});

Deno.test({
	name: "_fillin_",
	ignore: true,
	fn: async () => {},
});
