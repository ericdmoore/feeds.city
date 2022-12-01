import type { HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/ast/:url(http.*)",
};

export const handler = (req: Request, ctx: HandlerContext): Response => {
  return new Response(`AST Explorer
    - ${JSON.stringify({ req, ctx }, null, 2)}
  `);
};
