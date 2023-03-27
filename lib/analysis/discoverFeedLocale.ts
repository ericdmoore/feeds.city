import * as DenoDom from "dom_deno";
import { join } from "$std/path/mod.ts";

// import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";

const grabFromNode =
  (initURL: URL, propName: string) => (n: unknown): string => {
    const _n = n as { attributes: { [key: string]: string } };
    return (_n.attributes?.[propName] ?? "").startsWith("http")
      ? _n.attributes?.[propName]
      : join(initURL.href, _n.attributes?.[propName]);
  };

type IDiscoverInputType = { url: string | URL; body?: PromiseLike<string> };

/**
 * @param inputUrl
 * @returns
 */
export const discoverSelfFeed = async (input: IDiscoverInputType) => {
  let inputPageText: string;
  const url = typeof input.url === "string" ? new URL(input.url) : input.url;

  if (input.body) {
    inputPageText = await input.body;
  } else {
    inputPageText = await (await fetch(url.href)).text();
  }

  const doc = new DenoDom.DOMParser().parseFromString(
    inputPageText,
    "text/html",
  )!;

  const rssAlts = doc.querySelectorAll('link[type="application/rss+xml" i]');
  const atomAlts = doc.querySelectorAll('link[type="application/atom+xml" i]');
  const clickableRss = doc.querySelectorAll('a[href*="rss.xml" i]');
  const clickableAtom = doc.querySelectorAll('a[href*="atom.xml" i]');

  const atomAltPaths = [...atomAlts].map(grabFromNode(url, "href"));
  const rssAltPaths = [...rssAlts].map(grabFromNode(url, "href"));
  const atomPaths = [...clickableAtom].map(grabFromNode(url, "href"));
  const rssPaths = [...clickableRss].map(grabFromNode(url, "href"));

  return [...atomAltPaths, ...rssAltPaths, ...atomPaths, ...rssPaths];
};

export default discoverSelfFeed;
