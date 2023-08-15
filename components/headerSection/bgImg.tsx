import type { Color } from "../../lib/types.ts";

interface BgImgProps {
	color: keyof typeof Color;
	img: {
		src: string;
		alt: string;
	};
	h1: string;
	p: string;
}

export default function (props: Partial<BgImgProps>) {
	const css = "absolute inset-0 mix-blend-multiply";
	const p = {
		color: "indigo",
		h1: "Get in touch",
		p: "Mattis amet hendrerit dolor, quisque lorem pharetra. Pellentesque lacus nisi urna, arcu sociis eu. Orci vel lectus nisl eget eget ut consectetur. Sit justo viverra non adipisicing elit distinctio.",
		img: {
			src:
				"https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100",
			alt: "Business Team of 2 women and a man gather around, and look at the laptop of the central woman",
			...props.img,
		},
		...props,
	} as BgImgProps;

	return (
		<div class={`relative bg-${p.color}-800`}>
			<div class="absolute inset-0">
				<img
					class="h-full w-full object-cover"
					src={p.img.src}
					alt={p.img.alt}
				/>
				<div class={`${css} bg-${p.color}-800`} aria-hidden="true" />
			</div>
			<div class="relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
				<h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
					{p.h1}
				</h1>
				<p class={`mt-6 max-w-3xl text-xl text-${p.color}-100`}>{p.p}</p>
			</div>
		</div>
	);
}
