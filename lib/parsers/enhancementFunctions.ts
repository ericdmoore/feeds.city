// deno-lint-ignore-file require-await
/*
Rusty Double colon
Content Encoding Prefixes (Comma Separated) :: Value
Example:

STR,B64::{{btoa value here}} - sa::
STR,BR,B64::{{btoa value here}} - sba::
STR,GZ,B64::{{btoa value here}} - sga::

JSON,B64::{{btoa value here}} - ja::
JSON,GZ,B64::{{btoa value here}} - jga::
JSON,BR,B64::{{btoa value here}} - jba::

BSON,B64::{{btoa value here}} - ba::

*/
import { type PromiseOr } from "../types.ts";
import * as bson from "bson_deno";
import * as base64url from '$std/encoding/base64url.ts'

import {
  compress as zstdCompress,
  decompress as zstdDecompress,
} from "zstd_wasm";
import { gzipDecode, gzipEncode } from "gzip_wasm";
import { 
  compress as brCompress, 
  decompress as brDecompress 
} from "brotli";

type Dict<T> = { [key: string]: T };

export enum CryptoKeyUsages {
  "encrypt" = "encrypt",
  "decrypt" = "decrypt",
  "sign" = "sign",
  "verify" = "verify",
  "deriveKey" = "deriveKey",
  "deriveBits" = "deriveBits",
  "wrapKey" = "wrapKey",
  "unwrapKey" = "unwrapKey",
}

export enum JWS_ALG {
  "HS256" = "HS256",
  "HS384" = "HS384",
  "HS512" = "HS512",
  "RS256" = "RS256",
  "RS384" = "RS384",
  "RS512" = "RS512",
  "ES256" = "ES256",
  "ES384" = "ES384",
  "ES512" = "ES512",
  "PS256" = "PS256",
  "PS384" = "PS384",
  "PS512" = "PS512",
}

export enum JWE_ALG {
  "RSA1_5" = "RSA1_5",
  "RSA-OAEP" = "RSA-OAEP",
  "RSA-OAEP-256" = "RSA-OAEP-256",
  "ECDH-ES " = "ECDH-ES ",
  "A128KW" = "A128KW",
  "A192KW" = "A192KW",
  "A256KW" = "A256KW",
}

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

export type EncryptableEncoderFn = (
  key: JsonWebKey,
) => (data: Uint8Array) => Promise<string>;
export type DecryptableEncoderFn = (
  key: JsonWebKey,
) => (str: string) => Promise<Uint8Array>;

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
export const ItherAdd = <R, L>(
  A: Either<Partial<R>, L>,
  B: Either<Partial<R>, L>,
): Either<R, L> =>
  A.left || B.left
    ? Left(A.left ?? B.left)
    : Right({ ...A.right, ...B.right } as R);

export type BareParams = number | boolean | null;
export type EncodedParams =
  | string
  | FunctionBuilderParamInputs
  | EncodedParams[];
export interface FunctionBuilderParamInputs {
  [paramName: string]: BareParams | EncodedParams;
}
export interface FunctionPathBuilderInputDict {
  [fName: string]: FunctionBuilderParamInputs;
}
export type FuncInterface = {
  fname: string;
  params?: Dict<string>;
  errors?: string[];
  messages?: string[];
};

export interface DiscoveryStruct {
  funcs: string[];
  str: string;
}

export interface FunctionParsingOptions {
  functionDelim: string;
  argValueDelim: string;
  argListDelim: string;
  paramStart: string;
  paramEnd: string;
  legendDelim: string;
  legendSeperator: string;
  legendOpts: {
    hurdle: number;
    strategy: {
      unknown: string[];
      string: string[];
      object: string[];
      keys: Dict<string[]>;
    };
  };
  auto: {
    stringifyArrays: boolean;
  };
  encryptionKeys?: {
    privateJWK: JsonWebKey | string; // JSON String
    publicJWK: JsonWebKey | string; // JSON String
  };
}

const dec = new TextDecoder();
const enc = new TextEncoder();

