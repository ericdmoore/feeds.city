// #region interfaces
type TestExecFunc = (t: Deno.TestContext) => void | Promise<void>;

interface TestObj {
  name: string;
  ignore?: boolean;
  fn: TestExecFunc;
}

type Dict<T> = { [key: string]: T };

// #endregion interfaces

// #region helpers
export const skip = (name: string, fn: TestExecFunc) => {
  return { name, fn, ignore: true } as Deno.TestDefinition;
};

// export const envData = async <T>(overrides?: Dict<string>)=>{
// 	const errVal = `No env file, No env variable, Missing Override, can't help ya`
// 	const envFileData = await import('./.env.json', {assert:{type:'json'}}).catch(()=>{
// 		return {default:{
// 			// emulate the env file  structure here
//             AWS_KEY: overrides?.AWS_KEY ?? Deno.env.get('AWS_KEY') ?? errVal,
//             AWS_SECRET: overrides?.AWS_SECRET ?? Deno.env.get('AWS_SECRET') ?? errVal,
// 			pollybucket: overrides?.pollybucket ?? Deno.env.get('pollybucket') ?? errVal
//         }}
//     })
// 	return envFileData.default
// }

export default skip;
// #endregion helpers
