import useFormInput from "../compositeHooks/useFormInput.tsx";

export interface TextAreaPreviewProps {
	renderFn?: (text: string) => string;
	setterFn?: (text: string) => void;
	mode: "write" | "preview";
	value: string;
}

export function withPreviewButton(props: Partial<TextAreaPreviewProps>) {
	// preview mode hides the text area and shows the preview
	return (
		<form action="#">
			<div>
				<div
					class="flex items-center"
					aria-orientation="horizontal"
					role="tablist"
				>
					{/* <!-- Selected: "bg-gray-100 text-gray-900 hover:bg-gray-200", Not Selected: "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900" --> */}
					<button
						id="tabs-1-tab-1"
						class="bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
						aria-controls="tabs-1-panel-1"
						role="tab"
						type="button"
						onChange={(e) => {
							props.mode = "write";
						}}
					>
						Write/ParameterName
					</button>
					{/* <!-- Selected: "bg-gray-100 text-gray-900 hover:bg-gray-200", Not Selected: "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900" --> */}
					<button
						id="tabs-1-tab-2"
						class="bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
						aria-controls="tabs-1-panel-2"
						role="tab"
						type="button"
						onChange={(e) => {
							props.mode = "preview";
						}}
					>
						Preview
					</button>

					{/* <!-- These buttons are here simply as examples and don't actually do anything. --> */}
					<div class="ml-auto flex items-center space-x-5">
						<div class="flex items-center">
							<button
								type="button"
								class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
							>
								<span class="sr-only">Insert link</span>
								<svg
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
									<path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
								</svg>
							</button>
						</div>
						<div class="flex items-center">
							<button
								type="button"
								class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
							>
								<span class="sr-only">Insert code</span>
								<svg
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
						<div class="flex items-center">
							<button
								type="button"
								class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
							>
								<span class="sr-only">Mention someone</span>
								<svg
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
										clip-rule="evenodd"
									/>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div class="mt-2">
					<div
						id="tabs-1-panel-1"
						class="-m-0.5 rounded-lg p-0.5"
						aria-labelledby="tabs-1-tab-1"
						role="tabpanel"
						tabIndex={0}
					>
						<label for="comment" class="sr-only">Comment</label>
						<div>
							<textarea
								rows={5}
								name="comment"
								id="comment"
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								placeholder="Add your comment..."
								value={props.value}
							>
							</textarea>
						</div>
					</div>
					<div
						id="tabs-1-panel-2"
						class="-m-0.5 rounded-lg p-0.5"
						aria-labelledby="tabs-1-tab-2"
						role="tabpanel"
						tabIndex={0}
					>
						<div
							class={`border-b ${props.mode === "preview" ? "visible" : "hidden"} `}
						>
							<div class="mx-px mt-px px-3 pb-12 pt-2 text-sm leading-5 text-gray-800">
								Preview content will render here.
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-2 flex justify-end">
				<button
					type="submit"
					class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					Post
				</button>
			</div>
		</form>
	);
}

export default withPreviewButton;
