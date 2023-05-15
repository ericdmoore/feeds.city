import { assertEquals } from "$std/testing/asserts.ts";

// import { skip } from '../helpers.ts';
import { getPath, type JsonValue } from "$lib/utils/propertyPath.ts";
import { parseAndValidate } from "$lib/start.ts";
import { ASTAuthor, type ASTjson, computableToJson } from "$lib/parsers/ast.ts";
import {
  JsonFeed,
  JsonFeedAuthor,
  type RespStruct,
} from "$lib/parsers/jsonFeed.ts";

import { jsonFeed as dfbJS } from "../mocks/jsonFeed/daringFireball.ts";
import { jsonFeed as fmJS } from "../mocks/jsonFeed/flyingmeat.ts";
import { jsonFeed as hyperCrit } from "../mocks/jsonFeed/hyperCritical.ts";
import { jsonFeed as maybePizza } from "../mocks/jsonFeed/maybePizza.ts";
import { jsonFeed as shapeOf } from "../mocks/jsonFeed/shapeOf.ts";

/**
 * @param i input Mode
 * @param a Actual
 * @param e Expected
 * @param prefix declare string input - or combine with string array
 */
const assertProp = (
  i: { prop: string } | { name: string },
  a: unknown,
  e: unknown,
  prefix: string | string[] = "",
  _n?: number,
) => {
  const pre = Array.isArray(prefix) ? prefix.join(".") : prefix;

  if ("prop" in i) {
    const actual = getPath(i.prop, a as JsonValue);
    const expected = getPath(i.prop, e as JsonValue);
    try {
      assertEquals(
        actual,
        expected,
        `${pre}.${i.prop}: a: ${actual} - e:${expected}`,
      );
    } catch (er) {
      console.error(er);
      console.error({ actual: a, expected: e, prop: i.prop });
      assertEquals(
        actual,
        expected,
        `${pre}.${i.prop}: a: ${actual} - e:${expected}`,
      );
    }
  } else {
    try {
      assertEquals(a, e, `${pre} - ${i.name}: a: ${a} - e:${e}`);
    } catch (er) {
      console.error(er);
      console.error({ actual: a, expected: e, name: i.name });
      assertEquals(a, e, `${pre} - ${i.name}: a: ${a} - e:${e}`);
    }
  }
};

const compareAuthors = (
  astAuthors: typeof ASTAuthor.TYPE[],
  authors: (typeof JsonFeedAuthor.TYPE | undefined)[],
  prefix = [] as string[],
) => {
  // console.log({astAuthors, authors})

  authors.forEach((a, i) => {
    const astAuthor = astAuthors?.[i];
    assertProp({ prop: "name" }, astAuthor, a, [...prefix, "authors"], i);
    assertProp({ prop: "url" }, astAuthor, a, [...prefix, "authors"], i);
    if (a?.avatar) {
      assertEquals(a.avatar, astAuthor.imageURL);
    }
  });
};

const compareASTtoJSFheaders = (
  ast: ASTjson,
  kind: string,
  jsData: RespStruct,
) => {
  assertEquals(kind, "jsonFeed");
  assertEquals(ast._meta._type, "application/json+cityfeed");

  assertEquals(ast.title, jsData.title);
  compareAuthors(
    ast.authors,
    (jsData.authors ?? []).concat(jsData.author ? [jsData.author] : []),
    ["headers"],
  );

  jsData.favicon && assertProp({ prop: "favicon" }, ast.images, jsData);
  assertProp({ name: "feedUrl" }, ast.links.feedUrl, jsData.feed_url);
  assertProp({ name: "item len" }, ast.items.length, jsData.items.length);
};

const compareASTtoJSFitems = (ast: ASTjson, jsData: RespStruct) => {
  ast.items.forEach((astItem, i, _a) => {
    const origItem = jsData.items[i];
    assertProp({ prop: "id" }, astItem, origItem);
    assertProp({ prop: "url" }, astItem, origItem);
    assertProp({ prop: "title" }, astItem, origItem);
    assertProp({ prop: "language" }, astItem, {
      ...origItem,
      language: origItem.language ?? "en-US",
    });
    assertProp({ prop: "summary" }, astItem, origItem);

    assertProp({ prop: "images.bannerImage" }, astItem, {
      images: { bannerImage: origItem.banner_image },
    });
    assertProp({ prop: "images.indexImage" }, astItem, {
      images: { indexImage: origItem.image },
    });
    if (origItem.date_modified) {
      assertProp({ prop: "modified" }, astItem.dates, {
        modified: new Date(origItem.date_modified).getTime(),
      });
    }
    if (origItem.date_published) {
      assertProp({ prop: "published" }, astItem.dates, {
        published: new Date(origItem.date_published).getTime(),
      });
    }

    compareAuthors(
      astItem.authors,
      (origItem.authors ?? []).concat(origItem.author ? [origItem.author] : []),
      ["items"],
    );

    astItem.attachments.forEach((attached, j) => {
      const ogAttach = origItem.attachments?.[j];
      assertEquals(
        attached.durationInSeconds,
        ogAttach?.duration_in_seconds,
        "attachment.durationSecs",
      );
      assertEquals(attached.mimeType, ogAttach?.mime_type, "attachment.mime");
      assertEquals(
        attached.sizeInBytes,
        ogAttach?.size_in_bytes,
        "attachment.bytes",
      );
      assertEquals(attached.title, ogAttach?.title, "attachment.title");
      assertEquals(attached.url, ogAttach?.url, "attachment.url");
    });
  });
};

