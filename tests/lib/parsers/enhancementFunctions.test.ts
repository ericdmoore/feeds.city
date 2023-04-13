import hipsteripsum from "./helpers/hipsteripsum.ts";
import { SAblurb, SBAblurb } from "./helpers/encTextBlurb.ts";
import exampleKeys from "./helpers/jwKeys.example.ts";
import { assert, assertObjectMatch, assertEquals } from "$std/testing/asserts.ts";

import {
  defaultedOptions,
  type FuncInterface,
  type FunctionParsingOptions,
  type FunctionPathBuilderInputDict,
  functions,
  legends,
  paramElement,
  params,
  TypeNames,
} from "$lib/parsers/enhancementFunctions.ts";

// import * as base64url from '$std/encoding/base64url.ts'

Deno.test("basic parse Legend", () => {
  const sba = legends.parse()("sba");
  assert(sba.right);
  assertEquals(sba.right, ["s", "b", "a"]);

  const ma = legends.parse()("ma");
  assert(ma.right);
  assertEquals(ma.right, ["m", "a"]);

  const bad = legends.parse()("bad");
  assert(bad.left && !bad.right);

  const bae = legends.parse()("bae");
  assert(bae.left && !bae.right);

  const jbgbga = legends.parse()("jbgbga");
  assert(jbgbga.left && !jbgbga.right);

  const jaa = legends.parse()("jaa");
  // console.log({jaa})
  assert(jaa.left && !jaa.right);

  const jae = legends.parse()("jae");
  // console.log({jae})
  assert(jae.left && !jae.right);
});

Deno.test("parse and Sort Legend", () => {
  const bas = legends.parse()("bas");
  assert(bas.right);
  assertEquals(bas.right, ["s", "b", "a"]);
});

Deno.test("Pase Long Form Legend", () => {
  const jba = legends.parse()("JSON,BR,B64");
  assert(jba.right);
  assertEquals(jba.right, ["JSON", "BR", "B64"]);
});

Deno.test("validity requires 1only1 structure and 1only1 encoding legend keys", () => {
  assert(legends.isValid(["s", "a"]));
  assert(legends.isValid(["s", "b", "g", "a"])); // albeit not practical
  assert(!legends.isValid(["b", "a"]));
  assert(!legends.isValid(["s", "b"]));
  assert(!legends.isValid(["s", "j", "b"]));
});

Deno.test("SA encodeParams", async () => {
  const legend = "sa";
  assertEquals((await paramElement.stringify(legend)(null)).right, "null");
  assertEquals((await paramElement.stringify(legend)(true)).right, "true");
  assertEquals((await paramElement.stringify(legend)(false)).right, "false");
  assertEquals((await paramElement.stringify(legend)(42)).right, "42");
  assertEquals((await paramElement.stringify(legend)(3005)).right, "3005");
  assertEquals((await paramElement.stringify(legend)(18.82)).right, "18.82");
  assertEquals(
    (await paramElement.stringify(legend)("Hello World")).right,
    "sa::SGVsbG8gV29ybGQ",
  );
  assertEquals(
    (await paramElement.stringify(legend)(hipsteripsum)).right,
    SAblurb,
  );
  const helloWorld = await paramElement.stringify(legend)("Hello World");
  assertObjectMatch(helloWorld, {
    type: TypeNames.Right,
    right: "sa::SGVsbG8gV29ybGQ", //base64url woujld not have the = encoded
  });
});

Deno.test("SA decodeParams", async () => {
  assertEquals((await paramElement.parse()("null")).right, null);
  assertEquals((await paramElement.parse()("true")).right, true);
  assertEquals((await paramElement.parse()("false")).right, false);
  assertEquals((await paramElement.parse()("42")).right, 42);
  assertEquals((await paramElement.parse()("3005")).right, 3005);
  assertEquals((await paramElement.parse()("ja::3005")).right, 3005);
  assertEquals((await paramElement.parse()("sa::3005")).right, 3005);
  assertEquals((await paramElement.parse()("18.82")).right, 18.82);
  assertEquals((await paramElement.parse()("::18.82")).right, 18.82);
  assertEquals(
    (await paramElement.parse()("sa::SGVsbG8gV29ybGQ")).right, // no = in base64url
    "Hello World",
  );
  assertEquals(
    (await paramElement.parse()("sa::SGVsbG8gV29ybGQ=")).right, // no = in base64url
    "Hello World",
  );
  assertEquals((await paramElement.parse()(SAblurb)).right, hipsteripsum);
});

