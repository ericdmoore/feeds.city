import type { HandlerContext, RouteConfig } from "$fresh/server.ts";
import { config as cfg, handler as h } from "../../../ast/[url].tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition/:url(http.*)",
};
export const handler = h;
