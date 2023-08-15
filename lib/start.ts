import * as fromXml from "fromXml";
import { ASTComputable, ASTJson, IValidate } from "./types.ts";
import { atom, jsonfeed, rss, sitemap } from "./parsers/index.ts";
import { computableToJson } from "./parsers/ast.ts";

// #region types
export type ISupportedTypeNames =
	| "atom"
	| "jsonFeed"
	| "jsonLD"
	| "sitemap"
	| "rss"
	| "JS_SELECTION_ERROR"
	| "TEXT_SELECTION_ERROR";

export type ISupportedTypes =
	| atom.RespStruct
	| jsonfeed.RespStruct
	| rss.RespStruct
	| sitemap.RespStruct;

export type TypedValidator = <T>(
	copmact: T | unknown,
	url: string,
) => IValidate<T>;

export type IDictUnionOfPayloadTypes =
	| {
		kind: "jsonFeed";
		url: string;
		data: typeof jsonfeed.JsonFeedKind.TYPE;
		parser: TypedValidator;
	}
	| {
		kind: "atom";
		url: string;
		data: typeof atom.AtomResponse.TYPE;
		parser: TypedValidator;
	}
	| {
		kind: "rss";
		url: string;
		data: typeof rss.RssResponse.TYPE;
		parser: TypedValidator;
	}
	| {
		kind: "sitemap";
		url: string;
		data: typeof sitemap.SitemapKind.TYPE;
		parser: TypedValidator;
	}
	| {
		kind: "JS_SELECTION_ERROR";
		url: string;
		data: Error;
		parser: TypedValidator;
	}
	| {
		kind: "TEXT_SELECTION_ERROR";
		url: string;
		data: Error;
		parser: TypedValidator;
	};
// | { kind: 'jsonLD'; data: typeof jsonfeed.JsonFeedKind.TYPE }

export type IDictValidPayloadTypes = Exclude<
	IDictUnionOfPayloadTypes,
	| { kind: "JS_SELECTION_ERROR" }
	| { kind: "TEXT_SELECTION_ERROR" }
>;

// #endregion types

export const startFromURL = async (url: string) => {
	const remoteData = await fetch(url);
	return { url, txt: await remoteData.text() };
};

export const pickType = (
	i: { url: string; data: Record<string, unknown> },
): IDictUnionOfPayloadTypes => {
	if ("items" in i.data && i.data?.items) {
		return {
			url: i.url,
			kind: "jsonFeed",
			data: i.data as typeof jsonfeed.JsonFeedKind.TYPE,
			parser: jsonfeed.JsonFeed,
		};
	} else if ("feed" in i.data && i.data?.feed) {
		return {
			url: i.url,
			kind: "atom",
			data: i.data as typeof atom.AtomResponse.TYPE,
			parser: atom.Atom,
		};
	} else if (i.data?.rss) {
		return {
			url: i.url,
			kind: "rss",
			data: i.data as typeof rss.RssResponse.TYPE,
			parser: rss.Rss,
		};
	} else if (i.data?.urlset || i.data?.sitemapindex) {
		return {
			url: i.url,
			kind: "sitemap",
			data: i.data as typeof sitemap.SitemapKind.TYPE,
			parser: sitemap.Sitemap,
		};
	} else {
		return {
			url: i.url,
			kind: "TEXT_SELECTION_ERROR",
			data: new Error(),
			parser: jsonfeed.JsonFeed,
		};
	}
};

export const parseAndPickType = (
	i: { url: string; txt: string },
): IDictUnionOfPayloadTypes => {
	try {
		return pickType({ url: i.url, data: JSON.parse(i.txt) });
	} catch (_) {
		return pickType({
			url: i.url,
			data: fromXml.xml2js(i.txt, { compact: true }),
		});
	}
};

export const urlToAST = (
	i: { url: string; txt: string },
): Promise<ASTComputable> => {
	const picked = parseAndPickType(i);
	return picked.parser(picked.data, picked.url).toAST();
};

export const typedValidation = async (
	input: IDictUnionOfPayloadTypes,
): Promise<IDictValidPayloadTypes> => {
	switch (input.kind) {
		case "rss":
			return {
				kind: "rss",
				url: input.url,
				data: await rss.Rss(input.data, input.url).validate(),
				parser: rss.Rss,
			} as IDictValidPayloadTypes;
		case "atom":
			return {
				kind: "atom",
				url: input.url,
				data: await atom.Atom(input.data, input.url).validate(),
				parser: atom.Atom,
			} as IDictValidPayloadTypes;
		case "jsonFeed":
			return {
				kind: "jsonFeed",
				url: input.url,
				data: await jsonfeed.JsonFeed(input.data, input.url).validate(),
				parser: jsonfeed.JsonFeed,
			} as IDictValidPayloadTypes;
		case "sitemap":
			return {
				kind: "sitemap",
				url: input.url,
				data: await sitemap.Sitemap(input.data, input.url).validate(),
				parser: sitemap.Sitemap,
			} as IDictValidPayloadTypes;
		default:
			return {} as never;
	}
};

export const parseAndValidate = (i: { url: string; txt: string }) => typedValidation(parseAndPickType(i));

export const fetchParseValidate = async (i: { url: string }) =>
	typedValidation(parseAndPickType(await startFromURL(i.url)));

export const fetchAndValidateIntoASTJson = (
	i: { url: string },
): Promise<ASTJson> => {
	return computableToJson(fetchAndValidateIntoAST(i));
};

export const fetchAndValidateIntoAST = async (
	i: { url: string },
): Promise<ASTComputable> => {
	const r = await fetchParseValidate(i);
	return r.parser(r.data, r.url).toAST();
};

export const setup = {
	aParser: {
		fromUrl: async (i: { url: string }) => {
			const d = await fetchParseValidate(i);
			return d.parser(d.data, d.url);
		},
		fromText: async (i: { url: string; txt: string }) => {
			const d = await parseAndValidate(i);
			return d.parser(d.data, d.url);
		},
		fromData: async (i: { url: string; data: unknown }) => {
			const o = i.data as Record<string, unknown>;
			const d = await pickType({ url: i.url, data: o });
			return d.parser(d.data, d.url);
		},
	},
	anAST: {
		fromUrl: async (i: { url: string }) => {
			return (await setup.aParser.fromUrl(i)).toAST();
		},
		fromText: async (i: { url: string; txt: string }) => {
			return (await setup.aParser.fromText(i)).toAST();
		},
		fromData: async (i: { url: string; data: unknown }) => {
			return (await setup.aParser.fromData(i)).toAST();
		},
	},
};

export default parseAndPickType;
