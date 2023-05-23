// deno-lint-ignore-file require-await
// define the expected atom shape
// perform the fetch
// validate the response

import type { TypedValidator } from "../start.ts";
import { ASTcomputable, ASTjson, computableToJson } from "./ast.ts";
import { IValidate } from "../types.ts";
import { JSONStruct, removeUndef } from "./helpers/removeUndef.ts";

import * as s from "superstruct";
import * as toXml from "toXml";

import er from "./helpers/error.ts";
import {
	_text,
	_typedText,
	CDataInnerText,
	Enclosure,
	Generator,
	GUID,
	InnerText,
	Link,
	OptInnerText,
	txtorCData,
	TypedInnerText,
} from "./helpers/composedPrimitives.ts";

const {
	union,
	object,
	string,
	array,
	optional,
	type,
} = s;

const structuredAttributes = <T, S>(attrSruct: s.Struct<T, S>) =>
	type({
		_attributes: attrSruct,
		_cdata: string(),
		_text: string(),
	});

const Category = structuredAttributes(type({ domain: string() }));

export const RssItem = type({
	title: optional(CDataInnerText),
	link: InnerText,
	guid: GUID,
	comments: optional(InnerText),
	"dc:creator": optional(TypedInnerText),
	pubDate: optional(InnerText),
	category: optional(
		union([TypedInnerText, array(TypedInnerText), Category, array(Category)]),
	),
	description: optional(TypedInnerText),
	"content:encoded": optional(TypedInnerText),
	"wfw:commentRss": optional(InnerText),
	"slash:comments": optional(InnerText),
	"atom:link": optional(TypedInnerText),
	enclosure: optional(union([Enclosure, array(Enclosure)])),
});

interface _RssRespAttributes {
	version?: string;
	encoding?: string;
	standalone?: string;
}

interface _RssRespChannelAttribs {
	version: string;
	"xmlns:atom": string;
	"xmlns:content": string;
	"xmlns:wfw": string;
	"xmlns:dc": string;
	"xmlns:sy": string;
	"xmlns:slash": string;
	"xmlns:georss": string;
	"xmlns:geo": string;
}

interface RssChannelData {
	"atom:link"?: {
		_attributes: {
			href: string;
			rel?: string;
			type?: string;
		};
	};
	lastBuildDate?: { _text?: string };
	"sy:updatePeriod"?: { _text?: string };
	"sy:updateFrequency"?: { _text?: string };
}

interface RssMeta {
	_attributes: {
		name: string;
		content: string;
	};
}

export const RssResponse = type({
	_instruction: optional(union([
		type({ "xml-stylesheet": string() }),
		array(type({ "xml-stylesheet": string() })),
	])),
	_declaration: object({
		_attributes: object({
			version: optional(string()),
			encoding: optional(string()),
			standalone: optional(string()),
		}),
	}),
	rss: object({
		meta: optional(type({
			_attributes: type({
				content: string(),
				name: string(),
			}),
		})),
		_attributes: type({
			version: optional(string()),
			"xmlns:atom": optional(string()),
			"xmlns:content": optional(string()),
			"xmlns:wfw": optional(string()),
			"xmlns:dc": optional(string()),
			"xmlns:sy": optional(string()),
			"xmlns:slash": optional(string()),
			"xmlns:georss": optional(string()),
			"xmlns:geo": optional(string()),
		}),
		channel: type({
			title: optional(InnerText),
			link: InnerText,
			image: optional(
				type({ url: OptInnerText, title: OptInnerText, link: OptInnerText }),
			),
			description: optional(union([OptInnerText, CDataInnerText])),
			generator: optional(Generator),
			language: optional(OptInnerText),
			copyright: optional(OptInnerText),
			lastBuildDate: optional(OptInnerText),
			"atom:link": optional(Link),
			"sy:updatePeriod": optional(OptInnerText),
			"sy:updateFrequency": optional(OptInnerText),
			item: array(RssItem),
		}),
	}),
});

export type RespStruct = typeof RssResponse.TYPE;

