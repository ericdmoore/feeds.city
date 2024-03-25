import { encodingWith } from "$lib/clients/cacheProviders/recoders/mod.ts";

const recoder = await encodingWith();

const sampleString2 =
	`I'm baby celiac VHS praxis subway tile reprehenderit ut. Gatekeep vaporware flannel officia chillwave everyday carry offal typewriter portland tattooed ad 3 wolf moon letterpress. Readymade offal authentic fanny pack yr, pop-up vice tacos truffaut lumbersexual jean shorts fugiat. Chartreuse 8-bit street art tacos af, swag velit live-edge 3 wolf moon consectetur. Prism esse street art keffiyeh nostrud, tofu occaecat hexagon hot chicken XOXO narwhal lumbersexual retro. Austin offal banjo fugiat pickled. Fit exercitation aliquip, ut gatekeep waistcoat venmo DIY vibecession est yr.
Shaman grailed mollit DSA jianbing. Wolf eu four dollar toast, non readymade do 90's exercitation quis iPhone truffaut vinyl. DIY humblebrag sustainable kickstarter. Activated charcoal crucifix distillery church-key, reprehenderit freegan copper mug truffaut est yr mollit put a bird on it keytar eu fit. Authentic et pork belly hoodie organic humblebrag velit try-hard XOXO id cliche nisi gastropub everyday carry.
Activated charcoal gochujang readymade, food truck shoreditch VHS narwhal portland aesthetic do irure bushwick. Locavore copper mug 90's glossier laboris edison bulb pabst esse. Brunch slow-carb officia selfies literally. Occaecat trust fund 8-bit ea eu kombucha hashtag tilde. Eu etsy wayfarers, laboris tbh cliche ennui 3 wolf moon qui gastropub ut id. Chillwave pabst williamsburg actually banh mi glossier pariatur, sriracha mustache laborum voluptate tumblr.
Esse irony praxis deep v mlkshk meh culpa, four loko fanny pack fashion axe you probably haven't heard of them sartorial. Magna labore locavore roof party eiusmod cred ad vegan four loko cardigan. Typewriter edison bulb craft beer shabby chic austin, mukbang jean shorts woke hammock marxism fingerstache fit yuccie. Ut proident echo park, chambray next level Brooklyn kombucha unicorn yes plz kinfolk neutra health goth food truck. Vape ut four dollar toast pitchfork mumblecore blue bottle PBR&B artisan cardigan irony occaecat ennui dolor anim excepteur. Tacos ex fingerstache tonx butcher, ut bicycle rights dreamcatcher trust fund labore iPhone flexitarian ugh.
Blog af shaman commodo. Wayfarers nulla succulents crucifix williamsburg fanny pack neutra pok pok. Bicycle rights taiyaki poke, celiac snackwave hella put a bird on it swag organic quinoa. Neutral milk hotel paleo jawn health goth occaecat ut.`;

const randomString = (inputLength: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789 _=;.<>{}()!@#$%^&*()_                   \n";
	for (let i = 0; i < inputLength; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

const IGNORE_LEVEL = 6; // higher numbers reduce tests
const randLabel = "4e7"; // 4.4e7 is fine - 4.5e7 causes OOM

const randStr = randomString(Number.parseFloat(randLabel));
console.log({ randLabel }, randStr.slice(0, 150));

// snappy always wins, zstd is always second

Deno.bench({
	name: "snappy human string",
	ignore: IGNORE_LEVEL > 5,
	fn: async () => {
		// near 72k ops/sec
		const _snappyEncoded = await recoder.encode(["snappy"], sampleString2);
	},
});

Deno.bench({
	name: `snappy random ${randLabel}`,
	ignore: IGNORE_LEVEL > 10,
	fn: async () => {
		// near 135k ops/sec
		const _snappyEncoded = await recoder.encode(["snappy"], randStr);
	},
});

Deno.bench({
	name: "zstd hipsum string",
	ignore: IGNORE_LEVEL > 5,
	fn: async () => {
		// near 16k ops/sec
		const _zstdEncoded = await recoder.encode(["zstd"], sampleString2);
	},
});

Deno.bench({
	name: `zstd random ${randLabel}`,
	ignore: IGNORE_LEVEL > 10,
	fn: async () => {
		// near 25.6k ops/sec
		const _zstdEncoded = await recoder.encode(["zstd"], randStr);
	},
});

Deno.bench({
	name: "gzip hipsum string",
	ignore: IGNORE_LEVEL > 2,
	fn: async () => {
		// near 1k ops/sec
		const _gzipEncoded = await recoder.encode(["gzip"], sampleString2);
	},
});
Deno.bench({
	name: `gzip random ${randLabel}`,
	ignore: IGNORE_LEVEL > 2,
	fn: async () => {
		// near .7k ops/sec
		const _gzipEncoded = await recoder.encode(["gzip"], randStr);
	},
});

Deno.bench({
	name: "br hipsum string",
	ignore: IGNORE_LEVEL > 1,
	fn: async () => {
		// near 0.9k ops/sec
		const _brEncoded = await recoder.encode(["br"], sampleString2);
	},
});

Deno.bench({
	name: `br random ${randLabel}`,
	ignore: IGNORE_LEVEL > 1,
	fn: async () => {
		// near 1k ops/sec
		const _brEncoded = await recoder.encode(["br"], randStr);
	},
});
