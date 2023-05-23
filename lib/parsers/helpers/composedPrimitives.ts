import * as superstruct from "superstruct";

const { partial, type, optional, object, string, union, literal, define, is } = superstruct;

export type TextOrHTMLUnion =
	| "text"
	| "text/html"
	| "html";

export const TextOrHTML = define<TextOrHTMLUnion>(
	"TextOrHTML",
	(s: unknown) =>
		is(
			(s as string).toLowerCase(),
			union([
				literal("text"),
				literal("text/html"),
				literal("html"),
			]),
		),
);

export const InnerText = object({ _text: optional(string()) });
export const OptInnerText = object({ _text: optional(string()) });

export const GUID = partial(object({
	_text: string(),
	_attributes: object({
		isPermaLink: optional(string()),
	}),
}));

export const Enclosure = object({
	_attributes: object({
		url: string(),
		type: optional(string()),
		length: optional(string()),
	}),
});

export const Link = object({
	_attributes: object({
		href: string(),
		rel: optional(string()),
		type: optional(string()),
	}),
});

export const TypedInnerText = partial(object({
	_attributes: optional(type({
		type: optional(TextOrHTML),
	})),
	_text: string(),
	_cdata: string(),
}));

export const CDataInnerText = partial(object({
	_text: string(),
	_cdata: string(),
}));

export const LinkedVersionedTextOrCData = partial(object({
	_attributes: partial(type({
		uri: string(),
		version: string(),
	})),
	_text: string(),
	_cdata: string(),
}));

export interface ITextWithCData {
	_text?: string;
	_cdata?: string;
}

export const pickText: IPickerFn = (data?: ITextWithCData) => {
	return data?._text;
};
export const pickCData: IPickerFn = (data?: ITextWithCData) => {
	return data?._cdata;
};

type IPickerFn = (data?: ITextWithCData) => string | undefined;
type PickerReducerFnPriorType = string | ITextWithCData | undefined;
export const pickFromObject = (init: string, ...pickers: IPickerFn[]) => {
	const usePickersOnOneData =
		(data: ITextWithCData | undefined) => (...pickers: IPickerFn[]): string | undefined =>
			pickers.reduce(
				(p: PickerReducerFnPriorType, picker: IPickerFn) => {
					return typeof p === "string" ? p : typeof picker(p) === "string" ? picker(p) : p;
				},
				data,
			) as string | undefined;

	return (...dataArr: (ITextWithCData | undefined)[]) => {
		const picked: string | undefined = dataArr.reduce(
			(prior: PickerReducerFnPriorType, curData) =>
				typeof prior === "string"
					? prior as string
					: typeof usePickersOnOneData(curData)(...pickers) === "string"
					? usePickersOnOneData(curData)(...pickers) as string
					: undefined,
			{ _text: undefined } as PickerReducerFnPriorType,
		) as string | undefined;
		return picked ?? init;
	};
};

export const txtorCData = (
	init: string,
	...data: (ITextWithCData | undefined)[]
) => pickFromObject(init, pickText, pickCData)(...data);

export const Generator = LinkedVersionedTextOrCData;

export interface IHasHTML {
	_attributes: { type: "html" };
	_cdata: string;
}

export interface IHasText {
	_attributes: { type: "text" };
	_text: string;
}

export const _text = (s?: string) => {
	return { _text: s };
};

export const _typedText = (s = ""): IHasHTML | IHasText => {
	if (/<\/?[a-z][\s\S]*>/i.test(s)) {
		return {
			_attributes: { type: "html" },
			_cdata: s,
		};
	} else {
		return {
			_attributes: { type: "text" },
			_text: s,
		};
	}
};
