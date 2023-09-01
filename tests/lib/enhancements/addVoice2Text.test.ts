//#region interfaces
// import { skip, only } from "../helpers.ts";

import { StringReader } from "$std/io/mod.ts";
import { assert, assertEquals, assertNotEquals, assertRejects } from "$std/testing/asserts.ts";
import { readableStreamFromReader } from "$std/streams/mod.ts";
import { readToString, streamToString } from "$lib/utils/pumpReader.ts";

import { enhancementAdapter, loadFeed } from "$lib/parsers/index.ts";

import {
	checkChache,
	default as addVoice2text,
	isMediaFinished,
	makeKey,
	sendToCache,
	signS3Urlsigner,
	splitSynthTaskResponse,
	textToVoice,
	// splitBucketItemURL,
} from "$lib/enhancements/addVoice2text/addVoice2text.ts";

import type { PollyClientInterface, SynthesisTaskConfig, SynthesisTaskIdentifiers } from "$lib/clients/aws-polly.ts";

import {
	type ASTcomputable,
	ASTFeedItemJson,
	type ASTjson,
	ASTKindJson,
	computableToJson,
	rezVal,
} from "$lib/parsers/ast.ts";

import { urlToAST } from "$lib/start.ts";
import { s3Mock } from "../mocks/s3/s3Mock.ts";
import { jsonFeed, jsonFeedUrl } from "../mocks/jsonFeed/daringFireball.elon.ts";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import mkEnvVar from "$lib/utils/vars.ts";

type AST = ASTjson | ASTcomputable;
type ASTItem = typeof ASTFeedItemJson.TYPE;
type ASTItemAssertion = (item: ASTItem) => Promise<void>;
type ASTAllAssertion = (item: AST) => Promise<void>;

//#endregion interfaces

console.warn("WARNING: This Test Runs Against Production Resources");

const _encoder = new TextEncoder();
const _s3stateGlobal = new Map<string, Uint8Array>();

const cfg = async (i?: { s3?: S3Client; dyn?: DynamoDBClient; pc?: PollyClientInterface }) => {
	const env = await mkEnvVar("MISSING-KEY-VALUE");

	const aws = {
		key: env("AWS_KEY"),
		secret: env("AWS_SECRET"),
		region: env("AWS_REGION"),
	};
	const config = {
		s3: {
			bucket: env("AWS_POLLY_BUCKET"),
			prefix: env("AWS_POLLY_PREFIX"),
			...(i?.s3 ? { client: i?.s3 } : {}),
		},
		...(i?.dyn ? { dynamo: { client: i?.dyn } } : {}),
		...(i?.pc ? { polly: { client: i?.pc } } : {}),
	};
	// console.log({ s3: config.s3 })
	return {
		aws,
		config,
	};
};

const runAssertions =
	(...ASTassertionFns: ASTAllAssertion[]) => (...itemAssertionFns: ASTItemAssertion[]) => async (ast: AST) => {
		// console.log('ast: ', ast)
		const _ast = await computableToJson(ast);

		ASTassertionFns.forEach(async (fASTAssert) => await fASTAssert(ast));

		itemAssertionFns.forEach((fnItemAssert) => {
			_ast.items.forEach(async (item, _i) => {
				// console.log({ i, 'Len(attachedList)': item.attachments.length, item })
				await fnItemAssert(item);
			});
		});
	};

const allAttachmentsShouldHave = (p: string) => `All attachments should have a ${p}`;

const assertPropertyPresensce = (prop: string, msg: (prop: string) => string) => (obj: { [key: string]: unknown }) =>
	assert(obj[prop], msg(prop));

const dynamicPresenceAssertion = (prop: string) => assertPropertyPresensce(prop, allAttachmentsShouldHave);

const assertS3signedUrl = (u: URL) => {
	assert(u.searchParams.has("X-Amz-Algorithm"));
	assert(u.searchParams.has("X-Amz-Content-Sha256"));
	assert(u.searchParams.has("X-Amz-Credential"));
	assert(u.searchParams.has("X-Amz-Date"));
	assert(u.searchParams.has("X-Amz-Expires"));
	assert(u.searchParams.has("X-Amz-Signature"));
	assert(u.searchParams.has("X-Amz-SignedHeaders"));
};

const propertyAssertions = {
	url: dynamicPresenceAssertion,
	title: dynamicPresenceAssertion,
	mimeType: dynamicPresenceAssertion,
	sizeInBytes: dynamicPresenceAssertion,
	durationInSeconds: dynamicPresenceAssertion,
};

