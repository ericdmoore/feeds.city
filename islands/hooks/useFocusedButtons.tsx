import type { ComponentChildren } from "preact";
import { useEffect, useId } from "preact/hooks";

type ButtonOmisionNames =
	| "prefix"
	| "translate"
	| "autocapitalize"
	| "style"
	| "role"
	| "part"
	| "form"
	| "contentEditable"
	| "dir";

export function FocusableButton(props: {
	children: ComponentChildren;
	onfocusout?: (e: FocusEvent) => void;
	onfocusin?: (e: FocusEvent) => void;
	onClick?: (e: MouseEvent) => void;
	id?: string;
	effectCB?: () => void | (() => void);
	effectDepList?: unknown[];
}) {
	const btnID = props.id ?? useId();

	const cb = function () {
		const button = document.querySelector(`button#${btnID}`) as HTMLElement | null;
		button?.addEventListener("click", function () {
			button?.focus();
		});

		const ogCleanUpFN = props?.effectCB ? props.effectCB() ?? null : null;

		return function () {
			button?.removeEventListener("click", function () {
				button?.focus();
			});
			if (ogCleanUpFN) ogCleanUpFN();
		};
	};

	useEffect(cb, props.effectDepList ?? []);
	return <button {...props} id={btnID}>{props.children}</button>;
}

export default FocusableButton;
