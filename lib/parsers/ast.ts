import type { IDictValidPayloadTypes, ISupportedTypes } from "../start.ts";
import type { ASTShell, IValidate, PromiseOr } from "../types.ts";
import * as s from "superstruct";
import * as rss from "./rss.ts";
import * as jsonFeed from "./jsonFeed.ts";
import * as sitemap from "./sitemap.ts";
import * as atom from "./atom.ts";

const {
  type,
  object,
  union,
  string,
  optional,
  array,
  enums,
  partial,
  number,
  nonempty,
  define,
  record,
  unknown,
  literal,
  nullable,
} = s;

type ThunkType<T> = () => Promise<T>;

export const validatedInputToAst = async (
  preValidatecdInput: IDictValidPayloadTypes,
  url: string,
): Promise<AST> => {
  switch (preValidatecdInput.kind) {
    case "atom":
      return await atom.Atom(preValidatecdInput.data, url).toAST();
    case "rss":
      return await rss.Rss(preValidatecdInput.data, url).toAST();
    case "jsonFeed":
      return await jsonFeed.JsonFeed(preValidatecdInput.data, url).toAST();
    case "sitemap":
      return await sitemap.Sitemap(preValidatecdInput.data, url).toAST();
    default:
      return {} as never;
  }
};

export const astShell = async (
  parser: IValidate<ISupportedTypes>,
  url: string,
  ast?: ASTcomputable,
  pos: { cur: number; pageSize: number } = { cur: 0, pageSize: 50 },
): Promise<ASTShell> => {
  return {
    ast: ast ?? await parser.toAST(),
    parserData: parser._,
    pos: {
      cur: 2,
      pageSize: 50,
      total: 234,
      remaining: 234 - 2,
    },
    items: {
      stream: (): ReadableStream<typeof ASTFeedItemJson.TYPE[]> => {
        return new ReadableStream<typeof ASTFeedItemJson.TYPE[]>();
      },
      iter: async function* (): AsyncGenerator<typeof ASTFeedItemJson.TYPE[]> {
        let nextP = await parser.next();
        let ast = await parser.clone(nextP.val, parser.url).toAST();
        while (nextP.canNext) {
          yield ast.item.list as typeof ASTFeedItemJson.TYPE[];
          nextP = await parser.next();
          ast = await parser.clone(nextP.val, parser.url).toAST();
        }
        return ast.item.list;
      },
      all: () => {
        return Promise.resolve([] as typeof ASTFeedItemJson.TYPE[]);
      },
    },
    page: {
      next: async () => {
        const { val } = await parser.next();
        ast = await parser.clone(val, url).toAST();
        return astShell(parser, url, ast, pos);
      },
      prev: async () => {
        const { val } = await parser.prev();
        ast = await parser.clone(val, url).toAST();
        return astShell(parser, url, ast, pos);
      },
    },
    use: async (fns) => {
      return fns.reduce(
        async (p, f) => f(await p),
        astShell(
          parser,
          url,
          ast ?? await parser.toAST(),
          pos,
        ),
      );
    },
    toXML: () => {
      // ast ? parser.fromAST(ast).toXml() : parser.
      return "";
    },
  };
};

const Thunk = <T>() =>
  define(
    "thunk",
    (value: unknown) =>
      typeof value === "function" || value instanceof Function,
  ) as s.Struct<() => Promise<T>, null>;
const StrThunk = Thunk<string>();
const eitherThunkOr = <T, S>(type: s.Struct<T, S>) => union([type, StrThunk]);

const EventNames = enums([
  "read",
  "share",
  "send",
  "rated",
  "reviewed",
  "replied",
]);
const EventLifecycle = enums([
  "alpha",
  "beta",
  "active",
  "sunset",
  "deprecated",
]);

export const EventStreamKind = object({
  event: EventNames,
  refUrl: string(),
  jsonSchemaUrl: string(),
  status: object({
    label: EventLifecycle,
    start: optional(union([Thunk<number>(), number()])),
    end: optional(union([Thunk<number>(), number()])),
  }),
});

