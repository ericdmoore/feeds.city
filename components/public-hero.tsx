import type { Icon } from "../types.ts";
// import {
//   Chevron_down,
//   Cursor_arrow_rays,
//   Shield_check,
//   Squares_2x2,
//   Arrow_path,
//   Play,
//   Phone,
//   Chart_bar,
//   Bars_3,
//   Lifebuoy,
//   Calendar,
//   Bookmark_square
// } from '../components/heroicons/outline.tsx'
// import {useState} from 'preact/hooks'

interface CTA {
  text: string;
  href: string;
  class?: string;
}

interface MenuItem {
  icon: Icon;
  text: string;
}

interface HeroProps {
  logo?: Icon;
  h1?: string;
  h1span?: string;
  p?: string;
  cta?: {
    left: CTA;
    right: CTA;
  };
  img?: {
    src: string;
    alt: string;
  };
  nav: {
    menu?: {
      Solutions: {
        body: {
          Analytics: MenuItem;
          Engagement: MenuItem;
          Secuitty: MenuItem;
          Integration: MenuItem;
          Automations: MenuItem;
        };
        footer: {
          "Watch Demo": MenuItem;
          "Contact Sales": MenuItem;
        };
      };
      Pricing: string;
      Docs: string;
      More: {
        body: {
          "Help Center": MenuItem;
          Guides: MenuItem;
          Events: MenuItem;
          Security: MenuItem;
        };
        footer?: null;
      };
    };
    _: {
      "Sign Up": { href: "/register" };
      "Sign In": { href: "/login" };
    };
  };
}

export function PublicHero(props: Partial<HeroProps>) {
  return (
    <section class="lg:relative">
      <div class="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
        <div class="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span class="block xl:inline">Subscribe On</span>
            <span class="block xl:inline">Your Terms</span>
            <span class="block xl:inline text-indigo-600">with Feed City</span>
          </h1>
          <p class="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
            lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
            fugiat aliqua.
          </p>
          <div class="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div class="rounded-md shadow">
              <a
                href="#"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
              >
                Get started
              </a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg"
              >
                Live demo
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
          alt=""
        />
      </div>
    </section>
  );
}

export default PublicHero;
