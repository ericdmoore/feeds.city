// Not sure if this is what we want for the run.ts

import { addHash } from "./addHash.ts";
import { enhancementAdapter } from "../../../lib/parsers/index.ts";
export const fn = enhancementAdapter(addHash);
export default fn;
