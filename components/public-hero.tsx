import type { JSX } from "preact";
import type { Color, Icon, ImgSrc } from "../types.ts";

interface CTAprops_CSS {
  text: string;
  href: string;
  class: string;
}

interface CTAprops_Color {
  text: string;
  href: string;
  color: {
    bg: keyof typeof Color;
    text: keyof typeof Color;
    hover?: string;
  };
}

type CTAprops = CTAprops_CSS | CTAprops_Color;

interface HeroProps {
  logo: Icon;
  h1: string;
  h1span: string;
  p: string | (() => JSX.Element);
  heroImg: ImgSrc & { class?: string };
  cta: {
    left: CTAprops;
    right: CTAprops;
  };
}

const CTA = (props: CTAprops) => {
  // text-base
  const _css = "class" in props && props.class
    ? props.class
    : "color" in props && props.color
    ? `flex w-full items-center justify-center rounded-md border border-transparent bg-${props.color.bg}-600 px-8 py-3 font-medium text-${props.color.text} ${
      props.color.hover ?? `hover:bg--${props.color.bg}-700`
    } md:py-4 md:px-10 md:text-lg`
    : `flex w-full items-center justify-center rounded-md border border-transparent bg-indigio-600 px-8 py-3 font-medium text-white hover:bg--indigo-700 md:py-4 md:px-10 md:text-lg`;
  return (
    <a href={props.href ?? "#"} class={_css}>{props.text ?? "Get Started!!"}</a>
  );
};

export function PublicHero(props: HeroProps) {
  return (
    <section class="lg:relative">
      <div class="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
        <div class="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span class="block xl:inline">{props.h1}</span>
            <span class="block xl:inline text-indigo-600">{props.h1span}</span>
          </h1>
          <p class="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            {typeof props.p === "string" ? props.p : props.p()}
          </p>
          <div class="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div class="rounded-md shadow">
              <CTA {...props?.cta.left} />
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <CTA {...props?.cta.right} />
            </div>

            {
              /* <CTA
                text="Get started"
                href="#"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
              />
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <CTA
                text="Live demo"
                href="#"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
              /> */
            }
          </div>
        </div>
      </div>
      <div class="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
        <img
          class={`absolute inset-0 h-full w-full object-cover ${props.heroImg?.class}`}
          src={props.heroImg?.src}
          // "https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
          alt={props.heroImg?.alt}
        />
      </div>
    </section>
  );
}

export default PublicHero;
