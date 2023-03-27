import type { Handler, HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token",
};

const jsonFenceBlock = (json: unknown) => `
\`\`\`json
${JSON.stringify({ json }, null, 2)}
\`\`\`
`;

export const handler: Handler = (req: Request, ctx: HandlerContext) => {
  const { token, tokType } = ctx.params;
  const u = new URL(req.url);
  const { protocol, host } = u;

  return new Response(
    `
# TokenInfo:
${jsonFenceBlock({ tokType, token })}


# More Routes:
- [${protocol}//${host}/${tokType}-${token}/json](${protocol}//${host}/${tokType}-${token}/json)
- [${protocol}//${host}/${tokType}-${token}/rss](${protocol}//${host}/${tokType}-${token}/rss)
- [${protocol}//${host}/${tokType}-${token}/atom](${protocol}//${host}/${tokType}-${token}/atom)
- [${protocol}//${host}/${tokType}-${token}/ast](${protocol}//${host}/${tokType}-${token}/ast)

# Runtime context  : 
${jsonFenceBlock({ req, ctx })}


`,
    { headers: { "content-type": "text/plain" } },
  );
};
