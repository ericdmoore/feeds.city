// #region interfaces
type TestExecFunc = (t: Deno.TestContext) => void | Promise<void>;

interface TestObj {
	name: string;
	ignore?: boolean;
	fn: TestExecFunc;
}

export const skip = (name: string, fn: TestExecFunc) => {
	return { name, fn, ignore: true } as Deno.TestDefinition;
};

export const only = (name: string, fn: TestExecFunc) => {
	return { name, fn, only: true } as Deno.TestDefinition;
};

export default skip;
// #endregion helpers
