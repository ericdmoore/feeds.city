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

interface Page {
	body: string;
	attrs: Record<string, unknown>;
}

export default function PostsIndexComponent(data?: Page) {
	// Show the Tag Name
	// show all the posts within the tag
	//
	return <></>;
}
