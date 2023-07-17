import type { HandlerContext, Handlers, PageProps, RouteConfig } from "$fresh/server.ts";

import { Status } from "$std/http/http_status.ts";

import { type Either } from "$lib/types.ts";
import { type FuncInterface_Param } from "$lib/parsers/enhancementFunctions.ts";

import NavPanels from "$components/navigation/panels.tsx";

export const config: RouteConfig = {
	routeOverride: "/api/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition/preview",
};

const FORM_SUBMISSION_PREFIX = "Form_Feed_AddFeedURL_";

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

interface ExistingCompositionProps {
	rootURL: string;
	prefix: string;
	composition: Either<FuncInterface_Param[], Error>;
	runTimeCtx: HandlerContext<Record<string, unknown>>;
	token: string;
}

export default function AddAURLForPreview(
	props: PageProps<ExistingCompositionProps>,
) {
	return (
		<div class="bg-white px-10 py-16 lg:px-8">
			<NavPanels
				stepsCompleted={["User Token", "Output Format", "Compositions"]}
				current="Add Feed URL"
				stepsPending={[]}
			/>
			<div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
				<AccentP addClass="mt-10">Preview</AccentP>
				<H1>Add Feed URL</H1>

				<div class="mt-10 max-w-2xl">
					<form method="post">
						<div class="py-3">
							<div class="relative">
								<label
									for={`${props.data.prefix}#URL`}
									class="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
								>
									Feed URL
								</label>
								<input
									type="text"
									name={`${props.data.prefix}#URL`}
									id={`${props.data.prefix}#URL`}
									class="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									value="https://daringfireball.net/feeds/json"
								/>
							</div>
						</div>
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
								Add URL
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
	POST: async (req, ctx) => {
		const { token, tokType, outputFmt, composition } = ctx.params;

		const formData = await req.formData();
		const url = formData.get(FORM_SUBMISSION_PREFIX + "#URL");
		console.log(url, formData);

		return new Response(null, {
			status: Status.SeeOther,
			headers: {
				location: `/api/${tokType}-${token}/${outputFmt}/${composition}/preview/${url}`,
			},
		});
	}, // POST
};
