import { encodingWith } from "$lib/clients/cacheProviders/encoders/mod.ts";
import { mockJSON } from "./mockData/jsonData.ts";
import { prose } from "./mockData/prose.ts";

const enc = new TextEncoder();
const coder = await encodingWith();

// BR
// 512 is a backup-able number
// 640,768 is also a backup-able number
// as is 1024

// GZIP
// 512 is a backup-able number
// 640,768 might even be more consistently beneficial

// ZSTD
// Crosses to good compression around 512 like others
// 640,768 might even be more consistently beneficial

Array.from({ length: 25 })
	.fill(1)
	.forEach(async (_, i) => {
		const stepForProse = 35;
		const stepForJSON = 35;

		const slicedProse = prose.slice(0, (i + 1) * stepForProse);
		const slicedJSON = mockJSON.slice(0, (i + 1) * stepForJSON);

		const encodedProseData = await coder.encode(["id", "br"], slicedProse);
		const proseOriginalByteLength = enc.encode(slicedProse).byteLength;
		const proseEncodedDataLength = encodedProseData.data.byteLength;
		const prosePctOfOrig = proseEncodedDataLength / proseOriginalByteLength;

		const encodedJsonData = await coder.encode(["id", "br"], slicedJSON);
		const jsonOriginalByteLength = enc.encode(slicedJSON).byteLength;
		const jsonEncodedDataLength = encodedJsonData.data.byteLength;
		const jsonPctOfOrig = proseEncodedDataLength / proseOriginalByteLength;

		console.log({
			run: i + 1,
			prose: {
				proseOriginalByteLength,
				proseEncodedDataLength,
				prosePctOfOrig,
			},
			json: {
				jsonOriginalByteLength,
				jsonEncodedDataLength,
				jsonPctOfOrig,
			},
		});
	});