export const Rss: TypedValidator = ((
	compactParse: RespStruct | unknown,
	url: string,
): IValidate<RespStruct> => {
	const structs = {
		response: RssResponse,
		item: RssItem,
	};
	return {
		url,
		inputKind: "rss",
		clone: Rss,
		_: compactParse as RespStruct,
		validate: (): Promise<RespStruct> => {
			let err: s.StructError | undefined;
			let validated: unknown;

			if (typeof compactParse === "string") {
				return Promise.reject(er(compactParse, "", new Error().stack));
			}
			if (compactParse == null) {
				return Promise.reject(
					er(compactParse, "got a null", new Error().stack),
				);
			}

			if ((compactParse as RespStruct).rss) {
				[err, validated] = structs.response.validate(compactParse, {
					coerce: true,
				});

				if (validated && !err) {
					return Promise.resolve(validated as RespStruct);
				} else if (err) {
					return Promise.reject(
						er(
							compactParse,
							"RSS: validation application error",
							err.toString(),
						),
					);
				} else {
					return Promise.reject(
						er(
							compactParse,
							"RSS: validation application error",
							new Error().stack,
						),
					);
				}
			} else {
				return Promise.reject(
					er(
						compactParse,
						`RSS: string structure lacks an rss tag within the xml to parse`,
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
		next: () => {
			return Promise.resolve({
				val: compactParse as RespStruct,
				canNext: false,
				canPrev: false,
			});
			// does it support next/prev?
		},
		prev: () => {
			return Promise.resolve({
				val: compactParse as RespStruct,
				canNext: false,
				canPrev: false,
			});
		},
		toString: () => {
			return toXml.js2xml(
				removeUndef(compactParse as JSONStruct) as Record<string, unknown>,
				{ compact: true },
			);
		},
		fromAST: async (_ast: ASTcomputable | ASTjson): Promise<RespStruct> => {
			const ast = await computableToJson(_ast);
			const g = ast?._rss?.generator as {
				_attributes: { uri?: string; version?: string };
				_cdata: string;
				_text: string;
			} | undefined;

			return {
				_declaration: {
					_attributes: {
						version: ast._rss?.version as string | undefined,
						...((ast._rss?._declaration as { _attributes: _RssRespAttributes })
								?._attributes
							? (ast._rss?._declaration as { _attributes: _RssRespAttributes })
								?._attributes
							: {}),
					},
					...(ast._rss?._declaration ? ast._rss?._declaration as Record<string, unknown> : {}),
				},
				...(ast._rss?._instruction ? ast._rss?._instruction as Record<string, unknown> : {}),
				rss: {
					_attributes: (ast._rss as {
						rss?: { _attributes?: Partial<_RssRespChannelAttribs> };
					}).rss
						?._attributes ?? {},
					meta: (ast._rss as { rss?: { meta?: RssMeta } }).rss?.meta,
					channel: {
						link: _text(ast.links.feedUrl),
						title: _text(ast.title),
						description: _text(ast.description),
						generator: {
							_attributes: {
								uri: g?._attributes?.uri,
								version: g?._attributes?.version,
							},
							_cdata: g?._cdata,
							_text: g?._text,
						},
						...((ast._rss as { rss: { channel: RssChannelData } })?.rss
							?.channel),
						item: await Promise.all(ast.items.map(async (i) => {
							return {
								link: await _text(i.url),
								guid: _text(i.id),
								title: _text(i.title ?? "null_source_title"),
								description: _text(i.summary ?? "null_source_description"),
								"content:encoded": _text(
									i.content.html ?? "null_source_content",
								),
								category: _typedText(i.links.category),
								"dc:creator": _typedText(i.authors?.[0].name),
								//
								"atom:link": i._rss?.["atom:link"] as
									| undefined
									| typeof TypedInnerText.TYPE,
								"slash:comments": i._rss?.["slash:comments"] as undefined | {
									_text: string;
								},
								"wfw:commentRss": i._rss?.["wfw:commentRss"] as undefined | {
									_text: string;
								},
								comments: i._rss?.comments as undefined | { _text: string },
								//
								enclosure: (i.attachments ?? [])
									.map((a) => ({
										_attributes: {
											url: a.url,
											length: a.sizeInBytes?.toString(),
											type: a.mimeType,
										},
									})),
							};
						})),
					},
				},
			};
		},
		toAST: async (): Promise<ASTcomputable> => {
			const c = await compactParse as RespStruct;

			// console.log('item0:', c.rss.channel.item[0]);

			return {
				_meta: {
					_type: "computable",
					reference: "",
					version: "",
					source: {
						url: url,
						t: Date.now(),
						hash: "",
						from: "",
					},
				},
				title: txtorCData(
					">> no title given",
					c.rss.channel.title,
					c.rss.channel.link,
				),
				description: txtorCData(">> no description", c.rss.channel.description),
				language: "en-US",
				authors: async () => {
					const authors = (await c.rss.channel.item).reduce((p, i) => {
						return {
							...p,
							[txtorCData("null_Author", i["dc:creator"])]: {
								name: txtorCData("null_Author", i["dc:creator"]),
							},
						};
					}, {} as { [name: string]: { name: string } });
					return Object.values(authors);
				},
				images: async () => {
					return {
						favicon: await txtorCData("null_favicon", c.rss.channel.image?.url),
						icon: txtorCData("null_icon", c.rss.channel.image?.url),
						bannerImage: txtorCData(
							"null_bannerImage",
							c.rss.channel.image?.url,
						),
					};
				},
				links: async () => {
					return {
						feedUrl: await txtorCData("", c.rss.channel.link),
						homeUrl: txtorCData("", c.rss.channel.link),
						sourceURL: txtorCData("", c.rss.channel.link),
						list: [
							...(
								c.rss.channel["atom:link"] ? [c.rss.channel["atom:link"]._attributes] : []
							),
						],
					};
				},
				sourceFeedMeta: async () => {
					return {
						generator: {
							name: txtorCData("", c.rss.channel.generator),
							url: c.rss.channel.generator?._attributes?.uri,
							version: c.rss.channel.generator?._attributes?.version,
						},
					};
				},
				paging: async () => {
					return {
						nextUrl: "",
						prevUrl: "",
						itemCount: c.rss.channel.item.length,
					};
				},
				entitlements: [
					{
						serverUrl: "",
						forKinds: ["copyrights"],
						tokenData: { "copyright": c.rss.channel.copyright?._text ?? null },
					},
				],
				_rss: {
					_declaration: c._declaration,
					_instruction: c._instruction,
					rss: {
						_attributes: c.rss._attributes,
						meta: c.rss.meta,
						channel: {
							"atom:link": c.rss.channel["atom:link"],
							"sy:updateFrequency": c.rss.channel["sy:updateFrequency"],
							"sy:updatePeriod": c.rss.channel["sy:updatePeriod"],
							lastBuildDate: c.rss.channel.lastBuildDate,
						},
					},
				},
				item: {
					next: async () => [],
					list: (c.rss.channel.item ?? []).map((i) => {
						return {
							title: txtorCData("_missing", i.title),
							summary: txtorCData("_missing", i.description),
							language: txtorCData("en-US", c.rss.channel.language),
							url: txtorCData("_missing", i.link),
							id: txtorCData("_missing", i.guid),
							authors: [{
								name: txtorCData(">>anonymous<<", i["dc:creator"]),
								email: undefined,
								url: undefined,
								imageURL: undefined,
							}],
							content: {
								html: txtorCData(
									"Err: 105 - Missing Content",
									i["content:encoded"],
								),
								text: txtorCData(
									"Err: 105 - Missing Content",
									i["content:encoded"],
								),
								makrdown: undefined,
							},
							images: {
								indexImage: undefined,
								bannerImage: undefined,
							},
							dates: { published: 0, modified: 0 },
							links: {
								category: Array.isArray(i.category)
									? txtorCData("", i.category[0])
									: txtorCData("", i.category),
								nextPost: undefined,
								prevPost: undefined,
								tags: Array.isArray(i.category)
									? i.category.map((c) => txtorCData(">> couldNotFindTagInfo", c))
									: i.category
									? [txtorCData("", i.category)]
									: [],
								externalURLs: [],
								relLinks: {},
							},
							_rss: {
								"atom:link": i["atom:link"],
								"slash:comments": i["slash:comments"],
								"wfw:commentRss": i["wfw:commentRss"],
								comments: i.comments,
							},
							expires: undefined,
							attachments: Array.isArray(i.enclosure)
								? i.enclosure.filter((e) => e?._attributes.type && e?._attributes.url).map((e) => {
									return {
										durationInSeconds: 0,
										sizeInBytes: e?._attributes.length &&
												!Number.isNaN(Number.parseInt(e?._attributes.length))
											? Number.parseInt(e?._attributes.length)
											: undefined,
										mimeType: e?._attributes.type as string,
										url: e?._attributes.url as string,
										title: e?._attributes.url as string,
									};
								})
								: i.enclosure?._attributes.type && i.enclosure?._attributes.url
								? [{
									durationInSeconds: 0,
									sizeInBytes: i.enclosure?._attributes.length &&
											!Number.isNaN(
												Number.parseInt(i.enclosure?._attributes.length),
											)
										? Number.parseInt(i.enclosure?._attributes.length)
										: undefined,
									mimeType: i.enclosure?._attributes.type ?? "",
									url: i.enclosure?._attributes.url ?? "",
									title: i.enclosure?._attributes.url ?? "",
								}]
								: [],
						};
					}),
				},
			};
		},
	};
}) as TypedValidator;
