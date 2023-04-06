import type { Handler, HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token/:outputFmt(json|html|atom|rss)",
};

const jsonFenceBlock = (json: unknown) => `
\`\`\`json
${JSON.stringify({ json }, null, 2)}
\`\`\`
`;

export const handler: Handler = (req: Request, ctx: HandlerContext) => {
  const u = new URL(req.url);
  const { protocol, host } = u;
  const { token, tokType, outputFmt  } = ctx.params;

  const baseLink = `${protocol}//${host}/${tokType}-${token}/${outputFmt}`
  const exampleComp1 = `func1(a:1)|func2(b:3)`
  const exampleComp2 = `funcA(a:1)|funcB(b:3)`
  const exampleComp3 = `funcA(a:1)|funcB(b:3)|other1|other2`

  return new Response(
    `
# TokenInfo:
${jsonFenceBlock({ tokType, token })}

# Runtime context  : 
${jsonFenceBlock({ req, ctx })}

# Example Compositions:
- [${baseLink}/${exampleComp1}](${baseLink}/${exampleComp1})
- [${baseLink}/${exampleComp2}](${baseLink}/${exampleComp2})
- [${baseLink}/${exampleComp3}](${baseLink}/${exampleComp3})

`,
    { headers: { "content-type": "text/plain" } },
  );
};
