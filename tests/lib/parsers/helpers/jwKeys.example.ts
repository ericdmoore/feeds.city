//
// All of these keys are ephemeral and MUST not be used in production
// Generate using the util file utils/keys/gen-all.ts
//

export const privateECDSA = {
  kid: 1681416495201,
  kty: "EC",
  crv: "P-384",
  alg: "ES384",
  x: "AUVEYyCInGv4l-qaXg-XhUqcOxDJ8V9NawN6j275khOInVZXXO8We0uyWm5DncQZ",
  y: "DmULx-pJE_jPSqFK0HWdcyK4yXbgoikszJFXpdcjaYm0inlvmNv0h6OJ7jLmSe5J",
  d: "WBLB9CwetDEELbIpxhNyovcNHYyIQLhSQZLWy-ITyK9LdWsoGiLnVIT_gQuZXsv8",
  key_ops: ["sign"],
  ext: true,
};
export const publicECDSA = {
  kid: 1681416495201,
  kty: "EC",
  crv: "P-384",
  alg: "ES384",
  x: "AUVEYyCInGv4l-qaXg-XhUqcOxDJ8V9NawN6j275khOInVZXXO8We0uyWm5DncQZ",
  y: "DmULx-pJE_jPSqFK0HWdcyK4yXbgoikszJFXpdcjaYm0inlvmNv0h6OJ7jLmSe5J",
  key_ops: ["verify"],
  ext: true,
};

export const aesGcmJWK = {
  kty: "oct",
  k: "WVMuSVjX70smLAZetJQ0FkCPLlppCkRDRZDSjq9UH0s",
  alg: "A256GCM",
  key_ops: ["encrypt", "decrypt"],
  ext: true,
};

export const publicRSA = {
  kty: "RSA",
  alg: "RSA-OAEP-256",
  n: "v80HJ3EKDcprrC-TZxZev3cRwEZs2VOL5A0QL7o0MpcVQs9PY8j4RJsmghrhTr7EpUtOZbg6gVkkB41PUbjCCOdNoS_E47GnAFaZlZcSim04yNkoyX72iiJQHrKsLPDl8NRF69mK7ngRlZ-Im9kom9iArMTdDSMeSgcDUXU7eksCg-iVtkSoGfjJRiYv6dletY19aOcD7keS1xuEvQqPETZt5LuoM5ziNn91G9lR6NaHcQii2_ZHn98c3uv27DvCMU15_OZWFTvz_cFQBYWesrH-e9VXWH1iUZ_5Y10vgAqsTjTx267lBbp3XrCq0-nHM_Y424vWaE8tt9F_0XTpmbQPa6gpEyMKgDMcNYr5AcLoLfBLfYAGXrUZKBOFKU6TTQZ83gV5FCwgJT-reIxcpr1JSPuxnxPxrSxSJwxyFXNHh4S_DJRVfbqkccJTjpylgK-EVMQUbu25YQSPGOH4xjFpZ-PaiUwNfB8g8w_xgxjbYpQW8fjkEtRsbDSbrHLIDMPfZV55dtv7KJJMlGdwg0gCTPqbmQpBnImnOGUiRi54iqqZ-gtOIwiW9yi9CcnooZpNvOACxIWgwTLepktSN7o_Fan2pwn619AXr4ayNvTKvKKlo17M3AA_ZnfbtHpv7cqsEK5pi1smSC4SoY6h2r0EIDe-0li9RtvGdf4sD-c",
  e: "AQAB",
  key_ops: ["encrypt"],
  ext: true,
};

