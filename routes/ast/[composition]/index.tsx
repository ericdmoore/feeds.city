import type { Handler, HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/ast/:composition",
};

export const handler: Handler = (req: Request, ctx: HandlerContext) => {
  const a = 1;

  return new Response(`ast/:composition direcotry
    - ${JSON.stringify({ req, ctx }, null, 2)}
  `);
};
