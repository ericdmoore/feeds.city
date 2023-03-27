import { HandlerContext, RouteConfig } from "$fresh/server.ts";

const jsonFenceBlock = (json: unknown) => `
\`\`\`json
${JSON.stringify(json, null, 2)}
\`\`\`
`;
const mdLink = (url: string, text?: string) => `[${text ?? url}](${url})`;

export const config: RouteConfig = {
  routeOverride: "/ast/:composition/:url(http.*)",
};

export const handler = (req: Request, ctx: HandlerContext): Response => {
  const u = new URL(req.url);
  const { protocol, host } = u;

  return new Response(
    `
# Composition Viewer

## Params Info:
${jsonFenceBlock({ ...ctx.params })}

## Composition Breakdown

## More Routes:
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample1/http://example.com/feed.md`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample2/http://example.com/feed.md`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample3/http://example.com/feed.md`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample4/http://example.com/feed.md`,
      )
    }

## Runtime context  : 
${jsonFenceBlock({ req, ctx })}
`,
    { headers: { "content-type": "text/plain" } },
  );
};
