import { assert, assertEquals, assertNotEquals } from "$std/testing/asserts.ts";
import { cacheStack, inMem as inMemCache, s3cache, dynamoCache, localizedS3Store } from "$lib/clients/cache.ts";
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

		assert(a?.name === "a");
		assertEquals(a?.data, new Uint8Array([1, 1, 1]));
	},
});

Deno.test({
	name: "Simple Stack - inMem vs Network",
	fn: async () => {
		const env = await envVar(">>MISSING<<");
		const cacheLocName = "someKey";
		const s3str = s3uri();

		const mem1 = inMemCache();
		const s3 = s3cache({
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			defaultBucket: env("AWS_POLLY_BUCKET"),
			defualtPrefix: env("AWS_POLLY_PREFIX"),
		}, {}, s3str.parse);

		const localizedS3 = cacheStack(mem1, s3);
		// set both cache destinations with `SET A = 123`
		await localizedS3.set(cacheLocName, new Uint8Array([1, 2, 3]));
		assertEquals(await localizedS3.has(cacheLocName), true);

		// corupt local cache to different value
		await mem1.set(cacheLocName, new Uint8Array([1, 1, 1]));
		const aInMem = await mem1.get(cacheLocName);
		assert(aInMem?.name === cacheLocName);
		assert((await localizedS3.get(cacheLocName))?.provider === "RAM");

		// assert local is different
		assertEquals(aInMem?.data, new Uint8Array([1, 1, 1]));

		const aInS3 = await s3.get(cacheLocName);
		assert(aInS3?.name === cacheLocName);
		// assert s3 is the same
		assertEquals(aInS3?.data, new Uint8Array([1, 2, 3]));
		assertNotEquals(aInS3.data, aInMem.data);
	},
});

Deno.test({
	name: "Simple Layered Cache Stack - inMem before S3",
	fn: async () => {
		const env = await envVar(">>MISSING<<");
	
		const localizedS3 = localizedS3Store(
			// s3 params
			{
				params: {
					key: env("AWS_KEY"),
					secret: env("AWS_SECRET"),
					region: env("AWS_REGION"),
					defaultBucket: env("AWS_POLLY_BUCKET"),
					defualtPrefix: env("AWS_POLLY_PREFIX")
				},
			},
			// RAM
			{ max: 256 }
		)
		await localizedS3.set("HelloWorld", enc.encode("Hello World!"));
		const resp = await localizedS3.get("HelloWorld");
		assert(resp?.provider === "RAM");
	},
});


Deno.test({
	name:'Dynamo Cache Stack with repeated overrite',
	only:false, 
	fn: async ()=>{
		const env = await envVar(">>MISSING<<");

		const dynCache = dynamoCache({
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			table: env("AWS_DYN_TABLE_MEGA"),
		})

		await dynCache.set("HelloWorld", enc.encode("Hello World!"))
		const r1 = await dynCache.get("HelloWorld")
		assertEquals(r1?.data, enc.encode("Hello World!"))

		await dynCache.set("HelloWorld", enc.encode("Hello World!"))
		const r2 = await dynCache.get("HelloWorld")
		assertEquals(r2?.data, enc.encode("Hello World!"))
	}
})