const buildDynamicAssertions = (
	assertionMap: {
		[prop: string]: (
			prop: string,
		) => (obj: { [key: string]: unknown }) => void;
	},
) =>
(obj: { [key: string]: unknown }) => {
	Object.entries(assertionMap)
		.forEach(([prop, assertionFn]) => {
			assertionFn(prop)(obj);
		});
};

const hasAnActualAttachment = async (attachedList: unknown[]) => {
	assertEquals(
		(await attachedList).length > 0,
		true,
		"All ast items should have attachment",
	);
};

const attachmentHasRightProperties = async (attached: unknown[]) => {
	const dynamicAssertions = await buildDynamicAssertions(propertyAssertions);
	for (const attachedItem of attached) {
		dynamicAssertions(attachedItem as Record<string, unknown>);
	}
};

// deno-lint-ignore require-await
const attachedURLIsSigned = async (attached: unknown[]) => {
	for (const attachedItem of (attached as Record<string, unknown>[])) {
		const u = new URL(attachedItem.url as string);
		assertS3signedUrl(u);
	}
};

const testItemsThatHaveAttachments =
	(...fns: ((attachedList: unknown[]) => Promise<void>)[]) => async (item: ASTItem) => {
		const attached = await rezVal(item.attachments);
		for await (const fn of fns) {
			await fn(attached as unknown[]);
		}
	};

Deno.test("streamToString", async () => {
	const data = { a: 1, b: 2, c: "c", d: { e: 5, f: null } };
	const dataStr = JSON.stringify(data);
	const strR = new StringReader(dataStr);
	const rs0 = readableStreamFromReader(strR);
	const s0 = await streamToString(rs0);
	const o0 = JSON.parse(s0);
	assertEquals(o0, data);
});

Deno.test("readToString", async () => {
	const input = "Hello";
	const rsInput = readableStreamFromReader(new StringReader(input));
	const collected = await readToString(rsInput);
	assertEquals(input, collected);
});

Deno.test({
	name: "Signing an S3 URL",
	fn: async () => {
		const c = await cfg();

		const signer = signS3Urlsigner({
			accessKeyId: c.aws.key,
			secretAccessKey: c.aws.secret,
		});

		const url = await signer({
			Bucket: "THIS_IS_THE_BUCKET",
			Key: "THIS_IS_THE_KEY",
			region: c.aws.region,
		});
		const u = new URL(url);
		assert(u.origin === `https://s3.${c.aws.region}.amazonaws.com`);
		assert(u.pathname === "/THIS_IS_THE_BUCKET/THIS_IS_THE_KEY");
		assertS3signedUrl(u);
	},
});

Deno.test({
	// only: true,
	name: "Valid Attachment For Each Entry ",
	fn: async () => {
		const enhanced = await loadFeed()
			.fromString(jsonFeed, jsonFeedUrl)
			.use(enhancementAdapter(addVoice2text), await cfg())
			.toCity();

		// const astWithAttachments = await computableToJson(enhanced.ast);
		console.log(
			"test>>",
			222,
			enhanced.ast.items.length,
			enhanced.ast.items.filter((i) => i.attachments.length > 0).length,
		);

		// enhanced.ast.items.forEach((i,n)=>{
		// 	console.log(228, n, i.attachments)
		// })

		runAssertions()(
			testItemsThatHaveAttachments(
				hasAnActualAttachment,
				attachmentHasRightProperties,
				attachedURLIsSigned,
			),
		)(enhanced.ast);
	},
});

Deno.test({ // @todo
	name: "Homomorphic Enhancement",
	// only: true,
	fn: async () => {
		const { ast } = await loadFeed()
			.fromString(jsonFeed, jsonFeedUrl)
			.use(enhancementAdapter(addVoice2text), await cfg())
			.toCity();

		// console.log("test:220", { ast });
		const [err, data] = ASTKindJson.validate(ast);
		runAssertions()(
			testItemsThatHaveAttachments(
				hasAnActualAttachment,
				attachedURLIsSigned,
			),
		)(ast);

		assertEquals(err, undefined);
		assert(
			data,
			"The AST should now be validated - and thus not undefined",
		);
	},
});

Deno.test("Enhancement Validates S3 Params", () => {
	const ast = urlToAST({ url: jsonFeedUrl, txt: jsonFeed });
	const addTextFn = textToVoice({
		aws: {
			key: "sillyExample",
			region: "us-west-2",
			secret: "somethingNotTooEmbarrasing",
		},
		config: { s3: { bucket: 5, prefix: "" } },
		// deno-lint-ignore no-explicit-any
	} as any);
	assertRejects(() => addTextFn(ast));
});

