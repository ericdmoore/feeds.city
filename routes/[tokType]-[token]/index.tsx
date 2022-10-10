import type{ RouteConfig, HandlerContext } from "$fresh/server.ts";

export const config: RouteConfig = {
    routeOverride: "/:tokType(u|t)-:token"
};
  
export const handler = (req: Request, ctx: HandlerContext): Response => {
    // const { token } = ctx.params;
    return new Response(`token privelges: 
        - ${JSON.stringify({req, ctx}, null, 2) }`
    );
};
