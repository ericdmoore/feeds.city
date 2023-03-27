import type { ASTComputable } from "../../../types.ts";
import type { ASTChainFunc } from "../index.ts";

import { jsonSchema } from "../../../deps.ts";
import { rezVal } from "../../parsers/ast.ts";

export const paramSchema = { type: jsonSchema.TypeName.Object };

export const addKeywordDigest =
  (() => async (input: PromiseLike<ASTComputable>): Promise<ASTComputable> => {
    const i = await input;
    const list = Array.isArray(i.item.list) ? i.item.list : await i.item.list();

    return {
      ...input,
      item: {
        list: () =>
          Promise.all(list.map(
            async (i) => {
              const content = await rezVal(i.content);
              let md: string | undefined;
              if (!content.markdown) {
                // const html = content?.html;
                // md = await convertToMD(html);
              } else {
                md = content.markdown;
              }

              // const kw = await determineKeywords(md);
              return {
                ...i,
                content: {
                  ...i.content,
                  markdown: md,
                  // text: kw.bodyTextVersion,
                },
                __analysis: {
                  // keywords: [...kw.keywords ?? []],
                  // keyphrases: [...kw.keyphrases ?? []],
                },
              };
            },
          )),
      },
    };
  }) as ASTChainFunc;