Deno.test("Validates S3 Params", () => {
	const ast = urlToAST({ url: jsonFeedUrl, txt: jsonFeed });
	const addTextFn = textToVoice({
		aws: {
			key: "sillyExample",
			region: "us-west-2",
			secret: "somethingNotTooEmbarrasing",
		},
		config: {
			s3: { bucket: 42, prefix: "" },
		},
		// deno-lint-ignore no-explicit-any
	} as any);
	assertRejects(() => addTextFn(ast));
});

Deno.test({
	name: "Validates Dynamo Params",
	// only: true,
	fn: async () => {
		const ast = await urlToAST({ url: jsonFeedUrl, txt: jsonFeed });
		const addTextFn = textToVoice({
			aws: {
				key: "sillyExample",
				region: "us-west-2",
				secret: "somethingNotTooEmbarrasing",
			},
			config: {
				s3: { bucket: 42, prefix: "prefix" },
				dynamo: {
					table: { whoa: "lil dogggy" },
				},
				// deno-lint-ignore no-explicit-any
			} as any,
		});
		assertRejects(() => addTextFn(ast));
	},
});

Deno.test("makeKey changes for config + corpus", async () => {
	const ka1 = await makeKey({ a: 1 }, "itemText");
	const ka2 = await makeKey({ a: 2 }, "itemText");
	const kb1 = await makeKey({ a: 1 }, "item Text");

	assertNotEquals(ka1, ka2);
	assertNotEquals(ka1, kb1);
	assertNotEquals(kb1, ka2);
});

Deno.test({
	name: "S3 Mock Unit Test",
	// only: true,
	fn: async () => {
		const s3m = s3Mock();
		const data = { a: 1, b: 2, c: { d: 4, e: 5 } };
		await s3m.putObject("someKey", data);

		//streamToString
		const s3DataStr = await readToString((await s3m.getObject("someKey")).Body);
		const s3DataObj = JSON.parse(s3DataStr);

		// console.log('>> await readToString(fromS3Mock) :: ', s3DataStr)
		// console.log('>> parsed data object :: ', s3DataObj)
		// console.log({s3DataObj, data});
		assertEquals(s3DataStr, JSON.stringify(data));
		assertEquals(s3DataObj, data);
	},
});

Deno.test({
	name: "haveEverStarted is based on breadcrumbs",
	ignore: true,
	// only: true,
	// @todo: fix
	fn: async () => {
		const key = "abcd";
		const url = `https://example.com/${key}`;
		const item = {
			title: "example",
			url,
			id: url,
			authors: [{ name: "Eric", imageUri: "http://example.com" }],
			content: { text: "Some Text" },
			images: { bannerImage: "", indexImage: "" },
			links: {
				category: "",
				nextPost: "",
				prevPost: "",
				externalURLs: [],
				tags: [],
				relLinks: {},
			},
			attachments: [],
			dates: { modified: Date.now(), published: Date.now() },
		};

		const pollyconfig = {
			OutputFormat: "mp3",
			Engine: "neural",
			LanguageCode: "en-US",
			LexiconNames: ["english"],
			SampleRate: "24000",
			VoiceId: "Matthew",
			SpeechMarkTypes: ["sentence"],
			TextType: "text",
		} as SynthesisTaskConfig;

		const IDs = {
			CreationTime: (new Date().getTime()),
			TaskStatus: "inProgress",
			SnsTopicArn: "SOME_EXAMPLE_ARN",
			TaskId: "some-uuid-that-has-hypens-and-numbers",
			OutputUri: "mock://data",
			TaskStatusReason: "Here-Is-A-Reason",
			RequestCharacters: 42,
		} as SynthesisTaskIdentifiers;

		const s3config = {
			s3c: s3Mock() as unknown as S3Client,
			Bucket: "MOCK",
			Prefix: "MOCKED_PREFIX",
		};

		await sendToCache(
			item,
			key,
			pollyconfig,
			IDs,
			s3config,
		);
		// console.log({data})

		const hasStarted = await checkChache(key, s3config).catch((er) => {
			console.error(394, er);
			return false;
		});
		console.log({ hasStarted });
		assert(hasStarted);
	},
});

