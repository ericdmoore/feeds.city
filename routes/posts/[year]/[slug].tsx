// import { tw } from 'twind'
import type { CompileContext } from "micromark-util-types";

import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { CSS, render } from "gfm";
import { Head } from "$fresh/runtime.ts";

import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { directiveHtml, type Handle } from "micromark-extension-directive";
// import { frontmatter, frontmatterHtml } from 'micromark-extension-frontmatter'
import { mdxjs } from "micromark-extension-mdxjs";
import { MDXProvider } from "@mdx-js/preact";

import { Check_circle, Information_circle } from "$components/heroicons/solid.tsx";
import { components } from "../components.tsx";

interface DirectiveInput {
	// Directive kind
	type: "containerDirective" | "leafDirective" | "textDirective";

	// name of directive
	name: string;

	// compiled HTML content that was in [brackets]
	label?: string;

	// Object w/ HTML attributes
	attributes?: Record<string, string>;

	// compiled HTML content inside container directive
	content?: string;
}

interface Page {
	body: string;
	attrs: Record<string, unknown>;
}

// ideally I would like a loose coupling between the source file and the theme.
// the source author uses regular markdown,
// the elements pick up themed styles, and can add to them
// or opt out of the styles
export const handler: Handlers<Page> = {
	GET(_req, ctx) {
		// look up slug from
		// fs > dyanmo > github issue?

		const rawMarkdown = `---
draft: true
description: test
---
## big text
Look, it's working. _This is in italics._

::figure[CAPTION]{alt='Alt Text' src='' srcSet='' media=''}
    
`;

		console.log({ year: ctx.params.year, slug: ctx.params.slug });

		// THIS IS WHERE YOU PUT VARIOUS LOADERS
		//
		//
		// DYNAMO
		// S3
		// GITHUB
		// FILESYSTEM
		//

		const { attrs, body, frontMatter } = extract(rawMarkdown);
		console.log({ attrs, body, frontMatter, ctx, render: ctx.render });

		return ctx.render({ body, attrs });
	},
};

// text directive
// `:name[label]{attributes}`

// text directive
// `:name[label]{attributes}`

const figureTag =
	(attr: Record<string, string>, ...tagFns: ((that: CompileContext, d: DirectiveInput) => void)[]) =>
	(that: CompileContext, d: DirectiveInput) => {
		that.tag("<figure>");
		for (const tagFn of tagFns) {
			tagFn(that, d);
		}
		that.tag("</figure>");
	};

const pictureTag = (config: string) => (that: CompileContext, d: DirectiveInput) => {
	that.tag("<picture>");

	that.tag("</picture>");
};

const captionTag = (defaultStr: string) => (that: CompileContext, d: DirectiveInput) => {
	that.tag("<figcaption>");

	that.tag("</figcaption>");
};

/**
 * Usage ::youtube[Video of a cat in a box]{vid=01ab2cd3efg}
 * ::figure[CAPTION]{alt='' src=''}
 * @param this
 * @param d
 * @returns
 */
const figure: Handle = function (this: CompileContext, d: DirectiveInput) {
	if (d.type !== "leafDirective") return false;

	/**
	 * figure
	 *   picture
	 *     source: srcSet media
	 *      img: src alt
	 *   figcaption
	 *      -text-
	 */

	figureTag(
		{},
		pictureTag(""),
		captionTag(""),
	)(this, d);

	this.tag("<figure");

	if (d.attributes && "title" in d.attributes) {
		this.tag(' title="' + this.encode(d.attributes.title) + '"');
	}

	this.tag(">");
	this.raw(d.label || "");
	this.tag("</figure>");
	return true;
};

