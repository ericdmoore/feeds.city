import { assert, assertEquals, assertRejects } from "$std/testing/asserts.ts";
import {
	addError,
	addWarning,
	loadFeed,
	mergeMessages,
	type ReturnedMessages,
} from "$lib/parsers/index.ts";

import { jsonFeed as dfjsf } from "../mocks/jsonFeed/daringFireball.ts";
import { fn as addHashEnhancement } from "$lib/enhancements/addHash/run.ts";

const daringFireball = {
	url: "https://daringfireball.net/feeds/json",
	txt: dfjsf,
};

Deno.test("Bad URL gets Rejected", () => {
	const rssAddress = "Not a URL";
	assertRejects(
		() => loadFeed().fromURL(rssAddress).toJsonFeed(),
		"BAD URL gets rejected",
	);
});

Deno.test("Add Error", () => {
	const r = { errors: [], warnings: [] } as ReturnedMessages;
	const actual = addError({
		situation: "situation",
		complication: "complication",
		implication: "implication",
		action: "action",
		benefit: "benefit",
		from: "from",
		loc: "loc",
	}, r);

	const expected = {
		errors: [{
			situation: "situation",
			complication: "complication",
			implication: "implication",
			action: "action",
			benefit: "benefit",
			from: "from",
			loc: "loc",
			msgType: "error",
		}],
		warnings: [],
	} as ReturnedMessages;
	assertEquals(actual, expected);
});

Deno.test("Add Warning", () => {
	const r = { errors: [], warnings: [] } as ReturnedMessages;
	const actual = addWarning({
		situation: "situation",
		complication: "complication",
		implication: "implication",
		action: "action",
		benefit: "benefit",
		from: "from",
		loc: "loc",
	}, r);

	const expected = {
		errors: [],
		warnings: [{
			situation: "situation",
			complication: "complication",
			implication: "implication",
			action: "action",
			benefit: "benefit",
			from: "from",
			loc: "loc",
			msgType: "warning",
		}],
	} as ReturnedMessages;
	assertEquals(actual, expected);
});

Deno.test("Merge Messages", () => {
	const retMsg1 = addError({
		situation: "1",
		complication: "1",
		implication: "1",
		action: "1",
		benefit: "1",
		from: "1",
		loc: "A",
	});
	console.log("retMsg1", retMsg1);

	const retMsg2 = addError({
		situation: "2",
		complication: "2",
		implication: "2",
		action: "2",
		benefit: "2",
		from: "2",
		loc: "A",
	});
	console.log("retMsg2", retMsg2);

	const retMsg3 = addWarning({
		situation: "3",
		complication: "3",
		implication: "3",
		action: "3",
		benefit: "3",
		from: "3",
		loc: "A",
	});
	console.log("retMsg3", retMsg3);

	const mergedAllActual = mergeMessages(
		mergeMessages(retMsg1, retMsg2),
		retMsg3,
	);

	const expected = {
		errors: [
			{
				msgType: "error",
				loc: "A",
				from: "1",
				situation: "1",
				complication: "1",
				implication: "1",
				action: "1",
				benefit: "1",
			},
			{
				msgType: "error",
				loc: "A",
				from: "2",
				situation: "2",
				complication: "2",
				implication: "2",
				action: "2",
				benefit: "2",
			},
		],
		warnings: [
			{
				msgType: "warning",
				loc: "A",
				from: "3",
				situation: "3",
				complication: "3",
				implication: "3",
				action: "3",
				benefit: "3",
			},
		],
	} as ReturnedMessages;

	console.log({ mergedAllActual, expected });
	assertEquals(mergedAllActual, expected);
});

Deno.test("Local Adaapted Enhancement", async () => {
	const resp = await loadFeed()
		.fromString(daringFireball.txt, daringFireball.url)
		.use(addHashEnhancement)
		.toJsonFeed({ exportingParam: null })
		.catch((er) => {
			console.error("er caught:: ", er);
			return null;
		});

	if (resp) {
		// console.log(Object.keys(resp))
		assert(resp.string, "string version of the AST must be in the response");
		assert("messages" in resp, "Error Messages MUST be in the response");

		assert(resp.ast, "AST must be in the response");
		assert(resp.ast.title);
		assert(resp.ast.description);
		assert(resp.ast.language);
		assert(resp.ast._meta);
		assert(resp.ast.images);
		assert(resp.ast.links);
		assert(resp.ast.paging);
		assert(resp.ast.entitlements);
		assert(resp.ast.authors);
		assert(resp.ast.items);

		resp.ast.items.forEach((item) => {
			assert(item.content.source?.from);
			assert(item.content.source?.url);
			assert(item.content.source?.t);
			assert(item.content.source?.hash);
		});
	} else {
		assert(
			resp,
			"the corresponding data from the jsonfeed.org site should be defined",
		);
	}
});

