import type { Handler, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token/:outputFmt(json|html|atom|rss)",
};

export const handler: Handler = (req, ctx) => {
  return new Response(`Show Composition Options: 
    - ${JSON.stringify({ req, ctx }, null, 2)}`);
};
