import { type ComponentChildren } from "preact";

import { AppShellMenuBar, type AppShellMenuBarProps } from "$islands/AppShellMenuBar.tsx";

export interface AppShellProps extends AppShellMenuBarProps {
	children: ComponentChildren;
}

export function AppShell(props: AppShellProps) {
	return (
		<div class="min-h-full">
			<AppShellMenuBar
				menu={props.menu}
				profile={{
					...props.profile,
					avatarURL:
						"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
				}}
			/>
			<div class="py-10">
				<header>
					<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 md:pb-6">
						<h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
							{props.menu.activeSection}
						</h1>
					</div>
				</header>
				<main>
					<div class="mx-auto max-w-7xl sm:px-4 lg:px-8">
						<div class="px-2 py-8 sm:px-0 bg-red-200">
							{props.children}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

export default AppShell;
