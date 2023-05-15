// import type { JSX } from "preact";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import {
  FormDataToParsedFunctionString,
  FormTypeNewParams,
} from "./[composition]/index.tsx";
import {
  defaultedOptions,
  type Either,
  type FuncInterface,
  type FuncInterface_Param,
  FunctionBuilderParamInputs,
  type FunctionPathBuilderInputDict,
  functions,
  params,
} from "$lib/parsers/enhancementFunctions.ts";
import { Status } from "$std/http/http_status.ts";

import NavPanels from "$components/navigation/panels.tsx";

export const config: RouteConfig = {
  routeOverride: "/api/:tokType(u|t)-:token/:outputFmt(json|html|atom|rss)",
};

const H1 = (
  { children, addClass }: { children: string; addClass?: string },
) => (
  <h1
    class={`mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl` +
      (addClass ?? "")}
  >
    {children}
  </h1>
);

const AccentP = (
  { children, addClass }: { children: string; addClass?: string },
) => (
  <p
    class={`text-base font-semibold leading-7 text-indigo-600` +
      (addClass ? ` ${addClass}` : "")}
  >
    {children}
  </p>
);

// const FORM_SUBMISSION_NAME = "formOutputFormat";
const FORM_SUBMISSION_PREFIX = "Form_Feed_Function_";

export default function AddFeedFunctions(
  props: PageProps<{ compStr: string }>,
) {
  return (
    <div class="bg-white px-10 py-16 lg:px-8">
      <NavPanels
        stepsCompleted={["User Token", "Output Format"]}
        current="Feed Functions"
        stepsPending={["Add Feed URL"]}
      />

      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <AccentP addClass="mt-10">Building Better Feeds</AccentP>
        <H1>Add Feed Functions</H1>

        <div class="mt-10 max-w-2xl">
          <form method="post">
            <FormTypeNewParams
              hasCompStr={false}
              PREFIX={FORM_SUBMISSION_PREFIX}
            />
            <div class="border-t border-gray-200 mt-6 px-4 py-4 sm:px-6">
              <button
                type="submit"
                class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const handler: Handlers = {
  GET: (req, ctx) => ctx.render(),
  POST: async (req, ctx): Promise<Response> => {
    const { token, tokType, outputFmt } = ctx.params;
    const parsedForm = await FormDataToParsedFunctionString(
      FORM_SUBMISSION_PREFIX,
      await req.formData(),
      [],
    );

    if (parsedForm.left) {
      return new Response(`${Status.BadRequest}::\n\n${parsedForm.left}`, {
        status: Status.BadRequest,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    } else {
      return new Response(null, {
        status: Status.SeeOther,
        headers: {
          location:
            `/api/${tokType}-${token}/${outputFmt}/${parsedForm.right}/`,
        },
      });
    }
  },
};
