import type { ISupportedTypes, TypedValidator } from "./start.ts";
import type {
  AST as _AST,
  ASTcomputable,
  ASTFeedItemJson,
  ASTjson,
} from "./parsers/ast.ts";

export type PaginationResp<T> = Promise<
  { val: T; canPrev: boolean; canNext: boolean }
>;

export interface IValidate<T> {
  _: T;
  url: string;
  inputKind: "rss" | "atom" | "sitemap" | "jsonfeed" | "scrape";
  clone: TypedValidator;
  paginateFrom: (pos?: number, offset?: number) => PaginationResp<T>;
  validate: () => Promise<T>;
  prev: () => PaginationResp<T>;
  next: () => PaginationResp<T>;
  toAST: () => Promise<ASTcomputable>;
  toString: () => string;
  fromAST: (ast: ASTjson | ASTComputable, ...other: unknown[]) => Promise<T>;
}

export type PromiseOr<T> = T | Promise<T>;

export interface ASTShell {
  ast: _AST;
  pos: {
    pageBy: number;
    total: number;
    cur: number;
    remaining: number;
  };
  changeState: {
    next: () => Promise<ASTShell>;
    prev: () => Promise<ASTShell>;
  };
  items: {
    stream: () => ReadableStream<typeof ASTFeedItemJson.TYPE[]>;
    iter: () => AsyncGenerator<typeof ASTFeedItemJson.TYPE[]>;
    all: () => Promise<typeof ASTFeedItemJson.TYPE[]>;
  };
  parserData: ISupportedTypes;
  use: (Fns: MapperFn[]) => Promise<ASTShell>;
  toXML: () => string;
}

export type ReducerFn = (
  prior: ASTShell,
  cur: ASTShell,
  i: number,
  all: ASTShell[],
) => Promise<ASTShell>;

export type MapperFn = (input: ASTShell) => Promise<ASTShell>;
export type AST = _AST;
export type ASTComputable = ASTcomputable;
export type ASTJson = ASTjson;
// export type VFile = unified.VFileWithOutput<undefined>
