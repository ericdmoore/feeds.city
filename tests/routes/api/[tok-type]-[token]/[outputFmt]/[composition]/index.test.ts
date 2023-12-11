import { assert } from "$std/testing/asserts.ts";
import { CONN_INFO, urlPath, isValidHTML } from "$tests/common.ts"
import { createHandler  } from "$fresh/server.ts";
import MANIFEST from "$/fresh.gen.ts";
import envVarReader from "$lib/utils/vars.ts";
// import CONFIG from "$/fresh.config.ts";
// import { getSetCookies } from "$std/http/cookie.ts";
// import { sleep } from "$lib/index.ts";

const envVars = await envVarReader();
const _env = await envVars("MISSING");
const path = urlPath("http://localhost", 8080);


// json|html|atom|rss
Deno.test({
    name:'/api/u-ericdmoore-token/json/composition',
    ignore: true, 
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/json/composition"), { method: "GET" }),
            CONN_INFO
        );
        
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(body.startsWith("<!DOCTYPE html>"));
        assert(body.endsWith("</html>"));
        assert(await isValidHTML(body));
    }
});
