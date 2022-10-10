import { HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/ast/:composition/:url(http.*)",
};

export const handler = (req: Request, ctx: HandlerContext): Response => {
  return new Response(`ast/:composition/:url
    - ${JSON.stringify({req, ctx}, null, 2) }
  `);
};