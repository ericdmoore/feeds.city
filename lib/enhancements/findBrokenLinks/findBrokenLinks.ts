/*
@Problem: If you write a sufficently large corpus, you need help ensuring your links dont rot.
            Links to your own content may move, and certainly your external links may wither.
            So you can be notified of your link-rot by subscribbibg to this feed that shows broken links.
@Solution: Enahnce another feed by adding link-checking.
*/

// deno-lint-ignore-file require-await
import { ASTChainFunc } from "../index.ts";
import { jsonSchema } from "../../../deps.ts";

export const findBrokenLinks = ((_targetKeywords: string[]) => async (ast) => {
  return ast;
}) as ASTChainFunc;

export const paramSchema = {
  type: jsonSchema.TypeName.Array,
  items: jsonSchema.TypeName.String,
};
