import { assert } from "$std/testing/asserts.ts";
import {  
	hex, 
	// toAmz, 
	// toDateStamp 
} from "$lib/clients/aws-url-signer.ts";

// Deno.test("AWS V4 Sig", async () => {
// 	const initReqRegion = "us-west-2";
// 	const initReqAwsAccessKeyId = "KEY";
// 	const initReqAwsSecretKey = "SECRET";
// 	const initReqService = "s3";

// 	const v4sign = awsV4Sig({
// 		region: initReqRegion,
// 		awsAccessKeyId: initReqAwsAccessKeyId,
// 		awsSecretKey: initReqAwsSecretKey,
// 		service: initReqService,
// 	});
// 	const r = new Request("https://example.com", { method: "GET" });

// 	const date = new Date();
// 	const signedReq = await v4sign(r);
// 	const amz = toAmz(date);

// 	assert(signedReq.url === r.url, "URL is incorrect");
// 	assert(
// 		signedReq.headers.has("x-amz-date"),
// 		"Request should have the AMZ Date",
// 	);

// 	assert(signedReq.headers.has("host"), "Request should have the AMZ Date");
// 	assert(signedReq.headers.get("x-amz-date") === amz, "AMZ Date is incorrect");
// 	assert(
// 		signedReq.headers.has("authorization"),
// 		"Request should have the Authorization header",
// 	);

// 	assert(
// 		signedReq.headers.get("authorization")?.startsWith(
// 			"AWS4-HMAC-SHA256 Credential=",
// 		),
// 		"Request should start with the Authorization header",
// 	);

// 	signedReq.headers.get("authorization")?.split(", ").forEach((tokenPair) => {
// 		const [key, value] = tokenPair.split("=");
// 		if (key === "SignedHeaders") {
// 			assert(value === "host;x-amz-date", "SignedHeaders is incorrect");
// 		}
// 		if (key === "Signature") {
// 			assert(key && value, "SignedHeaders must be present");
// 		}
// 		if (key === "Credential") {
// 			assert(
// 				value ===
// 					`${initReqAwsSecretKey}/${
// 						toDateStamp(date)
// 					}/${initReqRegion}/${initReqService}/aws4_request`,
// 				"SignedHeaders is incorrect",
// 			);
// 		}
// 	});
// });

Deno.test("hex encoding", () => {
	assert(
		hex("deadbeef") === "6465616462656566",
		"hex is incorrect",
	);
});
