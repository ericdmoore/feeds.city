import type { TypedValidator } from "../start.ts";
import type { IValidate } from "../types.ts";
import { ASTcomputable, ASTjson, computableToJson } from "../parsers/ast.ts";
import { JSONStruct, removeUndef } from "./helpers/removeUndef.ts";
import * as s from "superstruct";
import * as toXml from "toXml";

import {
  _text,
  _typedText,
  Generator,
  InnerText,
  TextOrHTML,
  txtorCData,
  TypedInnerText,
} from "./helpers/composedPrimitives.ts";

const { union, define, partial, object, string, array, literal, optional } = s;

const Encoding = define<"utf-8">(
  "Encoding",
  (s: unknown) => ["utf-8"].includes((s as string).toLowerCase()),
);

const Title = TypedInnerText;
const Subitle = TypedInnerText;
const ID = InnerText;

const Author = partial(object({
  name: partial(object({
    _text: string(), // prefer
    _cdata: string(),
  })),
  uri: partial(object({
    _text: string(), // prefer
    _cdata: string(),
  })),
  email: partial(object({
    _text: string(), // prefer
    _cdata: string(),
  })),
}));

export const Link = object({
  _attributes: partial(object({
    rel: string(),
    type: string(),
    hreflang: string(),
    href: string(),
  })),
});

export const Content = object({
  _attributes: object({
    type: TextOrHTML,
    "xml:base": optional(string()),
  }),
  _text: optional(string()),
  _cdata: optional(string()), //*
});

const Summary = Content;

const LinkSet = array(Link);

const LinkOrLinkSet = union([Link, LinkSet]);

// const MaybePersonOrSting = optional(union([string(), PersonKind]));

export const EntryKind = object({
  id: ID,
  title: union([Title, TypedInnerText]),
  link: LinkOrLinkSet,
  published: optional(InnerText),
  updated: optional(InnerText),
  author: optional(Author),
  summary: optional(Summary),
  content: optional(Content),
  _attributes: optional(object({
    // xmlns: literal("http://www.w3.org/2005/Atom"),
    "xml:lang": optional(string()), //* default to?? 'en-US' | 'en'
  })),
  // name: optional(string()),
  // email: optional(string()),
  // uri: optional(string()),
});

export const AtomFeedKind = object({
  title: Title,
  updated: InnerText,
  link: LinkOrLinkSet,
  entry: array(EntryKind),
  _attributes: optional(object({
    xmlns: literal("http://www.w3.org/2005/Atom"),
    "xml:lang": optional(string()), //* default to?? 'en-US' \ 'en'
  })),
  id: optional(ID),
  generator: optional(union([InnerText, Generator])),
  icon: optional(InnerText),
  logo: optional(InnerText),
  subtitle: optional(Subitle),
  author: optional(Author),
  contributor: optional(array(Author)),
  category: optional(array(string())),
  rights: optional(InnerText),
});

export const AtomResponse = object({
  _declaration: object({
    _attributes: object({
      version: string(),
      encoding: Encoding,
    }),
  }),
  feed: AtomFeedKind,
});

type ValidationReturn<T> =
  | ValidationReturnClean<T>
  | ValidationReturnWithErr<T>;
type ValidationReturnClean<T> = [null, T];
type ValidationReturnWithErr<T> = [s.StructError, T | null];

type ValidationError = s.StructError | undefined;

export type RespStruct = typeof AtomResponse.TYPE;
// export type AtomValidator = IValidate<RespStruct> extends IValidate

const pickURL = (fallback: string, link: typeof LinkOrLinkSet.TYPE) => {
  return Array.isArray(link)
    ? link.filter((l: s.Infer<typeof Link>) => l._attributes.rel === "self")[0]
      ._attributes.href ??
      fallback
    : link._attributes.href ?? fallback;
};

export const ChannelSideCar = object({
  _declaration: optional(object({
    _attributes: object({
      encoding: string(),
      version: string(),
    }),
  })),
  feed: object({
    _attributes: object({
      "xml:lang": string(),
      xmlns: string(),
    }),
  }),
});

export const ItemSideCar = object({});

