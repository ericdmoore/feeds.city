// deno-lint-ignore-file require-await
import type { ASTcomputable, ASTjson } from "./ast.ts";
import type { TypedValidator } from "../start.ts";
import * as superstruct from "superstruct";
import * as toXml from "toXml";
import { IValidate } from "../types.ts";
import { computableToJson } from "./ast.ts";
import { InnerText } from "./helpers/composedPrimitives.ts";
import { IDictUnionOfPayloadTypes, parseAndPickType } from "../start.ts";
import er from "./helpers/error.ts";

const { object, type, optional, array, string } = superstruct;

const buildChangeFreqPicker = () => {
	const HR = 1000 * 60 * 60;
	const DAY = 24 * HR;
	const WK = 7 * DAY;
	const WK4 = WK * 4;
	const YR = 365 * DAY;

	return (lastMod: number, today = Date.now()) => {
		const dif = today - lastMod;
		if (dif < HR) {
			return "always";
		} else if (dif < DAY) {
			return "hourly";
		} else if (dif < WK) {
			return "daily";
		} else if (dif < WK4) {
			return "weekly";
		} else if (dif < YR) {
			return "monthly";
		} else {
			return "yearly";
		}
	};
};

const pickChangeFreq = buildChangeFreqPicker();

const UrlLoc = object({
	loc: object({ _text: string() }),
	lastmod: optional(InnerText),
	changefreq: optional(InnerText),
	priority: optional(InnerText),
});
type IUrlLoc = typeof UrlLoc.TYPE;

const SitemapLoc = object({
	loc: object({ _text: string() }),
	lastmod: optional(InnerText),
});

type ISitemapLoc = typeof SitemapLoc.TYPE;

const UrlSet = object({
	url: array(UrlLoc),
	_comment: optional(string()),
	_attributes: optional(type({
		xmlns: string(),
	})),
});

const IndexSet = object({
	sitemap: array(SitemapLoc),
	_comment: optional(string()),
	_attributes: optional(type({
		xmlns: optional(string()),
	})),
});

export const SitemapKind = type({
	_declaration: object({
		_attributes: object({
			version: optional(string()),
			encoding: optional(string()),
			standalone: optional(string()),
		}),
	}),
	urlset: optional(UrlSet),
	sitemapindex: optional(IndexSet),
});

export type RespStruct = typeof SitemapKind.TYPE;

export const expand = async (
	compactParse: RespStruct,
	url: string,
): Promise<RespStruct> => {
	const allFetchedExternals = await Promise.all(
		(compactParse?.sitemapindex?.sitemap ?? []).map(
			async (sm) =>
				parseAndPickType({
					url: sm.loc._text,
					txt: await (await fetch(sm.loc._text)).text(),
				}),
		),
	);

	const newSitemapResp = allFetchedExternals.filter((res) => res.kind === "sitemap") as Extract<
		IDictUnionOfPayloadTypes,
		{ kind: "sitemap" }
	>[];

	console.log({ newSitemapResp });

	const newSitemaps: ISitemapLoc[] = newSitemapResp
		.filter((sm) => !!sm.data.sitemapindex?.sitemap)
		.reduce((p, sm) => {
			return [
				...p,
				...(sm.data.sitemapindex?.sitemap ?? []),
			] as ISitemapLoc[];
		}, [] as ISitemapLoc[]) as ISitemapLoc[];

	const newUrls: IUrlLoc[] = newSitemapResp
		.filter((sm) => !!sm.data.urlset?.url)
		.reduce((p: IUrlLoc[], sm) => {
			return [
				...p,
				...(sm.data.urlset?.url ?? []),
			] as IUrlLoc[];
		}, [] as IUrlLoc[]) as IUrlLoc[];

	const recurseParam = {
		...compactParse,
		sitemapindex: {
			...compactParse.sitemapindex,
			sitemap: newSitemaps ?? [],
		},
	} as RespStruct;

	return {
		...compactParse,
		urlset: {
			...compactParse.urlset,
			url: (compactParse?.urlset?.url ?? [])
				.concat(newUrls)
				.concat(
					(await expand(recurseParam, url)).urlset?.url ?? [],
				) as IUrlLoc[],
		},
	};
};

