import { Fragment } from "preact";
import { Popover, Transition } from "npm:@headlessui/react";
import { Chevron_down } from "$components/heroicons/solid.tsx";
import {
	Chart_bar,
	Check_circle,
	Cursor_arrow_rays,
	Phone,
	Play,
	Shield_check,
	Squares_2x2,
} from "$components/heroicons/outline.tsx";

const solutions = [
	{
		name: "Analytics",
		description: "Get a better understanding of where your traffic is coming from.",
		href: "#",
		icon: Chart_bar,
	},
	{
		name: "Engagement",
		description: "Speak directly to your customers in a more meaningful way.",
		href: "#",
		icon: Cursor_arrow_rays,
	},
	{
		name: "Security",
		description: "Your customers' data will be safe and secure.",
		href: "#",
		icon: Shield_check,
	},
	{
		name: "Integrations",
		description: "Connect with third-party tools that you're already using.",
		href: "#",
		icon: Squares_2x2,
	},
];

const callsToAction = [
	{ name: "Watch Demo", href: "#", icon: Play },
	{ name: "View All Products", href: "#", icon: Check_circle },
	{ name: "Contact Sales", href: "#", icon: Phone },
];

export function FullWidth() {
	return (
		<Popover class="relative z-0">
			{({ open }: { open: unknown }) => (
				<>
					<div class="relative z-10 bg-white shadow">
						<div class="mx-auto flex max-w-7xl p-6 lg:px-8">
							<Popover.Button
								class={`
									${open ? "text-gray-900" : "text-gray-500"}
									group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`
								}
							>
								<span>Solutions</span>
								<Chevron_down
									class={`${open ? "text-gray-600" : "text-gray-400"} ml-2 h-5 w-5 group-hover:text-gray-500`}
									aria-hidden="true"
								/>
							</Popover.Button>
						</div>
					</div>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 -translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 -translate-y-1"
					>
						<Popover.Panel class="absolute inset-x-0 z-10 transform shadow-lg">
							<div class="bg-white">
								<div class="mx-auto grid max-w-7xl gap-y-6 p-6 sm:grid-cols-2 sm:gap-8 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-12 xl:py-16">
									{solutions.map((item) => (
										<a
											key={item.name}
											href={item.href}
											class="-m-3 flex flex-col justify-between rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
										>
											<div class="flex md:h-full lg:flex-col">
												<div class="flex-shrink-0">
													<div class="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
														<item.icon class="h-6 w-6" aria-hidden="true" />
													</div>
												</div>
												<div class="ml-4 md:flex md:flex-1 md:flex-col md:justify-between lg:ml-0 lg:mt-4">
													<div>
														<p class="text-base font-medium text-gray-900">
															{item.name}
														</p>
														<p class="mt-1 text-sm text-gray-500">
															{item.description}
														</p>
													</div>
													<p class="mt-2 text-sm font-medium text-indigo-600 lg:mt-4">
														Learn more
														<span aria-hidden="true">&rarr;</span>
													</p>
												</div>
											</div>
										</a>
									))}
								</div>
							</div>
							<div class="bg-gray-50">
								<div class="mx-auto max-w-7xl space-y-6 px-6 py-5 sm:flex sm:space-y-0 sm:space-x-10 lg:px-8">
									{callsToAction.map((item) => (
										<div key={item.name} class="flow-root">
											<a
												href={item.href}
												class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-100"
											>
												<item.icon
													class="h-6 w-6 flex-shrink-0 text-gray-400"
													aria-hidden="true"
												/>
												<span class="ml-3">{item.name}</span>
											</a>
										</div>
									))}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
}
export default FullWidth;
