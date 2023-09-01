import { cacheStack, inMem as inMemCache, encodingWith } from "$lib/clients/cache.ts";
import { dynamo, s3 } from "$lib/clients/cacheProviders/mod.ts";
import s3uri from "$lib/parsers/s3uri.ts";
import envVar from "$lib/utils/vars.ts";

const s3str = s3uri();
const env = await envVar(">>MISSING<<");
const coder = await encodingWith()
const thisFileURL = new URL(import.meta.url)
const thisFile = await Deno.readTextFile(thisFileURL)	
const data = await Deno.readFile(thisFileURL)	
// const enc = new TextEncoder();
// const data = enc.encode("Hello World!");

const localLayeredS3 = cacheStack(
	inMemCache(1024),
	s3.cache(
		{
			key: env("AWS_KEY"),
			secret: env("AWS_SECRET"),
			region: env("AWS_REGION"),
			defaultBucket: env("AWS_POLLY_BUCKET"),
			defualtPrefix: env("AWS_POLLY_PREFIX"),
		},
		{},
		s3str.parse,
	),
);

const localizedDyn = cacheStack(
	inMemCache(1024),
	dynamo.cache({
		table: env("AWS_KEY"),
		key: env("AWS_KEY"),
		secret: env("AWS_SECRET"),
		region: env("AWS_REGION"),
	})
);

const dynCache = dynamo.cache({
	table: env("AWS_KEY"),
	key: env("AWS_KEY"),
	secret: env("AWS_SECRET"),
	region: env("AWS_REGION"),
});

const mem2 = inMemCache();


Deno.bench("Simple Layered Cache Stack - inMem before S3", async () => {
	await localLayeredS3.set("HelloWorld", data);
	await localLayeredS3.get("HelloWorld");
});

Deno.bench("Local Only Cache", async () => {
	await mem2.set("HelloWorld", data);
	await mem2.get("HelloWorld");
});

// Deno.bench("Dynamo Only Cache", async () => {
// 	await dynCache.set("HelloWorld", data);
// 	await dynCache.get("HelloWorld");
// });

// Deno.bench("Localized Dynamo Cache", async () => {
// 	await localizedDyn.set("HelloWorld", data);
// 	await localizedDyn.get("HelloWorld");
// });

Deno.bench("BR Compress", async () => {
	await coder.encode(['id', 'br'], thisFile)
	// from 
	// > gtime -v deno bench tests/lib/clients/cache.bench.ts -A
	// 143 MB => (Maximum resident set size (kbytes): 143696)
})

Deno.bench("GZIP Compress", async () => {
	await coder.encode(['id', 'gzip'], thisFile)
	// from 
	// > gtime -v deno bench tests/lib/clients/cache.bench.ts -A
	// 367 MB => (Maximum resident set size (kbytes): 367232)
})