import type { Icon } from "../lib/types.ts";
import type { JSX } from "preact";

import { useState } from "preact/hooks";

import {
	Arrow_path,
	Bars_3,
	Bookmark_square,
	Calendar,
	Chart_bar,
	Chevron_down,
	Cursor_arrow_rays,
	Lifebuoy,
	Phone,
	Play,
	Shield_check,
	Squares_2x2,
	X_mark,
} from "../components/heroicons/outline.tsx";

//#region interfaces
type MenuStringOpts = null | "mobile-menu" | "solution-menu" | "more-menu";

interface BlogRollContainerPropsWithChildren {
	header: string;
	footer: { href: string; text: string };
	children: JSX.Element[];
}

interface BlogRollContainerPropsWithTitles {
	header: string;
	footer: { href: string; text: string };
	titles: string[];
}

interface CTA {
	text: string;
	href: string;
	class?: string;
}

interface MenuItem {
	icon: Icon;
	text: string;
}

interface NavBarProps {
	logo: Icon;
	login: { register: { href: string }; auth: { href: string } };
	nav: Record<string, Record<string, CTA>>;
	// MenuGrpName: {SubheaderName1: string, SubheaderName1: string, SubFooterName1: string}
}

interface MenuItemProps {
	name: string;
	descr: string;
	href?: string;
	children: JSX.Element;
}

interface FlyOutMenuProps {
	activeMenuName: string | null;
	setMenuName: (name: string | null) => void;
	menuStateName: string;
	ButtonText: () => JSX.Element;
	children: JSX.Element;
}

interface MobileMenuTreeItemProps {
	name: string;
	children: JSX.Element;
	href?: string;
}

interface MobileMenuProps {
	logo: Icon;
	activeMenuName: string | null;
	setMenuName: (name: string | null) => void;
	FooterLinks: () => JSX.Element;
	TopLinks: () => JSX.Element;
	singnUpHref: string;
	singnInHref: string;
}

interface AnchorProps {
	href?: string;
	class?: string;
	text: string;
}

interface FooterMenuItemProps {
	name: string;
	href?: string;
	children: JSX.Element;
}

interface BlogRollProps {
	href?: string;
	name: string;
}

interface LargeMenuProps {
	logo: Icon;
	setMenuName: (s: string | null) => void;
	activeMenuName: string | null;
	singnUpHref: string;
	singnInHref: string;
	children: JSX.Element;
}

//#endregion interfaces

//#region helper-components
function Icon(props: { icon: Icon; class: string }) {
	return typeof props.icon === "function" ? props.icon(props.class) : (
		<img
			class={props.class}
			src={props.icon.src}
			alt={props.icon.alt}
		/>
	);
}

function MenuTreeItem(props: MenuItemProps) {
	return (
		<a
			href={props.href ?? "#"}
			class="-m-3 flex p-3 hover:bg-gray-50 rounded-lg items-start"
		>
			{props.children}
			<div class="ml-4">
				<p class="text-base font-medium text-gray-900">
					{props.name}
				</p>
				<p class="mt-1 text-sm text-gray-500">
					{props.descr}
				</p>
			</div>
		</a>
	);
}

function MobileMenuTreeItem(props: MobileMenuTreeItemProps) {
	return (
		<a
			href={props.href ?? "#"}
			class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50"
		>
			{props.children}
			<span class="ml-3 text-base font-medium text-gray-900">
				{props.name}
			</span>
		</a>
	);
}

function FooterMenuItem(props: FooterMenuItemProps) {
	return (
		<a
			href={props.href ?? "#"}
			class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100"
		>
			{props.children}
			<span class="ml-3">{props.name}</span>
		</a>
	);
}

function BlogRollPreview(props: BlogRollProps) {
	return (
		<a
			href={props.href ?? "#"}
			class="font-medium text-gray-900 hover:text-gray-700"
		>
			{props.name}
		</a>
	);
}

