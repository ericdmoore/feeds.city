import type { HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/ast/:composition",
};

export const handler = (req: Request, ctx: HandlerContext): Response => {
  return new Response(`ast/:composition direcotry
    - ${JSON.stringify({ req, ctx }, null, 2)}
  `);
};
