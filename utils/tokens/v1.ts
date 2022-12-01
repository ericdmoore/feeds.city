// deno-lint-ignore-file require-await
import type {
  AbstractTokenFactory,
  LocalValidatorFns,
  VersionedPayload,
} from "./tokenType.ts";
import {
  create,
  decode,
  type Header,
  Payload,
  validate as djwtValidate,
  verify as djwtVerify,
} from "djwt";

const ISSUER = "https://feeds.city";

export const isV1Token =
  (async (payload: VersionedPayload) => payload?.v === 1) as LocalValidatorFns;
export const isFromFeedCity =
  (async (payload: VersionedPayload) =>
    payload?.iss === ISSUER) as LocalValidatorFns;

export const v1: AbstractTokenFactory = (
  pair,
  kid: string,
  localValsFns = [isV1Token, isFromFeedCity],
) => {
  const v1Headers = { kid, typ: "JWT", alg: "ES384", iss: ISSUER } as Header;

  const _decode = async (jwtStr: string) => {
    try {
      const [headers, payload, signature] = decode(jwtStr) as [
        Header,
        Payload,
        Uint8Array,
      ];
      return { headers, payload, signature };
    } catch (er) {
      return Promise.reject(er);
    }
  };

  const parse = async (jwtStr: string) => {
    const ret = await _decode(jwtStr);
    return {
      signature: ret.signature,
      headers: ret.headers,
      payload: ret.payload as VersionedPayload,
    };
  };

  const mint = async (d: Payload, h = v1Headers as Header) => {
    return create({ ...h, ...v1Headers }, { ...d, v: 1 }, pair.privateKey);
  };

  const validate = async (jwtStr: string) => {
    const { headers, payload, signature } = await parse(jwtStr);
    try {
      const coreValidations = !!djwtValidate([headers, payload, signature]);
      const erroredUserVals = await Promise.all(
        localValsFns
          .map(async (fn) => ({
            fName: fn.name,
            val: await fn({ headers, payload, signature }),
          }))
          .filter(async (nameVal) => !(await nameVal).val),
      );

      if (erroredUserVals.length > 0) {
        Promise.reject(
          new Error(erroredUserVals.map(({ fName }) => fName).join(", ")),
        );
      }
      return coreValidations && erroredUserVals.length === 0;
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  };

  const verify = async (jwtStr: string) => {
    try {
      return !!djwtVerify(jwtStr, pair.publicKey);
    } catch (e) {
      return Promise.reject(new Error(e));
    }
  };

  return {
    mint,
    parse,
    validate,
    verify,
    v1Headers,
    v1Validators: [isV1Token, isFromFeedCity],
  };
};

export default v1;
