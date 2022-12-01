// deno-lint-ignore-file require-await
import { getCookies, setCookie } from "$std/http/cookie.ts";
import {
  create,
  decode,
  type Header,
  type Payload,
  validate,
  verify,
} from "djwt";

export type CookieBakeryFn = (
  privCryptotKey: CryptoKey,
  kid: string,
  payload: Record<string, unknown> | null,
  iat?: number,
) => Promise<string>;

export function stripHeaders(
  p?: Payload | null,
): null | Record<string, unknown> {
  if (!p) return null;
  // deno-lint-ignore no-unused-vars
  const { iss, sub, aud, exp, nbf, iat, jti, ...ret } = p;
  return ret;
}

export const mintV1Cookie: CookieBakeryFn = (
  privCryptotKey: CryptoKey,
  kid: string,
  payload: Record<string, unknown> | null,
  iat: number = Math.round(Date.now() / 1000),
) => {
  const unixNow = Math.round(Date.now() / 1000);
  return create(
    {
      kid,
      typ: "JWT",
      alg: "ES384",
      iss: "feeds.city",
      iat,
      nbf: unixNow - 3, // 3 second leeway
      exp: unixNow + 3600 * 2, // expires '2hrs from now'
    },
    payload ?? { v: 1, uuid: crypto.randomUUID() },
    privCryptotKey,
  );
};

const localvalidationsThrows = (p: Payload) => {
  const { iss, v } = p;
  if (!iss?.includes("feeds.city")) {
    console.error(`>>> ${iss}`);
    throw new Error("Invalid issuer");
  }
  if (typeof v !== "number") {
    console.error(`>>> ${v}`);
    throw new Error("Invalid version");
  }
};

// deno-lint-ignore no-unused-vars
const parseandValidateV1Token =
  (pair: CryptoKeyPair) => async (jwtStr: string): Promise<Payload> => {
    try {
      const v = validate(decode(jwtStr));
      localvalidationsThrows({ ...v.payload, ...v.header });
      return Promise.resolve(verify(jwtStr, pair.publicKey));
    } catch (er) {
      return Promise.reject(er);
    }
  };

export const confirmTokenGTEthreshold =
  (thresholdAgeSeconds: number) => (p: Payload): boolean | null => {
    const { iat, exp, v } = p;
    if (v === 1 && iat && exp) {
      const reqTime = exp - 3600 * 2;
      if (reqTime - iat >= thresholdAgeSeconds) {
        return true;
      } else {
        return false;
      }
    } else {
      return null;
    }
  };

/**
 * Does the request contain a cookie under a given name?
 * Is the cookie a valid JWT?
 * If so, delete that cookie, and spin up a new refreshed cookie value
 */
export const refreshCookieToken =
  (pair: CryptoKeyPair, kid: string, bakeryFn: CookieBakeryFn = mintV1Cookie) =>
  async (
    headers: Headers | HeadersInit,
    findJwt: string,
  ): Promise<{ headers: Headers; jwt: string }> => {
    const hdrs = new Headers(headers);
    const cookies = getCookies(hdrs);
    const jwtStr = cookies[findJwt];
    let jwt: string;

    if (!jwtStr) {
      jwt = await bakeryFn(pair.privateKey, kid, null);
    } else {
      let verifiedPayload: Payload | null = null;
      let hdr: Header | Record<string, unknown> = {};

      try {
        const v = validate(decode(jwtStr));
        hdr = v.header;
        console.log({ header: v.header, payload: v.payload });

        // already prints
        localvalidationsThrows({ ...v.payload, ...v.header });
        verifiedPayload = await verify(jwtStr, pair.publicKey);
      } catch (e) {
        return Promise.reject(new Error("Invalid JWT: ", e));
      }

      // const age = (hdr?.nbf as number -3) - (hdr?.iat as number)
      // console.log({
      //     iat: hdr?.iat ? new Date(hdr?.iat as number * 1000).toLocaleTimeString() : null,
      //     nbf: hdr?.nbf ? new Date(hdr?.nbf as number * 1000).toLocaleTimeString() : null,
      //     exp: hdr?.exp ? new Date(hdr?.exp as number * 1000).toLocaleTimeString() : null,
      //     _tokenAgeMinutes: age / 60,
      //     _tokenAgeHrs: age / 3600
      // })

      jwt = await bakeryFn(
        pair.privateKey,
        kid,
        stripHeaders(verifiedPayload),
        hdr?.iat as number | undefined,
      );
    }

    setCookie(hdrs, {
      name: findJwt,
      sameSite: "Strict",
      secure: true,
      maxAge: 60 * 60 * 2,
      value: jwt,
    });

    return { headers: hdrs, jwt };
  };
