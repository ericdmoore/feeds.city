import type { PageProps } from "$fresh/server.ts";
import { createContext, JSX } from "preact";
import { useContext, useState } from "preact/hooks";

import {
	Bars_3,
	Calendar,
	Home,
	Magnifying_glass_circle,
	Map,
	Megaphone,
	User_group,
	X_mark,
} from "../components/heroicons/outline.tsx";

interface ReadPageProps {
	profile: {
		name: string;
		avatarURL: string;
	};
}

interface SidebarNavItemProps {
	name: string;
	href: string;
	children: JSX.Element;
}

interface ContentItemProps {
	h1: string;
	h2: string;
	p: string;
	date: number;
	href?: string;
}

const navigation = [
	{ name: " Dashboard", href: "#", icon: Home },
	{ name: " Calendar", href: "#", icon: Calendar },
	{ name: " Teams", href: "#", icon: User_group },
	{ name: " Directory", href: "#", icon: Magnifying_glass_circle },
	{ name: " Announcements", href: "#", icon: Megaphone },
	{ name: " Office Map", href: "#", icon: Map },
];

const contentList = [
	{
		h1: "The Magic of Small Databases",
		h2: "Notes on personal libraries, collections and small indexes on the web",
		p: "Publishing documents to the web is a well-served use case but publishing small indexes, databases and collections to the web is still an incredibly frustrating and under-served use case. Here I outline why I think it matters and a variety of approaches to solving it.",
		date: (new Date()).getTime(),
	},
	{
		h1: "Digital Bricolage & Web Foraging",
		h2: "An ongoing journey in using the web in new ways",
		p: "When I reflect on the various lines of inquiry that light me up, there’s one consistent theme: digital bricolage. Bricolage is “the skill of using whatever is at hand and recombining them to create something new.”",
		date: (new Date()).getTime(),
	},
	{
		h1: "Generating Agency Through Blogging",
		h2: "Blogging as economic and social opportunity",
		p: "Lately I’ve been framing all of my work through the lens of increasing agency. (See: notes on agency at work).",
		date: (new Date()).getTime(),
	},
	{
		h1: "Increasing the surface area of blogging",
		h2: "Open feeds, OPML, books, blogs and graphs",
		p: "RSS is kind of an invisible technology. People call RSS dead because you can’t see it. There’s no feed, no login, no analytics. RSS feels subsurface.",
		date: (new Date()).getTime(),
	},
] as ContentItemProps[];

// context is global that is general availble to all components
const ActivatedSection = createContext("dashboard" as string);
const ActivationAnchorStyle = createContext({
	a: { current: "", default: "", all: "" },
	svg: { current: "", default: "", all: "" },
});

function SidebarNavItem(props: SidebarNavItemProps) {
	const activeSection = useContext(ActivatedSection);
	return (
		<a
			href={props.href ?? "#"}
			class={(activeSection === props.name
				? "text-gray-900 bg-gray-100"
				: "text-gray-600 hover:bg-gray-50 hover:text-gray-900") +
				`group flex items-center px-2 py-2 text-base font-medium rounded-md`}
		>
			{props.children}
			{props.name}
		</a>
	);
}

function ContentItem(props: ContentItemProps) {
	return (
		<li class="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 hover:bg-gray-50">
			<div class="flex justify-between space-x-3">
				<div class="min-w-0 flex-1">
					<a href={props.href ?? "#"} class="block focus:outline-none">
						<span class="absolute inset-0" aria-hidden="true"></span>
						<p class="truncate text-sm font-medium text-gray-900">{props.h1}</p>
						<p class="truncate text-sm text-gray-500">{props.h2}</p>
					</a>
				</div>
				<time
					dateTime={(new Date(props.date)).toISOString()}
					class="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
				>
					1d ago
				</time>
			</div>
			<div class="mt-1">
				<p class={`text-sm text-gray-600 ` + " line-clamp-2"}>{props.p}.</p>
			</div>
		</li>
	);
}

function PrimaryContentList(props: { contents: ContentItemProps[] }) {
	return (
		<>
			<ul role="list" class="divide-y divide-gray-200">
				{props.contents.map((content) => {
					return <ContentItem {...content} />;
				})}
			</ul>
		</>
	);
}

interface SidebarPropItem {
	displayName: string;
	href?: string;
	icon: () => JSX.Element;
}
const toLowerSnakeCase = (s: string) => s.replace("_", "._").replace(" ", "_").toLowerCase();

const SidebarAnchorForProvider = (
	props: {
		displayName: string;
		icon: (p: { class: string }) => JSX.Element;
		href?: string;
	},
) => {
	const activeSection = useContext(ActivatedSection);
	const { a, svg } = useContext(ActivationAnchorStyle);
	return (
		<a
			href={props.href ?? "#"}
			class={(activeSection === toLowerSnakeCase(props.displayName) ? a.current : a.default) +
				a.all}
		>
			{props.icon({
				class: (activeSection === toLowerSnakeCase(props.displayName) ? svg.current : svg.default) +
					svg.all,
			})}
			{props.displayName}
		</a>
	);
};

// PUT COMPONENTS INTO COMPONENTS FOLDER
// Call From an island that manages state
// Call the island from the route/application

