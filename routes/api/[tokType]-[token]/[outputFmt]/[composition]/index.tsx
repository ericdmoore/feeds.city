/**
 * Route:
 *   - parse the URL -> call the route Component with the parsed params
 */

import type { JSX } from "preact";
import type {
  HandlerContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";

import dotGet from "lodash.get";
import dotSet from "lodash.set";
import dotMerge from "lodash.merge";

import { Status } from "$std/http/http_status.ts";

import {
  defaultedOptions,
  type Either,
  type FuncInterface,
  type FuncInterface_Param,
  FunctionBuilderParamInputs,
  functions,
  paramListToDict,
} from "$lib/parsers/enhancementFunctions.ts";

import NavPanels from "$components/navigation/panels.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/api/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition",
};

const FORM_SUBMISSION_PREFIX = "Form_Feed_Function_";
const FORM_NEW_DATA_FUNCNAME = "~_NEW_FUNC_NAME_";
const FORM_NEW_DATA_PARAMNAME = "~_NEW_PARAM_NAME_";
const FORM_NEW_DATA_PARAMVALUE = "~_NEW_PARAM_VALUE_";
const FORM_NEW_DATA_ENCODING = "~_NEW_PARAM_ENCODING_";
const FORM_NEW_DATA_MERGESTRAT = "~_MERGE_STRATEGY_MERGE_";

const isObject = (u: unknown): u is Record<string, unknown> | Array<unknown> =>
  !(
    u === null ||
    typeof u === "boolean" ||
    typeof u === "undefined" ||
    typeof u === "number" ||
    typeof u === "string"
    // || typeof u === 'object'
    // || Array.isArray(u)
  );

const PoorFormedComposition = (
  props: { parsedFunc: Either<FuncInterface[], Error> },
) =>
  (
    <>
      <AccentP>Error During Parsing</AccentP>
      <p>{props.parsedFunc.left.name}</p>
      <p>{props.parsedFunc.left.message}</p>
      <p>{`${props.parsedFunc.left.cause}`}</p>
      <p>{props.parsedFunc.left.stack}</p>
    </>
  ) as JSX.Element;

