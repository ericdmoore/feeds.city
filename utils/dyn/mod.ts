export const string = (S:string)=>({S})
export const number = (N:number)=>({N:`${N}`})
export const boolean = (BOOL:boolean)=>({BOOL})  
export const binary = (B: Uint8Array)=>({B})
export const stringSet = (SS:string[])=>({SS})  // Set of strings
export const numberSet = (NS:number[])=>({NS})  // Set of numbers
export const binarySet = (BS: Uint8Array[])=>({BS})  // Set of binary data

export const object = (M:Record<string, unknown>)=>({M:{M}})
