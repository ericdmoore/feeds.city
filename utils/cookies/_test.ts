import {create, verify} from 'djwt'
import jwkeypair from'../ECkeys/grab.ts'

// deno-lint-ignore require-await
const _jwkeys = async () => {
    // const pair = await import('../../jwk.privateKeyPair.json')
    // const privateKey = await crypto.subtle.importKey(
    //     'jwk',
    //     pair.privateKey,
    //     {name:'ECDSA', namedCurve: 'P-384'},
    //     true,
    //     ['sign']
    // )

    // const publicKey = await crypto.subtle.importKey(
    //     'jwk',
    //     pair.publicKey,
    //     {name:'ECDSA', namedCurve: 'P-384'},
    //     true,
    //     ['verify']
    // )

    //
    // return {privateKey, publicKey}
    return jwkeypair()
}



(async ()=>{
    const {privateKey, publicKey} = await _jwkeys()
    const jwtStr = await create({typ:'JWT', alg:'ES384' },{msg: 'Allo Globe'}, privateKey)
    console.log(jwtStr)
    try{
        verify(jwtStr, publicKey)
    }catch(e){
        console.error('signature mismatch')
        console.error(e)
    }
    
    console.log('...and signature is verified')

})()