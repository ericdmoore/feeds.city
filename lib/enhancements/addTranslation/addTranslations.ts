/**
 * https://aws.amazon.com/translate/
 */

// deno-lint-ignore-file require-await
import { ASTChainFunc } from "../index.ts";
import * as jsonSchema from "jsonSchema";

export const addTranslations = ((_targetKeywords: string[]) => async (ast) => {
	return ast;
}) as ASTChainFunc;
export const paramSchema = {
	type: jsonSchema.TypeName.Array,
	items: jsonSchema.TypeName.String,
};
