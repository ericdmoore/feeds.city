import { ChevronDownIcon } from "npm:@heroicons/react/20/solid";
import {
	BookmarkSquareIcon,
	BreifcaseIcon,
	BuildingOfficeIcon,
	ComputerDesktopIcon,
	GlobeAltIcon,
	InformationCircleIcon,
	NewspaperIcon,
	SheildCheckIcon,
	UserGroupIcon,
} from "npm:@heroicons/react/20/outline";

interface MenuInterface {
	open: boolean;
}

interface TwoColumn {
	link: { text: string; href: string };
}

export function TwoColumn(props: MenuInterface & TwoColumn) {
	return (
		<div class="relative z-0">
			<div class="relative z-10 bg-white shadow">
				<div class="mx-auto flex max-w-7xl p-6 lg:px-8">
					{/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
					<button
						type="button"
						class="text-gray-500 group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						aria-expanded="false"
					>
						<span>Solutions</span>
						<ChevronDownIcon />
					</button>
				</div>
			</div>

			{
				/* <!--
    Flyout menu, show/hide based on flyout menu state.
    Entering: "transition ease-out duration-200"
      From: "opacity-0 -translate-y-1"
      To: "opacity-100 translate-y-0"
    Leaving: "transition ease-in duration-150"
      From: "opacity-100 translate-y-0"
      To: "opacity-0 -translate-y-1"
  --> */
			}
			<div class="absolute inset-x-0 z-10 transform shadow-lg">
				<div class="absolute inset-0 flex" aria-hidden="true">
					<div class="w-1/2 bg-white"></div>
					<div class="w-1/2 bg-gray-50"></div>
				</div>
				<div class="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
					<nav
						class="grid gap-y-10 bg-white py-8 px-6 sm:grid-cols-2 sm:gap-x-8 sm:py-12 lg:px-8 xl:pr-12"
						aria-labelledby="solutions-heading"
					>
						<h2 id="solutions-heading" class="sr-only">Solutions menu</h2>
						<div>
							<h3 class="text-base font-medium text-gray-500">Company</h3>
							<ul role="list" class="mt-5 space-y-6">
								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<InformationCircleIcon />
										<span class="ml-4">About</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<BuildingOfficeIcon />
										<span class="ml-4">Customers</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<NewspaperIcon />
										<span class="ml-4">Press</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<BreifcaseIcon />
										<span class="ml-4">Careers</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<SheildCheckIcon />
										<span class="ml-4">Privacy</span>
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 class="text-base font-medium text-gray-500">Resources</h3>
							<ul role="list" class="mt-5 space-y-6">
								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<UserGroupIcon />
										<span class="ml-4">Community</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<GlobeAltIcon />

										<span class="ml-4">Partners</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<BookmarkSquareIcon />
										<span class="ml-4">Guides</span>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 transition duration-150 ease-in-out hover:bg-gray-50"
									>
										<ComputerDesktopIcon />
										<span class="ml-4">Webinars</span>
									</a>
								</li>
							</ul>
						</div>
					</nav>
					<div class="bg-gray-50 py-8 px-6 sm:py-12 lg:px-8 xl:pl-12">
						<div>
							<h3 class="text-base font-medium text-gray-500">From the blog</h3>
							<ul role="list" class="mt-6 space-y-6">
								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-100"
									>
										<div class="hidden flex-shrink-0 sm:block">
											<img
												class="h-20 w-32 rounded-md object-cover"
												src="https://images.unsplash.com/photo-1558478551-1a378f63328e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2849&q=80"
												alt=""
											/>
										</div>
										<div class="min-w-0 flex-1 sm:ml-8">
											<h4 class="truncate text-base font-medium text-gray-900">
												Boost your conversion rate
											</h4>
											<p class="mt-1 text-sm text-gray-500">
												Eget ullamcorper ac ut vulputate fames nec mattis pellentesque elementum. Viverra tempor id mus.
											</p>
										</div>
									</a>
								</li>

								<li class="flow-root">
									<a
										href="#"
										class="-m-3 flex rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-100"
									>
										<div class="hidden flex-shrink-0 sm:block">
											<img
												class="h-20 w-32 rounded-md object-cover"
												src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2300&q=80"
												alt=""
											/>
										</div>
										<div class="min-w-0 flex-1 sm:ml-8">
											<h4 class="truncate text-base font-medium text-gray-900">
												How to use search engine optimization to drive traffic to your site
											</h4>
											<p class="mt-1 text-sm text-gray-500">
												Eget ullamcorper ac ut vulputate fames nec mattis pellentesque elementum. Viverra tempor id mus.
											</p>
										</div>
									</a>
								</li>
							</ul>
						</div>
						<div class="mt-6 text-sm font-medium">
							<a
								href="#"
								class="text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500"
							>
								View all posts
								<span aria-hidden="true">&rarr;</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TwoColumn;
