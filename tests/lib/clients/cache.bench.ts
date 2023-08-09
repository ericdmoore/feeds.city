import { 
	cacheStack, 
	dynamoCache, 
	inMem as inMemCache, 
	s3cache,

} from "$lib/clients/cache.ts";
import s3uri from "$lib/parsers/s3uri.ts";
import envVar from "$lib/utils/vars.ts";

const enc = new TextEncoder();
const s3str = s3uri();
const env = await envVar(">>MISSING<<");

const data = enc.encode("Hello World!");

const localLayeredS3 = cacheStack( 
	inMemCache(1024),
	s3cache({
		key: env("AWS_KEY"),
		secret: env("AWS_SECRET"),
		region: env("AWS_REGION"),
		defaultBucket: env("AWS_POLLY_BUCKET"),
		defualtPrefix: env("AWS_POLLY_PREFIX"),
	}, {}, s3str.parse)
);

const dynCache = dynamoCache({
	table: env("AWS_KEY"),
	key: env("AWS_KEY"),
	secret: env("AWS_SECRET"),
	region: env("AWS_REGION"),
})

const mem2 = inMemCache();

Deno.bench("Simple Layered Cache Stack - inMem before S3", async () => {
	await localLayeredS3.set("HelloWorld", data);
	await localLayeredS3.get("HelloWorld");
});

Deno.bench("Local Only Cache", async () => {
	await mem2.set("HelloWorld", data);
	await mem2.get("HelloWorld");
});

Deno.bench("Dynamo Only Cache", async () => {
	await dynCache.set("HelloWorld", data);
	await dynCache.get("HelloWorld");
});
