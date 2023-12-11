import { assert } from "$std/testing/asserts.ts";
import { CONN_INFO, urlPath, isValidHTML, isValidJSON, isValidXml as _asd } from "$tests/common.ts"
import { createHandler  } from "$fresh/server.ts";
import MANIFEST from "$/fresh.gen.ts";
import envVarReader from "$lib/utils/vars.ts";
// import CONFIG from "$/fresh.config.ts";
// import { getSetCookies } from "$std/http/cookie.ts";
// import { sleep } from "$lib/index.ts";

const envVars = await envVarReader();
const _env = await envVars("MISSING");
const path = urlPath("http://localhost", 8080);




Deno.test({
    name:'Default/Json /api/u-ericdmoore-token/json',
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/json"), { method: "GET" }),
            CONN_INFO
        );
        
        // Reponse is an HTML FORM seeking more info from the user
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidHTML(body), 'The Default response should be valid HTML');
    }
});


Deno.test({
    name:'RSS: /api/u-ericdmoore-token/rss',
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/rss"), { method: "GET" }),
            CONN_INFO
        );
        
        // Reponse is an HTML FORM seeking more info from the user
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidHTML(body), 'The Default response should be valid HTML');
    }
});


Deno.test({
    name:'Atom: /api/u-ericdmoore-token/atom',
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/atom"), { method: "GET" }),
            CONN_INFO
        );
        
        // Reponse is an HTML FORM seeking more info from the user
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidHTML(body), 'The Default response should be valid HTML');
    }
});

Deno.test({
    name:'HTML: /api/u-ericdmoore-token/html',
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/html"), { method: "GET" }),
            CONN_INFO
        );
        
        // Reponse is an HTML FORM seeking more info from the user
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidHTML(body), 'The Default response should be valid HTML');
    }
});

Deno.test({
    name:'Prefer JSON over HTML - /api/u-ericdmoore-token/json',
    ignore: true, 
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/json"), { 
                method: "GET",
                headers: { accept: ["application/json","text/html"].join(", ") }
             }),
            CONN_INFO
        );
        

        // Reponse is an HTML FORM seeking more info from the user
        // body would need to be some type JSON command schema
        // basically noting that the step is to add a composition
        // and then a URL to POST
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidJSON(body));        
        // assert(await isValidHTML(body), 'The Default response should be valid HTML');

        // add other assertions HERE
    }
});



Deno.test({
    name:'Only Accept JSON - /api/u-ericdmoore-token/json',
    // @backlog
    ignore: true,
    fn: async () => {

        const handler = await createHandler(MANIFEST, { plugins: [] });
        const getResp = await handler(
            new Request(path("/api/u-ericdmoore/json"), { 
                method: "GET",
                headers: { accept: ["application/json"].join(", ") }
             }),
            CONN_INFO
        );
        
        const body = await getResp.text();
        assert(getResp.status === 200);
        assert(await isValidJSON(body));
    }
});