export default function Example(props: PageProps) {
	const [selectedArticle, setSelectedArticle] = useState("_someID");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeSection, setSection] = useState("dashboard");

	return (
		<>
			<div class="flex h-screen">
				{/* <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. --> */}
				<div class="relative z-40 lg:hidden" role="dialog" aria-modal="true">
					{
						/* <!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    --> */
					}
					<div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>

					<div class="fixed inset-0 z-40 flex">
						{
							/* <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      --> */
						}
						<div class="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
							{
								/* <!--
          Close button, show/hide based on off-canvas menu state.

          Entering: "ease-in-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-300"
            From: "opacity-100"
            To: "opacity-0"
        --> */
							}
							<div class="absolute top-0 right-0 -mr-12 pt-2">
								<button
									type="button"
									class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
								>
									<span class="sr-only">Close sidebar</span>
									<X_mark class="h-6 w-6 text-white" />
								</button>
							</div>

							<div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
								<div class="flex flex-shrink-0 items-center px-4">
									<img
										class="h-8 w-auto"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/>
								</div>
								<nav aria-label="Sidebar" class="mt-5">
									<div class="space-y-1 px-2">
										<ActivatedSection.Provider value={activeSection}>
											<ActivationAnchorStyle.Provider
												value={{
													a: {
														current: "bg-gray-100 text-gray-900",
														default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
														all:
															"group flex items-center px-2 py-2 text-base font-medium rounded-md",
													},
													svg: {
														current: "text-gray-500",
														default: "text-gray-400 group-hover:text-gray-500",
														all: "mr-4 h-6 w-6",
													},
												}}
											>
												{navigation.map(({ name, icon, href }) => (
													<SidebarAnchorForProvider
														displayName={name}
														icon={icon}
														href={href}
													/>
												))}
											</ActivationAnchorStyle.Provider>
										</ActivatedSection.Provider>
									</div>
								</nav>
							</div>
							<div class="flex flex-shrink-0 border-t border-gray-200 p-4">
								<a href="#" class="group block flex-shrink-0">
									<div class="flex items-center">
										<div>
											<img
												class="inline-block h-10 w-10 rounded-full"
												src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
												alt=""
											/>
										</div>
										<div class="ml-3">
											<p class="text-base font-medium text-gray-700 group-hover:text-gray-900">
												Whitney Francis
											</p>
											<p class="text-sm font-medium text-gray-500 group-hover:text-gray-700">
												View profile
											</p>
										</div>
									</div>
								</a>
							</div>
						</div>

						<div class="w-14 flex-shrink-0" aria-hidden="true">
							{/* <!-- Force sidebar to shrink to fit close icon --> */}
						</div>
					</div>
				</div>

				{/* <!-- Static sidebar for desktop --> */}
				<div id="desktop-sidebar" class="hidden lg:flex lg:flex-shrink-0">
					<div class="flex w-64 flex-col">
						{/* <!-- Sidebar component, swap this element with another sidebar if you like --> */}
						<div class="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-gray-100">
							<div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
								{/* Logo */}
								<div class="flex flex-shrink-0 items-center px-4">
									<img
										class="h-8 w-auto"
										src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
										alt="Your Company"
									/>
								</div>
								<nav class="mt-5 flex-1" aria-label="Sidebar">
									<div class="space-y-1 px-2">
										<ActivatedSection.Provider value={activeSection}>
											<ActivationAnchorStyle.Provider
												value={{
													a: {
														current: "bg-gray-200 text-gray-900",
														default: "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
														all: "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
													},
													svg: {
														current: "text-gray-500",
														default: "text-gray-400 group-hover:text-gray-500",
														all: "mr-3 h-6 w-6",
													},
												}}
											>
												{navigation.map(({ name, icon, href }) => (
													<SidebarAnchorForProvider
														displayName={name}
														icon={icon}
														href={href}
													/>
												))}
											</ActivationAnchorStyle.Provider>
										</ActivatedSection.Provider>
									</div>
								</nav>
							</div>
							<div class="flex flex-shrink-0 border-t border-gray-200 p-4">
								<a href="#" class="group block w-full flex-shrink-0">
									<div class="flex items-center">
										<div>
											<img
												class="inline-block h-9 w-9 rounded-full"
												src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
												alt=""
											/>
										</div>
										<div class="ml-3">
											<p class="text-sm font-medium text-gray-700 group-hover:text-gray-900">
												Whitney Francis
											</p>
											<p class="text-xs font-medium text-gray-500 group-hover:text-gray-700">
												View profile
											</p>
										</div>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>

				<div class="flex min-w-0 flex-1 flex-col overflow-hidden">
					<div class="lg:hidden">
						<div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-1.5">
							<div>
								<img
									class="h-8 w-auto"
									src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
									alt="Your Company"
								/>
							</div>
							<div>
								<button
									type="button"
									class="-mr-3 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
								>
									<span class="sr-only">Open sidebar</span>
									<Bars_3 class="h-6 w-6" />
								</button>
							</div>
						</div>
					</div>

					<div class="relative z-0 flex flex-1 overflow-hidden">
						<main class="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
							{/* <!-- Start main area--> */}
							<div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
								<div class="h-full rounded-lg border-2 border-gray-100">
									<PrimaryContentList contents={contentList} />
								</div>
							</div>
							{/* <!-- End main area --> */}
						</main>
						<aside class="relative hidden w-96 flex-shrink-0 overflow-y-auto border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
							{/* <!-- Start secondary column (hidden on smaller screens) --> */}
							<div class="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
								<div class="h-full rounded-lg border-2 border-gray-100">
									<PrimaryContentList contents={contentList} />
								</div>
							</div>
							{/* <!-- End secondary column --> */}
						</aside>
					</div>
				</div>
			</div>
		</>
	);
}
