import type { Handler, RouteConfig } from "$fresh/server.ts";
import { type EnhanceFeed, loadFeed } from "$lib/parsers/index.ts";

import { Status } from "$std/http/http_status.ts";
import { isLeft, isRight } from "$lib/types.ts";
import { defaultedOptions, functions } from "$lib/parsers/enhancementFunctions.ts";

import {} from "$lib/enhancements/index.ts";

export const config: RouteConfig = {
	routeOverride: "/api/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition/:url(http.*)",
};

export const handler: Handler = async (req, ctx) => {
	const { url, composition } = ctx.params;
	const outputType = ctx.params.outputFmt as "json" | "ast" | "rss" | "atom";
	const parsed = await functions.parse(defaultedOptions)(composition);

	if (isLeft(parsed)) {
		return new Response(`${parsed.left}`, {
			status: Status.BadRequest,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} else {
		const loaded = loadFeed({params:{}}).fromURL(url).using(parsed.right);

		let r: EnhanceFeed;
		switch (outputType) {
			case "json":
				r = await loaded.toJsonFeed();
				break;
			case "ast":
				r = await loaded.toCity();
				break;
			case "rss":
				r = await loaded.toRSS();
				break;
			case "atom":
				r = await loaded.toAtom();
				break;
			default:
				r = null as never;
		}

		if (r.messages.errors.length > 0) {
			return new Response(r.string, {
				status: Status.UnprocessableEntity,
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			return new Response(r.string, {
				status: Status.OK,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
	}
};
