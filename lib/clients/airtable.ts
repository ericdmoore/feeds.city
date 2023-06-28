import type { JsonType, JsonObject } from '../parsers/index.ts'

interface MiddleLayerReturns<T>{
    url: ()=> URL
    req: () => Request
    fetch: ()=> Promise<Response>
    json: ()=>Promise<T>
}

interface AirtableState {
    baseURL: string
    apiToken: string
    baseId: string
    tableName: string
}


const makeReturnable = <T>(state:AirtableState, req: Request)=>{
    req.headers.set('Authorization', `Bearer ${state.apiToken}`)
    return {
        url: ()=> new URL(req.url),
        req: ()=> req,
        fetch: ()=> fetch(req),
        json: ()=> fetch(req).then(res => res.json() as T)
    }
}

type SortOptions = string | {field: string, direction?: "asc" | "desc"}

type OverRideFunction = (data: unknown) => string

/**
 * @param url
 * @param params
 * @param mapOfOverideRules
 */
const intergratateQuerryParams = (url: URL, params: Record<string, unknown>, mapOfOverideRules: Record<string, (data:unknown)=>string> = {}): URL => {
    return  Object.entries(params).reduce((url, [key,val]) => {
        key in mapOfOverideRules 
            ? url.searchParams.set(key, encodeURIComponent(mapOfOverideRules[key](val)))
            : url.searchParams.set(key, encodeURIComponent(`${val}`))
        return url
    }, new URL(url.href) )
}


interface ListMethodResponse{
    offset?: string
    records: {
        id: string
        createdTime: string
        fields: {key:string}
        commentCount?: number
    }[]
}
interface ListMethodOptions{
    timeZone?: string // example: "America/Chicago"
    userLocale?: string // examaple: 'en-US'
    pageSize?: number // default: 100
    maxRecords? : number // default: 100
    offset?: string
    view?: string
    sort?: SortOptions[]
    filterByFormula?: string 
    'fields[]'?: string[] // fieldName or fieldID list  
    cellFormat?: "json" | "string" // json is default
    returnFieldsByFieldId?: boolean //default false
    // recordMetadata? : commentCount[] // dont understand well enough to yet implement
}
const listMethod = (state: AirtableState) => (opts: ListMethodOptions = {
    timeZone:'America/Chicago',
    userLocale: 'en-US', 
    pageSize: 100,
    maxRecords: 100,
    cellFormat: 'json',
}): MiddleLayerReturns<ListMethodResponse> => {

    const overrideSortOptions = ((val: SortOptions[] ) => {
        const sortString = (val as SortOptions[]).map((v) => {
            if(typeof v === 'string'){
                return `field=${v}`
            }else{
                return `field=${v.field}&direction=${v.direction || 'asc'}`
            }
        }).join('&')
        return sortString
    }) as OverRideFunction

    const listRecordsURL = new URL(state.baseURL)
    const urlWithQuery = intergratateQuerryParams(listRecordsURL, opts as Record<string, unknown>, {sort: overrideSortOptions})
    const req = new Request(urlWithQuery, {method: 'GET'})
    return makeReturnable(state, req)
}



export interface GetMethodResponse{ 
    id: string
    createdTime: string
    fields: JsonObject
}
export interface GetMethodOptions{
    recordId: string
    cellFormat?: "json" | "string"
    returnFieldsByFieldId?: boolean
}
const getMethod = (state: AirtableState) => (opts: GetMethodOptions ) :MiddleLayerReturns<GetMethodResponse> => {
    const {recordId, ...others} = opts
    const listRecordsURL = new URL(state.baseURL + `/${recordId}`)
    const urlWithQuery = intergratateQuerryParams(listRecordsURL, others as Record<string, unknown>)
    
    const req = new Request(urlWithQuery)
    return makeReturnable(state, req)
}



export interface DeleteMethodOptions{
    records: string[]
}
export interface DeleteMethodResponse{
    id: string;
    deleted: boolean
}
const deleteMethod = (state: AirtableState) =>  (recordIdList: string[]) :MiddleLayerReturns<DeleteMethodResponse> => {
    const url = new URL(state.baseURL)
    
    const req  = new Request(url, {
        method: 'DELETE', 
        body: JSON.stringify({records: recordIdList.map((id) => ({id}))})
    })
    return makeReturnable(state, req)
}




const updateMethod = (state: AirtableState) =>  () :MiddleLayerReturns<JsonType> => {
    const url = new URL(state.baseURL)
    const req  = new Request(url,{method: 'GET'})
    return makeReturnable(state, req)
}





const createMethod = (state: AirtableState) =>  () :MiddleLayerReturns<JsonType> => {
    const url = new URL(state.baseURL)
    const req  = new Request(url,{method: 'GET'})
    return makeReturnable(state, req)
}





export const airtable = (init: Omit<AirtableState, 'baseURL'>)=>{

    const state = {
        baseURL: `https://api.airtable.com/v0/${init.baseId}/${init.tableName}`,
        ...init
    }

    return {
        GET: getMethod(state),
        LIST: listMethod(state),
        DELETE: deleteMethod(state),
        UPDATE: updateMethod(state),
        CREATE: createMethod(state),
    }

}

export default airtable