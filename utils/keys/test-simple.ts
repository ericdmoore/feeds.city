import * as base64url from 'https://deno.land/std@0.181.0/encoding/base64url.ts'
import jwKeyExamples from '../../tests/lib/parsers/helpers/jwKeys.example.ts';

const enc = new TextEncoder()

const pubCryhptoKey = await window.crypto.subtle.importKey(
     "jwk", 
     jwKeyExamples.rsa.seal,
     {name:'RSA-OAEP', hash: { name:'SHA-256'} },
     false, 
     ['encrypt']
 )

// const message = JSON.stringify(payload)
const message = base64url.encode(crypto.getRandomValues(new Uint8Array(334)))
console.log('message.length :>', message.length)
console.log('message :>', message)

const encoded = enc.encode(message)
console.log('encoded', encoded)

const encMessage = await crypto.subtle.encrypt( { name: "RSA-OAEP"}, pubCryhptoKey, encoded );
console.log('encMessage', base64url.encode(new Uint8Array(encMessage)))