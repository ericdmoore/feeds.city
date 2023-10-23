import type { JSX } from "preact";
import { Fragment } from "preact";

import {
	type FocusableMenu,
	type SelfOpeningName,
	type SimpleMenuList,
	type SimpleMenuProps,
	StringOrThunk,
	truncate,
} from "./menuTypes.tsx";

import { Chevron_down } from "../heroicons/solid.tsx";

const trunc100 = truncate(100);
const PtagOrThunk = StringOrThunk("text-base font-medium text-gray-900");

export function SimpleMenu(props: SimpleMenuProps) {
	const open = props.selected === props.name;
	const onFocus = () => props.menuSetter(props.name);
	const onBlur = () => props.menuSetter(null);

	return (
		<div class="relative">
			<button
				type="button"
				aria-expanded="false"
				{...onFocus}
				{...onBlur}
				class={`
					${open ? "text-gray-900" : "text-gray-500"}
					text-gray-500 
					group 
					inline-flex 
					items-center 
					rounded-md bg-white 
					text-base 
					font-medium 
					hover:text-gray-900 
					focus:outline-none 
					focus:ring-2 
					focus:ring-indigo-500 
					focus:ring-offset-2`}
				>
					<span>{props.name}</span> 
					<Chevron_down />
			</button>
			<div
				class={`${open ? "" : "hidden"} 
        		${open ? "transition ease-out duration-200" : "transition ease-in duration-150"}
				${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
				absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0
				`}
			>
				<div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
					<div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
						{props.menu.map((item, menuIdx) =>
							"desc" in item
								? (
									<a
										href={item.href}
										class={item.class ??
											"-m-3 block rounded-md p-3 transition duration-150 ease-in-out hover:bg-gray-50"}
									>
										<PtagOrThunk text={item.name} />
										<p class="mt-1 text-sm text-gray-500">
											{trunc100(item.desc)}
										</p>
									</a>
								)
								: <PtagOrThunk text={item.name} />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SimpleMenu;

{
	/* <!--
    Flyout menu, show/hide based on flyout menu state.

    Entering: "transition ease-out duration-200"
      From: "opacity-0 translate-y-1"
      To: "opacity-100 translate-y-0"
    Leaving: "transition ease-in duration-150"
      From: "opacity-100 translate-y-0"
      To: "opacity-0 translate-y-1"
  --> */
}
