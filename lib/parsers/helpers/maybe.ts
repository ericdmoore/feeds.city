import { superstruct } from "../../../deps.ts";
export const maybe = <T>(type: superstruct.Struct<T>) =>
  superstruct.optional(type);

export type Dict<T> = { [key: string]: T };
