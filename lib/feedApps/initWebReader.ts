import type { PromiseOr } from "../../types.ts";
import type { ASTComputable } from "../../types.ts";
import er from "../parsers/helpers/error.ts";
import { superstruct as s } from "../../deps.ts";

const { optional, boolean, object } = s;

export const SetupParams = s.object({
	awsCredLoc: s.string(),
});

/**
 * ## Setup
 * Run this Once at install time
 * provision and configure cloud services & resources that will be needed
 * during ongoing use of the enhancement
 */
export const setup = (i: s.Infer<typeof SetupParams>): Promise<null> => {
	if (SetupParams.is(i)) {
		return Promise.reject(() => er(i, "did not fill in", (new Error()).stack));
	}
	return Promise.resolve(null);
};

export const TeardownParams = object({});

export const teardown = async (
	_i: s.Infer<typeof TeardownParams>,
): Promise<void> => {
};

export const EnhancementParams = object({
	useNeural: optional(boolean()),
});

export const enhancement = () => async (_ast: PromiseOr<ASTComputable>) => {
};
