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

// https://tailwindcss.com/docs/customizing-colors
// console.log([...document.getElementById('default-color-palette').nextSibling.nextSibling.nextSibling.children].map(node => `'${node.firstChild.firstChild.innerText}'`).join('| '))

import type { JSX } from "preact";

export const Color = {
  "slate": "slate",
  "gray": "gray",
  "zinc": "zinc",
  "neutral": "neutral",
  "stone": "stone",
  "red": "red",
  "orange": "orange",
  "amber": "amber",
  "yellow": "yellow",
  "lime": "lime",
  "green": "green",
  "emerald": "emerald",
  "yeal": "yeal",
  "cyan": "cyan",
  "sky": "sky",
  "blue": "blue",
  "indigo": "indigo",
  "violet": "violet",
  "purple": "purple",
  "fuchsia": "fuchsia",
  "pink": "pink",
  "rose": "rose",
  "white": "white",
} as const;

export interface ImgSrc {
  src: string;
  alt: string;
}

export type Icon = ImgSrc | ((class_?: string) => JSX.Element);

export interface IconText {
  i: Icon;
  text: string;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[]
    // deno-lint-ignore ban-types
    : T[P] extends object ? RecursivePartial<T[P]>
    : T[P];
};

export enum TypeNames {
  Just = "maybe-type__just",
  Nothing = "maybe-type__nothing",
  Left = "either-type__left",
  Right = "either-type__right",
}

export interface Just<T> {
  type: typeof TypeNames.Just;
  val: T;
}
export interface Nothing {
  type: typeof TypeNames.Nothing;
  val: null;
}

export interface Left<L> {
  type: TypeNames.Left;
  left: L;
  right: never;
}
export interface Right<R> {
  type: TypeNames.Right;
  right: R;
  left: never;
}

export type Maybe<J> = Just<J> | Nothing;

export const Nothing = (): Nothing => ({ type: TypeNames.Nothing, val: null });
export const Just = <J>(val: J): Just<J> => ({ type: TypeNames.Just, val });

export const Left = <L>(left: L): Left<L> =>
  ({ type: TypeNames.Left, left }) as Left<L>;

export const Right = <R>(right: R): Right<R> =>
  ({ type: TypeNames.Right, right }) as Right<R>;

export type Either<R, L = Error> = NonNullable<Right<R> | Left<L>>;

export const Either = <R, L>(leftOrRight: Right<R> | Left<L>): Either<R, L> =>
  leftOrRight.type === TypeNames.Left
    ? Left(leftOrRight.left)
    : Right(leftOrRight.right);

type RightSideMapFn<R, L, R2, L2> = (
  v: Right<R>,
  i: number,
  arr: Either<R, L>[],
) => Either<R2, L2>;
type LeftSideMapFn<R, L, R2, L2> = (
  v: Left<L>,
  i: number,
  arr: Either<R, L>[],
) => Either<R2, L2>;

export const isRight = <R, L>(ither: Either<R, L>): ither is Right<R> =>
  !!ither.right;
export const isLeft = <R, L>(ither: Either<R, L>): ither is Left<L> =>
  !!ither.left;

export type EitherMap = <R, L, R2, L2>(
  v: Either<R, L>[],
  r: RightSideMapFn<R, L, R2, L2>,
  l: LeftSideMapFn<R, L, R2, L2>,
) => Either<R2, L2>[];

export const EitherMap = <R, L, R2, L2>(
  v: Either<R, L>[],
  r: RightSideMapFn<R, L, R2, L2>,
  l: LeftSideMapFn<R, L, R2, L2>,
) =>
  v.map((v, i, arr) => {
    return v.type === TypeNames.Right ? r(v, i, arr) : l(v, i, arr);
  });

export type ChannelReducer<R, L, R2, L2> = (
  acc: Either<R, L>,
  v: Either<R, L>,
  i: number,
  arr: Either<R, L>[],
) => Promise<Either<R2, L2>>;

export const ItherMerge = <R extends Record<string, unknown>, L>(
  A: Either<Partial<R>, L>,
  B: Either<Partial<R>, L>,
): Either<R, L> =>
  A.left || B.left
    ? Left(A.left ?? B.left)
    : Right({ ...A.right, ...B.right } as R);
