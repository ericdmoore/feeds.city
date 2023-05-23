/**
 * Input: FunctInerface[]
 * Output: FunctInerface[]
 *
 * - Adding new Params does not change the "state shape"
 *
 * Side EFfects:
 *  Generate new link state for next
 *  Update the URL inplace with new stateLInk
 */

// import {useForm} from 'react-hook-form'
import type { JSX } from "preact";
import type { Signal } from "@preact/signals";

import { computed, effect, signal } from "@preact/signals";

// import {useFormInput} from '../compositeHooks/useFormInput.tsx'

export interface CompositionFormProps {
	parentGetsStateOnSubmit: (state: string) => void;
}

function connectSignal(s: Signal<string>) {
	return {
		onChange: (e: Event) => {
			s.value = (e.target as HTMLInputElement).value;
		},
	};
}

// const SignaledInputCheckbox = (props: {signal: Signal<string>, attrs: HTMLInputElement})=>{
//   return <input {...{...props.attrs, ...connectSignal(props.signal),type:'checkbox'}}   />
// }
const SignaledInputColor = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="color" />;
};

const SignaledInputFile = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="file" />;
};
const SignaledInputHidden = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="hidden" />;
};
const SignaledInputImage = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="image" />;
};
const SignaledInputMonth = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="month" />;
};
const SignaledInputPassword = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="password" />;
};
const SignaledInputRange = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="range" />;
};
const SignaledInputReset = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="reset" />;
};
const SignaledInputSearch = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="search" />;
};
const SignaledInputSubmit = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="submit" />;
};
const SignaledInputTel = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="tel" />;
};

const SignaledInputDate = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="date" />;
};
const SignaledInputDatetime = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="datetime" />;
};
const SignaledInputEmail = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="email" />;
};
const SignaledInputNumber = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return (
		<input
			{...props}
			{...connectSignal(props.signal)}
			value={props.signal.value}
			type="number"
		/>
	);
};
const SignaledInputRadio = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return (
		<input
			{...props}
			{...connectSignal(props.signal)}
			value={props.signal.value}
			type="radio"
		/>
	);
};
const SignaledInputText = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return (
		<input
			{...props}
			{...connectSignal(props.signal)}
			value={props.signal.value}
			type="text"
		/>
	);
};

const SignaledInputTime = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="time" />;
};
const SignaledInputUrl = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="url" />;
};
const SignaledInputWeek = (
	props: JSX.HTMLAttributes<HTMLInputElement> & { signal: Signal<string> },
) => {
	return <input type="week" />;
};

/**
 * Form Elememnt Composition is dynanmic
 * Each Element needs to transmit any changed state to the parent
 *
 * Forms (parent) can compile the current state and emit a link,
 *  or even change the current URL to reflect changes.
 *
 * and keep them in a state object of sorts, and then embed those "signals"
 * into the form too for viewing purposes
 *
 * Form should use a recursive build strategy to build the form elements,
 * and in each element, gets a signal that it updates based on user input
 *
 * PARAM TREE
 *   keyParamName: {value: bareValue or nestedParamTree}
 *
 *   upStreamTree... : {
 *      value: bareValue,
 *      signal: signal,
 *      comp: ()=>JSX.Element
 *   }
 *
 *  flattenedTree(nestedTree)
 *  {
 *     dottedKeyParamName: {value: bareValue}
 *     ...
 *   }
 *
 *   nestDottedTree(dottedTree)
 *   {
 *    dottedKeyParamName: {value: bareValue, signal: signal, comp: ()=>JSX.Element}
 *   }
 */

export function CompositionForm(props: Partial<CompositionFormProps>) {
	// const {register, handleSubmit, formState: { errors }} = useForm();
	// const onValidSubmit = (data: unknown) => console.log(data);
	// const onInvalidSubmit = (data: unknown) => console.error(data);

	const onSubmit = ((e) => {
		props.parentGetsStateOnSubmit && props.parentGetsStateOnSubmit("state");
		console.log("onSubmit", { e });
	}) as JSX.GenericEventHandler<HTMLFormElement>;

	return (
		<form onSubmit={onSubmit}>
			<SignaledInputText signal={signal("")} />
			{/* <input {...useFormInput('firstName', 'onChange')} /> */}
			{/* <input {...useFormInput('lastName', 'onChange')} /> */}
			<button type="submit" />
		</form>
	);
}

export default CompositionForm;