Deno.test({
	name: "isMediaFinished is based on bread crumbs",
	// only: true,
	ignore: true,
	fn: async () => {
		const s3m = s3Mock() as unknown as S3Client;

		const itemNum = 1234;
		const url = `https://example.com/${itemNum}`;
		const item = {
			title: "example",
			url,
			id: url,
			authors: [{ name: "Eric", imageUri: "http://example.com" }],
			content: {
				text:
					"Some Text that will end up in an S3 bucket... but their will also be a meta data object that exists in another s3 location",
			},
			images: { bannerImage: "", indexImage: "" },
			links: {
				category: "",
				nextPost: "",
				prevPost: "",
				externalURLs: [],
				tags: [],
				relLinks: {},
			},
			attachments: [],
			dates: { modified: Date.now(), published: Date.now() },
		};
		const status: "completed" | "failed" | "inProgress" | "scheduled" = "inProgress";

		const synthTask = {
			SynthesisTask: {
				TaskStatus: status,
				TaskId: "a1b2c3d4",
				CreationTime: Date.now(),
				OutputFormat: "mp3" as const,
				OutputUri: "https://audio.example.com/1234",
				Engine: "neural" as const,
				LanguageCode: "en-US" as const,
				LexiconNames: [""],
				RequestCharacters: 42,
				SampleRate: "24000",
				SnsTopicArn: "",
				SpeechMarkTypes: ["sentence"] as ["sentence"],
				TaskStatusReason: "",
				TextType: "text" as const,
				VoiceId: "Matthew" as const,
			},
		};

		const key = await makeKey(item, item.content.text);
		const { taskIDs, ...tcfg } = splitSynthTaskResponse(synthTask.SynthesisTask);
		const s3Stuff = { s3c: s3m, Bucket: "MOCK", Prefix: "MOCKED_PREFIX" };
		const breadCrumbs = await sendToCache(
			item,
			key,
			tcfg.config,
			taskIDs,
			s3Stuff,
		);
		const hasStarted = await checkChache(key, s3Stuff);

		assertEquals("sk" in breadCrumbs, true);
		assertEquals("pk" in breadCrumbs, true);
		assertEquals("item" in breadCrumbs, true);
		assertEquals("task" in breadCrumbs, true);

		if (hasStarted) {
			const isFinished = await isMediaFinished(hasStarted);
			assertEquals(isFinished, false);
		}
		assertEquals(!!hasStarted, true);
	},
});

Deno.test({
	name: "isMediaFinished is now complete",
	ignore: true,
	// only: true,
	fn: async () => {
		const s3m = s3Mock() as unknown as S3Client;

		const itemNum = 1234;
		const url = `https://example.com/${itemNum}`;
		const item = {
			title: "example",
			url,
			id: url,
			authors: [{ name: "Eric", imageUri: "http://example.com" }],
			content: {
				text:
					"Some Text that will end up in an S3 bucket... but their will also be a meta data object that exists in another s3 location",
			},
			images: { bannerImage: "", indexImage: "" },
			links: {
				category: "",
				nextPost: "",
				prevPost: "",
				externalURLs: [],
				tags: [],
				relLinks: {},
			},
			attachments: [],
			dates: { modified: Date.now(), published: Date.now() },
		};
		const status: "completed" | "failed" | "inProgress" | "scheduled" = "completed";

		const synthTask = {
			SynthesisTask: {
				TaskStatus: status,
				TaskStatusReason: "",
				TaskId: "a1b2c3d4",
				CreationTime: Date.now(),
				OutputFormat: "mp3" as const,
				OutputUri: "https://audio.example.com/1234",
				Engine: "neural" as const,
				LanguageCode: "en-US" as const,
				LexiconNames: [""],
				RequestCharacters: 42,
				SampleRate: "24000",
				SnsTopicArn: "",
				SpeechMarkTypes: ["sentence"] as ["sentence"],
				TextType: "text" as const,
				VoiceId: "Matthew" as const,
			},
		};

		const key = await makeKey(item, item.content.text);

		const { taskIDs, ...tcfg } = splitSynthTaskResponse(synthTask.SynthesisTask);
		const s3stuff = { s3c: s3m, Bucket: "MOCK", Prefix: "MOCKED_PREFIX" };
		const breadCrumbs = await sendToCache(
			item,
			key,
			tcfg.config,
			taskIDs,
			s3stuff,
		);
		const hasStarted = await checkChache(key, s3stuff);

		assertEquals("sk" in breadCrumbs, true);
		assertEquals("pk" in breadCrumbs, true);
		assertEquals(breadCrumbs.pk, breadCrumbs.sk);
		assertEquals("item" in breadCrumbs, true);
		assertEquals("task" in breadCrumbs, true);
		assertEquals(!!hasStarted, true); // @todo

		if (hasStarted) {
			const isFinished = await isMediaFinished(hasStarted);
			assertEquals(isFinished, true);
		}
	},
});

Deno.test({
	name: "make item key",
	fn: async () => {
		const ka1 = await makeKey({ a: 1, b: 2, c: 3 }, "Hello World I am some example text!");
		assert(ka1.startsWith("k01://"));
		assert(!ka1.includes(","));
	},
});

// Deno.test(skip("example", async () => {}));
// WAIT FOR the s3 resources to show ... then delete
