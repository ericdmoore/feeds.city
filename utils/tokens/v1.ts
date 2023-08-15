// deno-lint-ignore-file require-await
import type { IValidationData, LocalValidatorFns, v1AbstractTokenFactory, VersionedPayload } from "./tokenType.ts";

import { create, decode, type Header, Payload, validate as djwtValidate, verify as djwtVerify } from "djwt";

const ISSUER = "https://feeds.city";

export const isV1Token: LocalValidatorFns = async (
	data: { headers: Header; payload: VersionedPayload; signature: Uint8Array },
) => {
	// console.log('isV1Token',data)
	return data.headers?.ver === 1;
};

export const isFromMe: LocalValidatorFns = async (
	data: { headers: Header; payload: VersionedPayload; signature: Uint8Array },
) => {
	// console.log('isFromMe', data)
	return data.headers?.iss === ISSUER;
};

export const notTooSoon: LocalValidatorFns = async (
	data: { headers: Header; payload: VersionedPayload; signature: Uint8Array },
) => "nbf" in data.headers && data.headers.nbf ? Math.floor(Date.now() / 1000) > (data.headers.nbf as number) : true;

export const validIssuanceDate: LocalValidatorFns = async (
	data: { headers: Header; payload: VersionedPayload; signature: Uint8Array },
) => {
	return data.headers?.iss === ISSUER;
};

export const validatiorsAvailable = {
	isV1Token,
	isFromMe,
	validIssuanceDate,
	notTooSoon,
};
export const v1Validators = [
	isV1Token,
	isFromMe,
	notTooSoon,
	validIssuanceDate,
];
export const expirationIntervalSecs = 3600 * 4; // 4hr

export const v1: v1AbstractTokenFactory = (
	pair,
	kid: string,
	localValsFns = v1Validators,
) => {
	const v1Headers = {
		kid,
		ver: 1,
		typ: "JWT",
		alg: "ES384",
		iss: ISSUER,
	} as Header;

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
		} as IValidationData;
	};

	const mint = async (p: Payload = {}, h = v1Headers as Header) => {
		const iat = Math.floor(Date.now() / 1000);
		const nbf = iat + 1; // `not before` set as 1 sec in future
		const exp = iat + expirationIntervalSecs;
		return create(
			{ iat, nbf, exp, ...h, ...v1Headers },
			{ ...p },
			pair.privateKey,
		);
	};

	const validate = async (
		jwtStr: string,
		...userValFns: LocalValidatorFns[]
	) => {
		const { headers, payload, signature } = await parse(jwtStr);
		let coreValidations = false as boolean;
		let erroredUserVals = [] as { fName: string; val: boolean }[];

		try {
			coreValidations = !!djwtValidate([headers, payload, signature]);
			erroredUserVals = [
				...await Promise.all(
					[...localValsFns, ...userValFns]
						.map(async (fn) => ({
							fName: fn.name,
							val: await fn({ headers, payload, signature }),
						})),
				),
			].filter((nameVal) => !nameVal.val);

			if (erroredUserVals.length > 0) {
				console.error({ erroredUserVals });
				Promise.reject(
					new Error(erroredUserVals.map(({ fName }) => fName).join(", ")),
				);
			}
			return coreValidations && erroredUserVals.length === 0;
		} catch (e) {
			console.error({ coreValidations, erroredUserVals });
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
		defaultValues: {
			headers: v1Headers,
			validators: v1Validators,
			expirationIntervalSecs,
		},
	};
};

export default v1;
