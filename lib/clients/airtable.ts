//# region interfaces
export interface AirtableState {
	baseURL: string;
	apiToken: string;
	baseId: string;
	tableName: string;
}
export interface MiddleLayerReturns<T> {
	url: () => URL;
	req: () => Request;
	fetch: () => Promise<Response>;
	json: () => Promise<T>;
}
export type SortOptions = string | { field: string; direction?: "asc" | "desc" };
export type toStringForQueryValues = (data: unknown) => string;
export interface Stringable {
	toString: () => string;
}

export interface ListMethodResponse {
	offset?: string;
	records: {
		id: string;
		createdTime: string;
		fields: Record<string, string>;
		commentCount?: number;
	}[];
}
export interface ListMethodOptions {
	timeZone?: string; // example: "America/Chicago"
	userLocale?: string; // examaple: 'en-US'
	pageSize?: number; // default: 100
	maxRecords?: number; // default: 100
	offset?: string;
	view?: string;
	sort?: SortOptions[];
	filterByFormula?: string | Record<string, string>;
	"fields[]"?: string[]; // fieldName or fieldID list
	cellFormat?: "json" | "string"; // json is default
	returnFieldsByFieldId?: boolean; //default false
	// recordMetadata? : commentCount[] // dont understand well enough to yet implement
}

export interface GetMethodResponse {
	id: string;
	createdTime: string;
	fields: Record<string, string | number | boolean>;
}
export interface GetMethodOptions {
	recordId: string;
	cellFormat?: "json" | "string";
	returnFieldsByFieldId?: boolean;
}

export type DeleteMethodOptions = string;
export interface DeleteMethodResponse {
	records: {
		id: string;
		deleted: boolean;
	}[];
}

export type CreateMethodData = Record<string, string | number | null | boolean>;

export interface CreateMethodResponse {
	records: {
		id: string;
		createdTime: string;
		fields: Record<string, string | number | boolean>;
	}[];
}

export interface UpdateMethodOptions {
	performUpsert?: { fieldsToMergeOn: string[] };
	returnFieldsByFieldId?: boolean;
	typecast?: boolean;
	records: {
		id?: string;
		fields: Record<string, unknown>;
	}[];
}
export interface UpdateMethodResponse {
	records: {
		id: string;
		createdTime: string;
		fields: Record<string, unknown>;
	}[];
	updatedRecords: string[];
	createdRecords: string[];
}

//# endregion interfaces

const makeReturnable = <T>(state: AirtableState, req: Request) => {
	req.headers.set("Authorization", `Bearer ${state.apiToken}`);
	return {
		req: () => req,
		url: () => new URL(req.url),
		fetch: () => fetch(req),
		json: () => fetch(req).then((res) => res.json() as T),
	};
};

/**
 * @param url
 * @param params
 * @param mapOfOverideRules
 */
const intergratateQuerryParams = (
	url: URL,
	params: Record<string, unknown>,
	mapOfOverideRules: Record<string, (data: unknown) => string> = {},
): URL => {
	return Object.entries(params).reduce((url, [key, val]) => {
		key in mapOfOverideRules
			? url.searchParams.set(key, mapOfOverideRules[key](val))
			: typeof val === "string"
			? url.searchParams.set(key, val)
			: url.searchParams.set(key, (val as Stringable).toString());
		// console.log([...url.searchParams.entries()])
		return url;
	}, new URL(url.href));
};

const overrideSortOptions = ((val: SortOptions[]) => {
	const sortString = (val as SortOptions[]).map((v, i) => {
		if (typeof v === "string") {
			return `sort[${i}][field]=${v}`;
		} else {
			return `sort[${i}][field]=${v.field}&sort[${i}][direction]=${v.direction || "asc"}`;
		}
	}).join("&");
	return sortString;
}) as toStringForQueryValues;

export type ezStarer = { "AND_": ezObject } | { "OR_": ezObject };
export type ezElement = { [key: string]: string | number | boolean };
export type ezObject = ezElement | ezStarer;
export const OR = (val: ezObject): ezStarer => ({ OR_: val });
export const AND = (val: ezObject): ezStarer => ({ AND_: val });

const ANDoperator = (val: string) => `AND(${val})`;
const ORoperator = (val: string) => `OR(${val})`;