function FlyoutTopLinkConainer(props: { children: JSX.Element[] }) {
	return (
		<div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
			{props.children}
		</div>
	);
}

function SideBySideFooterConainer(props: { children: JSX.Element[] }) {
	return (
		<div class="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
			{props.children}
		</div>
	);
}

function BlogRollContainer(
	props: BlogRollContainerPropsWithChildren | BlogRollContainerPropsWithTitles,
) {
	if ("titles" in props) {
		return (
			<div class="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8">
				<div>
					<h3 class="text-base font-medium text-gray-500">
						{props.header}
					</h3>
					<ul role="list" class="mt-4 space-y-4">
						{props.titles.map((name) => (
							<li class="truncate text-base">
								<BlogRollPreview name={name} />
							</li>
						))}
					</ul>
				</div>
				<div class="mt-5 text-sm">
					<a
						href={props.footer.href}
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{props.footer.text}
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		);
	} else {
		return (
			<div class="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8">
				<div>
					<h3 class="text-base font-medium text-gray-500">
						{props.header}
					</h3>
					<ul role="list" class="mt-4 space-y-4">
						{props.children}
					</ul>
				</div>
				<div class="mt-5 text-sm">
					<a
						href={props.footer.href}
						class="font-medium text-indigo-600 hover:text-indigo-500"
					>
						{props.footer.text}
					</a>
				</div>
			</div>
		);
	}
}

function FlyOutMenu(props: FlyOutMenuProps) {
	/* <!--
  'Solutions' flyout menu, show/hide based on flyout menu state.

  Entering: "transition ease-out duration-200"
  From: "opacity-0 translate-y-1"
  To: "opacity-100 translate-y-0"
  Leaving: "transition ease-in duration-150"
  From: "opacity-100 translate-y-0"
  To: "opacity-0 translate-y-1"
  --> */
	return (
		<div class="relative">
			<button type="button"
				onClick={() => {
					props.activeMenuName === props.menuStateName 
						? props.setMenuName(null)
						: props.setMenuName(props.menuStateName);
				}}
				onFocus={() => {
					props.setMenuName(props.menuStateName);
				}}
				onBlur={() => {
					props.setMenuName(null);
				}}
				class={`
      ${props.activeMenuName === props.menuStateName ? "text-gray-900" : "text-gray-500"}
      group 
      inline-flex 
      items-center 
      rounded-md 
      bg-white 
      text-base 
      font-medium 
      hover:text-gray-900
      focus:text-gray-900 
      focus:outline-none 
      focus:ring-2 
      focus:ring-indigo-500 
      focus:ring-offset-2`}
				aria-expanded="false"
			>
				<props.ButtonText />
			</button>
			<div
				class={`${
					props.activeMenuName === props.menuStateName ? "" : "hidden"
				} absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2`}
			>
				<div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
					{props.children}
				</div>
			</div>
		</div>
	);
}

function Anchor(props: AnchorProps) {
	return (
		<a
			href={props.href ?? "#"}
			class={props.class ??
				"text-base font-medium text-gray-900 hover:text-gray-700"}
		>
			{props.text}
		</a>
	);
}

//#endregion helper-components

