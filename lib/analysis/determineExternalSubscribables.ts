// import { DenoDom, path } from "dom_deno";
import * as DenoDom from "dom_deno";
import { join } from "$std/path/mod.ts";
import disocverFeedLocal from "./discoverFeedLocale.ts";

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
export const discoverOtherLinkedDomainURLs = async (
  input: IDiscoverInputType,
) => {
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
  const externalLinks = doc.querySelectorAll("a");
  const externalLinksStr = [...externalLinks].map(grabFromNode(url, "href"));

  const dedupedSet = new Set(
    [...externalLinksStr]
      // relative XXX
      // absolute start with 'http'
      // network start with '//'
      .filter((s) => s.startsWith("http") || s.startsWith("//"))
      .filter((s) => !s.match(url.hostname))
      .map((s) => {
        const u = new URL(s);
        return u.host;
      }),
  );
  return [...dedupedSet] as string[];
};

export const discoverOtherSubscribables = async (
  _urls: (string | URL)[],
): Promise<string[]> => {
  const urls = await _urls.map((u) => u instanceof URL ? u : new URL(u));
  return urls.reduce(async (p: Promise<string[]>, u: URL) => {
    return [...(await p), ...(await disocverFeedLocal({ url: u }))];
  }, Promise.resolve([]) as Promise<string[]>);
};

export default { discoverOtherLinkedDomainURLs, discoverOtherSubscribables };
