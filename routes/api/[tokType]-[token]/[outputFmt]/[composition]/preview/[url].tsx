import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { Status } from "$std/http/http_status.ts";
import { startFromURL } from "$lib/start.ts";
import { computableToJson, jsonToComputable } from "$lib/parsers/ast.ts";
import { urlToAST } from "$lib/start.ts";
import { composeASTChains, EnhancementModule } from "$lib/enhancements/index.ts";
import { defaultedOptions, functions } from "$lib/parsers/enhancementFunctions.ts";

import NavPanels from "$components/navigation/panels.tsx";

export const config: RouteConfig = {
	routeOverride:
		"/api/:tokType(u|t)-:token/:outputFmt(ast|json|html)/:composition/preview/:url(http.*)",
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

const FORM_SUBMISSION_PREFIX = "Form_Feed_PreviewURL_";

export interface ExploreGivenURL {
	url: string;
	prefix: string;
	processed: string;
	raw: string;
	errors: Error[];
}

export const ExploreGivenURL = (props: PageProps<ExploreGivenURL>) => (
	<div class="bg-white px-10 py-16 lg:px-8">
		<NavPanels
			stepsCompleted={["User Token", "Output Format", "Compositions"]}
			current="Add Feed URL"
			stepsPending={[]}
		/>
		<div class="mx-auto max-w-3xl text-base leading-7 text-gray-700">
			<AccentP addClass="mt-10">{`${[props.url]}`}</AccentP>
			<H1>Previewing</H1>

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
							Update URL
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
);

type ListOfEnhancementModules = EnhancementModule[];

const moduleMap = {} as { [fname: string]: ListOfEnhancementModules };

export const handler: Handlers = {
	GET: async (req, ctx) => {
		const { tokType, token, outputFmt, composition, url } = ctx.params;
		const parsedComps = await functions.parse(defaultedOptions)(composition);

		if (parsedComps.left) {
			return new Response(`${Status.BadRequest}\n\n${parsedComps.left}`, {
				status: Status.BadRequest,
				headers: {
					content_type: "text/plain",
				},
			});
		} else {
			const { txt } = await startFromURL(url);
			const ast = await jsonToComputable(urlToAST({ url, txt }));

			console.log(135, "ModuleMap is no longer imported", { moduleMap });

			const { found, errs } = parsedComps.right.reduce(
				({ found, errs }, { fname }) => {
					return moduleMap[fname]
						? {
							found: [...found, moduleMap[fname]] as ListOfEnhancementModules,
							errs,
						}
						: {
							found,
							errs: [...errs, Error(`fname: ${fname} - was not found`)],
						};
				},
				{ found: [] as ListOfEnhancementModules, errs: [] as Error[] },
			);

			if (errs.length > 0) {
				return ctx.render({
					url,
					prefix: FORM_SUBMISSION_PREFIX,
					raw: txt,
					processed: txt,
					errors: errs,
				});
			} else {
				const finalEnhancedAST = await computableToJson(
					await composeASTChains(
						found.map((f) => f.run),
						parsedComps.right.map(({ params }) => params),
					)(ast),
				);

				return ctx.render({
					url,
					prefix: FORM_SUBMISSION_PREFIX,
					raw: txt,
					processed: JSON.stringify(finalEnhancedAST, null, 2),
					errors: [],
				});
			}
		}
	},
	POST: async (req, ctx) => {
		const fd = await req.formData();
		const newUrl = fd.get(FORM_SUBMISSION_PREFIX + "#URL") as
			| string
			| undefined;
		const { tokType, token, outputFmt, composition, url } = ctx.params;

		// eventually
		// submit the newURL to server / queue
		// return a screen with a progress bar waiting for the server to proocess the work on the feed
		// implies a "receipt system" to check on the status of the work

		return new Response(null, {
			status: Status.SeeOther,
			headers: {
				location: `/api/${tokType}-${token}/${outputFmt}/${composition}/${newUrl ?? url}`,
			},
		});
	},
};

export default ExploreGivenURL;
