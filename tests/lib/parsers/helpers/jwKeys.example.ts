export const examplePublic = {
  kty: "RSA",
  alg: "RSA-OAEP-512",
  n: "3GcK70kfHoX8tV1j_JmtiuBU43Z-tNAyerDuvjYV-2Rlmi5_wky24gZj8IUWnoLcXSo6KeKI3B82I1tfNpO3b4pjnCWQA1_q9lcg-xUNOoacSqa8RWWsn6JadLLGkw3_zKhzbSe_rs5nBA8-PCec33lXErexxoBy8PKwHOfB79vOwYXIHBgr3UXVoHmTiVR7QLEIkxJvdyfz3WYqdSWhinhT8M3VPle003QqN0FzIV2oq5l4JRqb8waKaBm-9p5Uhzyg4AxL7Pv9thvZM_za0z-FDlp0Hd76ylKA1Wh5eJT8iee3_R2eUW00NeO-5YFuaFvdfPk0ibLoZOHqGQiZRQ",
  e: "AQAB",
  key_ops: ["encrypt"],
  ext: true,
} as JsonWebKey;

export const examplePrivate = {
  kty: "RSA",
  alg: "RSA-OAEP-512",
  n: "3GcK70kfHoX8tV1j_JmtiuBU43Z-tNAyerDuvjYV-2Rlmi5_wky24gZj8IUWnoLcXSo6KeKI3B82I1tfNpO3b4pjnCWQA1_q9lcg-xUNOoacSqa8RWWsn6JadLLGkw3_zKhzbSe_rs5nBA8-PCec33lXErexxoBy8PKwHOfB79vOwYXIHBgr3UXVoHmTiVR7QLEIkxJvdyfz3WYqdSWhinhT8M3VPle003QqN0FzIV2oq5l4JRqb8waKaBm-9p5Uhzyg4AxL7Pv9thvZM_za0z-FDlp0Hd76ylKA1Wh5eJT8iee3_R2eUW00NeO-5YFuaFvdfPk0ibLoZOHqGQiZRQ",
  e: "AQAB",
  d: "2JGT6A6Uunx0FY5f6lzjbtwB7cSIuoj9oRtsbJFexjgfsgHQ3g5dgfk_iJ5t3HG_sPgGURPc4Vb17oYhJ9K8Y6i7OjqaqQY-LbLtoGpOJl0RBDWUOCixF-cDNTpZ7zPJT8OSMAbnzg_Yn9-OirNt7RUhHy5LTD75MpN1w-Fi6pjiOZFzMpMYOtCUFESafCGRfOKYe0uxuEeu94SM11x5vuHG4OiTYvOVUb21L9L8EeqzPw4sGBtsdEl5MEscFl4YUy7AYMHdVcSEwI7EV_uPNbviss9reYU0qmCtLasw08RXevgte4JOWVzFBT7C1Ughle077Hb-KqIzLDBhnICNnQ",
  p: "85UUdI3Du_oN9mUZUsk0Uedgu_Vv1y3WZF-iUP-kPFRhB5QmiJZEUbDdiWtO1zghw799_n-EzBzcIuncj__dd-QPH8Vey1IE-XjgWDsomBfMcs6ngtVsnBfObTDyZuAOcp2MchJ_bgg0sno5UbTJtCCl7yl9H86ljhszdIxxqB8",
  q: "56NzI9wYIspJIiM1CbmR8PX6P2LiBHOYQMVRsTBsuSEaZWJL8_DVINxlTGPfYnvTV5WBwIzE4bLtsu0XFhSQT-_kwNvTnx0SB-l_bkr41D2N1uoCk01dkvyUQhS7N73WYOaGrJCjDhRcMygL2pZoM5VblHwPsuIUod7HRSNQYhs",
  dp:
    "Nx17dGgDawxIjoEPutC2GvY8yCrf9JN1mF6fTq6ZjeEV124pTeyaZtWbOxXh0AbudOlma-iUts6s7OV3t8mQZilfVrQFIAJeB8jXEn_ITqnL5Apoks0R9zvXxJM3thlqi3qkpccTuGT4742CXL-IiE5-3V_I5SKQCViUSwHgUcc",
  dq:
    "BQ-1PFtay6fP4UcTqZq8bZ9yUGBAwAgmk4O8PTrppUHr6bs0Hahtf8JRFFI6V1SNUaSaqTJqOuRF_Vrg3kKkxJphTTWAckGYW0Pm3OoWdczChKeoVr-iA8wxESCS1qz3OjbPSoX-ihg3y4Zce_I9ZKMm1R_A2A_Ik6DiicgzwXE",
  qi:
    "fQqHnApYHSMUoYPEBu1lNtV7QEExAclJpPYkJF8VN420F1_gl9un3eBsmv49RJ7lsf7oqu_0MUAL8IqcMTCgTGV_C4osk2qBHhrPn3z5icGcAqZ9RqRBskEPdg73biTURp-ssGVO1KRFN2LaiU1GhY93uqpERpsyYn5YxjqlLio",
  ext: true,
  key_ops: ["decrypt"],
} as JsonWebKey;

export default { pub: examplePublic, priv: examplePrivate };

/**

//
// Generate using this
//

const keyPair = await crypto.subtle.generateKey(
  {
    name: JWE_ALG['RSA-OAEP'],
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-512',
  },
  true,
  ['encrypt', 'decrypt'],
);

const saveablePubKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey)
console.log('public:\n', JSON.stringify(saveablePubKeyJwk,  null, 2) )

const saveablePrivKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey)
console.log('\n\n\nprivate:\n', JSON.stringify(saveablePrivKey,  null, 2))

//
//
*/
