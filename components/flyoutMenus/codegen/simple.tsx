import { Fragment } from "preact";
import { Chevron_down } from "$components/heroicons/solid.tsx";

const solutions = [
	{
		name: "Blog",
		description: "Learn about tips, product updates and company culture.",
		href: "#",
	},
	{
		name: "Help Center",
		description: "Get all of your questions answered in our forums of contact support.",
		href: "#",
	},
	{
		name: "Guides",
		description: "Learn how to maximize our platform to get the most out of it.",
		href: "#",
	},
	{
		name: "Events",
		description: "Check out webinars with experts and learn about our annual conference.",
		href: "#",
	},
	{
		name: "Security",
		description: "Understand how we take your privacy seriously.",
		href: "#",
	},
];

export function Simple() {
	return (
		<div class="relative">
			<>
				<button
					class={"ui-open:text-gray-900 ui-not-open:text-gray-500 group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"}
				>
					<span>Solutions</span>
					<Chevron_down
						class="ui-open:text-gray-600 ui-not-open:text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500"
						aria-hidden="true"
					/>
				</button>

				{
					/* <Transition
					as={Fragment}
					enter="transition ease-out duration-200"
					enterFrom="opacity-0 translate-y-1"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in duration-150"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-1"
				> */
				}
				<div class="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
					<div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
						<div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
							{solutions.map((item) => (
								<a
									key={item.name}
									href={item.href}
									class="-m-3 block rounded-md p-3 transition duration-150 ease-in-out hover:bg-gray-50"
								>
									<p class="text-base font-medium text-gray-900">
										{item.name}
									</p>
									<p class="mt-1 text-sm text-gray-500">
										{item.description}
									</p>
								</a>
							))}
						</div>
					</div>
				</div>
				{/* </Transition> */}
			</>
		</div>
	);
}

export default Simple;