export const configMaker = (
  encryptionKeys?: {
    privateJWK: JsonWebKey | string;
    publicJWK: JsonWebKey | string;
  },
  keysStrategy = {} as { [keyName: string]: [string, string] },
  unknownStrategy = ["ja", "jba"] as [string, string],
  stringStrategy = ["sa", "sba"] as [string, string],
  objectStrategy = ["ja", "jba"] as [string, string],
  hurdle = 512,
  stringifyArrays = true,
  functionDelim = "+",
  paramStart = "(",
  paramEnd = ")",
  argValueDelim = "=",
  argListDelim = "&",
  legendDelim = ",",
  legendSeperator = "::",
) =>
  Object.freeze({
    functionDelim,
    paramStart,
    paramEnd,
    argValueDelim,
    argListDelim,
    legendDelim,
    legendSeperator,
    encryptionKeys,
    auto: { stringifyArrays },
    legendOpts: {
      hurdle,
      strategy: {
        unknown: unknownStrategy,
        string: stringStrategy,
        object: objectStrategy,
        keys: keysStrategy,
      },
    },
  } as FunctionParsingOptions);

export const defaultedOptions = configMaker();

const isBareParam = (obj: BareParams | EncodedParams): obj is BareParams => {
  return typeof obj === "number" ||
    obj instanceof Number ||
    typeof obj === "boolean" ||
    obj instanceof Boolean ||
    obj === null;
};

const intersection = <T>(A: T[], B: T[]) => A.filter((e) => B.includes(e));

export const functionsStruct = (() => {
  const strEnc = async (text: string) => enc.encode(text);
  const jsonEnc = async (obj: unknown) => 
    enc.encode(JSON.stringify(await obj));
    // new Uint8Array(await nodeBuffer.Buffer.from(JSON.stringify(obj), "utf8").buffer);
  
  const bsonEnc = async (obj: unknown) =>
    new Uint8Array(await bson.serialize(obj as bson.Document));

  const strDec = async (data: Uint8Array) => dec.decode(data);
  const jsonDec = async (data: Uint8Array) => JSON.parse(dec.decode(data));
  const bsonDec = async (obj: Uint8Array) => bson.deserialize(await obj);

  return Object.freeze({
    // data -> UInt8Array
    toURL: {
      STR: strEnc,
      s: strEnc,
      JSON: jsonEnc,
      j: jsonEnc,
      BSON: bsonEnc,
      m: bsonEnc,
    } as { [funcName: string]: (d: unknown) => Promise<Uint8Array> },
    // data <- UInt8Array
    fromURL: {
      STR: strDec,
      s: strDec,
      JSON: jsonDec,
      j: jsonDec,
      BSON: bsonDec,
      m: bsonDec,
    } as { [funcName: string]: (d: Uint8Array) => Promise<unknown> },
  });
})();

export const functionsTransforms = (() => {
  const gzEnc = async (bytes: Uint8Array) => await gzipEncode(bytes);
  const brEnc = async (bytes: Uint8Array) => await brCompress(bytes);
  const zEnc = async (bytes: Uint8Array) => await zstdCompress(bytes);

  const gzDec = async (bytes: Uint8Array) => await gzipDecode(bytes);
  const brDec = async (bytes: Uint8Array) => await brDecompress(bytes);
  const zDec = async (i: Uint8Array) => new Uint8Array(await zstdDecompress(i));

  return Object.freeze({
    toURL: {
      GZ: gzEnc,
      g: gzEnc,
      BR: brEnc,
      b: brEnc,
      ZSTD: zEnc,
      z: zEnc,
    } as { [transformName: string]: (i: Uint8Array) => Promise<Uint8Array> },
    fromURL: {
      GZ: gzDec,
      g: gzDec,
      BR: brDec,
      b: brDec,
      ZSTD: zDec,
      z: zDec,
    } as { [transformName: string]: (i: Uint8Array) => Promise<Uint8Array> },
  });
})();

