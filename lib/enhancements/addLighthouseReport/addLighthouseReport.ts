/*
    @Problem: As an SEO person, you may want to run a lighthouse score on a set of links on a schedule.
    @Solution: this enhancement will add lighthouse scores to feed.
*/

// deno-lint-ignore-file require-await
import { ASTChainFunc } from "../index.ts";

import * as jSchema from "jsonSchema";
// import * as s  from "superstruct";

export const addLighthouseReport = ((_targetKeywords: string[]) => async (ast) => {
	return ast;
}) as ASTChainFunc;
export const paramSchema = {
	type: jSchema.TypeName.Array,
	items: jSchema.TypeName.String,
};