const ProperExpansionOfParams = (
  props: { fname: string; params: FunctionBuilderParamInputs },
) => {
  return (
    <>
      {Object.entries(props.params).map(([paramName, pValue]) => {
        if (isObject(pValue)) {
          return (
            <div class="relative ">
              <label
                for={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                class="absolute -top-2 left-2 inline-block bg-white p-1 text-xs font-medium text-gray-900"
              >
                {paramName}
              </label>
              <textarea
                name={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                id={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                class="block w-full rounded-md border-0 mt-5 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={`${pValue}`}
              />
            </div>
          );
        } else {
          return (
            <div class="relative">
              <label
                for={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                class="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
              >
                {paramName}
              </label>
              <input
                type="text"
                name={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                id={`${FORM_SUBMISSION_PREFIX}#${props.fname}#${paramName}`}
                class="block w-full rounded-md border-0 mt-5 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={`${pValue}`}
              />
            </div>
          );
        }
      })}
    </>
  );
};

interface newElementValidated {
  fname: string;
  paramValue: string;
  paramName: string;
  encoding: string;
  fip: FuncInterface_Param;
}
const newItemHasAllElements = (
  prefix: string,
  input: FormData,
): null | newElementValidated => {
  const fname = input.get(`${prefix}#${FORM_NEW_DATA_FUNCNAME}`) as
    | string
    | undefined;
  const paramName = input.get(`${prefix}#${FORM_NEW_DATA_PARAMNAME}`) as
    | string
    | undefined;
  const paramValue = input.get(`${prefix}#${FORM_NEW_DATA_PARAMVALUE}`) as
    | string
    | undefined;
  const encoding = input.get(`${prefix}#${FORM_NEW_DATA_ENCODING}`) as
    | string
    | undefined;

  if (fname && paramName && paramValue && encoding) {
    return {
      fname,
      paramName,
      paramValue,
      encoding,
      fip: { fname, params: { [paramName]: paramValue } },
    };
  } else {
    return null;
  }
};

const addNewItem = (
  prefix: string,
  input: FormData,
  composition: FuncInterface_Param[],
) => {
  console.log("adding");
  const validated = newItemHasAllElements(prefix, input);
  return validated ? [...composition, validated.fip] : composition;
};

/**
 * @param prefix
 * @param input
 * @param composition
 * @todo Deal with deep nesting via dotted key data structure
 * @todo Deal with merge on repeated funcs
 * funcName = {name}.{index}
 * paramName = {dottedName}
 * paramValue
 */
const mergeNewItem = (
  prefix: string,
  input: FormData,
  composition: FuncInterface_Param[],
) => {
  // look for the submitted function name, then submitted param name in the list
  console.log("merging");
  const lookForIdx =
    (input.get(`${prefix}#${FORM_NEW_DATA_FUNCNAME}`) as string).split(
      ".",
    )[1] ?? "0";
  const filteredFuncList = Object.entries(composition)
    .filter(([idx, elem]) =>
      elem.fname === input.get(`${prefix}#${FORM_NEW_DATA_FUNCNAME}`)
    );

  console.log({ lookForIdx, filteredFuncList });
  if (filteredFuncList.length === 0) {
    // no overlap to deal with merging
    console.log("no overlap - add to end");
    return addNewItem(prefix, input, composition);
  } else {
    const validated = newItemHasAllElements(prefix, input);
    const found = Object.fromEntries(filteredFuncList)[lookForIdx];
    const foundInCompoIdx = filteredFuncList.findIndex(([key, elem]) =>
      key === lookForIdx
    );

    console.log({
      validated,
      found,
      foundInCompoIdx,
    });

    if (validated && found && foundInCompoIdx !== -1) {
      if (dotGet(found.params, validated.paramName, null)) {
        // replace via dotted names?
        //
        composition[foundInCompoIdx] = {
          fname: found.fname,
          params: dotMerge(
            found.params,
            [dotSet(found.params, validated.paramName, validated.paramValue)],
          ),
        };
        return composition;
      } else {
        // edit: merge in new param name
        composition[foundInCompoIdx] = {
          fname: found.fname,
          params: dotSet(
            found.params,
            validated.paramName,
            validated.paramValue,
          ),
        };
        return composition;
      }
    } else {
      // validation failed
      // return unchanged
      return composition;
    }
  }
};

export const FormDataToParsedFunctionString = (
  prefix: string,
  input: FormData,
  composition: FuncInterface_Param[],
) => {
  const funcBuildInputList =
    input.get(`${prefix}#${FORM_NEW_DATA_MERGESTRAT}`)?.toString()
        .toLowerCase() === "merge"
      ? mergeNewItem(prefix, input, composition)
      : addNewItem(prefix, input, composition);
  return functions.stringify(defaultedOptions)(
    ...paramListToDict(funcBuildInputList),
  );
};

export const FormTypeNewParams = (
  props: { PREFIX: string; hasCompStr: boolean },
) => (
  <fieldset class="mt-10 border-t border-gray-200">
    {props.hasCompStr
      ? <legend>Change Feed Functions</legend>
      : <legend>Add Feed Functions</legend>}

    <div class="flex flex-col">
      <div class="py-3">
        <div class="relative">
          <label
            for="name"
            class="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Function Name
          </label>
          {/* eventually make this a typeahead */}
          <input
            type="text"
            name={`${props.PREFIX}#~_NEW_FUNC_NAME_`}
            id={`${props.PREFIX}#~_NEW_FUNC_NAME_`}
            class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value=""
          />
        </div>
      </div>

      <div class="py-3">
        <div class="relative">
          <label
            for="name"
            class="absolute -top-2 left-2 inline-block bg-white p-1 text-xs font-medium text-gray-900"
          >
            Param Name
          </label>
          <input
            type="text"
            name={`${props.PREFIX}#~_NEW_PARAM_NAME_`}
            id={`${props.PREFIX}#~_NEW_PARAM_NAME_`}
            class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value=""
          />
        </div>
      </div>

      <div class="py-3">
        <div class="relative">
          <label
            for={`${props.PREFIX}#~_NEW_PARAM_VALUE_`}
            class="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            New Param Value
          </label>
          <input
            type="text"
            name={`${props.PREFIX}#~_NEW_PARAM_VALUE_`}
            id={`${props.PREFIX}#~_NEW_PARAM_VALUE_`}
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value=""
          />
        </div>
      </div>

      <div class="py-4">
        <div class="relative">
          <label
            for={`${props.PREFIX}#~_NEW_PARAM_ENCODING_`}
            class="absolute -top-5 left-2 inline-block bg-white p-1 text-xs font-medium text-gray-900"
          >
            Encoding
          </label>
          <select
            name={`${props.PREFIX}#~_NEW_PARAM_ENCODING_`}
            id={`${props.PREFIX}#~_NEW_PARAM_ENCODING_`}
            class="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            // oldClass=" ring-gray-300 shadow-sm "
          >
            <option value="default">Default</option>
            <option value="JBA">JBA</option>
            <option value="JA">JA</option>
            <option value="SA">SA</option>
            <option value="SBA">SBA</option>
          </select>
        </div>
      </div>

      <div>
        <label class="text-base font-semibold text-gray-900">
          Merge / Repeat
        </label>
        <p class="text-sm text-gray-500">
          How should this be integrated if there is a repeat
        </p>
        <fieldset class="mt-4">
          <legend class="sr-only">Handle Repeats</legend>
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                type="radio"
                id={`${props.PREFIX}#~_MERGEOPTS_MERGE_`}
                name={`${props.PREFIX}#~_MERGE_STRATEGY_MERGE_`}
                value="merge"
                checked
                class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                for={`${props.PREFIX}#~_MERGE_STRATEGY_MERGE_`}
                class="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                Merge/Overide
              </label>
            </div>
            <div class="flex items-center">
              <input
                id={`${props.PREFIX}#~_MERGEOPTS_REPEAT`}
                type="radio"
                name={`${props.PREFIX}#~_MERGE_STRATEGY_MERGE_`}
                value="repeat"
                class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                for={`${props.PREFIX}#~_MERGE_STRATEGY_REPEAT_`}
                class="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                Repeat
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
    {/* flex-row */}
  </fieldset>
);

const ProperComposition = (
  props: {
    rootURL: string;
    hasCompStr: boolean;
    parsedFunc: FuncInterface_Param[];
  },
) => (
  <>
    <form method="post">
      <>
        {props.parsedFunc.map(({ fname, params }) => (
          <fieldset>
            <legend class="mb-1">{fname}</legend>
            <ProperExpansionOfParams fname={fname} params={params} />
          </fieldset>
        ))}
      </>
      <FormTypeNewParams
        PREFIX={FORM_SUBMISSION_PREFIX}
        hasCompStr={props.hasCompStr}
      />
      <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <button
          type="submit"
          class="w-full 
          rounded-md 
          border 
          border-transparent 
          bg-indigo-500 
          px-4 
          py-3 
          text-base 
          font-medium 
          text-white 
          shadow-sm 
          hover:bg-indigo-700 
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-500 
          focus:ring-offset-2 
          focus:ring-offset-gray-50"
        >
          + Param
        </button>
      </div>
    </form>
    <a
      href={`${props.rootURL}/preview`}
      // class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
    >
      Add URL
    </a>
  </>
);

// #endregion UI Comps
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

export default function FeedFunctionPreview(
  props: PageProps<ExistingCompositionProps>,
) {
  // const { token, tokType, outputFmt, composition } = props.params;
  // console.log();

  return (
    <div class="bg-white px-10 py-16 lg:px-8">
      <NavPanels
        stepsCompleted={["User Token", "Output Format"]}
        current="Compositions"
        stepsPending={["Add Feed URL"]}
      />
      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <AccentP addClass="mt-10">Preview</AccentP>
        <H1>Existing Compositions</H1>

        <div class="mt-10 max-w-2xl">
          {props.data.composition.right
            ? (
              <ProperComposition
                rootURL={props.data.rootURL}
                hasCompStr={props.data.composition.right.length > 0}
                parsedFunc={props.data.composition.right}
              />
            )
            : <PoorFormedComposition parsedFunc={props.data.composition} />}
        </div>
      </div>
    </div>
  );
}

interface ExistingCompositionProps {
  rootURL: string;
  composition: Either<FuncInterface_Param[], Error>;
  runTimeCtx: HandlerContext<Record<string, unknown>>;
  token: string;
}

export const handler: Handlers = {
  GET: async (req, ctx) => {
    const u = new URL(req.url);
    const { protocol, host } = u;
    const { token, tokType, outputFmt, composition } = ctx.params;

    const baseLink =
      `${protocol}//${host}/api/${tokType}-${token}/${outputFmt}/${composition}`;

    return ctx.render({
      composition: await functions.parse(defaultedOptions)(composition),
      rootURL: baseLink,
      runTimeCtx: ctx,
      token: JSON.stringify({ token, tokType }, null, 2),
    });
  },
  POST: async (req, ctx) => {
    const { token, tokType, outputFmt, composition } = ctx.params;
    const parsedComp = await functions.parse(defaultedOptions)(composition);

    // console.log({parsedComp})

    if (parsedComp.left) {
      console.error(parsedComp.left);
      return new Response(
        `${Status.BadRequest}:\n\n${parsedComp.left.toString()}`,
        {
          status: Status.BadRequest,
          headers: { "content-type": "plain/text" },
        },
      );
    } else {
      // WORK HORSE FUNCTION
      const parsedForm = await FormDataToParsedFunctionString(
        FORM_SUBMISSION_PREFIX,
        await req.formData(),
        parsedComp.right,
      );

      if (parsedForm.left) {
        console.error(parsedComp.left);
        return new Response(`${Status.BadRequest}:\n\n${parsedComp.left}`, {
          status: Status.BadRequest,
          headers: { "content-type": "plain/text" },
        });
      } else {
        console.log(476, parsedForm.right);
        return new Response(null, {
          status: Status.SeeOther,
          headers: {
            location:
              `/api/${tokType}-${token}/${outputFmt}/${parsedForm.right}`,
          },
        });
      }
    }
  },
};
