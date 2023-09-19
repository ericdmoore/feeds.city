import { Fragment } from "preact";
import { Popover, Transition } from "npm:@headlessui/react";
import { Chevron_down } from "$components/heroicons/solid.tsx";
import {
	Arrow_path,
	Chart_bar,
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
	{
		name: "Automations",
		description: "Build strategic funnels that will drive your customers to convert",
		href: "#",
		icon: Arrow_path,
	},
];

const callsToAction = [
	{ name: "Watch Demo", href: "#", icon: Play },
	{ name: "Contact Sales", href: "#", icon: Phone },
];

export function StackedFooterActions() {
	return (
		<Popover class="relative">
			<>
				<Popover.Button
					class="ui-open:text-gray-900 ui-not-open:text-gray-500 group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					<span>Solutions</span>
					<Chevron_down
						class='ui-open:text-gray-600 ui-not-open:text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500'
						aria-hidden="true"
					/>
				</Popover.Button>

				<Transition
					as={Fragment}
					enter="transition ease-out duration-200"
					enterFrom="opacity-0 translate-y-1"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in duration-150"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-1"
				>
					<Popover.Panel class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
						<div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
							<div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
								{solutions.map((item) => (
									<a
										key={item.name}
										href={item.href}
										class="-m-3 flex items-start rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<item.icon
											class="h-6 w-6 flex-shrink-0 text-indigo-600"
											aria-hidden="true"
										/>
										<div class="ml-4">
											<p class="text-base font-medium text-gray-900">
												{item.name}
											</p>
											<p class="mt-1 text-sm text-gray-500">
												{item.description}
											</p>
										</div>
									</a>
								))}
							</div>
							<div class="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
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
		</Popover>
	);
}
export default StackedFooterActions;
