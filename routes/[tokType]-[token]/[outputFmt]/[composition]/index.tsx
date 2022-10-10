import type { RouteConfig, HandlerContext } from "$fresh/server.ts";
import {handler as h} from '../../../ast/index.tsx'

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition"
};

export const handler = h