export const jwkRSAtoCryptoKey = async (
  key: PromiseOr<JsonWebKey>,
  usages: KeyUsage[] = [CryptoKeyUsages.encrypt],
) =>  crypto.subtle.importKey(
  "jwk",
  await key,
  { name: JWE_ALG["RSA-OAEP"], hash: {name: "SHA-256" }},
  true,
  usages,
);

export const functionsEncodings = (() => {
  const B64toURL = async (data: PromiseOr<Uint8Array>):Promise<string> =>
    base64url.encode(await data)
  const B64fromURL = async (URLstring: string):Promise<Uint8Array> =>
    base64url.decode(await URLstring)
  const JWEtoURL = (pubKey: JsonWebKey) => async (data: Uint8Array) => {
    const cryptoPubKey = await jwkRSAtoCryptoKey(pubKey, [
      CryptoKeyUsages.encrypt,
    ]);
    const encBuffer = await crypto.subtle.encrypt(
      { name: JWE_ALG["RSA-OAEP"] },
      cryptoPubKey,
      data,
    )
    console.log('line 319::',data, encBuffer.byteLength, new Uint8Array(encBuffer.slice(0,30)));
    return B64toURL(new Uint8Array(encBuffer));
  };

  const JWEFromURL = (privkey: JsonWebKey) => async (URLstring: string) => {
    const data = await B64fromURL(URLstring);
    const cryptoPrivKey = await jwkRSAtoCryptoKey(privkey, [
      CryptoKeyUsages.decrypt,
    ]);
    const unencBuffer = await crypto.subtle.decrypt(
      { name: JWE_ALG["RSA-OAEP"] },
      cryptoPrivKey,
      data,
    );
    return new Uint8Array(unencBuffer);
  };
  return Object.freeze({
    toURL: {
      B64: () => B64toURL,
      a: () => B64toURL,
      JWE: JWEtoURL, // already 2 arity
      e: JWEtoURL, // already 2 arity
    } as Dict<EncryptableEncoderFn>,
    fromURL: {
      B64: () => B64fromURL,
      a: () => B64fromURL,
      JWE: JWEFromURL,
      e: JWEFromURL,
    } as Dict<DecryptableEncoderFn>,
  });
})();

// ASSUMES symetry on to and From URL sides
export const functionAbrevAvailable = [
  ...new Set([
    ...Object.keys(functionsEncodings.toURL),
    ...Object.keys(functionsTransforms.toURL),
    ...Object.keys(functionsStruct.toURL),
  ]),
];

const sortingWeightsForFunctionTypes = Object.freeze(Object.fromEntries([
  ...Object.keys(functionsStruct.toURL).map((f) => [f, -1]),
  ...Object.keys(functionsTransforms.toURL).map((f) => [f, 0]),
  ...Object.keys(functionsEncodings.toURL).map((f) => [f, 1]),
])) as { [funcNames: string]: number };

export const sortValidFuncs = (
  funcs: string[],
  sortFn?: (funcA: unknown, funcB: unknown) => number,
): string[] => {
  return sortFn
    ? funcs.sort(sortFn)
    : funcs.sort((a, z) =>
      sortingWeightsForFunctionTypes[a] - sortingWeightsForFunctionTypes[z]
    );
};

const tryJSONparse = (s: string): Either<unknown> => {
  try {
    return Right(JSON.parse(s));
  } catch (_er) {
    return Left(Error(_er));
  }
};

