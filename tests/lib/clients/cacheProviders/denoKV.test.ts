import { assert, assertEquals } from "$std/testing/asserts.ts";
import { denoKVcache } from "$lib/clients/cacheProviders/denoKV.ts";

const enc = new TextEncoder();

Deno.test({
	name: "set then get",
	ignore: true,
	fn: async () => {
		const dkv = await denoKVcache({ maxItems: 1000, prefix: "unitTests" });
		const dataToCache = await dkv.set("test1", enc.encode("test"));
		const dataFromCache = await dkv.get("test1");

		assertEquals(dataFromCache, dataToCache);
	},
});

Deno.test({
	name: "repeated lifecycle",
	ignore: true,
	fn: async () => {
		const dkv = await denoKVcache({ maxItems: 1000, prefix: "lifecycleUnitTests" });

		const dataToSave = [
			{ key: "test2", value: "This is the example text for the string used in Test number two. ".repeat(1000) },
			{ key: "test3", value: "This is the example text not for Stringtwo, but rather for string3. ".repeat(500) },
			{ key: "test4", value: "Lastly, this is the example text for the string used in Test number four! ".repeat(777) },
		];

		for (const d of dataToSave) {
			const dataToCache = await dkv.set(d.key, enc.encode(d.value));
			assert(dataToCache);
		}

		for (const d of dataToSave) {
			const dataToCache = await dkv.get(d.key);
			assert(dataToCache);
		}
	},
});

Deno.test({
	name: "del",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "has",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "peek",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "overrides",
	ignore: true,
	fn: async () => {},
});

Deno.test({
	name: "transforms",
	ignore: true,
	fn: async () => {},
});