//@todo add default docs
export const eventDefinition = (
  name: typeof EventNames.TYPE,
  status: { name: typeof EventLifecycle.TYPE; start?: number; end?: number },
  urls?: { ref?: string; schema?: string },
): typeof EventStreamKind.TYPE => ({
  event: name,

  jsonSchemaUrl: urls?.schema ?? "",
  refUrl: urls?.ref ?? "",
  status: {
    label: status.name,
    start: status.start ?? new Date(2020, 0, 1).getTime(),
    end: status.end ?? new Date(2030, 11, 31).getTime(),
  },
});

export const ASTSource = type({
  t: number(),
  url: string(),
  hash: string(),
  from: enums([
    "html",
    "text",
    "markdown",
    "article",
    "raw",
    "blend",
    "unknown",
  ]),
});

export const ASTAuthor = type({
  name: string(),
  url: optional(string()),
  email: optional(string()),
  imageURL: optional(string()),
});

const ASTAuthorComputable = type({
  name: eitherThunkOr(string()),
  url: optional(eitherThunkOr(string())),
  email: optional(eitherThunkOr(string())),
  imageURL: optional(eitherThunkOr(string())),
});

const ASTAttachment = type({
  url: string(),
  mimeType: string(),
  title: optional(string()),
  sizeInBytes: optional(number()),
  durationInSeconds: optional(number()),
});

const ASTimages = partial(type({
  icon: string(),
  bannerImage: string(),
  favicon: string(),
}));

const ASTpaging = type({
  nextUrl: optional(string()),
  prevUrl: optional(string()),
  itemCount: number(),
});

const ASTlinks = type({
  sourceURL: string(),
  homeUrl: string(),
  feedUrl: string(),
  list: array(type({
    href: string(),
    hreflang: optional(string()),
    rel: optional(string()),
    type: optional(string()),
  })),
});

const ASTFeedMeta = partial(type({
  generator: partial(type({
    name: string(),
    url: string(),
    version: string(),
  })),
}));

// @todo: need more documentation on use cases here;
// with some elapsed time, my memory is hazy on how this was going to work.
//
// I think it was to support paid, and private city - content
// each site might have a different process to handle paid content,
// unless it is a city feed - which will need to follow the spec.
const ASTEntitlement = type({
  serverUrl: string(),
  forKinds: array(string()),
  tokenData: optional(
    record(
      string(),
      nullable(string()),
    ),
  ),
});

const ItemContent = object({
  html: optional(string()),
  text: optional(string()),
  markdown: optional(string()),
  raw: optional(string()),
  article: optional(string()),
  source: optional(ASTSource),
});

const ItemLinks = type({
  category: optional(string()),
  nextPost: optional(string()),
  prevPost: optional(string()),
  tags: array(string()),
  externalURLs: array(string()),
  relLinks: record(string(), record(string(), string())),
});

const ItemImages = object({
  indexImage: optional(string()),
  bannerImage: optional(string()), // layout above the post
});
const ItemDates = object({
  published: number(),
  modified: number(),
  expiresOn: optional(number()),
});

export const ASTFeedItemJson = type({
  id: string(), // can also be the permalink
  url: string(), // permalink
  language: optional(string()),
  title: optional(string()),
  summary: optional(string()),
  expires: optional(number()),
  content: ItemContent,
  images: ItemImages,
  dates: ItemDates,
  links: ItemLinks,
  attachments: array(ASTAttachment),
  authors: nonempty(array(ASTAuthor)),

  _: optional(record(string(), unknown())), // for what?
  _rss: optional(record(string(), unknown())),
  _atom: optional(record(string(), unknown())),
  _sitemap: optional(record(string(), unknown())),
  __analysis: optional(record(string(), record(string(), unknown()))),
  __enhancement: optional(record(string(), record(string(), unknown()))),
});

export type ASTFeedItemJsonTYPE = typeof ASTFeedItemJson.TYPE;

