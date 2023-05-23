import { Arrow_right, Check_circle } from "../heroicons/outline.tsx";

export interface NavPanelProps {
	stepsCompleted: string[];
	current: string;
	stepsPending: string[];
}

const NavPanelURLs = (url: URL, ctxParams: Record<string, string>) => {
	const { token, tokType, outputFmt, composition } = ctxParams;

	const baseLink = `$//${url.host}/api/${tokType}-${token}/${outputFmt}/${composition}`;
	return [
		`//${url.host}/api`, // add token
		`//${url.host}/api/${tokType}-${token}`, // add format
		`//${url.host}/api/${tokType}-${token}/${outputFmt}`, // add comps
		`//${url.host}/api/${tokType}-${token}/${outputFmt}/${composition}`, // add URL
		`//${url.host}/api/${tokType}-${token}/${outputFmt}/${composition}/preview`,
	];
};

export function Panels(props: NavPanelProps) {
	return (
		<nav aria-label="Progress">
			<ol
				role="list"
				class="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
			>
				{/* <!-- Completed Steps --> */}
				{props.stepsCompleted.map((stepName, index) => (
					<li class="relative md:flex md:flex-1">
						<a href="#" class="group flex w-full items-center">
							<span class="flex items-center px-6 py-4 text-sm font-medium">
								<span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
									<svg
										class="h-6 w-6 text-white"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
											clip-rule="evenodd"
										/>
									</svg>
								</span>
								<span class="ml-4 text-sm font-medium text-gray-900">
									{stepName}
								</span>
							</span>
						</a>

						{/* <!-- Arrow separator for lg screens and up --> */}
						<div
							class="absolute right-0 top-0 hidden h-full w-5 md:block"
							aria-hidden="true"
						>
							<svg
								class="h-full w-full text-gray-300"
								viewBox="0 0 22 80"
								fill="none"
								preserveAspectRatio="none"
							>
								<path
									d="M0 -2L20 40L0 82"
									vector-effect="non-scaling-stroke"
									stroke="currentcolor"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</li>
				))}

				{/* <!-- Current Step --> */}
				<li class="relative md:flex md:flex-1">
					<a
						href="#"
						class="flex items-center px-6 py-4 text-sm font-medium"
						aria-current="step"
					>
						<span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
							<span class="text-indigo-600">
								{props.stepsCompleted.length + 1}
							</span>
						</span>
						<span class="ml-4 text-sm font-medium text-indigo-600">
							{props.current}
						</span>
					</a>

					{/* <!-- Arrow separator for lg screens and up --> */}
					<div
						class="absolute right-0 top-0 hidden h-full w-5 md:block"
						aria-hidden="true"
					>
						<svg
							class="h-full w-full text-gray-300"
							viewBox="0 0 22 80"
							fill="none"
							preserveAspectRatio="none"
						>
							<path
								d="M0 -2L20 40L0 82"
								vector-effect="non-scaling-stroke"
								stroke="currentcolor"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				</li>

				{/* Pending Steps */}
				{props.stepsPending.map((stepName, index) => (
					<li class="relative md:flex md:flex-1">
						<a href="#" class="group flex items-center">
							<span class="flex items-center px-6 py-4 text-sm font-medium">
								<span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
									<span class="text-gray-500 group-hover:text-gray-900">
										{props.stepsCompleted.length + 2 + index}
									</span>
								</span>
								<span class="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
									{stepName}
								</span>
							</span>
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}

export default Panels;
