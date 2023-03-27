import type { Handler, HandlerContext, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/ast/:url(http.*)",
};

const jsonFenceBlock = (json: unknown) => `
\`\`\`json
${JSON.stringify(json, null, 2)}
\`\`\`
`;

const mdLink = (url: string, text?: string) => `[${text ?? url}](${url})`;

export const handler: Handler = (req: Request, ctx: HandlerContext) => {
  const u = new URL(req.url);
  const { protocol, host } = u;

  return new Response(
    `
# TokenInfo:
${jsonFenceBlock(ctx.params)}

# More Routes:
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample1/http://example.com/feed`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample2/http://example.com/feed`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample3/http://example.com/feed`,
      )
    }
- ${
      mdLink(
        `${protocol}//${host}/ast/compositionExample4/http://example.com/feed`,
      )
    }

# Runtime context  : 
${jsonFenceBlock({ req, ctx })}

`,
    { headers: { "content-type": "text/plain" } },
  );
};
