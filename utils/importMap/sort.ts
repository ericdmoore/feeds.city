import existing from "../../import_map.json" assert { type: "json" };

const sortedImportData = Object.fromEntries(
  [
    //
    // ...Object.entries(imports),
    ...Object.entries(existing.imports),
  ].sort((
    a,
    z,
  ) => a[0] < z[0] ? -1 : 1),
);

const stdVersionID = new URL(sortedImportData["$std/"]).pathname.split("@")[1]
  .slice(0, -1);

const sortedVersioned = Object.fromEntries(
  Object.entries(sortedImportData)
    .map(([specifier, importURL]) => {
      if (specifier.endsWith("/") || specifier.startsWith("./")) {
        return [specifier, importURL];
      } else {
        const u = new URL(importURL);
        if (u.host === "esm.sh") {
          if (!u.searchParams.has("deno-std")) {
            u.searchParams.set("deno-std", stdVersionID);
          }

          if (!u.searchParams.has("no-dts")) {
            u.searchParams.set("dts", "1");
          }
          return [specifier, u.href];
        } else {
          return [specifier, u.href];
        }
      }
    }),
);

console.log(
  JSON.stringify(
    {
      imports: sortedVersioned,
      scopes: existing.scopes,
    },
    null,
    2,
  ),
);

/** Backup value
 *
 *
{
  "imports": {
    "$fresh/": "https://deno.land/x/fresh@1.1.1/",
    "$std/": "https://deno.land/std@0.181.0/",
    "@aws-sdk/client-dynamodb": "https://esm.sh/@aws-sdk/client-dynamodb@3.200.0?deno-std=0.161.0?dts",
    "@aws-sdk/client-dynamodb/": "https://esm.sh/@aws-sdk/client-dynamodb@3.200.0?deno-std=0.161.0/",
    "@preact/signals": "https://esm.sh/*@preact/signals@1.0.3?dts",
    "@preact/signals-core": "https://esm.sh/*@preact/signals-core@1.0.1?dts",
    "@twind/": "https://esm.sh/@twind/",
    "@twind/aspect-ratio": "https://esm.sh/@twind/aspect-ratio@0.1.4?dts",
    "@twind/aspect-ratio/": "https://esm.sh/@twind/aspect-ratio@0.1.4/",
    "@twind/forms": "https://esm.sh/@twind/forms@0.1.4?dts",
    "@twind/forms/": "https://esm.sh/@twind/forms@0.1.4/",
    "VFile": "https://denopkg.com/ericdmoore/vfile@main/mod.ts",
    "airtable": "https://deno.land/x/airtable@v1.1.1/mod.ts",
    "airtable/": "https://deno.land/x/airtable@v1.1.1/",
    "brotli": "https://deno.land/x/brotli@v0.1.4/mod.ts",
    "bson_deno": "https://deno.land/x/deno_bson@v0.0.2/mod.ts",
    "djwt": "https://deno.land/x/djwt@v2.7/mod.ts",
    "dom_deno": "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts",
    "fluentSchema": "https://esm.sh/fluent-json-schema@3.1.0?dts&deno-std=0.153.0",
    "fromXml": "https://deno.land/x/xml2js@1.0.0/mod.ts",
    "gzip_wasm": "https://deno.land/x/wasm_gzip@v1.0.0/mod.ts",
    "jsonSchema": "https://deno.land/x/json_schema_typed@v8.0.0/draft_latest.ts",
    "minhash": "https://esm.sh/minhash@0.0.9?dts",
    "multiformat": "https://esm.sh/multiformats@9.6.4?dts",
    "mustache": "https://deno.land/x/mustache@v0.3.0/mod.ts",
    "nodeBuffer": "https://deno.land/std@0.153.0/node/buffer.ts",
    "preact": "https://esm.sh/preact@10.11.0?dts",
    "preact-render-to-string": "https://esm.sh/preact-render-to-string@5.2.4?dts",
    "preact/": "https://esm.sh/preact@10.11.0/",
    "rehypeParse": "https://denopkg.com/ericdmoore/rehype@main/packages/rehype-parse/mod.ts",
    "rehypeRemark": "https://denopkg.com/ericdmoore/rehype-remark@main/mod.ts",
    "rehypeStringify": "https://denopkg.com/ericdmoore/rehype@main/packages/rehype-stringify/mod.ts",
    "remarkParse": "https://denopkg.com/ericdmoore/remark@main/packages/remark-parse/mod.ts",
    "remarkRehype": "https://denopkg.com/ericdmoore/remark-rehype@main/mod.ts",
    "remarkRetext": "https://esm.sh/remark-retext?dts",
    "remarkStringify": "https://denopkg.com/ericdmoore/remark@main/packages/remark-stringify/mod.ts",
    "retextEnglish": "https://esm.sh/retext-english@4?dts",
    "retextParse": "https://esm.sh/retext-english?dts",
    "retextStringify": "https://esm.sh/retext-stringify@3.1.0?dts",
    "superstruct": "https://deno.land/x/deno_superstruct@0.0.0/mod.ts",
    "toXml": "https://deno.land/x/js2xml@1.0.2/mod.ts",
    "twind": "https://esm.sh/twind@0.16.17?dts",
    "twind/": "https://esm.sh/twind@0.16.17/",
    "unified": "https://denopkg.com/ericdmoore/unified@main/mod.ts",
    "zstd_wasm": "https://deno.land/x/zstd_wasm@0.0.16/deno/zstd.ts"
  },
  "scopes": {
    "___thisFile_IsAutoGenerated": {
      "message": "the keys are sorted alphabetically by an external process, so don't worry about the order",
      "to_edit_the_external_process": "./utils/importMap/sort.ts"
    }
  }
}

 *
 *
 */
