import type { Icon } from "../lib/types.ts";
// import type { JSX } from 'preact';

import { SimpleMenu } from "../components/flyoutMenus/simple.tsx";
import { useState } from "preact/hooks";
import { MenuItem } from "../components/flyoutMenus/menuTypes.tsx";

const Icon = (props: { icon: Icon; class: string }) => {
	return typeof props.icon === "function" ? props.icon(props.class) : (
		<img
			// class="h-8 w-auto sm:h-10"
			class={props.class}
			src={props.icon.src}
			alt={props.icon.alt}
		/>
	);
};

type MenuTreeValues = MenuItem[]; //  | Record<string, MenuItem[]> // for nesting
type MenuTree = Record<string, MenuTreeValues>;

interface NavBarProps {
	logo: Icon;
	class?: string;
	menus: MenuTree;
}

export function NavBar(props: NavBarProps) {
	const [menuSelected, setSelectedMenu] = useState(null as null | string);

	return (
		<div class="relative bg-gray-50">
			<div class="relative bg-white shadow">
				<div class="mx-auto max-w-7xl px-4 sm:px-6">
					<div class="flex items-center justify-between py-6 md:justify-start md:space-x-10">
						<div class="flex justify-start lg:w-0 lg:flex-1">
							<a href="/">
								<span class="sr-only">Feed City</span>
								<Icon class="h-8 w-auto sm:h-10" icon={props.logo} />
							</a>
						</div>
						<nav class="hidden space-x-10 md:flex">
							<div class="relative">
								{Object.entries(props.menus).map(([name, menu]) => (
									<SimpleMenu
										name={name}
										menu={menu}
										selected={menuSelected}
										menuSetter={setSelectedMenu}
									/>
								))}
							</div>
						</nav>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NavBar;
