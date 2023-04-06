import { skip } from "../helpers.ts";
import { sitemap as flyingMeatSite } from "../mocks/sitemaps/flyingmeat.ts";
import { parseAndValidate } from "$lib/start.ts";
import { computableToJson } from "$lib/parsers/ast.ts";
import { RespStruct, Sitemap } from "$lib/parsers/sitemap.ts";
import { assertEquals } from "$std/testing/asserts.ts";

Deno.test(skip(
  "Sitemap -> AST -> Sitemap",
  async () => {
    const fakeUrl = "https://world.hey.com/dhh/sitemap.xml";
    const c1 = await parseAndValidate({ url: fakeUrl, txt: flyingMeatSite });
    const ast = await Sitemap(c1.data, fakeUrl).toAST();
    const astJson = await computableToJson(ast);
    const c2 = await Sitemap<RespStruct>({}, fakeUrl).fromAST(astJson);
    assertEquals(c1.data, c2);
  },
));

Deno.test(skip(
  "Sitemap -> AST -> Rss",
  async () => {},
));

Deno.test(skip(
  "Sitemap -> AST -> JsonFeed",
  async () => {},
));
