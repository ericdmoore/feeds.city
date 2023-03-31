import type { Handler, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition",
};

export const handler: Handler = (req, ctx) => {
  return new Response(`Show Composition options: 
    - ${JSON.stringify({ req, ctx }, null, 2)}`);
};