/* Mobile Menu
<!-- Mobile menu, show/hide based on mobile menu state.
Entering: "duration-200 ease-out"
  From: "opacity-0 scale-95"
  To: "opacity-100 scale-100"
Leaving: "duration-100 ease-in"
  From: "opacity-100 scale-100"
  To: "opacity-0 scale-95"
-->
*/
const MobileMenu = (props: MobileMenuProps) => {
	const MENU_NAME = "mobile-menu";
	return (
		<div
			class={`${
				props.activeMenuName === MENU_NAME ? "" : "hidden"
			} absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden`}
		>
			<div class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
				<div class="px-5 pt-5 pb-6">
					<div class="flex items-center justify-between">
						<div>
							<Icon class="h-8 w-auto" icon={props.logo} />
						</div>
						<div class="-mr-2">
							<button
								type="button"
								onFocus={() => {
									props.setMenuName(null);
								}}
								onBlur={() => {
									props.setMenuName(null);
								}}
								class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
							>
								<span class="sr-only">Close menu</span>
								<X_mark class="h-6 w-6" />
							</button>
						</div>
					</div>
					<div class="mt-6">
						<nav class="grid gap-y-8">
							<props.TopLinks />
						</nav>
					</div>
				</div>
				<div class="space-y-6 py-6 px-5">
					<div class="grid grid-cols-2 gap-y-4 gap-x-8">
						<props.FooterLinks />
					</div>
					<div>
						<a
							href={props.singnUpHref}
							class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
						>
							Sign up
						</a>
						<p class="mt-6 text-center text-base font-medium text-gray-500">
							Existing customer?
							<a
								href={props.singnInHref}
								class="text-indigo-600 hover:text-indigo-500"
							>
								Sign in
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

const LargeMenu = (props: LargeMenuProps) => {
	const MENU_NAME = "large-menu";
	return (
		<div class="mx-auto max-w-7xl px-4 sm:px-6">
			<div class="flex items-center justify-between py-6 md:justify-start md:space-x-10">
				<div class="flex justify-start lg:w-0 lg:flex-1">
					<a href="/">
						<span class="sr-only">Feed City</span>
						<Icon class="h-8 w-auto sm:h-10" icon={props.logo} />
					</a>
				</div>

				{/* Mobile Menu Burger */}
				<div class="-my-2 -mr-2 md:hidden">
					<button
						type="button"
						aria-expanded="false"
						onFocus={() => props.setMenuName("mobile-menu" as MenuStringOpts)}
						onBlur={() => props.setMenuName(null)}
						class="inline-flex 
            items-center 
            justify-center 
            rounded-md 
            bg-white p-2 
            text-gray-400 
            hover:bg-gray-100 
            hover:text-gray-500 
            focus:outline-none 
            focus:ring-2 
            focus:ring-inset 
            focus:ring-indigo-500"
					>
						<span class="sr-only">Open menu</span>
						<Bars_3 class="h-6 w-6" />
					</button>
				</div>

				<nav class="hidden space-x-10 md:flex">
					{props.children}
				</nav>

				<div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
					<a
						href={props.singnInHref}
						class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
					>
						Sign in
					</a>
					<a
						href={props.singnUpHref}
						class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
					>
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
};

export function NavBar(props: NavBarProps) {
	const [activeMenu, setActiveMenuGroup] = useState(null as string | null);
	const signUpHref = "/register";
	const signInHref = "/signin";

	return (
		<div class="relative bg-gray-50">
			<div class="relative bg-white shadow">
				<LargeMenu
					logo={props.logo}
					setMenuName={setActiveMenuGroup}
					activeMenuName={activeMenu}
					singnUpHref={signUpHref}
					singnInHref={signInHref}
				>
					<>
						<FlyOutMenu
							setMenuName={setActiveMenuGroup}
							activeMenuName={activeMenu}
							menuStateName="solution-menu"
							ButtonText={() => (
								<>
									<span>Solutions</span>
									<Chevron_down class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500" />
								</>
							)}
						>
							<>
								<FlyoutTopLinkConainer>
									<MenuTreeItem
										name="Analytics"
										descr="Get a better understanding of where your traffic is coming from."
									>
										<Chart_bar class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Engagement"
										descr="Speak directly to your customers in a more meaningful way."
									>
										<Cursor_arrow_rays class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Security"
										descr=" Your customers&#039; data will be safe and secure."
									>
										<Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Integrations"
										descr="Connect with third-party tools that you&#039;re already using."
									>
										<Squares_2x2 class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Automations"
										descr="Build strategic funnels that will drive your customers to convert"
									>
										<Arrow_path class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>
								</FlyoutTopLinkConainer>
								<SideBySideFooterConainer>
									<div class="flow-root">
										<FooterMenuItem name="Watch Demo">
											<Play class="h-6 w-6 flex-shrink-0 text-gray-400" />
										</FooterMenuItem>
									</div>
									<div class="flow-root">
										<FooterMenuItem name="Contact Sales">
											<Phone class="h-6 w-6 flex-shrink-0 text-gray-400" />
										</FooterMenuItem>
									</div>
								</SideBySideFooterConainer>
							</>
						</FlyOutMenu>

						<a
							href="#"
							class="text-base font-medium text-gray-500 hover:text-gray-900"
						>
							Pricing
						</a>
						<a
							href="#"
							class="text-base font-medium text-gray-500 hover:text-gray-900"
						>
							Docs
						</a>

						<FlyOutMenu
							ButtonText={() => (
								<>
									<span>More</span>
									<Chevron_down class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500 focus:text-gray-600" />
								</>
							)}
							menuStateName="more-menu"
							setMenuName={setActiveMenuGroup}
							activeMenuName={activeMenu}
						>
							<>
								<FlyoutTopLinkConainer>
									<MenuTreeItem
										name="Help Center"
										descr="Get all of your questions answered in our forums or contact support."
									>
										<Lifebuoy class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Guides"
										descr="Learn how to maximize our platform to get the most out of it."
									>
										<Bookmark_square class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Events"
										descr="See what meet-ups and other events we might be planning near you."
									>
										<Calendar class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>

									<MenuTreeItem
										name="Security"
										descr="Understand how we take your privacy seriously."
									>
										<Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600" />
									</MenuTreeItem>
								</FlyoutTopLinkConainer>
								<BlogRollContainer
									header="Recent Posts"
									footer={{ text: "See More Posts", href: "#" }}
								>
									<li class="truncate text-base">
										<BlogRollPreview name="Boost your conversion rate" />
									</li>

									<li class="truncate text-base">
										<BlogRollPreview name="How to use search engine optimization to drive traffic to your site" />
									</li>

									<li class="truncate text-base">
										<BlogRollPreview name="Improve your customer experience" />
									</li>
								</BlogRollContainer>
							</>
						</FlyOutMenu>
					</>
				</LargeMenu>
				<MobileMenu
					logo={props.logo}
					setMenuName={setActiveMenuGroup}
					activeMenuName={activeMenu}
					singnUpHref={signUpHref}
					singnInHref={signInHref}
					FooterLinks={() => (
						<>
							<Anchor text="Pricing" href="/pricing" />
							<Anchor text="Docs" href="/docs" />
							<Anchor text="Help Center" href="/help" />
							<Anchor text="Guides" href="/guides" />
							<Anchor text="Security" href="/security" />
							<Anchor text="Events" href="/events" />
						</>
					)}
					TopLinks={() => (
						<>
							<MobileMenuTreeItem name="Analytics">
								<Chart_bar class="h-6 w-6 flex-shrink-0 text-indigo-600" />
							</MobileMenuTreeItem>

							<MobileMenuTreeItem name="Engagement">
								<Cursor_arrow_rays class="h-6 w-6 flex-shrink-0 text-indigo-600" />
							</MobileMenuTreeItem>

							<MobileMenuTreeItem name="Security">
								<Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600" />
							</MobileMenuTreeItem>

							<MobileMenuTreeItem name="Integrations">
								<Squares_2x2 class="h-6 w-6 flex-shrink-0 text-indigo-600" />
							</MobileMenuTreeItem>

							<MobileMenuTreeItem name="Automations">
								<Arrow_path class="h-6 w-6 flex-shrink-0 text-indigo-600" />
							</MobileMenuTreeItem>
						</>
					)}
				/>
			</div>
		</div>
	);
}

export default NavBar;