export default function MarkdownPage({ data }: PageProps<Page | null>) {
	if (!data) {
		return <h1>File not found.</h1>;
	}

	// const h1 = apply("mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl")

	const h1 = `mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl`;

	// console.log( tw(h1))

	const Post = (props: { text: string }) => <p>{`Here is a Post:  ${props.text}`}</p>;

	return (
		<>
			<Head>
				<style dangerouslySetInnerHTML={{ __html: CSS }} />
			</Head>
			<main>
				<pre>{JSON.stringify(data.attrs, null,2)}</pre>
				<div class="py-6"></div>

				<div class="bg-white px-10 py-32 lg:px-8">
					<div class="mx-auto max-w-6xl text-base leading-7 text-gray-700">
						<div
							class="markdown-body"
							dangerouslySetInnerHTML={{
								__html: micromark(
									data.body,
									{
										extensions: [
											// gfm(),
											// frontmatter(),
											// mdxjs()
										],
										htmlExtensions: [
											// gfmHtml(),
											// directiveHtml({figure}),
											// frontmatterHtml()
										],
									},
								),
							}}
						/>
						{
							/* <MDXProvider components={components({})}>
              <Post text='Allo World!' />
            </MDXProvider> */
						}

						<p class="text-base font-semibold leading-7 text-indigo-600">Introducing</p>
						{/* <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">JavaScript for Beginners</h1> */}
						<h1 class={h1}>JavaScript for Beginners</h1>
						<p class="mt-6 text-xl leading-8">
							Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam eget
							aliquam. Quisque id at vitae feugiat egestas ac. Diam nulla orci at in viverra scelerisque eget. Eleifend
							egestas fringilla sapien.
						</p>

						<div class="mt-10 max-w-2xl">
							<p>
								Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
								vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
								erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
								semper sed amet vitae sed turpis id.
							</p>
							<ul role="list" class="mt-8 max-w-xl space-y-8 text-gray-600">
								<li class="flex gap-x-3">
									<Check_circle class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
									<span>
										<strong class="font-semibold text-gray-900">Data types.</strong>{" "}
										Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit
										eaque, iste dolor cupiditate blanditiis ratione.
									</span>
								</li>
								<li class="flex gap-x-3">
									<Check_circle class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
									<span>
										<strong class="font-semibold text-gray-900">Loops.</strong>{" "}
										Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
									</span>
								</li>
								<li class="flex gap-x-3">
									<Check_circle class="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
									<span>
										<strong class="font-semibold text-gray-900">Events.</strong>{" "}
										Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
									</span>
								</li>
							</ul>
							<p class="mt-8">
								Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
								fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
								adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
							</p>
							<h2 class="mt-16 text-2xl font-bold tracking-tight text-gray-900">From beginner to expert in 3 hours</h2>
							<p class="mt-6">
								Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
								Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
								tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
								turpis ipsum eu a sed convallis diam.
							</p>
							<figure class="mt-10 border-l border-indigo-600 pl-9">
								<blockquote class="font-semibold text-gray-900">
									<p>
										“Vel ultricies morbi odio facilisi ultrices accumsan donec lacus purus. Lectus nibh ullamcorper ac
										dictum justo in euismod. Risus aenean ut elit massa. In amet aliquet eget cras. Sem volutpat enim
										tristique.”
									</p>
								</blockquote>
								<figcaption class="mt-6 flex gap-x-4">
									<img
										class="h-6 w-6 flex-none rounded-full bg-gray-50"
										src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
									<div class="text-sm leading-6">
										<strong class="font-semibold text-gray-900">Maria Hill</strong> – Marketing Manager
									</div>
								</figcaption>
							</figure>
							<p class="mt-10">
								Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
								vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
								erat velit.
							</p>
						</div>
						<figure class="mt-16">
							<img
								class="aspect-video rounded-xl bg-gray-50 object-cover"
								src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&w=1310&h=873&q=80&facepad=3"
								alt=""
							/>
							<figcaption class="mt-4 flex gap-x-2 text-sm leading-6 text-gray-500">
								<Information_circle class="mt-0.5 h-5 w-5 flex-none text-gray-300" aria-hidden="true" />
								Faucibus commodo massa rhoncus, volutpat.
							</figcaption>
						</figure>

						<div class="mt-16 max-w-2xl">
							<h2 class="text-2xl font-bold tracking-tight text-gray-900">Everything you need to get up and running</h2>
							<p class="mt-6">
								Purus morbi dignissim senectus mattis adipiscing. Amet, massa quam varius orci dapibus volutpat cras. In
								amet eu ridiculus leo sodales cursus tristique. Tincidunt sed tempus ut viverra ridiculus non molestie.
								Gravida quis fringilla amet eget dui tempor dignissim. Facilisis auctor venenatis varius nunc, congue
								erat ac. Cras fermentum convallis quam.
							</p>
							<p class="mt-8">
								Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
								vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
								erat velit.
							</p>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
