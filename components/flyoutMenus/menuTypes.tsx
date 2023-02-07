import type { JSX } from "preact";
import type { Icon } from "../../types.ts";

export interface Openable {
  open: boolean;
}

type Nullable<T> = T | null;

export interface SelfOpeningName {
  selected: Nullable<string>;
}

export type StringOrElement = string | (() => JSX.Element);

export interface FocusableMenu {
  menuSetter: (s: Nullable<string>) => void;
}

export type MenuItem = MenuItemString | MeuItemThunk;

export interface MenuItemString {
  name: string;
  desc: string;
  href: string;
  class?: string;
}

export type SimpleMenuProps = SimpleMenuList & SelfOpeningName & FocusableMenu;

export type MeuItemThunk = (props: SimpleMenuProps) => JSX.Element;

export interface SimpleMenuList {
  name: string;
  menu: MenuItem[];
}

const Icon = (props: { icon: Icon; class: string }) => {
  return typeof props.icon === "function" ? props.icon(props.class) : (
    <img
      // class="h-8 w-auto sm:h-10"
      class={props.class}
      src={props.icon.src}
      alt={props.icon.alt}
    />
  );
};

// @todo
// Quit adding future flexibilty
// assume that it wont be used
// add it when I need it
export const StringOrThunk =
  (myClass: string, Tag: keyof JSX.IntrinsicElements = "p") =>
  (props: { text: string | (() => JSX.Element) }) => {
    return typeof props.text === "string"
      ? <Tag class={myClass}>{props.text}</Tag>
      : props.text();
  };

export const truncate = (n: number) => (s: string) =>
  s.length > n ? s.slice(0, n) + "..." : s;