export const Sitemap: TypedValidator = ((
	compactParse: unknown | RespStruct,
	url: string,
): IValidate<RespStruct> => {
	// let isValidated = false;
	return {
		url,
		inputKind: "sitemap",
		clone: Sitemap,
		_: compactParse as RespStruct,

		validate: async (): Promise<RespStruct> => {
			let err: superstruct.StructError | undefined;
			let validated: unknown;

			if (typeof compactParse === "string") {
				return Promise.reject(
					er(compactParse, "Parse Before Validation", new Error().stack),
				);
			}
			if (compactParse == null) {
				return Promise.reject(
					er(compactParse, "Data input was null", new Error().stack),
				);
			}

			if (
				(compactParse as RespStruct).urlset ||
				(compactParse as RespStruct).sitemapindex
			) {
				[err, validated] = SitemapKind.validate(compactParse, {
					coerce: true,
				});

				if (!err && validated) {
					let v = validated as RespStruct;
					if (v.sitemapindex?.sitemap) {
						v = await expand(v, url);
					}

					[err, validated] = SitemapKind.validate(v, { coerce: true });

					if (validated) {
						return Promise.resolve(validated as RespStruct);
					} else if (err) {
						return Promise.reject(
							er(
								v,
								"Sitemap Expansion: superstruct validation returned eith errors",
								err.toString(),
							),
						);
					} else {
						return Promise.reject(
							er(
								v,
								"Sitemap Expansion: superstruct validation returned eith errors",
								new Error().stack,
							),
						);
					}
				} else if (err) {
					return Promise.reject(
						er(
							compactParse,
							"Sitemap: superstruct validation returned eith errors",
							err.toString(),
						),
					);
				} else {
					return Promise.reject(
						er(
							compactParse,
							"Sitemap: validation application error",
							new Error().stack,
						),
					);
				}
			} else {
				return Promise.reject(
					er(
						compactParse,
						`Sitemap: string structure lacks an rss tag within the xml to parse`,
						new Error().stack,
					),
				);
			}
		},
		paginateFrom: (pos = 0, pageBy = 50) => {
			console.log({ pos, pageBy });
			return Promise.resolve({
				val: compactParse as RespStruct,
				canPrev: false,
				canNext: false,
			});
		},
		prev: () =>
			Promise.resolve({
				val: compactParse as RespStruct,
				canPrev: false,
				canNext: false,
			}),
		next: () =>
			Promise.resolve({
				val: compactParse as RespStruct,
				canPrev: false,
				canNext: false,
			}),
		toString: () => {
			return toXml.js2xml(
				compactParse as RespStruct,
				{ compact: true },
			);
		},
		fromAST: async (
			_ast: ASTjson | ASTcomputable,
		): Promise<RespStruct> => {
			const opts = {
				lastmod: "",
				priority: "",
				changefreq: "",
			};

			const ast = await computableToJson(_ast);
			const asInnerText = (s?: string) => {
				return { _text: s };
			};
			return {
				_declaration: {
					_attributes: {
						version: ast._sitemap?.version as string | undefined,
						encoding: ast._sitemap?.encoding as string | undefined,
						standalone: ast._sitemap?.standalone as string | undefined,
					},
				},
				urlset: {
					_attributes: {
						xmlns: ast._sitemap?.urlset_xmlns as string | undefined,
					},
					url: ast.items.map((i) => {
						return {
							loc: asInnerText(i.url),
							lastmod: asInnerText(opts.lastmod),
							priority: asInnerText(opts.priority),
							changefreq: asInnerText(opts.changefreq),
						};
					}),
				},
			} as RespStruct;
		},
		toAST: async (): Promise<ASTcomputable> => {
			const c = compactParse as RespStruct;
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
				title: url,
				description: "this feed is generated from a sitemap",
				language: "en-US",
				links: async () => {
					return {
						homeUrl: "",
						feedUrl: "",
						sourceURL: "",
						list: [],
					};
				},
				images: {
					icon: "",
					favicon: "",
					bannerImage: "",
				},
				paging: {
					nextUrl: "",
					prevUrl: "",
					itemCount: 0,
				},
				authors: async () => {
					return [{ name: "" }];
				},
				entitlements: [],
				sourceFeedMeta: {},
				_sitemap: {},
				item: {
					next: async () => [],
					list: (c.urlset?.url ?? []).map((u) => {
						return {
							id: u.loc._text,
							url: u.loc._text,
							language: "en-US",
							title: async () => "",
							summary: async () => "",
							expires: undefined,
							authors: async () => [{ name: "null" }],
							content: async () => ({
								html: "",
								makrdown: "",
								text: "",
							}),
							dates: async () => ({
								published: -1,
								modified: u.lastmod?._text ? new Date(u.lastmod?._text).getTime() : -1,
							}),

							images: async () => ({
								bannerImage: "",
								indexImage: "",
							}),

							links: async () => ({
								nextPost: "",
								prevPost: "null",
								category: "uncategorized",
								tags: [],
								externalURLs: [],
								relLinks: {},
							}),
							attachments: async () => {
								return [];
							},
							_sitemap: {
								changefreq: u.changefreq ?? ((u) => {
									return u.lastmod?._text ? pickChangeFreq(new Date(u.lastmod?._text).getTime()) : "yearly";
								})(u),
								priority: u.priority ?? 0.5,
							},
						};
					}),
				},
			};
		},
	};
}) as TypedValidator;

export default Sitemap;