export const legends = (() => {
  /**
   * Is Legend Input Valid?
   * @param legend - the pre-split array of characters in the legend, usually the output of parse
   */
  const isValid = (legend: string[]): boolean => {
    const hasOnlyOneStrucFn =
      intersection(legend, Object.keys(functionsStruct.toURL)).length === 1;
    const hasOnlyOneEnc =
      intersection(legend, Object.keys(functionsEncodings.toURL)).length === 1;
    if (hasOnlyOneStrucFn && hasOnlyOneEnc) {
      const middleFuncLetters = legend.filter((f) =>
        !Object.keys(functionsEncodings.toURL).includes(f)
      )
        .filter((f) => !Object.keys(functionsStruct.toURL).includes(f));

      const hasUnrepeatedMiddleFns =
        middleFuncLetters.length === [...new Set(middleFuncLetters)].length;
      // console.warn({hasOnlyOneStrucFn, hasOnlyOneEnc, hasUnrepeatedMiddleFns})
      return hasUnrepeatedMiddleFns;
    } else {
      // console.warn({hasOnlyOneStrucFn, hasOnlyOneEnc})
      return false;
    }
  };

  const parse =
    (opts: FunctionParsingOptions = defaultedOptions) =>
    (legend: string): Either<string[]> => {
      const val = legend.includes(opts.legendDelim)
        ? legend.split(opts.legendDelim)
        : legend.split("");
      return !val.every((f) => functionAbrevAvailable.includes(f))
        ? Left(
          Error(
            `Found invalid encoding functions: ${
              val.filter((f) => !!functionAbrevAvailable.includes(f)).join(",")
            }`,
          ),
        )
        : isValid(val)
        ? Right(sortValidFuncs(val))
        : Left(
          Error(
            `The content encoding legend must have 1 structure & 1 encoding function, middle/ transform funcs are optional, but not repeatable`,
          ),
        );
    };

  /**
   * ## Input Types:
   * - {string}				// bare param form
   * - {legend}::{string} 	// standard form
   * - ::{string} 			// implied default form
   */
  const discover =
    (opts: FunctionParsingOptions = defaultedOptions) =>
    (maybeLegend?: string): Either<DiscoveryStruct> => {
      // console.log({maybeLegend})
      if (maybeLegend && maybeLegend.includes(opts.legendSeperator)) {
        const parsedLeg = parse(opts)(
          maybeLegend.split(opts.legendSeperator)[0],
        );
        if (maybeLegend.split(opts.legendSeperator)[0].length > 0) {
          return parsedLeg.left ? Left(parsedLeg.left) : Right({
            funcs: parsedLeg.right,
            str: maybeLegend.split(opts.legendSeperator)[1],
          });
        } else {
          const pl = parse(opts)(opts.legendOpts.strategy.unknown[0]);
          return pl.left ? Left(pl.left) : Right({
            funcs: pl.right,
            str: maybeLegend.split(opts.legendSeperator)[1],
          });
        }
      } else {
        return !maybeLegend
          ? Left(Error("need some input string to imply an legend from"))
          : maybeLegend.length > opts.legendOpts.hurdle
          ? Right({
            funcs: opts.legendOpts.strategy.unknown[0].split(""),
            str: maybeLegend,
          })
          : Right({
            funcs: opts.legendOpts.strategy.unknown[1].split(""),
            str: maybeLegend,
          });
      }
    };

  const stringify = (legend: string[]) =>
    legend.every((tok) => tok.toLowerCase() === tok)
      ? legend.join("")
      : legend.join(",");

  return { parse, stringify, discover, isValid };
})();

type ValidationMode = ParseMode | StrinifyMode;

interface ParseMode {
  mode: "parse";
  input: string;
}
interface StrinifyMode {
  mode: "stringify";
  input: BareParams | EncodedParams;
}

