import { airtable } from '$lib/clients/airtable.ts'
import { parse } from "$std/dotenv/mod.ts";   
import { join } from '$std/path/mod.ts'
import { assert } from '$std/testing/asserts.ts';

const relEnvPath = '../../../../.env'
const envPath =  join( import.meta.url , relEnvPath).split(':')[1]

const dec = new TextDecoder()
const fh = await Deno.readFile(envPath).catch((e)=> {console.error(e); return new Uint8Array()} )
const fileStr = dec.decode(fh)
const env = parse(fileStr)

const [apiToken, baseId, tableName] = [
    env["AIRTABLE_TOKEN"] ?? 'MISSING',
    env["AIRTABLE_BASE"] ?? 'MISSING',
    env["AIRTABLE_TABLE"] ?? 'MISSING',
];

const AIR = airtable({apiToken, baseId, tableName})



Deno.test('LIST URL', () => {
    const u = AIR.LIST().url()
    assert(u.origin === 'https://api.airtable.com')
    assert(u.pathname.includes(`/v0/${baseId}/${tableName}`))
});

Deno.test('LIST REQ', () => {
    const req = AIR.LIST().req()
    // console.log(33, req)
    assert(req.url.includes(`https://api.airtable.com/v0/${baseId}/${tableName}`))
    assert(req.headers.get('authorization')?.includes('Bearer'))
    assert(req.headers.get('authorization')?.includes(apiToken))
});


Deno.test('LIST JSON:NET + GET:Net Request', async () => {
    const recordSet = await AIR.LIST().json()
    // console.log(41, {data: recordSet})
    
    assert(recordSet)
    assert(recordSet.records)
    assert(recordSet.records.length >=2 )

    await Promise.all(
        recordSet.records.map(async record => {
            const singleRecord = await AIR
                .GET({recordId: record.id})
                .json()
                .catch((e)=>{
                    console.error(e) 
                    return {id:''}
                })
            assert(singleRecord && recordSet.records.map((rec)=>rec.id).includes(singleRecord.id))
        })
    )
});

Deno.test('LIST Response', async () => {
    const res = await AIR.LIST().fetch()
    
    assert(res.ok)
    assert(res.status === 200)

    res.body?.cancel()
});

