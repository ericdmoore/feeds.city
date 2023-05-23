import * as superstruct from "superstruct";

export const maybe = <T>(type: superstruct.Struct<T>) => superstruct.optional(type);

export type Dict<T> = { [key: string]: T };
