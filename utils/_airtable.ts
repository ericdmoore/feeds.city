// deno-lint-ignore-file require-await ban-unused-ignore
import { Airtable }  from "airtable"

(async()=>{

    const d1 = Date.now().toString().slice(5, -3)
    const [apiKey, baseId, tableName] = await Promise.all([
        Deno.env.get('AIRTABLE_KEY'),
        Deno.env.get('AIRTABLE_BASE'),
        Deno.env.get('AIRTABLE_TABLE')
    ])

    const airtable = new Airtable({ useEnv: false, apiKey, baseId, tableName });    
    const r = await airtable.create({ email: `_${d1}@ericdm.com`, Status: "Waiting"} )
    console.log('\n\n',d1, '\n\n\n',r)
})()
