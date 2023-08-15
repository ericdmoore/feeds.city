import { useState } from "preact/hooks";

interface AppShellMenuBarProps {
	activeSection: "home" | "feed" | "team" | "calendar";
}

export function AppShellMenuBar(props: AppShellMenuBarProps) {
	const [isOpen, setIsOpen] = useState(false);

	// setState based on Request?

	const css = {
		mobile: {
			common: " block pl-3 pr-4 py-2 border-l-4 text-base font-medium ",
			active: " bg-indigo-50 border-indigo-500 text-indigo-700 ",
			inactive: " border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
		},
		nonMobile: {
			common: "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
			active: "border-indigo-500 text-gray-900",
			inactive: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ",
		},
	};

	return (
		<nav class="border-b border-gray-200 bg-white">
			{/* MenuBar */}
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 justify-between">
					<div class="flex">
						{/* Header Logo */}
						<div class="flex flex-shrink-0 items-center">
							<img
								class="block h-8 w-auto lg:hidden"
								src="/feedCity.svg"
								alt="Your Company"
							/>
							<img
								class="hidden h-8 w-auto lg:block"
								src="/feedCity.svg"
								alt="Your Company"
							/>
						</div>

						<div
							id="amIDesktopMenu"
							class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8"
						>
							{/* <!-- Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" --> */}
							<a
								href="#/home"
								class={`${css.nonMobile.common} ${css.nonMobile.active}`}
								aria-current="page"
							>
								Dashboard
							</a>
							<a
								href="#/team"
								class={`${css.nonMobile.common} ${css.nonMobile.inactive}`}
							>
								Team
							</a>
							<a
								href="#/projects"
								class={`${css.nonMobile.common} ${css.nonMobile.inactive}`}
							>
								Projects
							</a>
							<a
								href="#/calender"
								class={`${css.nonMobile.common} ${css.nonMobile.inactive}`}
							>
								Calendar
							</a>
						</div>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:items-center">
						<button
							type="button"
							class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">View notifications</span>
							{/* <!-- Heroicon name: outline/bell --> */}
							<svg
								class="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
								/>
							</svg>
						</button>

						{/* <!-- Profile dropdown --> */}
						<div class="relative ml-3">
							<div>
								<button
									id="user-menu-button"
									type="button"
									onClick={() => {
										setIsOpen(!isOpen);
									}}
									aria-expanded={isOpen}
									aria-haspopup="true"
									class="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
								>
									<span class="sr-only">Open user menu</span>
									<img
										class="h-8 w-8 rounded-full"
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										alt=""
									/>
								</button>
							</div>

							{
								/* <!--
              Dropdown menu, show/hide based on menu state.

              Entering: "transition ease-out duration-200"
                From: "transform opacity-0 scale-95"
                To: "transform opacity-100 scale-100"
              Leaving: "transition ease-in duration-75"
                From: "transform opacity-100 scale-100"
                To: "transform opacity-0 scale-95"
            --> */
							}
							<div
								class={`${
									isOpen ? "" : "hidden"
								} absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabIndex={-1}
							>
								{/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
								<a
									href="#/profile"
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-0"
								>
									Your Profile
								</a>
								<a
									href="#/settings"
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-1"
								>
									Settings
								</a>
								<a
									href="#/logout"
									class="block px-4 py-2 text-sm text-gray-700"
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-2"
								>
									Sign out
								</a>
							</div>
						</div>
					</div>
					<div class="-mr-2 flex items-center sm:hidden">
						{/* <!-- Mobile menu button --> */}
						<button
							type="button"
							onClick={() => {
								setIsOpen(!isOpen);
							}}
							class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span class="sr-only">Open main menu</span>
							{/* <!-- Heroicon name: outline/bars-3   Menu open: "hidden", Menu closed: "block" --> */}
							<svg
								class={`${isOpen ? "hidden" : "block"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
								/>
							</svg>
							{/* <!-- Heroicon name: outline/x-mark Menu open: "block", Menu closed: "hidden" --> */}
							<svg
								class={`${isOpen ? "block" : "hidden"} h-6 w-6`}
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div class={`${isOpen ? "" : "hidden"} sm:hidden`} id="mobile-menu">
				<div class="space-y-1 pt-2 pb-3">
					{/* <!-- Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" --> */}
					<a
						href="#/home"
						class={`${css.mobile.common} ${css.mobile.active}`}
						aria-current="page"
					>
						Dashboard
					</a>
					<a
						href="#/team"
						class={`${css.mobile.common} ${css.mobile.inactive}`}
					>
						Team
					</a>
					<a
						href="#/projects"
						class={`${css.mobile.common} ${css.mobile.inactive}`}
					>
						Projects
					</a>
					<a
						href="#/calendar"
						class={`${css.mobile.common} ${css.mobile.inactive}`}
					>
						Calendar
					</a>
				</div>
				{/* Mobile Profile */}
				<div class="border-t border-gray-200 pt-4 pb-3">
					<div class="flex items-center px-4">
						<div class="flex-shrink-0">
							<img
								class="h-10 w-10 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div class="ml-3">
							<div class="text-base font-medium text-gray-800">Tom Cook</div>
							<div class="text-sm font-medium text-gray-500">
								tom@example.com
							</div>
						</div>
						<button
							type="button"
							class="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">View notifications</span>
							{/* <!-- Heroicon name: outline/bell --> */}
							<svg
								class="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
								/>
							</svg>
						</button>
					</div>
					<div class="mt-3 space-y-1">
						<a
							href="#/profile"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Your Profile
						</a>
						<a
							href="#/settings"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Settings
						</a>
						<a
							href="#/logout"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Sign out
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
}

export default AppShellMenuBar;