const isSpecialKey = (key: string): { opr: string | false; key: string } => {
	if (key.endsWith(">=")) return { opr: ">=", key: key.slice(0, -2) };
	if (key.endsWith("<=")) return { opr: "<=", key: key.slice(0, -2) };
	if (key.endsWith("=")) return { opr: "=", key: key.slice(0, -1) };
	if (key.endsWith("<")) return { opr: "<", key: key.slice(0, -1) };
	if (key.endsWith(">")) return { opr: ">", key: key.slice(0, -1) };
	return { opr: false, key };
};
export const _handleRecords = (obj: ezObject, init = ""): string => {
	// console.log('records', {init, obj})
	return Object.entries(obj).map(([key, val]) => {
		const { opr, key: k } = isSpecialKey(key);
		return typeof val === "object"
			? _handleNestedRecords({ [key]: val } as ezStarer, init)
			: opr
			? `{${k}}${opr}"${val}"`
			: `{${key}}="${val}"`;
	}).join(",");
};

export const _handleNestedRecords = (obj: ezStarer, init = ""): string => {
	// console.log('nest', {init, obj})
	return Object.entries(obj)
		.reduce((acc, [key, objVal]) => {
			// console.log({acc, key, objVal})
			return key === "AND_"
				? ANDoperator(_handleRecords(objVal, acc))
				: ORoperator(_handleRecords(objVal, acc));
		}, init);
};

const overrideFilterByFormula = ((val: string | ezStarer) => {
	// console.log('overrideFilterByFormula', typeof val, val)
	return typeof val === "string" ? val : _handleNestedRecords(val as ezStarer);
}) as toStringForQueryValues;

const listMethod =
	(state: AirtableState) => (opts?: ListMethodOptions): MiddleLayerReturns<ListMethodResponse> => {
		const withDefaults: ListMethodOptions = {
			timeZone: "America/Chicago",
			userLocale: "en-US",
			pageSize: 100,
			maxRecords: 100,
			cellFormat: "json",
			...opts,
		};

		const urlWithQuery = intergratateQuerryParams(
			new URL(state.baseURL),
			withDefaults as Record<string, unknown>,
			{
				sort: overrideSortOptions,
				filterByFormula: overrideFilterByFormula,
			},
		);
		const req = new Request(urlWithQuery, { method: "GET" });

		// console.log(opts, req)

		return makeReturnable(state, req);
	};

const getMethod =
	(state: AirtableState) => (opts: GetMethodOptions): MiddleLayerReturns<GetMethodResponse> => {
		const { recordId, ...others } = opts;
		const listRecordsURL = new URL(state.baseURL + `/${recordId}`);
		const urlWithQuery = intergratateQuerryParams(
			listRecordsURL,
			others as Record<string, unknown>,
		);

		const req = new Request(urlWithQuery);
		return makeReturnable(state, req);
	};

/**
 * @doc https://airtable.com/developers/web/api/delete-multiple-records
 * @param state
 * @returns
 */
const deleteMethod =
	(state: AirtableState) =>
	(...records: DeleteMethodOptions[]): MiddleLayerReturns<DeleteMethodResponse> => {
		const url = new URL(state.baseURL);
		records.forEach((rec) => url.searchParams.append("records", encodeURIComponent(rec)));

		const req = new Request(url, {
			method: "DELETE",
		});
		return makeReturnable(state, req);
	};

const createMethod =
	(state: AirtableState) =>
	(...records: CreateMethodData[]): MiddleLayerReturns<CreateMethodResponse> => {
		const url = new URL(state.baseURL);
		const req = new Request(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(
				records.length === 1
					? { fields: records[0] }
					: { records: records.map((rec) => ({ fields: rec })) },
			),
		});
		return makeReturnable(state, req);
	};

const updateMethod = (state: AirtableState) =>
(
	opts: UpdateMethodOptions,
): MiddleLayerReturns<UpdateMethodResponse> => {
	const url = new URL(state.baseURL);
	const req = new Request(url, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(opts),
	});
	return makeReturnable(state, req);
};

export const airtable = (init: Omit<AirtableState, "baseURL">) => {
	const state = {
		baseURL: `https://api.airtable.com/v0/${init.baseId}/${init.tableName}`,
		...init,
	};

	return {
		/**
		 * @doc https://airtable.com/developers/web/api/get-record
		 */
		GET: getMethod(state),
		/**
		 * @doc https://airtable.com/developers/web/api/list-records
		 */
		LIST: listMethod(state),
		/**
		 * @doc https://airtable.com/developers/web/api/delete-multiple-records
		 */
		DELETE: deleteMethod(state),
		/**
		 * @doc https://airtable.com/developers/web/api/update-multiple-records
		 */
		UPDATE: updateMethod(state),
		/**
		 * @doc https://airtable.com/developers/web/api/create-records
		 */
		CREATE: createMethod(state),
	};
};

export default airtable;
