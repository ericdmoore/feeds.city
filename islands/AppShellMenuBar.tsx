import { useState } from "preact/hooks";
import {Bell, Bars_3, X_mark} from '$components/heroicons/outline.tsx'
import TopHat from '$components/TopHat.tsx'


const defaultMenuList = {
	Home:"/home",
	Following:"/following",
	Feeds:"/feeds",
	Functions:"/functions",
};

export type MenuItemName = string
export type MenuItemHref = string
export type MenuListURLMapping = Record<MenuItemName, MenuItemHref>

export type DefaultMenuOptions = keyof typeof defaultMenuList

export interface Profile{
	name: string
	avatarURL: string
}
export interface AppShellMenuBarProps {
	menu:{
		// deno-lint-ignore ban-types
		activeSection: DefaultMenuOptions | (string & {})
		options?: MenuListURLMapping
	}
	profile: Profile
}

export function AppShellMenuBar(props: AppShellMenuBarProps) {
	// setState based on Request?
	const menuList = props.menu.options ?? defaultMenuList
	const [isProfileOpen, setProfileOpen] = useState(false);
	// const [activeMenu, setActiveMenu] = useState('Home' as keyof typeof menuList | string);

	const css = {
		mobile: {
			common: " block pl-3 pr-4 py-2 border-l-4 text-base font-medium ",
			active: " bg-indigo-50 border-indigo-500 text-indigo-700 ",
			inactive: " border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800",
		},
		nonMobile: {
			common: " inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
			active: " border-indigo-500 text-gray-900",
			inactive: " border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 ",
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
							<a href="/home">
								<img
									class="block h-8 w-auto lg:hidden"
									src="/feedcitylogo.svg"
									alt="Your Company"
								/>
								<img
									class="hidden h-8 w-auto lg:block"
									src="/feedcitylogo.svg"
									alt="Your Company"
								/>
							</a>
						</div>

						<div id="amIDesktopMenu" class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8" >
							{/* Menu Bar Items */}
							{ Object.entries(menuList).map(([iterMenuName, href]) => 
										<a
											{...{href}}
											class={`${css.nonMobile.common} ${
												iterMenuName === props.menu.activeSection 
													? css.nonMobile.active 
													: css.nonMobile.inactive
											}`}
											aria-current={iterMenuName === props.menu.activeSection  ? 'page' : undefined}
											>
											{iterMenuName}
										</a>
							)}
						</div>
					</div>
					<div class="hidden sm:ml-6 sm:flex sm:items-center">
						<button
							type="button"
							class="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">View notifications</span>
							<Bell class="h-6 w-6" /> 
						</button>

						{/* <!-- Profile dropdown --> */}
						<div class="relative ml-3">
							<div>
								<button
									id="user-menu-button"
									type="button"
									onClick={() => {setProfileOpen(!isProfileOpen);}}
									onBlur={() => {setProfileOpen(false);}}
									// onFocus={() => {setProfileOpen(true);}}
									aria-expanded={isProfileOpen}
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
								class={`${isProfileOpen ? "" : "hidden"} 
									absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 
									shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none
									`}
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabIndex={-1}
							>
								<a
									href="/profile"
									class={`block px-4 py-2 text-sm text-gray-700 ${props.menu.activeSection === "Profile" ? 'bg-gray-100' : ''}`}
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-0"
								>
									Your Profile
								</a>
								<a
									href="/settings"
									class={`block px-4 py-2 text-sm text-gray-700 ${props.menu.activeSection === "Settings" ? 'bg-gray-100' : ''}`}
									role="menuitem"
									tabIndex={-1}
									id="user-menu-item-1"
								>
									Settings
								</a>
								<a
									href="/logout"
									// not used since there is no logout UI - but a side-effect route 
									class={`block px-4 py-2 text-sm text-gray-700 ${props.menu.activeSection === "Logout" ? 'bg-gray-100' : ''}`}
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
							onClick={(e: MouseEvent) => {
								e.preventDefault();
								setProfileOpen(!isProfileOpen);
							}}
							// causes a double take
							//
							// onBlur={(e: FocusEvent)=>{
							// 	e.preventDefault()
							// 	setProfileOpen(false)
							// }}
							// onFocus={(e: FocusEvent)=>{
							// 	e.preventDefault()
							// 	setProfileOpen(true)
							// }}
							class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							aria-controls="mobile-menu"
							aria-expanded="false"
						>
							<span class="sr-only">Open main menu</span>
							<Bars_3 class={`${isProfileOpen ? "hidden" : "block"} h-6 w-6`} />
							<X_mark class={`${isProfileOpen ? "block" : "hidden"} h-6 w-6`} />
						</button>
					</div>
				</div>
			</div>

			<div class={`${isProfileOpen ? "" : "hidden"} sm:hidden`} id="mobile-menu">
				<div class="space-y-1 pt-2 pb-3">
					{ Object.entries(menuList).map(([iterMenuName, href]) => 
						<a
							{...{href}}
							class={`${css.mobile.common} ${
								iterMenuName === props.menu.activeSection 
									? css.mobile.active 
									: css.mobile.inactive
							}`}
							aria-current={iterMenuName === props.menu.activeSection  ? 'page' : undefined}
							>
							{iterMenuName}
						</a>) 
					}
				</div>
				{/* Mobile Profile */}
				<div class="border-t border-gray-200 pt-4 pb-3">
					<div class="flex items-center px-4">
						<div class="flex-shrink-0">
							<img
								class="h-10 w-10 rounded-full"
								src={props.profile.avatarURL}
								alt="Profile Picture"
							/>
						</div>
						<div class="ml-3">
							<div class="text-base font-medium text-gray-800">Tom Cook</div>
							<div class="text-sm font-medium text-gray-500">
								{props.profile.name}
							</div>
						</div>
						<button type="button"
							class="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						>
							<span class="sr-only">View notifications</span>
							<Bell class="h-6 w-6" /> 

						</button>
					</div>
					<div class="mt-3 space-y-1">
						<a
							href="/profile"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Your Profile
						</a>
						<a
							href="/settings"
							class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
						>
							Settings
						</a>
						<a
							href="/logout"
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
