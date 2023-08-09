import { skip } from "../helpers.ts";
import { type Status, pollyClient, } from "$lib/clients/aws-polly.ts";
import { toRequest, toHttpRequest, sigMaker } from "$lib/clients/aws-url-signer.ts"
import { HttpRequest } from "@aws-sdk/protocol-http";
import { assert, assertEquals } from "$std/testing/asserts.ts";

import envFn from "$lib/utils/vars.ts";
const env = await envFn("MISSING-KEY-VALUE");

Deno.test({
	name: "Isomorphic Morphism.1",
	fn: async () => {
		const req1 = new Request('https://foo.com/bar?first=1&second=2#baz', {method: 'GET', headers:{host: 'foo.com'}})
		const req2 = await toRequest(toHttpRequest(req1))
		
		assert(req1.cache === req2.cache)
		assert(req2.credentials === req1.credentials)
		assert(req2.destination === req1.destination)
		assert(req2.integrity === req1.integrity)
		assert(req2.keepalive === req1.keepalive)
		assert(req2.method === req1.method)
		assert(req2.mode === req1.mode)
		assert(req2.redirect === req1.redirect)
		assert(req2.referrer === req1.referrer)
		assert(req2.referrerPolicy === req1.referrerPolicy)
		assert(req1.url === req2.url)

		assertEquals(req2.body, req1.body)
		assertEquals(req2.headers, req1.headers)
		assertEquals(req2.signal, req1.signal)
	}
})

Deno.test({
	name: "Isomorphic Morphism.2",
	fn: async () => {
		const req1 = new HttpRequest({
			method: "POST",
			protocol: "https:",
			path: "/v1/polly/speech",
			fragment:'#baz',
			headers: {
				authorization: 'HMAC-SHA256',
				host: "foo.us-bar-1.amazonaws.com"
			},
			hostname: "foo.us-bar-1.amazonaws.com",
		})
		const req2 = await toHttpRequest(toRequest(req1))
		assertEquals(req2, req1)
	}
})


// https://github.com/aws/aws-sdk-js-v3/blob/main/packages/signature-v4/src/SignatureV4.spec.ts
// Deno.test({
// 	name:'SignatureV4.spec.ts line 68', 
// 	fn:()=>{}
// })

// https://github.com/aws/aws-sdk-js-v3/blob/main/packages/signature-v4/src/SignatureV4.spec.ts
Deno.test({
	name: "sigMaker",
	fn: async () => {
		const signer = sigMaker('foo', 'bar', "us-bar-1", 'foo')
		
		const minimalRequest = new HttpRequest({
			method: "POST",
			protocol: "https:",
			path: "/",
			headers: {
			  host: "foo.us-bar-1.amazonaws.com",
			},
			hostname: "foo.us-bar-1.amazonaws.com",
		  });
		  
		const signedReq = await signer(toRequest(minimalRequest), {
			signingDate: new Date("2000-01-01T00:00:00.000Z")
		})
		// console.log(signedReq)
		assert( 
			signedReq.headers.get('Authorization') === 
			"AWS4-HMAC-SHA256 Credential=foo/20000101/us-bar-1/foo/aws4_request, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=1e3b24fcfd7655c0c245d99ba7b6b5ca6174eab903ebfbda09ce457af062ad30" 
		);

	}
})


Deno.test({
	name: "toHttpRequest",
	// only: false,
	fn: async () => {
		const req = new Request('https://foo.com/bar?first=1&second=2#baz', {method: 'GET'})
		const reqURL = new URL(req.url)
		const httpReq = await toHttpRequest(req)

		// console.log('httpReq: ', httpReq)
		// console.log('actualHttpReq: ', actualHttpReq)
		// console.log('req: ', req)
		// 
		// assertEquals(actualHttpReq, httpReq)		

		const headers = {} as Record<string, string>
		req.headers.forEach((val, key)=>{
			headers[key] = val
		})

		const search = {} as Record<string, string>
		reqURL.searchParams.forEach((val, key)=>{
			search[key] = val
		})

		assert(!httpReq.body && !req.body)
		assert(httpReq.fragment	=== reqURL.hash)
		assert(httpReq.hostname === reqURL.hostname)
		assertEquals(httpReq.headers , {
			host:'foo.com',
			...headers
		} as Record<string, string>)
		assert(httpReq.method === req.method)
		assert(httpReq.password === undefined && reqURL.password === '')
		assert(httpReq.username === undefined && reqURL.username === '')
		assert(httpReq.port === undefined)
		assert(reqURL.port === '')
		assert(httpReq.protocol === reqURL.protocol)
		assertEquals(httpReq.query, search)
		
	}
})


