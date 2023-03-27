export type JSONPrim =
  | string
  | number
  | boolean
  | undefined;
export type JSONObject = { [x: string]: JSONPrim | JSONObject | JSONArray };
export type JSONArray = Array<JSONPrim | JSONObject | JSONArray>;
export type JSONStruct = JSONPrim | JSONObject | JSONArray;

const removeUndefinedsFromObjectArray = (i: JSONArray): JSONArray => {
  return i
    .filter((v) => v) // removes undefined
    .map((v) => {
      return typeof v === "object"
        ? Array.isArray(v)
          ? removeUndefinedsFromObjectArray(v)
          : removeUndefinedsFromObject(v)
        : v;
    });
};

const removeUndefinedsFromObject = (i: JSONObject): JSONObject => {
  const ent = Object.entries(i)
    .filter(([_, v]) => v) // removes undefined values
    .map(([k, v]) => {
      return typeof v === "object"
        ? Array.isArray(v)
          ? [k, removeUndefinedsFromObjectArray(v)]
          : [k, removeUndefinedsFromObject(v)]
        : [k, v];
    });
  return Object.fromEntries(ent) as JSONObject;
};

export const removeUndef = (i: JSONStruct): JSONStruct => {
  return typeof i === "object"
    ? Array.isArray(i)
      ? removeUndefinedsFromObjectArray(i)
      : removeUndefinedsFromObject(i)
    : i;
};

export default removeUndef;
