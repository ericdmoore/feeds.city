import { assert, assertEquals, assertRejects } from "$std/testing/asserts.ts";

import loadFeed from "$lib/parsers/index.ts";

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

Deno.test("Fetch the original jsonfeed", async () => {
  const jsonFeedURL = "https://www.jsonfeed.org/feed.json";
  
  const resp = await loadFeed()
    .fromURL(jsonFeedURL)
    .toJsonFeed()
    .catch((er) => {
      console.error('er caught:: ', er);
      return null;
    });

  if (resp) {
    assertEquals(resp.ast._meta._type, "application/json+cityfeed");
    assertEquals(resp.ast._meta.version, "application/json+cityfeed");

    assert("title" in resp.ast, "AST Should have a title ");
    assert("icon" in resp.ast, "AST Should have a icon");
    assert("home_page_url" in resp.ast, "AST Should have a home_page_url");
    assert("feed_url" in resp.ast, "AST Should have a feed_url");
  } else {
    assert(resp, 'the corresponding data from the jsonfeed.org site should be defined');
  }
});