export const paramElement = (() => {
  const stringifyValidate = (
    _data: BareParams | EncodedParams,
    opts: FunctionParsingOptions,
  ): Either<boolean> => {
    return Right(!!opts);
  };
  const parseValidate = (
    _str: string,
    opts: FunctionParsingOptions,
  ): Either<boolean> => {
    return Right(!!opts);
  };
  const validate = (
    opts: FunctionParsingOptions,
    legend: Either<DiscoveryStruct>,
    param: ValidationMode,
  ): Either<boolean> => {
    // console.info('...validating', {line: 432})
    if (legend.left) {
      console.warn("legend discovery failed");
      return Left(legend.left);
    }
    if (
      intersection(legend.right.funcs, ["JWE", "e"]).length > 0 &&
      (!opts.encryptionKeys?.privateJWK || !opts.encryptionKeys?.publicJWK)
    ) {
      console.warn("Asking to use encryption with no keys provided");
      return Left(
        Error(
          "to use the JWE/e encoding functions, both the public and private keys are needed",
        ),
      );
    }

    if (param.mode === "parse") {
      // console.info('parse Validate', {param, opts})
      if (param.input.length === 0) {
        return Left(Error("Error - there is no value to return"));
      }
      return parseValidate(param.input, opts);
    } else {
      // console.info('stringify validate', {param, opts})
      return stringifyValidate(param.input, opts);
    }
  };
  const parse =
    (opts: FunctionParsingOptions = defaultedOptions) =>
    async (paramValueString: string): Promise<Either<unknown>> => {
      // console.log('parsing...', {paramValueString})
      const legend = legends.discover(opts)(paramValueString);
      const isValid = validate(opts, legend, {
        mode: "parse",
        input: paramValueString,
      });

      // console.info({isValid, legend});

      if (isValid.left) {
        console.warn("validation failed");
        return Left(isValid.left);
      } else {
        if (["null", "true", "false"].includes(legend.right.str)) {
          // console.log('bareparam')
          return Right(JSON.parse(legend.right.str));
        }

        if (!/[^0-9-_.+]+/gi.test(legend.right.str)) { // has no letters
          // NOTE: basė4 has no . char
          const maybeVal = tryJSONparse(legend.right.str);
          return maybeVal.left ? Left(maybeVal.left) : Right(maybeVal.right);
        } else {
          const funcs = legend.right.funcs;
          const [parseFn, unencFn, ...middFns] = funcs.length === 2
            ? [
              functionsStruct.fromURL[funcs[0]],
              functionsEncodings.fromURL[funcs[1]],
            ]
            : [
              functionsStruct.fromURL[funcs[0]],
              functionsEncodings.fromURL[legend.right.funcs.slice(-1)[0]],
              ...funcs.slice(1, -1).map((letter) =>
                functionsTransforms.fromURL[letter]
              ),
            ];

          const composedMiddles = middFns.reduce((p, next) => {
            return async (data: Uint8Array) => next(await p(data));
          }, async (input: Uint8Array) => await input);

          if (opts.encryptionKeys) {
            // console.info('will use the enc keys provided', {unencFn, middFns, parseFn})
            const pks = opts.encryptionKeys.privateJWK;
            const pk = typeof pks === "string" ? JSON.parse(pks) : pks;
            const ret = Right(
              await parseFn(
                await composedMiddles(await unencFn(pk)(legend.right.str)),
              ),
            );
            // console.log({ret})
            return ret;
          } else {
            // console.info('did not provide enc keys', {unencFn, middFns, parseFn})

            return intersection(legend.right.funcs, ["JWE", "e"]).length > 0
              ? Left(
                Error(
                  "Can not attempt to decrpyt an input string if no keys are given",
                ),
              )
              : Right(
                await parseFn(
                  await composedMiddles(await unencFn({})(legend.right.str)),
                ),
              );

            // console.log({ requestedFnIntersectionList, unencoded, unMiddled, parsed, ret})
            // return ret
          }
        }
      }
    };

  const stringify =
    (legend: string, opts: FunctionParsingOptions = defaultedOptions) =>
    async (obj: BareParams | EncodedParams): Promise<Either<string>> => {
      // console.log('stringing...', {obj, legend})

      const funcs = legends.parse(opts)(legend);
      const disc = Right({ funcs: funcs.right, str: "" }) as Either<
        DiscoveryStruct
      >;
      const isValid = validate(opts, disc, { mode: "stringify", input: obj });

      if (funcs.left || isValid.left) {
        // console.warn('legend parse failed')
        return Left(funcs.left ?? isValid.left);
      } else {
        const flist = funcs.right;
        if (isBareParam(obj)) {
          return Right(`${obj}`);
        } else {
          // console.log('stringifying the encoded object param',{obj})
          const [strFn, encFn, ...middFns] = flist.length === 2
            ? [
              functionsStruct.toURL[flist[0]],
              functionsEncodings.toURL[flist[1]],
            ]
            : [
              functionsStruct.toURL[flist[0]],
              functionsEncodings.toURL[flist.slice(-1)[0]],
              ...flist.slice(1, -1).map((letter) =>
                functionsTransforms.toURL[letter]
              ),
            ];

          const composedMiddles = middFns.reduce((p, next) => {
            return async (data: Uint8Array) => next(await p(data));
          }, async (input: Uint8Array) => await input);

          if (opts.encryptionKeys) {
            const ppubWebKey = opts.encryptionKeys.publicJWK;
            const key = typeof ppubWebKey === "string"
              ? JSON.parse(ppubWebKey)
              : ppubWebKey as JsonWebKey;

            return Right(
              `${legends.stringify(flist)}${opts.legendSeperator}${await encFn(
                key,
              )(
                await composedMiddles(await strFn(obj)),
              )}`,
            );
          } else {
            if (intersection(flist, ["JWE", "e"]).length > 0) {
              console.warn("no enc keys", flist, opts, obj);
              return Left(
                Error(
                  `Can't encrypt params, without the public key - but both are required`,
                ),
              );
            } else {
              return Right(
                `${
                  legends.stringify(flist)
                }${opts.legendSeperator}${await encFn({})( // Key Not Needed
                  await composedMiddles(await strFn(obj)),
                )}`,
              );
            }
          }
        }
      }
    };

  return { parse, stringify };
})();

