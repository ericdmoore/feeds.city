export type JsonValue =
  | null
  | string
  | number
  | boolean
  | JsonValue[]
  | { [key: string]: JsonValue };

type Dict<T> = { [key: string]: T };
const indexableObj = (i: unknown): i is Dict<JsonValue> =>
  typeof i === "object" && !Array.isArray(i);

/**
 * @param path - sringPath.with.dot.separators
 * @param input - A JSON Value
 */
export const getPath = (
  path: string | string[],
  input: JsonValue,
): JsonValue | undefined => {
  const pathSegments = typeof path === "string" ? path.split(".") : path;
  // .map(s=> {const n = Number.parseInt(s) })
  return pathSegments.reduce((p, seg) => {
    if (indexableObj(p)) {
      if (seg in p) {
        return p[seg] as JsonValue | undefined;
      } else {
        return undefined;
      }
    } else if (Array.isArray(p)) {
      const n = Number.parseInt(seg);
      if (Number.isSafeInteger(n) && n < p.length) {
        return p[n];
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }, input as JsonValue | undefined);
};

export const setPath = (
  path: string | string[],
  replacerValue: JsonValue,
  input: JsonValue,
): JsonValue => {
  const pathSegments = typeof path === "string" ? path.split(".") : path;

  const seg = pathSegments[0];
  if (pathSegments.length === 1) {
    if (indexableObj(input)) {
      if (seg in input) {
        input[seg] = replacerValue;
        return input;
      } else {
        return input;
      }
    } else if (Array.isArray(input)) {
      const n = Number.parseInt(seg);
      if (Number.isSafeInteger(n) && n < input.length) {
        input[n] = replacerValue;
        return input;
      } else {
        return input;
      }
    } else {
      return input;
    }
  } else {
    if (indexableObj(input)) {
      if (seg in input) {
        input[seg] = setPath(pathSegments.slice(1), replacerValue, input[seg]);
        return input;
      } else {
        return input;
      }
    } else if (Array.isArray(input)) {
      const n = Number.parseInt(seg);
      if (Number.isSafeInteger(n) && n < input.length) {
        input[n] = setPath(pathSegments.slice(1), replacerValue, input[n]);
        return input;
      } else {
        return input;
      }
    } else {
      return input;
    }
  }
};

export default getPath;
