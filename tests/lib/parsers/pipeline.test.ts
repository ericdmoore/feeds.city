import { assert, assertEquals, assertRejects } from "$std/testing/asserts.ts";
import { enhancementAdapter, loadFeed } from "$lib/parsers/index.ts";
import { jsonFeed as dfjsf } from "../mocks/jsonFeed/daringFireball.ts";
import { addHash } from "$lib/enhancements/addHash/addHash.ts";

const daringFireball = {
  url: "https://daringfireball.net/feeds/json",
  txt: dfjsf,
};

Deno.test("Bad URL gets Rejected", () => {
  const rssAddress = "Not a URL";
  assertRejects(
    () =>
      loadFeed()
        .fromURL(rssAddress)
        .toJsonFeed(),
    "BAD URL gets rejected",
  );
});

Deno.test("Load Enhancement from URL", async () => {
  
  const resp = await loadFeed()
    .fromString(daringFireball.txt, daringFireball.url)
    .use(
      "https://denopkg.com/ericdmoore/feeds.city@master/lib/enhancements/addHash/run.ts",
    )
    .toJsonFeed({ exportingParam: null });

  assert(resp.string, "string version of the AST must be in the response");
  assert(resp.messages, "Error Messages MUST be in the response");
  assert(resp.warnings, "Warning Messagae MUST be in the response");

  assert(resp.ast, "AST must be in the response");
  assert(resp.ast.title);
  assert(resp.ast.description);
  assert(resp.ast.language);
  assert(resp.ast._meta);
  assert(resp.ast.images);
  assert(resp.ast.links);
  assert(resp.ast.paging);
  assert(resp.ast.entitlements);
  assert(resp.ast.authors);
  assert(resp.ast.items);
});

Deno.test("Load Enhancement from URL", async () => {
  
  const resp = await loadFeed()
    .fromString(daringFireball.txt, daringFireball.url)
    .use(
      "https://denopkg.com/ericdmoore/feeds.city@master/lib/enhancements/addHash/run.ts",
    )
    .use(
      "https://denopkg.com/ericdmoore/feeds.city@master/lib/enhancements/NOTAMODULE/run.ts",
    )
    .toJsonFeed({ exportingParam: null });

  assert(resp.string, "string version of the AST must be in the response");
  assert(resp.messages, "Error Messages MUST be in the response");
  assert(resp.warnings, "Warning Messagae MUST be in the response");

  assert(resp.ast, "AST must be in the response");
  assert(resp.ast.title);
  assert(resp.ast.description);
  assert(resp.ast.language);
  assert(resp.ast._meta);
  assert(resp.ast.images);
  assert(resp.ast.links);
  assert(resp.ast.paging);
  assert(resp.ast.entitlements);
  assert(resp.ast.authors);
  assert(resp.ast.items);
});


Deno.test("Fetch the original jsonfeed using inline string", async () => {
  const resp = await loadFeed()
    .fromString(daringFireball.txt, daringFireball.url)
    .toJsonFeed({ exportingParam: null });

  assert(resp.string, "string version of the AST must be in the response");
  assert(resp.messages, "Error Messages MUST be in the response");
  assert(resp.warnings, "Warning Messagae MUST be in the response");

  assert(resp.ast, "AST must be in the response");
  assert(resp.ast.title);
  assert(resp.ast.description);
  assert(resp.ast.language);
  assert(resp.ast._meta);
  assert(resp.ast.images);
  assert(resp.ast.links);
  assert(resp.ast.paging);
  assert(resp.ast.entitlements);
  assert(resp.ast.authors);
  assert(resp.ast.items);
});

Deno.test("Fetch the original jsonfeed", async () => {
  const resp = await loadFeed()
    .fromURL("https://www.jsonfeed.org/feed.json")
    .toCity()
    .catch((er) => {
      console.error("er caught:: ", er);
      return null;
    });

  if (resp) {
    console.log("resp.ast:: ", resp.ast);
    assert(resp);
    assert(resp.ast);
  } else {
    assert(
      resp,
      "the corresponding data from the jsonfeed.org site should be defined",
    );
  }
});

Deno.test("a USE call with the ASTChainFunc Adapter", async () => {
  const resp = await loadFeed()
    .fromString(daringFireball.txt, daringFireball.url)
    .use(enhancementAdapter(addHash))
    .toJsonFeed()
    .catch((er) => {
      console.error("er caught:: ", er);
      return null;
    });

  if (resp) {
    console.log("resp.ast:: ", resp.ast);
    assert(resp);
    assert(resp.ast);
    resp.ast.items?.forEach((item) => {
      assert(item.content.source?.t);
      assert(item.content.source?.from);
      assert(item.content.source?.url);
      assert(item.content.source?.hash);
    });
  } else {
    assert(
      resp,
      "the corresponding data from the jsonfeed.org site should be defined",
    );
  }
});

Deno.test("data + config", () => {
  const jsonFeedURL = "https://daringfireball.net/feeds/json";

  const state = loadFeed()
    .fromString(dfjsf, jsonFeedURL)
    .use("https://denopkg.com/ericdmoore/deno-xml-parser/mod.ts")
    .data({ a: "Hey", b: true, c: [1, 2, 3] })
    .config({ key: "value", key2: "value2" })
    .state();

  assertEquals(state?.data?.a, "Hey");
  assertEquals(state?.config?.key, "value");
});

Deno.test("init via extracted state", () => {
  const state1 = loadFeed()
    .fromString(dfjsf, "https://daringfireball.net/feeds/json")
    .use("https://denopkg.com/ericdmoore/deno-xml-parser/mod.ts")
    .data({ a: "Hey", b: true, c: [1, 2, 3] })
    .config({ key: "value", key2: "value2" })
    .state();

  const state2 = loadFeed(state1)
    .fromString("", "")
    .state();

  assertEquals(state1.enhancements, state2.enhancements);
  assertEquals(state1.data, state2.data);
  assertEquals(state1.config, state2.config);
});

Deno.test("USE call with URL", async () => {
  const jsonFeedURL = "https://daringfireball.net/feeds/json";

  const resp = await loadFeed()
    .fromString(dfjsf, jsonFeedURL)
    .toJsonFeed();

  if (resp) {
    console.log(resp);
    assert(resp);
  } else {
    assert(
      resp,
      "the corresponding data from the jsonfeed.org site should be defined",
    );
  }
});
