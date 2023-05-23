import { JSX } from "preact";
interface CTAPanel {
	h1: string | JSX.Element;
	p: string | JSX.Element;
	ctaLink: {
		href: string;
		text: string;
	};
}

export default function (props: Partial<CTAPanel>) {
	const aspectCSss = "aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1";

	const p = {
		h1: (
			<>
				<span class="block">Ready to dive in?</span>
				<span class="block">Start your free trial today</span>
			</>
		),
		p: "Ac euismod vel sit maecenas id pellentesque eu sed consectetur. Malesuada adipiscing sagittis vel nulla nec.",
		ctaLink: {
			href: "/earlybird",
			text: "See the Earlybird Offer",
			...props.ctaLink,
		},
		...props,
	};
	return (
		<section class="bg-white">
			<div class="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
				<div class="overflow-hidden rounded-lg bg-indigo-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
					<div class="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
						<div class="lg:self-center">
							<h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
								<span class="block">{p.h1}</span>
							</h2>
							<p class="mt-4 text-lg leading-6 text-indigo-200">{p.p}</p>
							<a
								href={p.ctaLink.href}
								class="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-indigo-50"
							>
								{p.ctaLink.text}
							</a>
						</div>
					</div>
					<div class={`${aspectCSss}`}>
						<img
							class="translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
							src="https://tailwindui.com/img/component-images/full-width-with-sidebar.jpg"
							alt="App screenshot"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
