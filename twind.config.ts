import type { Options } from "$fresh/plugins/twind.ts";
import { forms } from "@twind/forms";
import HeadlessUI from 'npm:@headlessui/tailwindcss'
import aspectRatio from "npm:@twind/aspect-ratio";
// import {lineClamp} from "@twind/line-clamp@0.1.1"

export default {
	selfURL: import.meta.url,
	plugins: {
		// lineClamp
		forms,
		HeadlessUI,
		aspectRatio,
	},
} as Options;
