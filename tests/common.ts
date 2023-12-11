import type  { ServeHandlerInfo } from "$fresh/server.ts";
import { DOMParser } from "deno_dom";
import { xml2js } from 'fromXml'

export const CONN_INFO = {
	remoteAddr: { 
        transport: "tcp", 
        hostname: "192.168.1.2", 
        // hostname: "127.0.0.1"
        port: 80 
        // port: 53496
    } as Deno.Addr,
} as ServeHandlerInfo;


export const urlPath = (host = 'https://localhost', port:number | string = 8080) => 
    (path: string) => 
        `${host}:${port}${path}`;


export const isValidHTML = async (str:string) => {
    try{ await new DOMParser().parseFromString(str, 'text/html'); return true; }
    catch(e:unknown){ console.error(e); return false; }
}

export const isValidXml = (str:string): Promise<boolean> => {
    try{ xml2js(str,{}); return Promise.resolve(true); }
    catch(e:unknown){  console.error(e); return Promise.resolve(false); }
}


export const isValidJSON = (str:string): Promise<boolean> => {
    try{ JSON.parse(str); return Promise.resolve(true); }
    catch(e:unknown){  console.error(e); return Promise.resolve(false); }
}