Deno.test("SBA encode decode", async () => {
  const encSBA = await paramElement.stringify("sba")(hipsteripsum);
  if (encSBA.left) {
    console.error(encSBA.left);
    assert(!encSBA.left);
  } else {
    assert(
      encSBA.right.length < SAblurb.length,
      "Compressed SHOULD BE smaller than unencrypted",
    );
    assertEquals(encSBA.right, SBAblurb);
    assertEquals(
      (await paramElement.parse()(encSBA.right)).right,
      hipsteripsum,
    );
  }
});

Deno.test("encode + parse Param", async () => {
  const params = { param1: true, param2: { a: 1, b: null, c: "Hello World" } };
  const multiParamStr =
    "param1=true&param2=ja::eyJhIjoxLCJiIjpudWxsLCJjIjoiSGVsbG8gV29ybGQifQ==";
  const encParamStr = await paramElement.stringify("ja")(params);
  if (encParamStr.left) {
    assert(!encParamStr.left);
    assertEquals(encParamStr.right, multiParamStr);
  } else {
    const parsedParam = (await paramElement.parse()(encParamStr.right)).right;
    assertEquals(parsedParam, params);
  }
});

Deno.test("param parse", async () => {
  const p1 = { param1: true, param2: { a: 1, b: null, c: "Hello World" } };
  const r = await params.parse()(
    "param1=true&param2=ja::eyJhIjoxLCJiIjpudWxsLCJjIjoiSGVsbG8gV29ybGQifQ==",
  );
  assert(r.right && !r.left);
  assertEquals(r.right, p1);
});

Deno.test("param parse empty string", async () => {
  const r = await params.parse()("");
  assert(r.left && !r.right);
});

Deno.test("Params stringify then parse ", async () => {
  const p1 = { param1: true, param2: { a: 1, b: null, c: "Hello World" } };
  const built = await params.stringify()(p1);
  if (built.left) {
    assert(!built.left);
  } else {
    const p2 = await params.parse()(built.right);
    if (p2.left) {
      assert(!p2.left);
    } else {
      assertEquals(p2.right, p1);
    }
  }
});

Deno.test("buildParams.1", async () => {
  const p1 = { param1: true, param2: { a: 1, b: null, c: "Hello World" } };
  assertEquals(
    (await params.stringify()(p1)).right,
    "param1=true&param2=ja::eyJhIjoxLCJiIjpudWxsLCJjIjoiSGVsbG8gV29ybGQifQ", //no ==
  );
});

Deno.test("buildParams.2", async () => {
  const exampleParams = {
    example: { param1: true, param2: { a: 1, b: null, c: "Hello World" } },
  };
  const r = await params.stringify()(exampleParams);
  if (r.left) {
    assert(!r.left);
  } else {
    assert(r.right);
    assertEquals(
      r.right,
      "example=ja::eyJwYXJhbTEiOnRydWUsInBhcmFtMiI6eyJhIjoxLCJiIjpudWxsLCJjIjoiSGVsbG8gV29ybGQifX0",
    );
  }
});

Deno.test("buildFunctionString.1", async () => {
  const exampleFunction = {
    exampleFn: { param1: true, param2: { a: 1, b: null, c: "Hello World" } },
  };
  const r = await functions.stringify()(exampleFunction);
  if (r.left) {
    assert(!r.left);
  } else {
    assert(r.right);
    assertEquals(
      r.right,
      "exampleFn(param1=true&param2=ja::eyJhIjoxLCJiIjpudWxsLCJjIjoiSGVsbG8gV29ybGQifQ)",
    );
  }
});

Deno.test("buildFunctionString.2", async () => {
  const exampleFunctions = [
    { exampleFn1: { p1: true, p2: { a: 1, b: null, c: "string" } } },
    { exampleFn2: { p1: true, p2: false, p3: null, p4: "Hello World" } },
  ] as FunctionPathBuilderInputDict[];

  const r = await functions.stringify()(...exampleFunctions);
  // console.log(r)

  if (r.left) {
    assert(!r.left);
  } else {
    assert(r.right);
    assertEquals(
      r.right,
      "exampleFn1(p1=true&p2=ja::eyJhIjoxLCJiIjpudWxsLCJjIjoic3RyaW5nIn0)+exampleFn2(p1=true&p2=false&p3=null&p4=sa::SGVsbG8gV29ybGQ)",
    );
  }
});

