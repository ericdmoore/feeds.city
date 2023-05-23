import { skip } from "../helpers.ts";
import { pollyClient, type Status } from "$lib/clients/aws-polly.ts";
import { assert, assertEquals } from "$std/testing/asserts.ts";

import envFn from "$lib/utils/vars.ts";

let vars = null as null | {
	AWS_KEY: string;
	AWS_REGION: string;
	AWS_SECRET: string;
	POLLY: { BUCKET: string; PREFIX: string };
};

const findVars = async () => {
	const envs = await envFn("MISSING-KEY-VALUE");
	if (vars) {
		return vars;
	} else {
		const [AWS_KEY, AWS_SECRET, AWS_REGION, BUCKET, PREFIX] = [
			envs("AWS_KEY"),
			envs("AWS_SECRET"),
			envs("REGION"),
			envs("POLLYBUCKET"),
			envs("POLLYPREFIX"),
		];

		const POLLY = { BUCKET, PREFIX };
		const ret = Object.freeze({ AWS_KEY, AWS_REGION, AWS_SECRET, POLLY });
		// set global var / memoization
		vars = ret;
		return ret;
	}
};

// NEEDS NET, ENV VARS, and READ permissions
// priority actions
Deno.test("DescribeVoices", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const request = await pc.DescribeVoices().request();
	assertEquals(request.body, null);
	assertEquals(request.headers.has("Authorization"), true);

	const authHdr = request.headers.get("Authorization");
	assertEquals(authHdr?.includes("AWS4-HMAC-SHA256 "), true);
	assertEquals(authHdr?.includes("Credential="), true);
	assertEquals(authHdr?.includes("SignedHeaders="), true);
	assertEquals(authHdr?.includes("Signature="), true);

	// const response = await pc.DescribeVoices().response()
	// await response.body?.cancel
	// assertEquals(response.status, 200)

	const respObj = await pc.DescribeVoices().json();
	assert(respObj.Voices);
});

Deno.test("Inpsect Request - GetSpeechSynthesisTask", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const req = await pc.GetSpeechSynthesisTask("task-Id-42").request();
	assert(req.url);
});

Deno.test("StartSpeechSynthesisTask Create Request", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const req = {
		OutputS3BucketName: envs.POLLY.BUCKET,
		OutputS3KeyPrefix: "helloWorld",
		Text: "Hello World! I some text that you can both read and hear.",
	};

	const request = await pc.StartSpeechSynthesisTask(req).request();
	assert(request.headers.has("Authorization"));
	assert(request.body);

	const authHdr = request.headers.get("Authorization");
	assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
	assert(authHdr?.includes("Credential="));
	assert(authHdr?.includes("SignedHeaders="));
	assert(authHdr?.includes("Signature="));
});

Deno.test("ListSpeechSynthesisTasks", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);

	const request = await pc.ListSpeechSynthesisTasks().request();
	assert(request.headers.has("Authorization"));

	const authHdr = request.headers.get("Authorization");
	assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
	assert(authHdr?.includes("Credential="));
	assert(authHdr?.includes("SignedHeaders="));
	assert(authHdr?.includes("Signature="));

	const r = await pc.ListSpeechSynthesisTasks().response();
	await r.text();
	assertEquals(r.status, 200);

	// const rjson = await pc.ListSpeechSynthesisTasks().json()
	// console.log('rjson: \n' ,rjson)
});

Deno.test("StartSpeechSynthesisTask Create Request", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const req = {
		OutputS3BucketName: envs.POLLY.BUCKET,
		OutputS3KeyPrefix: "helloWorld",
		Text: "Hello World! I some text that you can both read and hear.",
	};

	const request = await pc.StartSpeechSynthesisTask(req).request();
	assertEquals(request.headers.has("Authorization"), true);

	const authHdr = request.headers.get("Authorization");
	assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
	assert(authHdr?.includes("Credential="));
	assert(authHdr?.includes("SignedHeaders="));
	assert(authHdr?.includes("Signature="));
});

// skip since the multi-step test accomplsihes the same goal
Deno.test(skip("StartSpeechSynthesisTask Issue Request", async () => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const req = {
		OutputS3BucketName: envs.POLLY.BUCKET,
		OutputS3KeyPrefix: "deleteMe-fromTest",
		Text: "Hello World! I some text that you can both read and hear.",
	};

	const r = await pc.StartSpeechSynthesisTask(req).json();
	assert(r.SynthesisTask);
}));

Deno.test("Observe a task in-flight (within the queue)", async (t) => {
	const envs = await findVars();
	const pc = pollyClient(envs.AWS_KEY, envs.AWS_SECRET);
	const b = Object.entries(Deno.build)
		.filter(([_, v]) => v)
		.map(([k, v]) => `${k}=${v}`)
		.join("+");

	let TaskID: string;
	let status: Status;

	const req = {
		OutputS3BucketName: envs.POLLY.BUCKET,
		OutputS3KeyPrefix: `deleteMe-${Date.now()}-${b}`,
		Text: `This text was generated on ${(new Date()).toISOString()} from a system that has ${
			Object.entries(Deno.build).map(([k, v]) => `${k} equal to ${v}`).join(
				" and ",
			)
		}`,
	};

	await t.step("Issue new Start Task Request", async () => {
		const r = await pc.StartSpeechSynthesisTask(req).json();
		status = r.SynthesisTask.TaskStatus;
		TaskID = r.SynthesisTask.TaskId;
		console.log({ status, TaskID });
		assert(["inProgress", "scheduled"].includes(status));
	});

	await t.step("Observe Single Task", async () => {
		const { SynthesisTask } = await pc.GetSpeechSynthesisTask(TaskID).json();

		assert("Engine" in SynthesisTask);
		assert("LanguageCode" in SynthesisTask);
		assert("LexiconNames" in SynthesisTask);
		assert("OutputFormat" in SynthesisTask);
		assert("SampleRate" in SynthesisTask);
		assert("SnsTopicArn" in SynthesisTask);
		assert("SpeechMarkTypes" in SynthesisTask);
		assert("TextType" in SynthesisTask);
		assert("VoiceId" in SynthesisTask);
		//
		assert("CreationTime" in SynthesisTask);
		assert("RequestCharacters" in SynthesisTask);
		assert("OutputUri" in SynthesisTask);
		assert("TaskId" in SynthesisTask);
		assert("TaskStatus" in SynthesisTask);
		assert("TaskStatusReason" in SynthesisTask);
	});

	await t.step("Observe All Tasks in Queue", async () => {
		const r = await pc.ListSpeechSynthesisTasks({ Status: status as Status })
			.json();
		const list = r.SynthesisTasks.filter((t) => t.TaskId === TaskID);
		assert(list.length > 0);
	});
});

// UNTESTED
//
// Which happens to be the Query String Based Stuff
//
// Deno.test(skip('SynthesizeSpeech', async ()=>{}))

// next priority actions
// Deno.test(skip('DeleteLexicon', async ()=>{}))
// Deno.test(skip('GetLexicon', async ()=>{}))
// Deno.test(skip('ListLexicons', async ()=>{}))
// Deno.test(skip('PutLexicon', async ()=>{}))