Deno.test("Load Enhancement from URL", async () => {
	const resp = await loadFeed()
		.fromString(daringFireball.txt, daringFireball.url)
		.use("https://denopkg.com/ericdmoore/feeds.city@master/lib/enhancements/addHash/run.ts")
		.toJsonFeed({ exportingParam: null });

	assert(resp.string, "string version of the AST must be in the response");
	assert(resp.messages, "Error Messages MUST be in the response");

	assert(resp.ast, "AST must be in the response");
	assert(resp.ast.title);
	assert(resp.ast.description);
	assert(resp.ast.language);
	assert(resp.ast._meta);
	assert(resp.ast.images);
	assert(resp.ast.links);
	assert(resp.ast.paging);
	assert(resp.ast.entitlements);
	assert(resp.ast.authors);
	assert(resp.ast.items);

	resp.ast.items.forEach((item) => {
		assert(item.content.source?.from);
		assert(item.content.source?.url);
		assert(item.content.source?.t);
		assert(item.content.source?.hash);
	});
});

Deno.test("Second Enhancement fails to laod from URL", async () => {
	const resp = await loadFeed()
		.fromString(daringFireball.txt, daringFireball.url)
		.use(addHashEnhancement)
		.use("https://denopkg.com/ericdmoore/feeds.city@master/lib/enhancements/NOTAMODULE/run.ts")
		.toJsonFeed({ exportingParam: null });

	assert(resp.string, "string version of the AST must be in the response");
	assert(resp.messages.errors.length > 0, "Error Messages MUST be in the response");
	assert(resp.ast, "AST must be in the response");
	assert(resp.ast.title);
	assert(resp.ast.description);
	assert(resp.ast.language);
	assert(resp.ast._meta);
	assert(resp.ast.images);
	assert(resp.ast.links);
	assert(resp.ast.paging);
	assert(resp.ast.entitlements);
	assert(resp.ast.authors);
	assert(resp.ast.items);
});

Deno.test("Fetch the original jsonfeed using inline string", async () => {
	const resp = await loadFeed()
		.fromString(daringFireball.txt, daringFireball.url)
		.toJsonFeed({ exportingParam: null });

	assert(resp.string, "string version of the AST must be in the response");
	assert(resp.messages, "Error Messages MUST be in the response");

	assert(resp.ast, "AST must be in the response");
	assert(resp.ast.title);
	assert(resp.ast.description);
	assert(resp.ast.language);
	assert(resp.ast._meta);
	assert(resp.ast.images);
	assert(resp.ast.links);
	assert(resp.ast.paging);
	assert(resp.ast.entitlements);
	assert(resp.ast.authors);
	assert(resp.ast.items);
});

Deno.test("Fetch the original jsonfeed", async () => {
	const resp = await loadFeed()
		.fromURL("https://www.jsonfeed.org/feed.json")
		.toCity()
		.catch((er) => {
			console.error("er caught:: ", er);
			return null;
		});

	if (resp) {
		console.log("resp.ast:: ", resp.ast);
		assert(resp);
		assert(resp.ast);
	} else {
		assert(
			resp,
			"the corresponding data from the jsonfeed.org site should be defined",
		);
	}
});

Deno.test("data + config", () => {
	const jsonFeedURL = "https://daringfireball.net/feeds/json";

	const state = loadFeed()
		.fromString(dfjsf, jsonFeedURL)
		.use("https://denopkg.com/ericdmoore/deno-xml-parser/mod.ts")
		.data({ a: "Hey", b: true, c: [1, 2, 3] })
		.config({ key: "value", key2: "value2" })
		.state();

	assertEquals(state?.data?.a, "Hey");
	assertEquals(state?.config?.key, "value");
});

Deno.test("init via extracted state", () => {
	const state1 = loadFeed()
		.fromString(dfjsf, "https://daringfireball.net/feeds/json")
		.use("https://denopkg.com/ericdmoore/deno-xml-parser/mod.ts")
		.data({ a: "Hey", b: true, c: [1, 2, 3] })
		.config({ key: "value", key2: "value2" })
		.state();

	const state2 = loadFeed(state1)
		.fromString("", "")
		.state();

	assertEquals(state1.enhancements, state2.enhancements);
	assertEquals(state1.data, state2.data);
	assertEquals(state1.config, state2.config);
});

Deno.test("USE call with URL", async () => {
	const jsonFeedURL = "https://daringfireball.net/feeds/json";

	const resp = await loadFeed()
		.fromString(dfjsf, jsonFeedURL)
		.toJsonFeed();

	if (resp) {
		console.log(resp);
		assert(resp);
	} else {
		assert(
			resp,
			"the corresponding data from the jsonfeed.org site should be defined",
		);
	}
});
