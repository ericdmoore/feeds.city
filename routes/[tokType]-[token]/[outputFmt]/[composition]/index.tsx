import type { Handler, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition",
};


const mdAnchor = (href:string, text?:string) => `[${text ?? href}](${href})`

const jsonFenceBlock = (json: unknown) => `
\`\`\`json
${JSON.stringify({ json }, null, 2)}
\`\`\`
`;

export const handler: Handler = (req, ctx) => {
  const u = new URL(req.url);
  const { protocol, host } = u;
  const { token, tokType, outputFmt  } = ctx.params;

  const baseLink = `${protocol}//${host}/${tokType}-${token}/${outputFmt}`
  const exampleComp1 = `func1(a:1)|func2(b:3)`
  const exampleComp2 = `funcA(a:1)|funcB(b:3)`
  const exampleComp3 = `funcA(a:1)|funcB(b:3)|other1|other2`

  const testFeed1 = `https://www.reddit.com/r/programming/.rss`
  const testFeed2 = 'https://datatracker.ietf.org/doc/recent/rss.xml'
  const testFeed3 = 'https://daringfireball.net/feeds/main'

  return new Response(
    `
# TokenInfo:
${jsonFenceBlock({ tokType, token })}

# Runtime context  : 
${jsonFenceBlock({ req, ctx })}

# Example Compositions:
 ${[testFeed1, testFeed2, testFeed3]
   .map((feed) => [
     `- ${mdAnchor(`${baseLink}/${exampleComp1}/${feed}`)}`,
     `- ${mdAnchor(`${baseLink}/${exampleComp2}/${feed}`)}`,
     `- ${mdAnchor(`${baseLink}/${exampleComp3}/${feed}`)}`,
   ].join('\n'))
 }
`,
    { headers: { "content-type": "text/markdown" } },
  );
};
