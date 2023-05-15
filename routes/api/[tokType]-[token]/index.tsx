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

export const config: RouteConfig = {
  routeOverride: "/api/:tokType(u|t)-:token",
};

const FORM_SUBMISSION_NAME = "formOutputFormat";

export default function PickAnOutputFmt(props: PageProps<null>) {
  return (
    <div class="bg-white px-10 py-16 lg:px-8">
      <NavPanels
        stepsCompleted={["User Token"]}
        current="Output Format"
        stepsPending={["Feed Functions", "Add Feed URL"]}
      />

      <div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <AccentP addClass="mt-10">Building Better Feeds</AccentP>
        <H1>Pick an Output</H1>

        <div class="mt-10 max-w-2xl">
          <form method="post">
            <fieldset>
              <div class="flex flex-col mb-6">
                <label for={FORM_SUBMISSION_NAME}>
                  Selected Output Format:
                </label>
                <select
                  required
                  name={FORM_SUBMISSION_NAME}
                  id={FORM_SUBMISSION_NAME}
                >
                  <option value="json">JsonFeed v1.1</option>
                  <option value="ast">CityFeed v1</option>
                  <option value="rss">RSS v2</option>
                  <option value="atom">Atom v1(2005)</option>
                </select>
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
  GET: (req, ctx) => ctx.render(),
  POST: async (req, ctx): Promise<Response> => {
    const { token, tokType } = ctx.params;
    const r = await req.formData();
    // validate and build response
    if (r.has(FORM_SUBMISSION_NAME)) {
      const selectedOutputType = r.get(FORM_SUBMISSION_NAME) as string;
      return new Response(null, {
        status: 303, // See Other
        headers: {
          location: `/api/${tokType}-${token}/${selectedOutputType}`,
        },
      });
    } else {
      return new Response("Needs an output type");
    }
  },
};
