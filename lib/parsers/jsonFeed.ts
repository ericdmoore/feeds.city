// define the expected atom shape
// perform the fetch
// validate the response

import type { IValidate } from "../types.ts";
import type { TypedValidator } from "../start.ts";
import { hashUsingCID } from "../analysis/calcMultihash.ts";
import { ASTcomputable, ASTjson, computableToJson } from "./ast.ts";
import * as s from "superstruct";
import er from "./helpers/error.ts";

const {
	number,
	union,
	literal,
	optional,
	type,
	object,
	string,
	array,
	boolean,
	record,
} = s;
// define,

export const JsonFeedAuthor = type({
	name: string(),
	url: optional(string()),
	avatar: optional(string()),
});

export const JsonAttachments = type({
	url: string(),
	mime_type: string(),
	title: optional(string()),
	size_in_bytes: optional(number()),
	duration_in_seconds: optional(number()),
});

export const JsonFeedItem = type({
	id: string(), // can also be the permalink
	url: string(), // permalink
	external_url: optional(string()), //
	title: optional(string()),
	content_html: optional(string()),
	content_text: optional(string()),
	content_makrdown: optional(string()),
	summary: optional(string()),
	image: optional(string()),
	banner_image: optional(string()), // layout above the post
	date_published: optional(string()), // ISO fmt
	date_modified: optional(string()), // ISO fmt
	language: optional(string()),
	tags: optional(array(string())),
	author: optional(JsonFeedAuthor),
	authors: optional(array(JsonFeedAuthor)),
	attachments: optional(array(JsonAttachments)),
	_eventStreamFromViewer: optional(object({
		tokenData: string(),
		feedEvents: object({
			available: array(string()),
			defaultUrl: string(),
		}),
		events: record(
			union([
				literal("read"),
				literal("share"),
			]),
			object({
				ts: number(),
				feedUri: string(),
				postUri: string(),
			}),
		),
	})),
});

export const JsonFeedKind = type({
	version: string(),
	title: string(),
	home_page_url: string(),
	feed_url: string(), // import meta.url
	author: optional(JsonFeedAuthor),
	authors: optional(array(JsonFeedAuthor)),
	description: optional(string()), // of feed
	user_comment: optional(string()), // developer comment
	next_url: optional(string()), //
	icon: optional(string()), //
	favicon: optional(string()),
	language: optional(string()),
	expired: optional(boolean()),
	items: array(JsonFeedItem),
	hubs: optional(array(object({
		type: string(),
		url: string(),
	}))),
});

export type RespStruct = typeof JsonFeedKind.TYPE;

