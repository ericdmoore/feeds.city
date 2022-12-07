import type { Header as djwtHeaders, Payload as djwtPayload } from "djwt";
export type UnversionedPayload = Omit<djwtPayload, "v">;
export type VersionedPayload = djwtPayload & { v: number };

export type IValidationData = {headers:djwtHeaders, payload:VersionedPayload, signature: Uint8Array}
export type LocalValidatorFns = (data: IValidationData) => Promise<boolean>;
export type v1AbstractTokenFactory = (
  pair: CryptoKeyPair,
  kid: string,
  localValidators?: LocalValidatorFns[],
) => v1AbstractToken;

export interface v1AbstractToken {
  mint: (d?: UnversionedPayload, headers?: djwtHeaders) => Promise<string>;
  parse: (
    jwtStr: string,
  ) => Promise<
    { headers: djwtHeaders; payload: VersionedPayload; signature: Uint8Array }
  >;
  validate: (jwtStr: string, ...userValFns: LocalValidatorFns[]) => Promise<boolean>;
  verify: (jwtStr: string) => Promise<boolean>;
  defaultValues:{
    validators: LocalValidatorFns[]
    headers: djwtHeaders
    expirationIntervalSecs: number
  }
}

// @see : ./v1.ts