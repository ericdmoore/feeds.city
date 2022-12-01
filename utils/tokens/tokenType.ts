import { Header as djwtHeaders, type Payload as djwtPayload } from "djwt";

export type UnversionedPayload = Omit<djwtPayload, "v">;
export type VersionedPayload = djwtPayload & { v: number };

export type LocalValidatorFns = (
  keyHeaderAndPayload: Record<string, unknown>,
) => Promise<boolean>;
export type AbstractTokenFactory = (
  pair: CryptoKeyPair,
  kid: string,
  localValidators?: LocalValidatorFns[],
) => AbstractToken;

export interface AbstractToken {
  mint: (d: UnversionedPayload, headers?: djwtHeaders) => Promise<string>;
  parse: (
    jwtStr: string,
  ) => Promise<
    { headers: djwtHeaders; payload: VersionedPayload; signature: Uint8Array }
  >;
  validate: (jwtStr: string) => Promise<boolean>;
  verify: (jwtStr: string) => Promise<boolean>;
}