Deno.test("DFB header Values", async () => {
  const fakeUrl = "https://daringfireball.net/feeds/json";
  const c1 = await parseAndValidate({ url: fakeUrl, txt: dfbJS });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, fakeUrl).toAST(),
  );
  compareASTtoJSFheaders(ast, c1.kind, jsData);
});

Deno.test("DFB Feed Items - but no content", async () => {
  const fakeUrl = "https://daringfireball.net/feeds/json";
  const c1 = (await parseAndValidate({ url: fakeUrl, txt: dfbJS }))
    .data as RespStruct;
  const ast = await computableToJson(JsonFeed<RespStruct>(c1, fakeUrl).toAST());
  compareASTtoJSFitems(ast, c1);
});

Deno.test("FMeat header Values", async () => {
  const fakeUrl = "https://daringfireball.net/feeds/json";
  const c1 = await parseAndValidate({ url: fakeUrl, txt: fmJS });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, fakeUrl).toAST(),
  );
  compareASTtoJSFheaders(ast, c1.kind, jsData);
});

Deno.test("FMeat Item Checks <No Content>", async () => {
  const fakeUrl = "https://daringfireball.net/feeds/json";
  const c1 = (await parseAndValidate({ url: fakeUrl, txt: fmJS }))
    .data as RespStruct;
  const ast = await computableToJson(JsonFeed<RespStruct>(c1, fakeUrl).toAST());
  compareASTtoJSFitems(ast, c1);
});

Deno.test("HyperCritical Feed Headers", async () => {
  const { url, txt } = {
    txt: hyperCrit,
    url: "https://hypercritical.co/feeds/main.json",
  };
  const c1 = await parseAndValidate({ url, txt });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, url).toAST(),
  );
  compareASTtoJSFheaders(ast, c1.kind, jsData);
});

Deno.test("HyperCritical Feed Items", async () => {
  const { url, txt } = {
    txt: hyperCrit,
    url: "https://hypercritical.co/feeds/main.json",
  };
  const c1 = await parseAndValidate({ url, txt });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, url).toAST(),
  );
  compareASTtoJSFitems(ast, jsData);
});

Deno.test("MaybePizza Feed Headers", async () => {
  const { url, txt } = {
    txt: maybePizza,
    url: "http://maybepizza.com/feed.json",
  };
  const c1 = await parseAndValidate({ url, txt });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, url).toAST(),
  );
  compareASTtoJSFheaders(ast, c1.kind, jsData);
});

Deno.test(
  "MaybePizza Feed Items",
  async () => {
    const { url, txt } = {
      txt: maybePizza,
      url: "http://maybepizza.com/feed.json",
    };
    const c1 = await parseAndValidate({ url, txt });
    const jsData = c1.data as RespStruct;
    const ast = await computableToJson(
      JsonFeed<RespStruct>(c1.data, url).toAST(),
    );
    compareASTtoJSFitems(ast, jsData);
  },
);

Deno.test("ShapeOf Feed Headers", async () => {
  const { url, txt } = { txt: shapeOf, url: "http://shapeof.com/feed.json" };
  const c1 = await parseAndValidate({ url, txt });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, url).toAST(),
  );
  compareASTtoJSFheaders(ast, c1.kind, jsData);
});

Deno.test("ShapeOf Feed Items", async () => {
  const { url, txt } = { txt: shapeOf, url: "http://shapeof.com/feed.json" };
  const c1 = await parseAndValidate({ url, txt });
  const jsData = c1.data as RespStruct;
  const ast = await computableToJson(
    JsonFeed<RespStruct>(c1.data, url).toAST(),
  );
  compareASTtoJSFitems(ast, jsData);
});

Deno.test("string input will not validate", async () => {
  const wontValidate = JsonFeed("will not validate", "url");
  const rej = await wontValidate.validate().catch(() => null);
  assertEquals(rej, null);
});

Deno.test("Bad Input with no items - will not validate", async () => {
  const wontValidate = JsonFeed({}, "url");
  const rej = await wontValidate.validate().catch(() => null);
  assertEquals(rej, null);
});

Deno.test("Bad Input with items - will not validate", async () => {
  const wontValidate = JsonFeed({ items: [] }, "url");
  const rej = await wontValidate.validate().catch(() => null);
  assertEquals(rej, null);
});

Deno.test("Bad Input- will not validate", async () => {
  const wontValidate = JsonFeed({ items: [] }, "url");
  const rej = await wontValidate.validate().catch(() => null);
  assertEquals(rej, null);
});

Deno.test("null input throws", async () => {
  const wontValidate = JsonFeed(null, "url");
  const rej = await wontValidate.validate().catch(() => null);
  assertEquals(rej, null);
});
