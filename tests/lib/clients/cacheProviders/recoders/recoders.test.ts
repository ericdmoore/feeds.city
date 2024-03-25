import enc, { encodingWith } from "$lib/clients/cacheProviders/recoders/mod.ts";

import { assert, assertEquals } from "$std/testing/asserts.ts";

const txtEnc = new TextEncoder();
const _sampleString1 = "This is the Hello World!";
const sampleString2 =
	`I'm baby celiac VHS praxis subway tile reprehenderit ut. Gatekeep vaporware flannel officia chillwave everyday carry offal typewriter portland tattooed ad 3 wolf moon letterpress. Readymade offal authentic fanny pack yr, pop-up vice tacos truffaut lumbersexual jean shorts fugiat. Chartreuse 8-bit street art tacos af, swag velit live-edge 3 wolf moon consectetur. Prism esse street art keffiyeh nostrud, tofu occaecat hexagon hot chicken XOXO narwhal lumbersexual retro. Austin offal banjo fugiat pickled. Fit exercitation aliquip, ut gatekeep waistcoat venmo DIY vibecession est yr.
Shaman grailed mollit DSA jianbing. Wolf eu four dollar toast, non readymade do 90's exercitation quis iPhone truffaut vinyl. DIY humblebrag sustainable kickstarter. Activated charcoal crucifix distillery church-key, reprehenderit freegan copper mug truffaut est yr mollit put a bird on it keytar eu fit. Authentic et pork belly hoodie organic humblebrag velit try-hard XOXO id cliche nisi gastropub everyday carry.
Activated charcoal gochujang readymade, food truck shoreditch VHS narwhal portland aesthetic do irure bushwick. Locavore copper mug 90's glossier laboris edison bulb pabst esse. Brunch slow-carb officia selfies literally. Occaecat trust fund 8-bit ea eu kombucha hashtag tilde. Eu etsy wayfarers, laboris tbh cliche ennui 3 wolf moon qui gastropub ut id. Chillwave pabst williamsburg actually banh mi glossier pariatur, sriracha mustache laborum voluptate tumblr.
Esse irony praxis deep v mlkshk meh culpa, four loko fanny pack fashion axe you probably haven't heard of them sartorial. Magna labore locavore roof party eiusmod cred ad vegan four loko cardigan. Typewriter edison bulb craft beer shabby chic austin, mukbang jean shorts woke hammock marxism fingerstache fit yuccie. Ut proident echo park, chambray next level Brooklyn kombucha unicorn yes plz kinfolk neutra health goth food truck. Vape ut four dollar toast pitchfork mumblecore blue bottle PBR&B artisan cardigan irony occaecat ennui dolor anim excepteur. Tacos ex fingerstache tonx butcher, ut bicycle rights dreamcatcher trust fund labore iPhone flexitarian ugh.
Blog af shaman commodo. Wayfarers nulla succulents crucifix williamsburg fanny pack neutra pok pok. Bicycle rights taiyaki poke, celiac snackwave hella put a bird on it swag organic quinoa. Neutral milk hotel paleo jawn health goth occaecat ut.`;

const randLabel = "4e5"; // 4.4e7 is fine - 4.5e7 causes OOM
const randomString = (inputLength: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789 _=;.<>{}()!@#$%^&*()_                   \n";
	for (let i = 0; i < inputLength; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

// snappy always wins, zstd is always second
const randStr = randomString(Number.parseFloat(randLabel));

Deno.test("br data array is smaller than original", async () => {
	const bytes = txtEnc.encode(sampleString2);
	const br = await enc.br();

	br.to(sampleString2).then((coded) => {
		assert(bytes.length >= coded.data.length);
		assertEquals(coded["content-encoding"], "br;id");
		assertEquals(coded["content-type"], "string");

		console.log(
			"coded.length: ",
			coded.data.length,
			"\noriginal.length:",
			bytes.length,
			"\n % of orig:",
			coded.data.length / bytes.length, // 51%
		);
	});
});

Deno.test("br data array is smaller than original - even for a randStr", async () => {
	const bytes = txtEnc.encode(randStr);
	const br = await enc.br();

	br.to(sampleString2).then((coded) => {
		assert(bytes.length >= coded.data.length);
		assertEquals(coded["content-encoding"], "br;id");
		assertEquals(coded["content-type"], "string");

		console.log(
			"coded.length: ",
			coded.data.length,
			"\noriginal.length:",
			bytes.length,
			"\n % of orig:",
			coded.data.length / bytes.length, // 51%
		);
	});
});

Deno.test("Coder/decoder based on Brotli", async () => {
	const bytes = txtEnc.encode(sampleString2);
	const [recoder, br] = await Promise.all([encodingWith(), enc.br()]);

	recoder.encode(["br"], bytes).then(async (coded) => {
		assertEquals(coded["content-encoding"], "br;id");
		assertEquals(coded["content-type"], "Uint8Array");
		assert(bytes.length >= coded.data.length);
		assertEquals(coded.data, (await br.to(sampleString2)).data);
		console.log(
			"coded.length: ",
			coded.data.length,
			"\noriginal.length:",
			bytes.length,
			"\n % of orig:",
			coded.data.length / bytes.length, // 51%
		);
	});
});

Deno.test("Coder/decoder based on Base64Url then Brotli", async () => {
	const bytes = txtEnc.encode(sampleString2);
	const [recoder, _br] = await Promise.all([encodingWith(), enc.br()]);

	recoder.encode(["base64url", "br"], sampleString2).then((coded) => {
		// native input data type
		assertEquals(coded["content-type"], "string");

		// most recent tranform is left-most
		// anchored with ID on the right
		assertEquals(coded["content-encoding"], "br;base64url;id");

		// comrpession should be effective
		assert(bytes.length >= coded.data.length);

		console.log(
			"coded.length: ",
			coded.data.length,
			"\noriginal.length:",
			bytes.length,
			"\n % of orig:",
			coded.data.length / bytes.length, // 83%
		);
	});
});

Deno.test("Coder/decoder based on Snappy", async () => {
	const bytes = txtEnc.encode(sampleString2);
	const [recoder] = await Promise.all([encodingWith()]);

	recoder.encode(["snappy"], sampleString2).then((coded) => {
		// native input data type
		assertEquals(coded["content-type"], "string");

		// most recent tranform is left-most
		// anchored with ID on the right
		assertEquals(coded["content-encoding"], "snappy;id");

		// comrpession should be effective
		assert(bytes.length >= coded.data.length);

		console.log(
			"coded.length: ",
			coded.data.length,
			"\noriginal.length:",
			bytes.length,
			"\n % of orig:",
			coded.data.length / bytes.length, // 82%
		);
	});
});
