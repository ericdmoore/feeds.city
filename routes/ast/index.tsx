import { HandlerContext } from "$fresh/server.ts";

export const handler = (req: Request, ctx: HandlerContext): Response => {
  return new Response(`ast directory: 
    - ${JSON.stringify({req, ctx}, null, 2) }
  `);
};
