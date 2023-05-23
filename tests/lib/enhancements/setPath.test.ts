// import skip from '../helpers.ts';
import { setPath } from "$lib/enhancements/setPath/setPath.ts";
import { computableToJson, rezVal } from "$lib/parsers/ast.ts";

import { parseAndPickType } from "$lib/start.ts";
import { jsonFeedNoItems as jsfTXT } from "../mocks/jsonFeed/flyingmeat.ts";
import { assertEquals, assertNotEquals } from "$std/testing/asserts.ts";

// import {getPath} from '../../lib/utils/propertyPath.ts'
// import {jsonfeed} from '../../lib/parsers/index.ts'

Deno.test("Setter Default", async () => {
	// console.log()
	const setTitle = setPath();
	const p = await parseAndPickType({ url: "http://example.biz", txt: jsfTXT });
	const ast = await p.parser(p.data, p.url).toAST();
	const ast2 = await computableToJson(setTitle(ast));
	assertNotEquals(ast.title, "Title: Hello World!");
	assertEquals(ast2.title, "Title: Hello World!");
});

Deno.test("Given Values", async () => {
	const setImages = setPath({
		path: "images.bannerImage",
		value: 'json::"https://cdn.image.com"',
	});
	const p = await parseAndPickType({ url: "http://example.biz", txt: jsfTXT });
	const ast = await p.parser(p.data, p.url).toAST();
	const ast2 = await computableToJson(setImages(ast));
	assertNotEquals(ast.title, "Title: Hello World!");
	assertEquals(ast2.images.bannerImage, "https://cdn.image.com");
});

Deno.test("Mustache Values", async () => {
	const setFavicon = setPath({
		path: "images.favicon",
		value: 'json::"https://cdn.something.com"',
	});
	const assignIconToFavicon = setPath({
		path: "images.icon",
		value: `{{::"{{{images.favicon}}}"`,
	});
	const p = await parseAndPickType({ url: "http://example.biz", txt: jsfTXT });
	const ast = await p.parser(p.data, p.url).toAST();
	const ast2 = await computableToJson(assignIconToFavicon(setFavicon(ast)));

	const astImages = await rezVal(ast.images);
	assertNotEquals(astImages.favicon, "https://cdn.something.com");
	assertEquals(ast2.images.favicon, "https://cdn.something.com");
	assertEquals(ast2.images.icon, "https://cdn.something.com");
});
