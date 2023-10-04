import type { Options } from "$fresh/plugins/twind.ts";
import { forms } from "@twind/forms";
import HeadlessUI from "https://esm.sh/@headlessui/tailwindcss@0.2.0";
import { aspectRatio } from "https://esm.sh/@twind/aspect-ratio@0.1.4";
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