export const params = (() => {
  const validOptions = (
    opts: FunctionParsingOptions = defaultedOptions,
  ): Either<boolean> => {
    const errMsg: string[] = [];
    const allHaveLen2 = [
      opts.legendOpts.strategy.object,
      opts.legendOpts.strategy.string,
      opts.legendOpts.strategy.unknown,
      ...Object.values(opts.legendOpts.strategy.keys),
    ].every((legendArr) => legendArr.length === 2);

    const allValid = [
      ...opts.legendOpts.strategy.object,
      ...opts.legendOpts.strategy.string,
      ...opts.legendOpts.strategy.unknown,
      ...Object.values(opts.legendOpts.strategy.keys).flat(),
    ].every((letterString) => {
      const { left, right } = legends.parse(opts)(letterString);
      return left ? false : legends.isValid(right);
    });
    if (!allValid) {
      errMsg.push(
        "All legendOpts.strategy key/values must have valid legends, where the zeroth element is for lte hudle values, and index 1 is for gt hurdle length values",
      );
    }
    if (!allHaveLen2) {
      errMsg.push(
        "All legendOpts.strategy key/values must have valid legends, with two elements in the array",
      );
    }

    return errMsg.length > 0 ? Left(Error(errMsg.join("/n"))) : Right(true);
  };

  const parse = (opts: FunctionParsingOptions = defaultedOptions) =>
  async (
    multiParamStr: string,
  ): Promise<Either<FunctionBuilderParamInputs>> => {
    const isValid = validOptions(opts);
    if (isValid.left) return Left(isValid.left);

    const mapped = await Promise.all(
      multiParamStr
        .split(opts.argListDelim)
        .map(async (paramChunks) => {
          const [name, val] = paramChunks.split(opts.argValueDelim);
          if (!val) {
            return Left(
              Error("Parameter string does not contain a key value pair"),
            );
          } else {
            const pp = await paramElement.parse(opts)(val);
            return pp.left ? Left(pp.left) : Right({ [name]: pp.right });
          }
        }),
    ) as Either<FunctionBuilderParamInputs>[];

    const errs = mapped.filter((item) => item.left);
    return errs.length > 0
      ? Left(Error(errs.map((er) => er.left).join("\n\n")))
      : Right(
        mapped.reduce(
          (acc, c) => ({ ...acc, ...c.right }),
          {} as FunctionBuilderParamInputs,
        ),
      );
  };

  const handler =
    (legends: string[], opts: FunctionParsingOptions = defaultedOptions) =>
    async (
      paramName: string,
      paramVal: string | FunctionBuilderParamInputs | EncodedParams[],
    ): Promise<Right<string>> => {
      const len = typeof paramVal === "string"
        ? paramVal.length
        : JSON.stringify(paramVal).length;

      return len > opts.legendOpts.hurdle
        ? Right(
          `${paramName}${opts.argValueDelim}${
            (await paramElement.stringify(legends[1], opts)(paramVal)).right
          }`,
        )
        : Right(
          `${paramName}${opts.argValueDelim}${
            (await paramElement.stringify(legends[0], opts)(paramVal)).right
          }`,
        );
    };

  const stringify =
    (opts: FunctionParsingOptions = defaultedOptions) =>
    async (param: FunctionBuilderParamInputs): Promise<Either<string>> => {
      const { left } = validOptions(opts);
      if (left) {
        return Left(left);
      }

      const resolvedEithers =  await Promise.all(
        Object.entries(param)
          .map(async ([paramName, paramVal]) => {
            if (isBareParam(paramVal)) {
              const encDataStr = await paramElement.stringify("sa", opts)(
                paramVal,
              ); // FYI : 'sa' gets ignored
              return encDataStr.left
                ? Left(encDataStr.left)
                : Right(`${paramName}${opts.argValueDelim}${encDataStr.right}`);
            } else {
              return paramName in opts.legendOpts.strategy.keys
                ? handler(opts.legendOpts.strategy.keys[paramName], opts)(
                  paramName,
                  paramVal,
                )
                : typeof paramVal === "string"
                ? handler(opts.legendOpts.strategy.string, opts)(
                  paramName,
                  paramVal,
                )
                : handler(opts.legendOpts.strategy.object, opts)(
                  paramName,
                  paramVal,
                );
            }
          }),
      ) as Either<string>[];

      const errs = resolvedEithers.filter((ei) => ei.left);
      // console.log(errs)
      return errs.length > 0
        ? Left(Error(errs.map((ei) => ei.left).join("\n\n")))
        : Right(
          resolvedEithers
            .filter((ei) => ei.right)
            .map((ei) => ei.right)
            .join(opts.argListDelim),
        );
    };

  return { parse, stringify };
})();

