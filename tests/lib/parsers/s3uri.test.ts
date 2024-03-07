import { assert, assertEquals, assertThrows } from "$std/testing/asserts.ts";
import { default as s3uri, s3UriParse } from "$lib/parsers/s3uri.ts";

// s3 -> s3.amazonaws.com
// b2 -> backblazeb2.com

Deno.test("s3uriparse simple", () => {
	const { Bucket, Key, query, protocol } = s3UriParse("s3://bucket/key");
	assertEquals(Bucket, "bucket");
	assertEquals(Key, "key");
	assertEquals(protocol, "s3");
	assertEquals(query, {});
});

Deno.test("s3uriparse simple for backblaze", () => {
	const { Bucket, Key, query, protocol, creds } = s3UriParse("b2.region://bucket/key");
	assertEquals(protocol, "b2");
	assertEquals(Bucket, "bucket");
	assertEquals(Key, "key");
	assertEquals(creds, { key: "", secret: "", region: "region" });
	assertEquals(query, {});
});

Deno.test({
	name: "s3uriparse Lots but no regoion",
	// only: true,
	fn: () => {
		const s3uri = s3UriParse("accesskey:secret@s3://bucket/key?alpha=a&beta=b#andHash");
		assertEquals(s3uri.protocol, "s3");
		assertEquals(s3uri.Bucket, "bucket");
		assertEquals(s3uri.Key, "key");
		assertEquals(s3uri.creds, { key: "accesskey", secret: "secret", region: "" });
		assertEquals(s3uri.query, { alpha: "a", beta: "b" });
		assertEquals(s3uri.hash, "andHash");
	},
});

Deno.test({
	name: "s3uriparse Lots and region in query",
	// only: true,
	fn: () => {
		const s3uri = s3UriParse("accesskey:secret@s3://bucket/key?alpha=a&beta=b&region=myRegion#andHash");
		assertEquals(s3uri.protocol, "s3");
		assertEquals(s3uri.Bucket, "bucket");
		assertEquals(s3uri.Key, "key");
		assertEquals(s3uri.creds, { key: "accesskey", secret: "secret", region: "myRegion" });
		assertEquals(s3uri.query, { alpha: "a", beta: "b", region: "myRegion" });
		assertEquals(s3uri.hash, "andHash");
	},
});

Deno.test({
	name: "s3uriparse full monty",
	// only: true,
	fn: () => {
		const s3uri = s3UriParse("accesskey:secret@s3.region://bucket/key?alpha=a&beta=b#andHash");
		assertEquals(s3uri.protocol, "s3");
		assertEquals(s3uri.Bucket, "bucket");
		assertEquals(s3uri.Key, "key");
		assertEquals(s3uri.creds, { key: "accesskey", secret: "secret", region: "region" });
		assertEquals(s3uri.query, { alpha: "a", beta: "b" });
		assertEquals(s3uri.hash, "andHash");
	},
});

Deno.test({
	name: "s3uriparse with only region",
	// only: true,
	fn: () => {
		const s3uri = s3UriParse("s3.region://bucket/key?alpha=a&beta=b#andHash");
		assertEquals(s3uri.protocol, "s3");
		assertEquals(s3uri.Bucket, "bucket");
		assertEquals(s3uri.Key, "key");
		assertEquals(s3uri.creds, { key: "", secret: "", region: "region" });
		assertEquals(s3uri.query, { alpha: "a", beta: "b" });
		assertEquals(s3uri.hash, "andHash");
	},
});

Deno.test({
	name: "bijective parse and string.1",
	// only: true,
	fn: () => {
		const s3u = s3uri();
		const expectedS3String = "s3.region://bucket/key?alpha=a&beta=b#andHash";
		assert(expectedS3String === s3u.s3String(s3u.parse(expectedS3String)));
	},
});

Deno.test({
	name: "bijective parse and string.1",
	// only: true,
	fn: () => {
		const s3u = s3uri();
		const expectedS3String = "s3.region://bucket/key?alpha=a&beta=b#andHash";
		assert(expectedS3String === s3u.s3String(s3u.parse(expectedS3String)));
	},
});

Deno.test({
	name: "invalid s3 string throws an error",
	// only: true,
	fn: () => {
		const s3u = s3uri();
		assertThrows(() => s3u.parse("somestring"));
	},
});
