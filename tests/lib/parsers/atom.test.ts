import { assertEquals } from "$std/testing/asserts.ts";
import { skip } from "../helpers.ts";
import { parseAndValidate } from "$lib/start.ts";
import { computableToJson } from "$lib/parsers/ast.ts";
import { Atom, RespStruct } from "$lib/parsers/atom.ts";
import { atom as dhhAtom } from "../mocks/atom/dhh_hey.ts";

Deno.test(skip(
	"Atom -> AST -> Atom",
	async () => {
		console.log();
		const fakeUrl = "http://world.hey.com/dhh/atom.xml";

		const a1 = await parseAndValidate({ url: fakeUrl, txt: dhhAtom });
		const ast = await Atom(a1, fakeUrl).toAST();
		console.log("ast:", ast);

		const astJson = await computableToJson(ast);
		console.log("astJson:", astJson);

		const a2 = await Atom<RespStruct>({}, fakeUrl).fromAST(astJson);
		console.log("a2:", a2);

		assertEquals(a1.data, a2);
	},
));

Deno.test(skip("DFB header Values", async () => {
	const { txt, url } = {
		url: "http://world.hey.com/dhh/atom.xml",
		txt: dhhAtom,
	};
	const c1 = await parseAndValidate({ url, txt });
	// const jsData = c1.data as RespStruct
	const ast = await computableToJson(Atom<RespStruct>(c1.data, url).toAST());
	const c2 = await Atom({}, url).fromAST(ast) as RespStruct;
	assertEquals(c1.data, c2);
}));

Deno.test(skip(
	"Atom -> AST -> Rss",
	async () => {
		const fakeUrl = "http://world.hey.com/dhh/atom.xml";
		const cAtom1 = await parseAndValidate({ txt: dhhAtom, url: fakeUrl });
		const ast = await Atom(cAtom1, fakeUrl).toAST();
		const astJson = await computableToJson(ast);
		const cAtom2 = await Atom({}, fakeUrl).fromAST(astJson);
		assertEquals(cAtom1.data, cAtom2);
	},
));

Deno.test(skip(
	"Atom -> AST -> JsonFeed",
	async () => {
	},
));
