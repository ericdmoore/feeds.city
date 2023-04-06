/** @jsx h */
/** @jsxFrag Fragment */

import { JsonForm } from "../../src/bin/comps/jsonForm.tsx";
import { simpleUser } from "./shemas.ts";

Deno.test("simpleUser", () => {
  const simpleUserObj = simpleUser.valueOf();
  const form = JsonForm(simpleUser);

  // console.log("form.type:", form.type);
  // console.log("form.props:", form.props);
  // console.log("form.key:", form.key);
  // console.log("form.ref:", form.ref);

  // console.log({ simpleUserObj });
  // console.log("simpleUserObj: >> \n\n", JSON.stringify(simpleUserObj, null, 2));
});
