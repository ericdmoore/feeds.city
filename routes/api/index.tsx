import type { JSX } from "preact";
import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";

import NavPanels from "$components/navigation/panels.tsx";

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

const FORM_SUBMISSION_NAME = "formUserToken";

export const config: RouteConfig = {
  routeOverride: "/api",
};

export default function AddYourToken(
  props: PageProps<null>,
) {
  const { token, tokType, outputFmt, composition } = props.params;
  console.log();

  return (
    <div class="bg-white px-10 py-16 lg:px-8">
      <NavPanels
        stepsCompleted={[]}
        current="User Token"
        stepsPending={["Output Format", "Feed Functions", "Add Feed URL"]}
      />

      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <AccentP addClass="mt-10">Building Better Feeds</AccentP>
        <H1>Add Your User Token</H1>

        <div class="mt-10 max-w-2xl">
          <form method="post">
            <fieldset>
              <label
                for={FORM_SUBMISSION_NAME}
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                User Token
              </label>
              <div class="mt-2">
                <input
                  id={FORM_SUBMISSION_NAME}
                  name={FORM_SUBMISSION_NAME}
                  type="text"
                  autocomplete="userToken"
                  required
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <button
                type="submit"
                class="
                flex 
                w-full 
                justify-center 
                rounded-md 
                bg-indigo-600 
                px-3 py-1.5 
                text-sm 
                font-semibold 
                leading-6 
                text-white 
                shadow-sm 
                hover:bg-indigo-500 
                focus-visible:outline 
                focus-visible:outline-2 
                focus-visible:outline-offset-2 
                focus-visible:outline-indigo-600"
              >
                Next
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export const handler: Handlers = {
  // can eventually replce with a login form/page
  // use a token form for now
  GET: (req, ctx) => ctx.render(),
  POST: async (req, _ctx): Promise<Response> => {
    const r = await req.formData();
    // validate and build response
    if (r.has(FORM_SUBMISSION_NAME)) {
      const formToken = r.get(FORM_SUBMISSION_NAME) as string;

      console.log({ formToken });
      // check db to see if the token is valid

      return new Response(null, {
        status: 303, // See Other
        headers: {
          location: `/api/${formToken}`,
        },
      });
    } else {
      return new Response("no form token");
    }
  },
};