export const ASTFeedItemThunk = type({
  id: eitherThunkOr(string()), // can also be the permalink
  url: eitherThunkOr(string()), // permalink

  language: optional(eitherThunkOr(string())),
  title: optional(eitherThunkOr(string())),
  summary: optional(eitherThunkOr(string())),
  expiresIn: optional(union([Thunk<number>(), number()])),
  content: union([ItemContent, Thunk<s.Infer<typeof ItemContent>>()]),
  images: union([ItemImages, Thunk<s.Infer<typeof ItemImages>>()]),
  dates: union([ItemDates, Thunk<s.Infer<typeof ItemDates>>()]),
  links: union([ItemLinks, Thunk<s.Infer<typeof ItemLinks>>()]),
  attachments: union([
    array(ASTAttachment),
    Thunk<s.Infer<typeof ASTAttachment>[]>(),
  ]),
  authors: union([
    nonempty(array(ASTAuthorComputable)),
    Thunk<s.Infer<typeof ASTAuthorComputable>[]>(),
  ]),

  _rss: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  _atom: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  _sitemap: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  __analysis: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  __enhancement: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
});

const ASTmeta = <T, S>(t: s.Struct<T, S>) =>
  type({
    _type: t,
    version: string(),
    reference: string(),
    source: ASTSource,
    comment: optional(string()),
  });

export const ASTKindJson = type({
  _meta: ASTmeta(
    literal("application/json+cityfeed") as s.Struct<
      "application/json+cityfeed",
      "application/json+cityfeed"
    >,
  ),
  title: string(),
  description: string(),
  language: string(),

  authors: nonempty(array(ASTAuthor)),
  images: ASTimages,
  paging: ASTpaging,

  links: ASTlinks,

  entitlements: array(ASTEntitlement),
  copyrights: optional(string()),

  sourceFeedMeta: ASTFeedMeta,
  items: array(ASTFeedItemJson),

  eventStreamFromViewer: optional(object({
    tokenData: string(),
    feedEvents: optional(nonempty(array(EventStreamKind))),
  })),

  _rss: optional(record(string(), unknown())), // [tagName]: value
  _atom: optional(record(string(), unknown())),
  _sitemap: optional(record(string(), unknown())),

  __analysis: optional(record(string(), unknown())), // [pluginName]: {someObject or value}
  __enhancement: optional(record(string(), unknown())), // [pluginName]: {someObject or value}
});

const ASTmetaComputable = ASTmeta(
  literal("computable") as s.Struct<"computable", "computable">,
);

export const ASTKindComputable = object({
  title: eitherThunkOr(string()),
  description: eitherThunkOr(string()),
  language: eitherThunkOr(string()),

  _meta: union([ASTmetaComputable, Thunk<s.Infer<typeof ASTmetaComputable>>()]),

  authors: union([
    Thunk<s.Infer<typeof ASTAuthor>[]>(),
    nonempty(array(ASTAuthor)),
  ]),
  images: union([ASTimages, Thunk<s.Infer<typeof ASTimages>>()]),
  paging: union([ASTpaging, Thunk<s.Infer<typeof ASTpaging>>()]),
  copyrights: optional(string()),

  entitlements: union([
    array(ASTEntitlement),
    Thunk<s.Infer<typeof ASTEntitlement>[]>(),
  ]),
  links: union([ASTlinks, Thunk<s.Infer<typeof ASTlinks>>()]),
  sourceFeedMeta: union([ASTFeedMeta, Thunk<typeof ASTFeedMeta.TYPE>()]),

  item: object({
    next: Thunk<typeof ASTFeedItemThunk.TYPE[]>(),
    list: union([
      array(ASTFeedItemThunk),
      Thunk<typeof ASTFeedItemThunk.TYPE[]>(),
    ]),
  }),

  eventStreamFromViewer: optional(object({
    tokenData: eitherThunkOr(string()),
    feedEvents: optional(nonempty(array(EventStreamKind))),
  })),
  _rss: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  _atom: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  _sitemap: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  __analysis: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
  __enhancement: optional(
    union([record(string(), unknown()), Thunk<Record<string, unknown>>()]),
  ),
});

// deno-lint-ignore require-await
export const rezVal = async <T>(i: T | ThunkType<T>) =>
  typeof i === "function" ? (i as ThunkType<T>)() : i;

export const isAstJson = (ast: ASTcomputable | ASTjson): ast is ASTjson => {
  return typeof ast._meta === "function" || ast._meta._type === "computable"
    ? false
    : true;
};