export const functions = {
  encoders: functionsEncodings,
  transforms: functionsTransforms,
  structs: functionsStruct,
  parse:
    (opts: FunctionParsingOptions = defaultedOptions) =>
    async (compositionStr: string): Promise<Either<FuncInterface[]>> => {
      const parsedFunctions = await Promise.all(
        compositionStr
          .split(opts.functionDelim)
          .map((funcStr) => {
            const [f, pStr] = funcStr.split(opts.paramStart);
            return { fname: f, multiParamStr: !pStr ? "" : pStr.slice(0, -1) }; // pull off last )
          })
          .map(async ({ fname, multiParamStr }) => {
            const parsedParams = await params.parse(opts)(multiParamStr);
            return {
              fname,
              params: parsedParams.right,
              errors: parsedParams.left,
            };
          }),
      );

      const pfErrs = parsedFunctions.filter((pf) => pf.errors);
      return pfErrs.length > 0
        ? Left(Error(pfErrs.reduce((acc, pf) => `${acc}\n${pf.errors}`, "")))
        : Right(parsedFunctions.map((pf) => ({
          fname: pf.fname,
          params: pf.params,
        } as FuncInterface)));
    },
  stringify: (opts: FunctionParsingOptions = defaultedOptions) =>
  async (
    ...funcList: FunctionPathBuilderInputDict[]
  ): Promise<Either<string>> => {
    const mapped = await Promise.all(
      funcList
        .filter((fObj) => Object.keys(fObj).length === 1)
        .map(async (fObj) => {
          const [fName, paramObj] = Object.entries(fObj)[0]; //shgould only be 1 due to filter
          const paramBodyStr = await params.stringify(opts)(paramObj);
          return paramBodyStr.left ? Left(paramBodyStr.left) : Right(
            `${fName}${opts.paramStart}${paramBodyStr.right}${opts.paramEnd}`,
          );
        }),
    ) as Either<string>[];

    const errList = mapped.filter((item) => item.left);
    return errList.length > 0
      ? Left(Error(errList.map((er) => er.left).join("\n\n")))
      : Right(mapped.map((item) => item.right).join(opts.functionDelim));
  },
};

export default { params, functions, legends };