Deno.test("example stringify works", async () => {
  const exampleJson = {
    _id: "630d2767f1f0781298f1e4e4",
    index: 0,
    guid: "b41f901b-0e2e-4262-a8a7-ed6b456ff5ac",
    isActive: true,
    balance: "$1,019.78",
    account: {
      company: "KEENGEN",
      profile: {
        about:
          "Pariatur ea pariatur reprehenderit cupidatat ea. Et reprehenderit officia duis mollit fugiat dolore. Magna labore quis Lorem occaecat mollit consequat ad aute fugiat aute culpa. Occaecat nulla excepteur consectetur ad nostrud nulla dolor proident cupidatat esse consequat sint. Sunt reprehenderit exercitation aliqua nulla deserunt occaecat cupidatat quis nostrud ut elit incididunt mollit. Tempor enim labore elit eu sint mollit Lorem dolor ipsum commodo ipsum sit quis in.\r\n",
        greeting: "Hello, Amber Quinn! You have 9 unread messages.",
        picture: "http://placehold.it/32x32",
        age: 24,
        eyeColor: "green",
        name: "Amber Quinn",
        gender: "female",
      },
      contact: {
        email: "amberquinn@keengen.com",
        phone: "+1 (894) 546-3501",
      },
      address: {
        street: "134 Clinton Avenue",
        city: "Trexlertown",
        state: "Maryland",
        zip: "02210",
        raw: "134 Clinton Avenue, Trexlertown, Maryland, 02210",
      },
    },
    registered: "2014-08-28T08:03:45 +05:00",
    latitude: -48.818118,
    longitude: 170.288914,
    tags: [
      "reprehenderit",
      "aute",
      "fugiat",
      "culpa",
      "mollit",
      "est",
      "est",
    ],
    friends: [
      { "id": 0, "name": "Farrell Pugh" },
      { "id": 1, "name": "Horn Burns" },
      { "id": 2, "name": "Juarez Camacho" },
    ],
  };
  const r = await params.stringify()(exampleJson);
  assert(r.right);
  assert(r.right.length <= 1159); // using default compression should be better than jba - as of Mon Aug 29 17:25:08 CDT 2022
});

Deno.test("function.stringify + parse is bijective", async () => {
  const finput = [
    { articlePicker: { cssSelector: "#SomeCssID" } },
    {
      addVoice: {
        s3: {
          bucket: "myawesomes3bucket",
          prefix: "thethingthatgoesbeforeeveryobject".repeat(20),
        },
        polly: {
          voiceId: "Matthew",
          outputFormat: "mp3",
          sampleRate: "2400",
          useNeuralEngine: true,
          isPlainText: true,
        },
      },
    },
  ] as FunctionPathBuilderInputDict[];

  const finterface = [
    { fname: "articlePicker", params: finput[0].articlePicker },
    { fname: "addVoice", params: finput[1].addVoice },
  ] as FuncInterface[];

  const s = await functions.stringify()(...finput);
  assert(s.right);
  // console.log(s.right)
  const pf = await functions.parse()(s.right);
  assert(pf.right);
  assertEquals(pf.right, finterface);
});

Deno.test("Pass In Encrypted params", async () => {
  const config = {
    ...defaultedOptions,
    encryptionKeys: {
      privateJWK: exampleKeys.rsa.open,
      publicJWK: exampleKeys.rsa.seal,
    },
    legendOpts: {
      hurdle: 512,
      strategy: {
        ...defaultedOptions.legendOpts.strategy,
        keys: {
          secretObj: ["je", "jbe"],
        },
      },
    },
  } as FunctionParsingOptions;


  const nonce = crypto.randomUUID() 
  const data = {
    f1name: {
      param1: true,
      secretObj: { 
        nonce,
        hello: "world", 
        mySecret: "AWS_PRETEND_KEY_0987654321234567890",
      }
    },
  };

  const fStr = await functions.stringify(config)(data);
  assert(fStr.right && !fStr.left);
  fStr.left && console.log('fStr: ',fStr)
});

Deno.test("Encrypted Serialization is bijective", async () => {
  const config = {
    ...defaultedOptions,
    encryptionKeys: {
      privateJWK: exampleKeys.rsa.open,
      publicJWK: exampleKeys.rsa.seal,
    },
    legendOpts: {
      ...defaultedOptions.legendOpts,
      hurdle: 512,
      strategy: {
        ...defaultedOptions.legendOpts.strategy,
        keys: {
          secretObj: ["je", "jbe"],
        },
      },
    },
  } as FunctionParsingOptions;

  const data = { 
    p1: true,
    secretObj: { 
      nonce: crypto.randomUUID(),
      AWS_KEY: "SOME_EXAMPLE_KEY", 
      AWS_SECRET: "AWS_SECRET_NEVER_ACTUALLY_STORED_IN_CODE",
    }
  };

  const paramStr = await params.stringify(config)(data);
  assert(paramStr.right && !paramStr.left);
  assert(typeof paramStr.right === "string");
  paramStr.left && console.log('params: ',paramStr)

  const d = await params.parse(config)(paramStr.right);
  console.log('d: ',d)
  assert(d.right);
  assertEquals(d.right, data); // input to ENCRYPTED LAND and back again, and it's the same
});
