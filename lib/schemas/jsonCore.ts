type Dict<T> = { [key: string]: T };
export type JsonSchemaTYPES =
	| "array"
	| "object"
	| "string"
	| "boolean"
	| "number"
	| "null";

export interface RootSchema {
	$schema: string;
	$id?: string;
	title?: string;
	$comment?: string;
	$defs?: Dict<JsonSchemaTypes>;
}

export interface TypeSchemaBase {
	$anchor?: string;
	id?: string;
	title?: string;
	description?: string;
	examples?: JsonSchemaTypes[];
	ref?: string;
	deprecated?: boolean;
	readoOly?: boolean;
	writeOnly?: boolean;
}

export interface EnumSchemaBase {
	enum: JsonSchemaTypes[];
}

export interface ConstSchemaBase {
	const: JsonSchemaTypes;
}

export interface TypeArraySchemaBase extends TypeSchemaBase {
	type: "array";
	prefixItems?: JsonSchemaTypes[];
	items?: JsonSchemaTypes[];
	contains?: JsonSchemaTypes[];
	maxItems?: number;
	minItems?: number;
	uniqueItems?: boolean;
	maxContains?: number; // always in cohoots with contains
	minContains?: number; // always in cohoots with contains
}

export interface TypeObjectSchemaBase extends TypeSchemaBase {
	type: "object";
	properties: Dict<JsonSchemaTypes>;
	patternProperties?: Dict<RegExp>;
	propertyNames?: JsonSchemaTypes;
	additionalProperties?: boolean;
	required?: string[];
	maxProperties?: number;
	minProperties?: number;
	// dependentRequired ?: {} // not supported yet
}

export interface TypeStringSchemaBase extends TypeSchemaBase {
	type: "string";
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	contentEncoding?: string;
	contentMediaType?: string;
	contentSchema?: string;
	default?: string;
}

export interface TypeBooleanSchemaBase extends TypeSchemaBase {
	type: "boolean";
	default?: boolean;
}

export interface TypeNumberSchemaBase extends TypeSchemaBase {
	type: "number";
	default?: number;
	multipleOf?: number;
	maximum?: number;
	exclusiveMaximum?: number;
	minimum?: number;
	exclusiveMinimum?: number;
}

export interface TypeNullSchemaBase extends TypeSchemaBase {
	type: "null";
}
export interface AnyOfSchemaBase {
	anyOf: JsonSchemaTypes[];
}

export interface AllOfSchemaBase {
	allOf: JsonSchemaTypes[];
}

export interface OneOfSchemaBase {
	OneOf: JsonSchemaTypes[];
}

export interface NotSchemaBase {
	not: JsonSchemaTypes[];
}

export interface ReferenceSchemaBase {
	$ref: string;
}

export interface DynamicReferenceSchemaBase {
	$dynamicRef: string;
}

export type JsonSchemaTypes =
	| TypeArraySchemaBase
	| TypeObjectSchemaBase
	| TypeStringSchemaBase
	| TypeBooleanSchemaBase
	| TypeNumberSchemaBase
	| TypeNullSchemaBase;

export type JsonSchema =
	| EnumSchemaBase
	| ConstSchemaBase
	| JsonSchemaTypes;

export type JsonLogicalSchemas =
	| AnyOfSchemaBase
	| AllOfSchemaBase
	| OneOfSchemaBase
	| NotSchemaBase;

export type TypedUnionSchemaBase<
	A extends JsonSchemaTypes,
	B extends JsonSchemaTypes,
> = Omit<A, "type"> & Omit<B, "type"> & { type: JsonSchemaTYPES[] };

type JsonSchemaInput = JsonSchemaTypes;

// deno-lint-ignore ban-types
type JsonSchemaOutput = {};

export const consts = (i: JsonSchemaInput): ConstSchemaBase => {
	return { const: i };
};

export const enums = (i: JsonSchemaInput[]): EnumSchemaBase => {
	return { enum: i };
};

export const union = (
	a: JsonSchemaInput,
	b: JsonSchemaInput,
): TypedUnionSchemaBase<JsonSchemaInput, JsonSchemaInput> => {
	return {
		...a,
		...b,
		type: [a.type, b.type] as JsonSchemaTYPES[],
	};
};
