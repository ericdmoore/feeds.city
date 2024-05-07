// import { skip } from "../helpers.ts";
import { assert, assertEquals, assertNotEquals } from "$std/testing/asserts.ts";
import { cacheStack, inMem as inMemCache, renamerWithSha1 } from "$lib/clients/cache.ts";
import { encoderMap, encodingWith } from "$lib/clients/cacheProviders/recoders/mod.ts";
import { dynamo, fsCache, memFrontS3, s3 } from "$lib/clients/cacheProviders/mod.ts";
import s3uri from "$lib/parsers/s3uri.ts";
import { sleep } from "$lib/index.ts";
import envVarReader from "$lib/utils/vars.ts";
const envVars = await envVarReader();
const env = await envVars("MISSING");

const enc = new TextEncoder();
const dec = new TextDecoder();
// const grabFirstElems = (n:number)=><T>(arr: T[] | string) => arr.slice(0,n);
// const grab1000 = grabFirstElems(1000)

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
	// only: true,
	fn: async () => {
		const cacheLocName = "someKey";
		const s3str = s3uri();

		const mem1 = inMemCache();
		const s3cac = await s3.cache(
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
		const localizedS3 = await memFrontS3.cache(
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
	// ignore: true,
	fn: async () => {
		const dynCache = await dynamo.cache({
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
		await dynCache.del("HelloWorld");
	},
});

Deno.test({
	name: "BR Encoding of a Short String",
	fn: async () => {
		const encMap = await encoderMap();
		const r = await encMap.br.to("Hello World!");
		assert(r["content-encoding"] === "id");
		assert(r["content-type"] === "string");
		assert(r.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "BR Encoding of a Long String",
	fn: async () => {
		const thisFile = await Deno.readTextFile(new URL(import.meta.url));

		const encMap = await encoderMap();
		const r = await encMap.br.to(thisFile);

		assert(r["content-encoding"] as string === "br;id");
		assert(r["content-type"] === "string");
		assert(r.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "Sha1 Renamer",
	fn: async () => {
		const renamed1 = await renamerWithSha1("Hello World!");
		const renamed2 = await renamerWithSha1("Allo World!");
		const renamed3 = await renamerWithSha1(Array(512).fill("Allo World!").join(""));
		// console.log({renamed1, renamed2, renamed3})
		assert(renamed1 !== renamed2);
		assert(renamed2 !== renamed3);
		assert(renamed1 !== renamed3);

		assert(renamed1 === "Lve95gjOVATpfV8EL5X4nxwjKHE");
		assert(renamed2 === "C_-SzbBu1Ry1IFnNbndv1dohz-I");
		assert(renamed3 === "DwUt3khKNBe0cRoEOvpKw6rVc1E");
		assert([renamed1, renamed2, renamed3].every((x) => x.length === 27));
	},
});
Deno.test({
	name: "Use a compressed, bijective, Dynamo-Ready Composition",
	// only: true,
	fn: async () => {
		const thisFile = await Deno.readTextFile(new URL(import.meta.url));

		const coder = await encodingWith();
		const val4CacheInternal_BR_B64 = await coder.encode(["id", "br", "base64url"], thisFile);

		assert(val4CacheInternal_BR_B64["content-encoding"] as string === "base64url;br;id");
		assert(val4CacheInternal_BR_B64["content-type"] === "string");
		assert(val4CacheInternal_BR_B64.data instanceof Uint8Array);

		const retVal = await coder.decode(val4CacheInternal_BR_B64);
		assertEquals(thisFile, dec.decode(retVal.data));
	},
});

Deno.test({
	name: "Use BR/Base64Url/ID Encoding on Bytes",
	// only: true,
	fn: async () => {
		const coder = await encodingWith();
		const thisFile = await Deno.readTextFile(new URL(import.meta.url));

		const val4CacheInternal = await coder.encode(["id", "base64url", "br"], thisFile);
		const decodedData = await coder.decode(val4CacheInternal);

		assert(decodedData["content-type"] === "string");
		// assertEquals(grab1000(thisFile), grab1000(dec.decode(decodedData.data)) )
		assertEquals(thisFile, dec.decode(decodedData.data));
	},
});

Deno.test({
	name: "Only uses compression the data is large enough to warrant at least some savings",
	// only: true,
	fn: async () => {
		const coder = await encodingWith();
		const quickFoxText = Array(11).fill("The quick brown fox jumps over the lazy dog!").join(" "); // 494 chars

		const cacheVal = await coder.encode(["id", "br", "base64url"], quickFoxText);

		assert(cacheVal.data instanceof Uint8Array);
		assert(cacheVal["content-type"] === "string");
		assert(
			cacheVal["content-encoding"] as string === "base64url;id",
			`what we actually got is: ${cacheVal["content-encoding"]}`,
		);

		const decodedData = await coder.decode(cacheVal);
		assertEquals(quickFoxText, dec.decode(decodedData.data));
	},
});

Deno.test({
	name: "Use ID Encoding on Bytes",
	// only: true,
	fn: async () => {
		const coder = await encodingWith();
		const res = await coder.encode(["id"], enc.encode("Hello World!"));

		// console.log(res);
		assert(res["content-encoding"] === "id");
		assert(res["content-type"] === "Uint8Array");
		assert(res.data instanceof Uint8Array);
		assertEquals(res.data, enc.encode("Hello World!"));
	},
});

const encMap5 = await encoderMap(5);

Deno.test({
	name: "Use ID Encoding on Text",
	fn: async () => {
		const res = await encMap5.id.to("Hello World!");

		assert(res["content-encoding"] === "id");
		assert(res["content-type"] === "string");
		assert(res.data instanceof Uint8Array);

		assertEquals(res.data, enc.encode("Hello World!"));
	},
});

Deno.test({
	name: "Use BR Encoding",
	// only: true,
	fn: async () => {
		const text = "Hello World!";
		const res = await encMap5.br.to(text);

		assert(res["content-type"] === "string");
		assert(res["content-encoding"] as string === "br;id");
		assert(res.data instanceof Uint8Array);

		// assertEquals(res.data, enc.encode("Hello World!"));
	},
});

Deno.test({
	name: "Use ZSTD Encoding",
	// only: true,
	fn: async () => {
		const text = "Hello World!";
		const res = await encMap5.zstd.to(text);

		assert(res["content-type"] === "string");
		assert(res["content-encoding"] as string === "zstd;id");
		assert(res.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "Use GZIP Encoding",
	// only: true,
	fn: async () => {
		const text = "Hello World!";
		const res = await encMap5.gzip.to(text);

		assert(res["content-type"] === "string");
		assert(res["content-encoding"] as string === "gzip;id");
		assert(res.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "Use Base64url Encoding on a string",
	// only: true,
	fn: async () => {
		const res = await encMap5.base64url.to("Hello World!");

		// console.log(res);
		assert(res["content-encoding"] as string === "base64url;id");
		assert(res["content-type"] === "string");
		assert(res.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "Use Make sure that none of the compressors kick-in on a text below the threshold",
	// only: true,
	fn: async () => {
		const coder = await encodingWith();
		const quickFoxText = Array(11).fill("The quick brown fox jumps over the lazy dog!").join(" "); // 494 chars
		const res = await coder.encode(["id", "br", "gzip", "zstd"], quickFoxText);

		// console.log(res);
		assert(res["content-type"] === "string");
		assert(res["content-encoding"] === "id");
		assert(res.data instanceof Uint8Array);
	},
});

Deno.test({
	name: "Fs Cache",
	fn: async () => {
		const quickFoxTextLarger = Array(16).fill("The quick brown fox jumps over the lazy dog!").join(" "); // 494 chars
		const fscache = await fsCache.cache({ relativeDir: "./.fsCache", maxItems: 4 });

		const Hello = enc.encode("Hello World!");
		await fscache.set("HelloWorld1", Hello);
		await fscache.set("Allo World!!", quickFoxTextLarger);

		const r1 = await fscache.get("HelloWorld1");
		const r2 = await fscache.get("HelloWorld1");

		assertEquals(r1?.value.data, Hello);
		assertEquals(r2?.value.data, Hello);
		assertEquals(r1?.value.data, r2?.value.data);
		// console.log(await fscache.del("HelloWorld"));
	},
});

Deno.test({
	name: "Fs Cache Too Many Items",
	// ignore: true,
	fn: async () => {
		const quickFoxTextLarger = Array(20).fill(
			`The quick brown fox jumps over the lazy dog! And that's a fact that you just have to deal with`,
		).join(" "); // 494 chars
		const fscache = await fsCache.cache({ relativeDir: "./.fsCache", maxItems: 4 });
		const Hello = enc.encode("Hello World!");

		const data1 = await fscache.set("HelloWorld1", "Hello World!");
		assert(fscache.meta.cacheItemSize() === 1); //
		await sleep(2000);

		const _data2 = await fscache.set("HelloWorld2", Hello);
		assert(fscache.meta.cacheItemSize() === 2); //
		await sleep(2000);

		await fscache.set("HelloWorld3", Hello);
		assert(fscache.meta.cacheItemSize() === 3); //
		await sleep(2000);

		await fscache.set("Allo World !!", quickFoxTextLarger);

		const [oldestName] = fscache.meta.oldestItem();
		assert(data1.key.renamed === oldestName);

		await fscache.set("Hello Too Many", enc.encode("Something Should Get Triggered Here!!"));
		assert(fscache.meta.cacheItemSize() === 4);

		assertEquals(null, await fscache.get("HelloWorld1")); // is upposed to be gone
		assertEquals(Hello, (await fscache.get("HelloWorld2"))?.value.data);
	},
});