// NEEDS NET, ENV VARS, and READ permissions
// priority actions
Deno.test({
	name: "DescribeVoices",
	fn:  async () => {
		const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));
		const request = await pc.DescribeVoices().request();

		// console.log(request)
		// console.log(request.headers.get("Authorization"))

		assertEquals(request.body, null);
		
		const authHdr = request.headers.get("Authorization");
		assertEquals(authHdr?.includes("AWS4-HMAC-SHA256 "), true);
		assertEquals(authHdr?.includes("Credential="), true);
		assertEquals(authHdr?.includes("SignedHeaders="), true);
		assertEquals(authHdr?.includes("Signature="), true);

		// const response = await pc.DescribeVoices().response()
		// await response.body?.cancel
		// assertEquals(response.status, 200)

		const respObj = await pc.DescribeVoices().json();
		// console.log(
		// 	respObj, 
		// 	(respObj as unknown as {message:string}).message
		// )
		assert(respObj?.Voices?.length > 0);
	}
});

Deno.test("Inpsect Request - GetSpeechSynthesisTask", async () => {
	const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));
	const req = await pc.GetSpeechSynthesisTask("task-Id-42").request();
	
	assert(req.method === "GET");
	assert(req.headers.has('Authorization'));
	assert(req.body === null);
	assert(new URL(req.url).pathname.includes("task-Id-42"));
	
	const authHdr = req.headers.get("Authorization");
	assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
	assert(authHdr?.includes("Credential="));
	assert(authHdr?.includes("SignedHeaders="));
	assert(authHdr?.includes("Signature="));
});

Deno.test({
	name:"StartSpeechSynthesisTask Create Request",
	// only: false,
	fn: async () => {
		const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));
		const input = {
			OutputS3BucketName: env('AWS_POLLY_BUCKET'),
			OutputS3KeyPrefix: "helloWorld",
			Text: "Hello World! I some text that you can both read and hear.",
		};

		const req = await pc.StartSpeechSynthesisTask(input).request();
		assert(req.headers.has("Authorization"));
		assert(req.body);

		// console.log(req.headers.get("authorization"))

		const authHdr = req.headers.get("Authorization");
		assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
		assert(authHdr?.includes("Credential="));
		assert(authHdr?.includes("SignedHeaders="));
		assert(authHdr?.includes("Signature="));
	}
});


Deno.test("ListSpeechSynthesisTasks", async () => {
	const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));

	const req = await pc.ListSpeechSynthesisTasks().request();
	assert(req.headers.has("Authorization"));

	// console.log(req)

	const authHdr = req.headers.get("Authorization");
	assert(authHdr?.includes("AWS4-HMAC-SHA256 "));
	assert(authHdr?.includes("Credential="));
	assert(authHdr?.includes("SignedHeaders="));
	assert(authHdr?.includes("Signature="));

	const r = await pc.ListSpeechSynthesisTasks().response();
	
	// console.log(await r.text())
	r.body?.cancel()

	assertEquals(r.status, 200);

	// const rjson = await pc.ListSpeechSynthesisTasks().json()
	// console.log('rjson: \n' ,rjson)
});


// skip since the multi-step test accomplsihes the same goal
Deno.test(skip("StartSpeechSynthesisTask Issue Request", async () => {
	const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));
	const req = {
		OutputS3BucketName: env('AWS_POLLY_BUCKET'),
		OutputS3KeyPrefix: "deleteMe-fromTest",
		Text: "Hello World! I some text that you can both read and hear.",
	};

	const r = await pc.StartSpeechSynthesisTask(req).json();
	assert(r.SynthesisTask);
}));

Deno.test("Observe a task in-flight (within the queue)", async (t) => {
	const pc = pollyClient(env('AWS_KEY'), env('AWS_SECRET'));
	const b = Object.entries(Deno.build)
		.filter(([_, v]) => v)
		.map(([k, v]) => `${k}=${v}`)
		.join("+");

	let TaskID: string;
	let status: Status;

	const req = {
		OutputS3BucketName: env('AWS_POLLY_BUCKET'),
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
		// console.log({ status, TaskID });
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
