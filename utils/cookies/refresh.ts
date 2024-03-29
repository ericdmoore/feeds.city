import type { Payload } from "djwt";
import type { UnversionedPayload, v1AbstractToken } from "../tokens/tokenType.ts";
import { getCookies, setCookie } from "$std/http/cookie.ts";

export function stripHeaders(
	p?: Payload | null,
): null | Record<string, unknown> {
	if (!p) return null;
	// deno-lint-ignore no-unused-vars
	const { iss, sub, aud, exp, nbf, iat, jti, ...ret } = p;
	return ret;
}

/**
 * Does the request contain a cookie under a given name?
 * Is the cookie a valid JWT?
 * If so, delete that cookie, and spin up a new refreshed cookie value
 */
export const refreshCookieToken =
	(v1Baker: v1AbstractToken, extendBySeconds: number) => async (headers: Headers | HeadersInit, findJwt: string) => {
		const localHeadersCopy = new Headers(headers);
		const cookies = getCookies(localHeadersCopy);

		// nothing to refresh so start us off
		if (!(findJwt in cookies) || !cookies?.[findJwt]) {
			const jwt = await v1Baker.mint();

			const { payload, headers } = await v1Baker.parse(jwt);
			setCookie(localHeadersCopy, {
				name: findJwt,
				sameSite: "Strict",
				secure: true,
				maxAge: extendBySeconds,
				value: jwt,
			});
			return {
				respHeaders: localHeadersCopy,
				jwt,
				jwtData: { payload, headers },
			};
		} // bump the exp & nbf
		else {
			let er: unknown;
			const jwtStr = cookies[findJwt];
			const [verified, validated] = await Promise.all([
				v1Baker.verify(jwtStr),
				v1Baker.validate(jwtStr),
			]).catch((err) => {
				er = err;
				return [false, false];
			});

			const { payload, headers } = verified && validated
				? await Promise.resolve(await v1Baker.parse(jwtStr))
				: await Promise.reject(
					new Error(`Token failed validation /verificiation: ${er}`),
				);

			const now = Math.round(Date.now() / 1000);
			const nbf = now + 1;
			const expires = new Date(Date.now() + extendBySeconds * 1000);
			const exp = Math.round(expires.getTime() / 1000);
			const jwt = await v1Baker.mint(
				stripHeaders(payload) as UnversionedPayload,
				{ ...v1Baker.defaultValues.headers, ...headers, nbf, exp },
			);

			setCookie(localHeadersCopy, {
				name: findJwt,
				sameSite: "Strict",
				secure: true,
				value: jwt,
				expires,
			});

			return {
				respHeaders: localHeadersCopy,
				jwt,
				jwtData: { payload, headers },
			};
		}
	};
