import type { Options } from "$fresh/plugins/twind.ts";
import { forms } from "@twind/forms";
// import { aspectRatio } from "@twind/aspect-ratio";
// import {lineClamp} from "@twind/line-clamp@0.1.1"

export default {
  selfURL: import.meta.url,
  plugins: {
    // lineClamp
    forms,
    // aspectRatio,
  },
} as Options;
