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

Deno.test({
	name: "meta",
	fn: async () => {
		const s3cache = await s3cacheP;
		assertEquals(s3cache.meta.cloud, "AWS");
		assertEquals(s3cache.meta.service, "S3");
		assertEquals(s3cache.meta.region, env("AWS_REGION"));
		assert(s3cache.meta.size);
		assertEquals(typeof s3cache.meta.size, "function");
		const size = s3cache.meta.size as () => number;
		assertEquals(typeof size(), "number");
	},
});
Deno.test({
	name: "provider",
	fn: async () => {
		const s3cache = await s3cacheP;
		assertEquals(s3cache.provider, "AWS:S3");
	},
});

Deno.test({
	name: "set/set/get/get/size/del/del/size",
	ignore: true,
	fn: async (t) => {
		const _dec = new TextDecoder();
		const enc = new TextEncoder();

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

		await t.step("Sets", async () => {
			//sets
			await s3cache.set("test1", "test1");
			await s3cache.set("test2", "test2");
		});

		await t.step("Gets", async () => {
			//get
			const return1 = await s3cache.get("test1");
			assertEquals(return1?.value.data, enc.encode("test1"));
			const return2 = await s3cache.get("test1");
			assertEquals(return2?.value.data, enc.encode("test1"));
		});
		await t.step("Size should eq 2", () => {
			//size
			assertEquals(s3cache.meta.size(), 2);
		});
		await t.step("Dels", async () => {
			//del
			const ret1 = await s3cache.del("test1");
			console.log(ret1?.value.transformed);
			const ret2 = await s3cache.del("test2");
			console.log(ret2?.value.transformed);
		});
		await t.step("Size should eq 0 - and GETs should be null", async () => {
			//size
			assertEquals(s3cache.meta.size(), 0);
			const g1 = await s3cache.get("test1");
			assert(!g1);
			const g2 = await s3cache.get("test2");
			assert(!g2);
		});
	},
});

Deno.test({
	name: "has",
	fn: async () => {
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
		assertEquals(has, true);
		await s3cache.del("test1");
		assertEquals(s3cache.meta.size(), 0);
	},
});
Deno.test({
	name: "peek",
	ignore: true,
	fn: async () => {},
});
Deno.test({
	name: "get",
	ignore: true,
	fn: async () => {},
});
Deno.test({
	name: "del",
	ignore: true,
	fn: async () => {},
});
Deno.test({
	name: "set",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "transforms",
	ignore: true,
	fn: async () => {},
});
Deno.test({
	name: "overrides",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "_fillin_",
	ignore: true,
	fn: async () => {},
});
