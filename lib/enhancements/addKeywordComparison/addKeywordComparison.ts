// deno-lint-ignore-file require-await
import { ASTChainFunc } from "../index.ts";
import * as jSchema from "jsonSchema";
// import * as s  from "superstruct";

export const addKeywordComparison =
  ((_targetKeywords: string[]) => async (ast) => {
    return ast;
  }) as ASTChainFunc;
export const paramSchema = {
  type: jSchema.TypeName.Array,
  items: jSchema.TypeName.String,
};
