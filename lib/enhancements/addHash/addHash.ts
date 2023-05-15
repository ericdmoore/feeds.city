/* */

// import type { EnhancementModule } from "../index.ts";
import * as jSchema from "jsonSchema";
import type { ASTComputable, PromiseOr } from "../../types.ts";
import { rezVal } from "$lib/parsers/ast.ts";
import { cidStr } from "$lib/analysis/calcMultihash.ts";

export const addHash =
  (_i?: unknown) =>
  async (ast: PromiseOr<ASTComputable>): Promise<ASTComputable> => {
    ast = await ast as ASTComputable;
    const _meta = await rezVal(ast._meta);
    const list = await rezVal(ast.item.list);

    const itemHashes = await Promise.all(list.map(async (i) => {
      const { html, text, markdown } = await rezVal(i.content);
      const content = text ?? markdown ?? html;
      const type = text ? "text" : html ? "html" : markdown ? "markdown" : null;
      return { type, hash: content ? await cidStr(content) : undefined };
    }));

    const concatValidHashses = itemHashes.filter((v) => v).map((i) => i.hash)
      .join("");

    return {
      ...ast,
      _meta: {
        ..._meta,
        _type: "computable",
        source: {
          t: Date.now(),
          url: (await rezVal(ast.links)).sourceURL,
          hash: await cidStr(concatValidHashses),
          from: "blend",
        },
      },
      item: {
        list: await Promise.all(list.map(async (item, i) => {
          const c = await rezVal(item.content);
          return {
            ...item,
            content: {
              ...c,
              source: {
                url: item.url,
                t: Date.now(),
                hash: itemHashes[i].hash,
                from: itemHashes[i].type,
              },
            },
          };
        })),
      },
    } as ASTComputable;
  };

export const paramSchema = {
  nullable: true,
  type: [
    jSchema.TypeName.Null,
    jSchema.TypeName.Object,
    jSchema.TypeName.String,
  ],
};