export const Atom = ((
  compactParse: RespStruct | unknown,
  url: string,
  // originalText?: string
): IValidate<RespStruct> => {
  const structs = {
    feed: AtomFeedKind,
    response: AtomResponse,
  };

  return {
    url,
    inputKind: "atom",
    clone: Atom,
    _: compactParse as RespStruct,
    paginateFrom: (pos = 0, offset = 50) => {
      console.log({ pos, offset });
      return Promise.resolve({
        val: compactParse as RespStruct,
        canPrev: false,
        canNext: false,
      });
    },
    prev: () =>
      Promise.resolve({
        val: compactParse as RespStruct,
        canNext: false,
        canPrev: false,
      }),
    next: () =>
      Promise.resolve({
        val: compactParse as RespStruct,
        canNext: false,
        canPrev: false,
      }),
    validate: (): Promise<RespStruct> => {
      let err: ValidationError;
      let validated: unknown;

      if (typeof compactParse === "string") {
        return Promise.reject({
          error: true,
          compactParse,
          err: new Error().stack,
          reason: `parse before validating`,
        });
      }

      if ((compactParse as typeof AtomResponse.TYPE).feed) {
        [err, validated] = structs.response.validate(compactParse, {
          coerce: true,
        });

        if (validated) {
          return Promise.resolve(validated as typeof AtomResponse.TYPE);
        } else if (err) {
          return Promise.reject({
            error: true,
            compactParse,
            reason: `Atom: validation application error : ${err}`,
            err,
          });
        } else {
          return Promise.reject({
            error: true,
            compactParse,
            reason: `Atom: validation application error`,
            err: new Error().stack,
          });
        }
      } else {
        return Promise.reject({
          error: true,
          compactParse,
          reason:
            `Atom: string structure lacks a feed tag within the xml to parse`,
          err: new Error().stack,
        });
      }
    },
    fromAST: async (_ast: ASTcomputable | ASTjson): Promise<RespStruct> => {
      const ast = await computableToJson(_ast);
      return {
        _declaration: (ast._atom as s.Infer<typeof ChannelSideCar>)
          ?._declaration,
        feed: {
          _attributes:
            (ast._atom as s.Infer<typeof ChannelSideCar>)?.feed._attributes,
          title: _typedText(ast.title),
          subtitle: _typedText(ast.description),
          link: ast.links.list.map((l) => {
            return {
              _attributes: {
                rel: l.rel,
                href: l.href,
                type: l.type,
                hreflang: l.hreflang,
              },
            };
          }),
          updated: _text(
            Math.max(
              ...ast.items.map((i) => {
                const p = i.dates?.published ?? 0;
                const m = i.dates?.modified ?? 0;
                return m > p ? m : p;
              }),
            ).toString(),
          ),
          ...(ast.authors?.[0]
            ? {
              author: {
                email: _typedText(ast.authors[0].email),
                name: _typedText(ast.authors[0].name),
                uri: _typedText(ast.authors[0].url),
              },
            }
            : {}),
          ...(ast._atom?.contributors
            ? {
              contributor: (ast._atom?.contributors as (typeof Author.TYPE)[])
                ?.map((c) => {
                  return {
                    email: _typedText(c.email?._text ?? c.email?._cdata),
                    name: _typedText(c.name?._text ?? c.name?._cdata),
                    uri: _typedText(c.uri?._text ?? c.uri?._cdata),
                  };
                }),
            }
            : {}),
          category: [] as string[],
          icon: _text(ast.images.favicon),
          logo: _text(ast.images.icon),
          id: _text(ast.links.feedUrl),
          rights: _text(ast._rss?.rights as string | undefined),
          entry: ast.items.map((i) => {
            return {
              _attributes: { "xml:lang": "en-US" },
              title: _typedText(i.title),
              summary: _typedText(i.summary),

              link: {
                _attributes: { href: "", hreflang: "", rel: "", type: "" },
              },
              updated: _text(new Date(i.dates?.modified ?? 0).toISOString()),
              id: _text(i.id),

              author: {
                name: _text(i.authors?.[0].name),
                email: _text(i.authors?.[0].email),
                uri: { _text: "" },
              },
              content: { _attributes: { type: "html" }, _text: "", _cdata: "" },
              published: { _text: "" },
            };
          }),
        },
      } as RespStruct;
    },
    toString: () => {
      return toXml.js2xml(
        removeUndef(compactParse as JSONStruct) as Record<string, unknown>,
        { compact: true },
      );
    },
    toAST: async (): Promise<ASTcomputable> => {
      const c = await compactParse as RespStruct;
      console.log("atom#toAST printing compactform", c);
      return {
        _meta: {
          _type: "computable",
          version: "",
          reference: "",
          source: {
            url: url,
            t: Date.now(),
            hash: "",
            from: "",
          },
        },
        title: txtorCData(">> no title << ", c.feed?.title),
        description: txtorCData(">> no description <<", c.feed?.subtitle),
        language: c.feed?._attributes?.["xml:lang"] ?? "en-US",
        authors: [{
          name: txtorCData("_missing name", c.feed?.author?.name),
          url: txtorCData("_missing url", c.feed?.author?.uri),
          email: txtorCData("_missing email", c.feed?.author?.email),
        }],
        images: {
          favicon: txtorCData("_missing logo", c.feed?.logo),
          icon: txtorCData("_missing logo", c.feed?.logo),
          bannerImage: txtorCData("_missing logo", c.feed?.logo),
        },
        links: () => {
          const links = Array.isArray(c.feed?.link)
            ? c.feed?.link
            : [c.feed?.link];
          const homeUrl =
            links.filter((l) => l?._attributes.rel === "alternate")[0]
              ?._attributes?.href ?? "";
          const sourceURL =
            links.filter((l) => l?._attributes.rel === "self")[0]?._attributes
              ?.href ?? "";
          const feedUrl =
            links.filter((l) => l?._attributes.rel === "self")[0]?._attributes
              ?.href ?? "";
          return Promise.resolve({
            feedUrl,
            homeUrl,
            sourceURL,
            list: links.map((l) => {
              return {
                href: l?._attributes.href ?? "",
                hreflang: l?._attributes.hreflang ?? "",
                rel: l?._attributes.rel ?? "",
                type: l?._attributes.type ?? "",
              };
            }),
          });
        },
        paging: {
          itemCount: c.feed?.entry?.length,
          nextUrl: undefined,
          prevUrl: undefined,
        },
        _atom: {},
        entitlements: [],
        sourceFeedMeta: {
          generator: {
            name: txtorCData("?gen.name", c?.feed?.generator),
            url: txtorCData("?gen.url", c?.feed?.generator),
            version: txtorCData("?gen.version", c?.feed?.generator),
          },
        },
        item: {
          next: async () => await [],
          list: (c.feed?.entry ?? []).map((i: s.Infer<typeof EntryKind>) => ({
            id: i.id?._text ?? pickURL(">> no link provided", i.link),
            url: pickURL(">> no link provided", i.link),
            title: txtorCData("", i.title),
            summary: i.summary?._cdata ?? i.summary?._text ??
              ">> no summary <<",
            language: i._attributes?.["xml:lang"] ?? "en-US",
            authors: [{
              name: txtorCData("", i.author?.name),
              email: txtorCData("", i.author?.email),
              url: txtorCData("", i.author?.uri),
            }],
            links: {
              category: "uncategorized",
              nextPost: "",
              prevPost: "",
              tags: [],
              externalURLs: [],
              relLinks: {},
            },
            content: {
              html: i.content?._attributes.type === "html"
                ? i.content?._text
                : i.content?._cdata,
              text: i.content?._attributes.type === "html"
                ? undefined
                : i.content?._text,
              makrdown: "",
            },
            dates: {
              modified: i.updated?._text
                ? new Date(i.updated._text).getTime()
                : Date.now(),
              published: i.published?._text
                ? new Date(i.published._text).getTime()
                : Date.now(),
            },
            images: {
              bannerImage: "",
              indexImage: "",
            },
            attachments: [],
            expires: undefined,
            _atom: {},
          })),
        },
      };
    },
  };
}) as TypedValidator;
