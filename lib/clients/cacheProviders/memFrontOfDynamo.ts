import { cacheStack, inMem, type RenamerFn } from "../cache.ts";
import { cache as dynamoCache, type IDynamoCacheConfig } from "./dynamo.ts";

export const localizedDynamoStore = (
	dyn: { params: IDynamoCacheConfig },
	local: { max?: number },
	renamer?: RenamerFn,
) =>
	cacheStack(
		inMem(local.max ?? 1024, { renamer }),
		dynamoCache(dyn.params, { renamer }),
	);
