import type{ RouteConfig, HandlerContext } from "$fresh/server.ts";
import {handler as h, config as cfg} from '../../../ast/[url].tsx'

export const config: RouteConfig = {
    routeOverride: "/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition/:url(http.*)"
}
export const handler = h