import { skip } from "../helpers.ts";
import { assert, assertEquals, assertNotEquals } from "$std/testing/asserts.ts";
import { cacheStack, encodingWith, inMem as inMemCache } from "$lib/clients/cache.ts";
import { dynamo, fsCache, memFrontS3, s3 } from "$lib/clients/cacheProviders/mod.ts";
import s3uri from "$lib/parsers/s3uri.ts";
import envVar from "$lib/utils/vars.ts";

const enc = new TextEncoder();

Deno.test({
	name: "Simple Stack",
	// only: true,
	fn: async () => {
		const mem1 = inMemCache();
		const mem2 = inMemCache();
		const mem12 = cacheStack(mem1, mem2);
		await mem12.set("a", new Uint8Array([1, 2, 3]));
		assert(await mem12.has("a") === true);
	},
});

Deno.test({
	name: "Simple Stack Orderinality",
	// only: true,
	fn: async () => {
		const mem1 = inMemCache();
		const mem2 = inMemCache();
		const mem12 = cacheStack(mem1, mem2);

		await mem12.set("a", new Uint8Array([1, 2, 3]));
		await mem1.set("a", new Uint8Array([1, 1, 1]));

		assertEquals(await mem12.has("a"), true);
		const a = await mem12.get("a");

		assert(a?.key.name === "a");
		assertEquals(a?.value.data, new Uint8Array([1, 1, 1]));
	},
});

Deno.test({
	name: "Simple Stack - inMem vs Network",
	fn: async () => {
		const env = await envVar(">>MISSING<<");
		const cacheLocName = "someKey";
		const s3str = s3uri();

		const mem1 = inMemCache();
		const s3cac = s3.cache(
			{
				key: env("AWS_KEY"),
				secret: env("AWS_SECRET"),
				region: env("AWS_REGION"),
				defaultBucket: env("AWS_POLLY_BUCKET"),
				defualtPrefix: env("AWS_POLLY_PREFIX"),
			},
			{},
			s3str.parse,
		);

		const localizedS3 = cacheStack(mem1, s3cac);
		// set both cache destinations with `SET A = 123`
		await localizedS3.set(cacheLocName, new Uint8Array([1, 2, 3]));
		assertEquals(await localizedS3.has(cacheLocName), true);

		// corupt local cache to different value
		await mem1.set(cacheLocName, new Uint8Array([1, 1, 1]));
		const aInMem = await mem1.get(cacheLocName);
		assert(aInMem?.key.name === cacheLocName);
		assert((await localizedS3.get(cacheLocName))?.provider === "RAM");

		// assert local is different
		assertEquals(aInMem?.value.data, new Uint8Array([1, 1, 1]));

		const aInS3 = await s3cac.get(cacheLocName);
		assert(aInS3?.key.name === cacheLocName);
		// assert s3 is the same
		assertEquals(aInS3?.value.data, new Uint8Array([1, 2, 3]));
		assertNotEquals(aInS3.value.data, aInMem.value.data);
	},
});

Deno.test({
	name: "Simple Layered Cache Stack - inMem before S3",
	fn: async () => {
		const env = await envVar(">>MISSING<<");

		const localizedS3 = memFrontS3.cache(
			// s3 params
			{
				params: {
					key: env("AWS_KEY"),
					secret: env("AWS_SECRET"),
					region: env("AWS_REGION"),
					defaultBucket: env("AWS_POLLY_BUCKET"),
					defualtPrefix: env("AWS_POLLY_PREFIX"),
				},
			},
			// RAM
			{ max: 256 },
		);
		await localizedS3.set("HelloWorld", enc.encode("Hello World!"));
		const resp = await localizedS3.get("HelloWorld");
		assert(resp?.provider === "RAM");
	},
});

Deno.test({
	name: "Dynamo Cache",
	// only: true,
	fn: async () => {
		const env = await envVar(">>MISSING<<");

		const dynCache = dynamo.cache({
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			table: env("AWS_DYN_TABLE_MEGA"),
		});

		await dynCache.set("HelloWorld", enc.encode("Hello World!"));
		const r1 = await dynCache.get("HelloWorld");
		// const scanned = await dynCache.meta.scan({})
		assertEquals(r1?.value.data, enc.encode("Hello World!"));
		const r2 = await dynCache.get("HelloWorld");
		assertEquals(r2?.value.data, enc.encode("Hello World!"));
		console.log(await dynCache.del("HelloWorld"));
	},
});

Deno.test({
	name: "Fs Cache",
	// only: true,
	fn: async () => {
		const fscache = await fsCache.cache({ relativeDir: "./.fsCache", maxItems: 256 });

		await fscache.set("HelloWorld", enc.encode("Hello World!"));
		const r1 = await fscache.get("HelloWorld");

		assertEquals(r1?.value.data, enc.encode("Hello World!"));
		const r2 = await fscache.get("HelloWorld");
		assertEquals(r2?.value.data, enc.encode("Hello World!"));
		console.log(await fscache.del("HelloWorld"));
	},
});

Deno.test({
	name: "Use ID Encoding",
	fn: async () => {
		const coder = await encodingWith();
		const res = await coder.encode(["id"], enc.encode("Hello World!"));

		assert(res["content-encoding"] === "id");
		assert(res["content-type"] === "Uint8Array");
		assert(res.data instanceof Uint8Array);
		assertEquals(res.data, enc.encode("Hello World!"));
	},
});

Deno.test({
	name: "Use BR Encoding",
	only: true,
	fn: async () => {
		const coder = await encodingWith();
		const res = await coder.encode(["br", "id"], enc.encode("Hello World!"));

		console.log(res);

		assert(res["content-encoding"]);
		assert(res["content-type"] === "Uint8Array");
		assert(res.data instanceof Uint8Array);
		assertEquals(res.data, enc.encode("Hello World!"));
	},
});

Deno.test(skip("Use zstd Encoding", async () => {}));
Deno.test(skip("Use gzip Encoding", async () => {}));
Deno.test(skip("Use base64url Encoding", async () => {}));
Deno.test(skip("Use id Encoding", async () => {}));
Deno.test(skip("Encoding Is Bijective", async () => {
	// make test data
	// encode the test Data
	// ensure the encoded data is not the same as the initiakl data
	// ensure you have equivalent data when decoded
}));
