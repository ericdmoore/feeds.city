import type { Color } from "../lib/types.ts";
import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import {
	Check_circle,
	Cloud_arrow_up,
	Ellipsis_horizontal,
	X_circle,
	X_mark,
} from "../components/heroicons/outline.tsx";

interface NotificaitonProps {
	display: boolean | HiddenPendingHappyError;
	color: keyof typeof Color;
	msg: string;
	closeable: boolean;
	shutClose: () => void;
}

interface SingUpProps {
	token: string;
	exp: number;
}

type HiddenPendingHappyError = "Hidden" | "Pending" | "Happy" | Error;
// 0 = Hidden
// 1 = pending
// 2 - Happy
// Error - Error

function NotificationSuccess(props: NotificaitonProps) {
	// green
	return (
		<div
			class={`${props.display === "Happy" ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}
		>
			<div class="flex">
				<div class="flex-shrink-0">
					<Check_circle class={`h-5 w-5 text-${props.color}-400`} />
				</div>
				<div class="ml-3">
					<p class={`text-sm font-medium text-${props.color}-800`}>
						{props.msg}
					</p>
				</div>
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							type="button"
							onClick={props.shutClose}
							class={`inline-flex rounded-md bg-${props.color}-50 p-1.5 text-${props.color}-500 hover:bg-${props.color}-100 focus:outline-none focus:ring-2 focus:ring-${props.color}-600 focus:ring-offset-2 focus:ring-offset-${props.color}-50`}
						>
							<span class="sr-only">Dismiss</span>
							<X_mark class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function NotificationFailure(props: NotificaitonProps) {
	// red
	return (
		<div
			class={`${props.display instanceof Error ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}
		>
			<div class="flex">
				<div class="flex-shrink-0">
					<X_circle class={`h-5 w-5 text-${props.color}-400`} />
				</div>
				<div class="ml-3">
					<p class={`text-sm font-medium text-${props.color}-800`}>
						{props.msg}
					</p>
				</div>
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							type="button"
							onClick={props.shutClose}
							class={`inline-flex rounded-md bg-${props.color}-100 p-1.5 text-${props.color}-500 hover:bg-${props.color}-200 focus:outline-none focus:ring-2 focus:ring-${props.color}-600 focus:ring-offset-2 focus:ring-offset-${props.color}-200`}
						>
							<span class="sr-only">Dismiss</span>
							<X_mark class="h-5 w-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function NotificationPending(props: NotificaitonProps) {
	return (
		<div
			class={`${props.display === "Pending" ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}
		>
			<div class="flex">
				<div class="flex-shrink-0">
					<Cloud_arrow_up class={`h-5 w-5 text-${props.color}-400`} />
				</div>
				<div class="ml-3">
					<p class={`text-sm font-medium text-${props.color}-800`}>
						{props.msg}
					</p>
				</div>
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						{props.closeable
							? (
								<button
									type="button"
									onClick={props.shutClose}
									class={`inline-flex rounded-md bg-${props.color}-100 
                p-1.5 text-${props.color}-500 hover:bg-${props.color}-200 
                focus:outline-none focus:ring-2 focus:ring-${props.color}-600 
                focus:ring-offset-2 focus:ring-offset-${props.color}-200`}
								>
									<span class="sr-only">Dismiss</span>
									<X_mark class="h-5 w-5" />
								</button>
							)
							: <></>}
					</div>
				</div>
			</div>
		</div>
	);
}

export function SignUp(props: Partial<SingUpProps>) {
	const [email, setEmail] = useState("");
	const [pendingMessage, setPendingMessage] = useState("...sending");
	const [sessionExpired, setSssionExpired] = useState(false);
	const [notificationStates, setNotificationState] = useState(
		"Hidden" as HiddenPendingHappyError,
	);

	const expMS = new Date(props.exp! * 1000).getTime();
	const nowMS = new Date().getTime();

	useEffect(() => {
		setTimeout(() => {
			setPendingMessage(
				"The session has timeed out. Please Refresh the page and try again.",
			);
			setNotificationState("Pending");
			setSssionExpired(true);
		}, expMS - nowMS);
	});

	const submitEmail = async (email: string, token?: string) => {
		const u = new URL(window.location.href);
		u.searchParams.append("token", token ?? "TOKEN_NOT_PROVIDED");
		u.searchParams.append("email", encodeURIComponent(email));

		const res = await fetch(u, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		return res.json().catch((er) => ({ _error: er }));
	};

	const onClick: JSX.GenericEventHandler<EventTarget> = async (e) => {
		e.preventDefault();
		setNotificationState("Pending");
		const resp = await submitEmail(email, props.token);
		if ("_error" in resp) {
			setNotificationState(resp._error);
		} else {
			setNotificationState("Happy");
		}
		setEmail(""); // clear out input box
	};

	const setEmailForAnyChange: JSX.GenericEventHandler<HTMLInputElement> = (
		e,
	) => {
		e.preventDefault();
		setEmail(String((e.target as HTMLInputElement).value));
	};

	return (
		<section class="bg-white">
			<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
				<NotificationPending
					display={notificationStates}
					color="gray"
					closeable={!sessionExpired}
					msg={pendingMessage}
					shutClose={() => setNotificationState("Hidden")} // Closed = 0
				/>
				<NotificationSuccess
					display={notificationStates}
					color="green"
					closeable
					msg="Request Sent!"
					shutClose={() => setNotificationState("Hidden")} // Closed = 0
				/>
				<NotificationFailure
					display={notificationStates}
					color="red"
					closeable
					msg="Hmm.... Something Went wrong, Please try again, in 10 minutes"
					shutClose={() => setNotificationState("Hidden")} // Closed = 0
				/>

				<div class="rounded-lg bg-indigo-700 px-6 py-6 md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
					<div class="xl:w-0 xl:flex-1">
						<h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
							Request an Invite to Feeds.City
						</h2>
						<p class="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">
							New Invites Given Daily
						</p>
					</div>

					<div class="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
						<form class="sm:flex">
							<label htmlFor="email-address" class="sr-only">
								Email address
							</label>
							<input
								required
								id="email-address"
								name="email-address"
								type="email"
								autoComplete="email"
								value={email}
								placeholder="Enter your email"
								class="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
								onInput={setEmailForAnyChange}
								onfocusout={setEmailForAnyChange}
							/>
							<button
								type="submit"
								onClick={onClick}
								disabled={sessionExpired || notificationStates === "Pending"}
								class="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
							>
								{notificationStates === "Pending"
									? <Ellipsis_horizontal class={`h-5 w-5 text-white`} />
									: <p>Request</p>}
							</button>
						</form>
						<p class="mt-3 text-sm text-indigo-200">
							We protect your data. Check out our{"   "}
							<a href="#" class="font-medium text-white underline">
								Privacy Policy.
							</a>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default SignUp;
