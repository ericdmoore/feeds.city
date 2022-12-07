// https://tailwindcss.com/docs/customizing-colors
// console.log([...document.getElementById('default-color-palette').nextSibling.nextSibling.nextSibling.children].map(node => `'${node.firstChild.firstChild.innerText}'`).join('| '))

import type { JSX } from "preact";

export type Color =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "yeal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

interface IconSrc {
  src: string;
  alt: string;
}

export type Icon = IconSrc | (() => JSX.Element);

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
export type Either<R, L = Error> = NonNullable<Right<R> | Left<L>>;

export const Nothing = (): Nothing => ({ type: TypeNames.Nothing });
export const Just = <J>(val: J): Just<J> => ({ type: TypeNames.Just, val });
export const Left = <L>(left: L): Left<L> =>
  ({ type: TypeNames.Left, left }) as Left<L>;
export const Right = <R>(right: R): Right<R> =>
  ({ type: TypeNames.Right, right }) as Right<R>;
export const Ither = <R, L>(leftOrRight: Right<R> | Left<L>): Either<R, L> =>
  leftOrRight.type === TypeNames.Left
    ? Left(leftOrRight.left)
    : Right(leftOrRight.right);
export const ItherMerge = <R, L>(
  A: Either<Partial<R>, L>,
  B: Either<Partial<R>, L>,
): Either<R, L> =>
  A.left || B.left
    ? Left(A.left ?? B.left)
    : Right({ ...A.right, ...B.right } as R);