export const privateRSA = {
  kty: "RSA",
  alg: "RSA-OAEP-256",
  n: "v80HJ3EKDcprrC-TZxZev3cRwEZs2VOL5A0QL7o0MpcVQs9PY8j4RJsmghrhTr7EpUtOZbg6gVkkB41PUbjCCOdNoS_E47GnAFaZlZcSim04yNkoyX72iiJQHrKsLPDl8NRF69mK7ngRlZ-Im9kom9iArMTdDSMeSgcDUXU7eksCg-iVtkSoGfjJRiYv6dletY19aOcD7keS1xuEvQqPETZt5LuoM5ziNn91G9lR6NaHcQii2_ZHn98c3uv27DvCMU15_OZWFTvz_cFQBYWesrH-e9VXWH1iUZ_5Y10vgAqsTjTx267lBbp3XrCq0-nHM_Y424vWaE8tt9F_0XTpmbQPa6gpEyMKgDMcNYr5AcLoLfBLfYAGXrUZKBOFKU6TTQZ83gV5FCwgJT-reIxcpr1JSPuxnxPxrSxSJwxyFXNHh4S_DJRVfbqkccJTjpylgK-EVMQUbu25YQSPGOH4xjFpZ-PaiUwNfB8g8w_xgxjbYpQW8fjkEtRsbDSbrHLIDMPfZV55dtv7KJJMlGdwg0gCTPqbmQpBnImnOGUiRi54iqqZ-gtOIwiW9yi9CcnooZpNvOACxIWgwTLepktSN7o_Fan2pwn619AXr4ayNvTKvKKlo17M3AA_ZnfbtHpv7cqsEK5pi1smSC4SoY6h2r0EIDe-0li9RtvGdf4sD-c",
  e: "AQAB",
  d: "auQs1IJfBAiHsVJiZ9VDwJjvP6UADK5PDC1rk-3GIVup8a3vpMDf-_wrnd61KlmO5j_t1SqzEFtJhRvv1K-PE780uFwS8oKTe9DHj2K-Zn8wYl8EKCel5p3w4OraocEvpOPog-SdVQF9a1GZpKGFzDUAoUilmSi1PLRj2QXou-MJ59G7ffUNakwIgBvQIBeQfMX52njE7ArffxpLA7_as9ENtagPuZP5Tj4CWh7nU0gb-5bAjK3YhPSm9mWzGzzCoQ94qMUFvJfJBuaxXiJ1q0kfdowTPbHDFZJ-Pi40xrssA_nlwHTcFjExTYhP7AIhjofucAyi1UcrR4JuJaFufc9AXTA_dnKNMGaLVNP59-MI2qiNrfDyB_BAXTglbSMkxsCx-PZo1s65LZF-x5Nx8tFqh2s96qKVl2g4n-sYdI9-uxFq3xeThfaxKkhOt7hX2r4nZ-J3LH7ds618qn7dQVQo1cBH3n1yGNtFgsYFn_ROPCJj-HCYXe3Q3pZuhh8JHybSr9ENRG81BCRsIyOwXbmQ4JR5FyJe25ELM6IdeQzQm8Gwo1opyc7gEVTQQJI3tya_Bjl5aiQyOKUr44sPrMTmC2DxoYmN9ci4TICIeVHOfIAmfbgjKs9_yrZIIgSpTEnW4WMAwTR_AgezgRZMHdPxnDFmx-3bN7sE99e7zcE",
  p: "0RSOtyFZeIL5IYQko3cuZWZs_utNO6hLywAVwWp3GomDJD0OkTkGo8MRagLwtzxWx7Oy8hxfE59rzUzlj_2Cj3EsugS-mS8mC2vH1x6f7e1u3ehHHo3UrX8I9skxyptTNcLdYoSJk5CCzTNKpzs03n4O84aHVpkUhPtamyIFqyv_nn-TI2KDrhoLusD3-m805DNwXsLXgpbE7ES4vT57DZaSW8quOdTPGinX5r2HK8YM74tLEc7MUo68_o13OdRSAebCWGeczEfkuFkhk_PKV58Tp4NSATgNrSafzfWiisGDmuPYGBiEeU1H3SJC3R0xnu9SXKLFP7bGqN6lnhDX2Q",
  q: "6tfJVv5tJAqiCqSTHCr4T2Y890LRJjqEgHRuh1rVlMc-uqD5B4M4LdWTYZ0HNtJ-3lxbp0AIy02PL_mtAe8RKoWeuRRMOcPBgZWRxObvXKjaLjoGHqZDS7xGT_4Wcq5jhmpVZYMzvzZ5b8U-PRWzD62JHb7otaHjb6nzoi_MwhBNhJKpIaACXyEKRZYLK68QzvkKm2LsAkGi4QuNm9OQ9wpzULalGCxzzdW5bG8c_yONapjcHakbrqbwjh0ks8WPOVISSATxi_O33HX84dvu_r0KXF8ID2Gz-tHw0NlsbptQvFWOySjSP8vHRW7rpcpi26OXo_gglBxqAaQHr60Nvw",
  dp:
    "cQwHelcK1FEkuQ2E7emj6WmvJ0o8sTP2_yTlnnWdPnj5sl9dAAJwZ50yTjqWwsxaM5IjACt88NQy6odYXDl7HWnZAB9Omu7WSDiXjeXeHTxSxKMxyQBw7PoR87WnOWAwZpIdN4ZoCKSLRL4l8DPgCyjnlp63kIgmgxyQye5kWD_q710VRn2eq0Uj8G8j5YG5fGWfrWz2L4KrqQAjTxd4W0l9iyoUd-prrD7RoM37RxzHo8GR7mf9K-pHn-8Hdvoo-SQ3Equ7KOz6av6uXBvl3OiDLQChF02if2ux3h-hKhsluFrXXXfsMNYrNBKxSnLdgIzv4GyV8DQ4R9hSfhunSQ",
  dq:
    "BYsgcpBA7Ufe-VdXLaQKBn3IVKHcJAXfmNSmw0Uuo3tsjKU-G6JKUjKnbvdw8ydW3VLaywDk9D-ZcK15GwGUqydKTt4eyoJHcBKixT4aSlqmA89U06ZjEkeYdUzvJLffG44pA-Nr9kiH506FoJWBi44yHWSjQ55Vqw4c9SghsjcGTWnU2jlXtP0nq-rVyqswP2J7kJ1uKsN3384RAquk0WAKxs346bAq76Hq5Zdd3Nvu-6QuFfkm8SF5rjEb665vKhA45EBRn1cacPbMCFzTsGmv8-w-WXaZ9AK-p39qYtYBuuBeJXt0MxNRWd87asdzO_IJo1I5GqXtDqrbj5cLKw",
  qi:
    "ICq5dBhvXlqIZR5obdRUpVZO2KBeHKHCxnRdsklfoLW7S9bRdjVemEfBtxfK_-bC80YjtpXZPQ1BOT56jlgo-oFxzJbZ_nr5G6Da7siuHs867YRWBTgWKakRYE0ZnULfOR7QA24oC9Yd3cHl0UwDcebhNf4Uj2TvgjBClATSq9tRIf3vW-d--XKBfsMsmIC-JOh5a8GAGLzjsSP8NQIhmfLA_4SGd-YKAn4yZ7CSVHEUJJJP9Gr3uk8L-bokjPEsaqYwctlURaAlr47J-76lzbZqfMn-jECIW1ECU5iVaaP7fCjL8imOlRbZhEBBEnX7c2l9UTMBWhduaPa5n06N8Q",
  key_ops: ["decrypt"],
  ext: true,
};

export default {
  aes: { gcm256secret: aesGcmJWK as JsonWebKey }, // symetiric secret (session keys)
  rsa: { seal: publicRSA as JsonWebKey, open: privateRSA as JsonWebKey }, // used for new session keys
  ecdsa: {
    verify: publicECDSA as JsonWebKey,
    sign: privateECDSA as JsonWebKey,
  }, // signs JWTs and other things
};