export const isAstComputable = (
  ast: ASTcomputable | ASTjson,
): ast is ASTcomputable => !isAstJson(ast);

export const jsonToComputable = async (
  _ast: PromiseOr<ASTcomputable | ASTjson>,
): Promise<ASTcomputable> => {
  const ast = await _ast as ASTcomputable | ASTjson;
  if (isAstJson(ast)) {
    return {
      ...ast,
      _meta: {
        _type: "computable",
        reference:
          "https://github.com/ericdmoore/feedBarber/wiki/AST-Reference",
        version:
          "https://github.com/ericdmoore/feedBarber/wiki/AST.v2022-08-01",
        source: ast._meta.source,
      },
      item: {
        next: async () =>
          ast.paging.nextUrl ? (await fetch(ast.paging.nextUrl)).json() : [],
        list: ast.items,
      },
    };
  } else {
    return ast;
  }
};

type ThunkOrJsonAST = ASTcomputable | ASTjson;
export const computableToJson = async (
  _ast: PromiseOr<ThunkOrJsonAST>,
): Promise<ASTjson> => {
  const ast = await _ast;
  if (isAstJson(ast)) {
    return ast;
  } else {
    const [
      _meta,
      _images,
      _links,
      _paging,
      _item,
    ] = await Promise.all([
      rezVal(ast._meta),
      rezVal(ast.images),
      rezVal(ast.links),
      rezVal(ast.paging),
      rezVal(ast.item),
    ]);
    const _list = await rezVal(_item.list);

    return {
      title: await rezVal(ast.title),
      description: await rezVal(ast.description),
      language: await rezVal(ast.language),
      _meta: {
        _type: "application/json+cityfeed",
        reference: _meta.reference,
        version: _meta.version,
        comment: _meta.comment ?? "",
        source: _meta.source,
      },
      images: {
        bannerImage: _images.bannerImage,
        favicon: _images.favicon,
        icon: _images.icon,
      },
      links: {
        feedUrl: _links.feedUrl,
        homeUrl: _links.homeUrl,
        list: _links.list,
        sourceURL: _links.sourceURL,
      },
      paging: {
        itemCount: _paging.itemCount,
        nextUrl: _paging.nextUrl,
        prevUrl: _paging.prevUrl,
      },
      entitlements: await rezVal(ast.entitlements),
      authors: await rezVal(ast.authors),
      sourceFeedMeta: await rezVal(ast.sourceFeedMeta),
      items: await Promise.all((_list ?? []).map(async (i) => {
        const [
          content,
          links,
          images,
          dates,
        ] = await Promise.all([
          rezVal(i.content),
          rezVal(i.links),
          rezVal(i.images),
          rezVal(i.dates),
        ]);

        // console.log({content})

        return {
          title: await rezVal(i.title),
          summary: await rezVal(i.summary),
          language: await rezVal(i.language),
          url: await rezVal(i.url),
          id: await rezVal(i.id),
          authors: await rezVal(i.authors),
          expiresIn: await rezVal(i.expiresIn),
          attachments: await rezVal(i.attachments),
          content: {
            html: content.html,
            markdown: content.markdown,
            text: content.text,
            article: content.article,
            raw: content.raw,
            source: content.source,
          },
          images: {
            bannerImage: images.bannerImage,
            indexImage: images.indexImage,
          },
          dates: {
            published: dates.published,
            modified: dates.modified,
          },
          links: {
            category: links.category,
            nextPost: links.nextPost,
            prevPost: links.prevPost,
            tags: links.tags ?? [],
            externalURLs: links.externalURLs ?? [],
            relLinks: links.relLinks ?? {},
          },
        } as s.Infer<typeof ASTFeedItemJson>;
      })),
    } as ASTjson;
  }
};

export type ASTjson = s.Infer<typeof ASTKindJson>;
export type ASTcomputable = s.Infer<typeof ASTKindComputable>;

export type ASTFactory = (input: ASTcomputable | ASTjson) => Promise<ASTjson>;
// deno-lint-ignore no-explicit-any
export type ASTkickstart = (...i: any[]) => Promise<ASTcomputable | ASTjson>;
export type AST = ASTcomputable;
