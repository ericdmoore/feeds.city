import { assert, assertEquals } from '$std/testing/asserts.ts'
import {getCookies} from "$std/http/cookie.ts";

const host = 'http://localhost'
const port = 8000
const path = '/'

const u = `${host}:${port}${path}`

Deno.test('GET root', async() => {
    const req = new Request(u, {method: 'GET'})
    const resp = await fetch(req)
    assert(resp)
    console.log({resp})
    assertEquals(resp.status, 200)
    const cookies = getCookies(resp.headers)
    assert(cookies?.sessionID)
})

Deno.test('POST root request', async() => {
    let req = new Request(u, {method: 'GET'})
    const resp = await fetch(req)
    assert(resp)
    assertEquals(resp.status, 200)
    
    const cookies = getCookies(resp.headers)
    assert(cookies?.sessionID)

    const token = resp.headers.get('sessionID')
    assert(token)

    const url = new URL(u)
    url.searchParams.append('email', encodeURIComponent('_edm42@bullmoose.cc'))
    url.searchParams.append('token', token)
    req = new Request(url, {method: 'POST'})

})