export const JsonFeed = ((
	compactParse: RespStruct | unknown,
	url: string,
): IValidate<RespStruct> => {
	const structs = { response: JsonFeedKind };

	return {
		url,
		inputKind: "jsonfeed",
		_: compactParse as RespStruct,
		clone: JsonFeed,
		validate: (): Promise<RespStruct> => {
			let err: s.StructError | undefined;
			let validated: unknown;

			if (typeof compactParse === "string") {
				return Promise.reject(
					er(
						compactParse,
						"JsonFeed: must passe the string before validation",
						new Error().stack,
					),
				);
			}
			if (compactParse == null) {
				return Promise.reject(
					er(
						compactParse,
						"JsonFeed: found null input",
						new Error().stack,
					),
				);
			}

			if ("items" in (compactParse as RespStruct)) {
				[err, validated] = structs.response.validate(compactParse, {
					coerce: true,
				});

				if (validated && !err) {
					return Promise.resolve(validated as RespStruct);
				} else if (err) {
					return Promise.reject(
						er(
							compactParse,
							"JsonFeed: validation application error",
							err.toString(),
						),
					);
				} else {
					return Promise.reject(
						er(
							compactParse,
							"JsonFeed: validation application error",
							new Error().stack,
						),
					);
				}
			} else {
				return Promise.reject(
					er(
						compactParse,
						"string structure lacks a `feed` tag within the parsed payload",
						new Error().stack,
					),
				);
			}
		},
		/**
		 * @param pos - starting positi0on
		 * @param pageBy - intteger value (pos|neg) indicating the page size and direction from the starting position
		 * @returns
		 */
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
				canPrev: false,
				canNext: false,
			});
		},
		prev: () => {
			return Promise.resolve({
				val: compactParse as RespStruct,
				canPrev: false,
				canNext: false,
			});
		},
		fromAST: async (input: ASTcomputable | ASTjson): Promise<RespStruct> => {
			const ast = await computableToJson(input);

			const ret: RespStruct = {
				version: "https://jsonfeed.org/version/1.1",
				title: ast.title,
				description: ast.description,

				language: ast.language,
				icon: ast.images.icon,
				favicon: ast.images.favicon,

				authors: ast.authors,
				user_comment: ast._meta.comment,

				feed_url: ast.links.feedUrl,
				home_page_url: ast.links.homeUrl,

				items: ast.items.map((i) => {
					return {
						...i,
						attachments: i.attachments.map((a) => {
							const {
								sizeInBytes,
								durationInSeconds,
								mimeType,
								...jsonAttach
							} = a;
							return {
								...jsonAttach,
								mime_type: mimeType,
								duration_in_seconds: sizeInBytes,
								size_in_bytes: durationInSeconds,
							};
						}),
					};
				}),
			} as RespStruct;
			return ret;
		},
		toString: () => {
			return JSON.stringify(compactParse);
		},
		toAST: async (): Promise<ASTcomputable> => {
			const c = await compactParse as RespStruct;
			return {
				_meta: {
					_type: "computable",
					version: "https://github.com/ericdmoore/feedBarber/wiki/AST.v2022-08-01",
					reference: "https://github.com/ericdmoore/feedBarber/wiki/AST-Reference",
					source: {
						url: url,
						t: Date.now(),
						from: "unknown",
						hash: await hashUsingCID(JSON.stringify(compactParse)),
					},
				},
				title: c.title,
				description: c.description ?? ">> no description <<",
				language: c.language ?? "en-US",
				links: async () => {
					return {
						feedUrl: await c.feed_url,
						homeUrl: c.home_page_url,
						sourceURL: c.feed_url,
						list: [],
					};
				},
				images: async () => ({
					favicon: await c.favicon,
					icon: c.icon,
					bannerImage: c.icon,
				}),
				paging: async () => ({
					itemCount: await c.items.length,
				}),
				entitlements: [],
				sourceFeedMeta: async () => {
					return await {};
				},
				authors: [...c.authors ?? []].concat(c.author ? [c.author] : [])
					.map((a) => ({
						name: a?.name ?? ">> no name provided <<",
						url: a?.url,
						email: undefined,
						imageURL: a?.avatar ??
							`https://randomuser.me/api/portraits/lego/${Math.round(Math.random() * 9)}.jpg`,
					})),
				item: {
					next: async () => await [],
					list: async () =>
						(await c.items).map((i: typeof JsonFeedItem.TYPE) => {
							const jsonAuthors = [...c.authors ?? []].concat(
								c.author ? [c.author] : [],
							);
							const itemAuthors = (i.authors ?? []).concat(
								// add the singular element via concat by wrapping it
								i.author
									? [i.author] // but if we had a list, concat nothing
									// else (no item list, no item single) fallback to hedaer value list
									: (i.authors ?? []).length > 0
									? []
									: jsonAuthors,
							);

							return {
								id: i.id,
								url: i.url,
								title: i.title,
								summary: i.summary,
								language: i.language ?? "en-US",
								authors: itemAuthors.map((a) => {
									return {
										name: a?.name ?? ">> no name provided <<",
										imageUrl: a?.avatar ??
											`https://randomuser.me/api/portraits/lego/${Math.random() * 9}.jpg`,
										url: a?.url,
										email: undefined,
									};
								}),
								content: {
									html: i.content_html,
									makrdown: i.content_makrdown,
									text: i.content_text,
								},
								dates: {
									modified: i.date_modified ? (new Date(i.date_modified)).getTime() : Date.now(),
									published: i.date_published ? (new Date(i.date_published)).getTime() : Date.now(),
								},
								images: async () => ({
									bannerImage: await i.banner_image,
									indexImage: i.image,
								}),
								links: {
									category: undefined,
									nextPost: "",
									prevPost: "",
									externalURLs: [],
									tags: [],
									relLinks: {},
								},
								expires: undefined,
								attachments: async () =>
									(await i.attachments ?? []).map((a) => {
										return {
											url: a.url,
											title: a.title,
											mimeType: a.mime_type,
											sizeInBytes: a.size_in_bytes,
											durationInSeconds: a.duration_in_seconds,
										};
									}),
							};
						}),
				},
			};
		},
	};
}) as TypedValidator;
