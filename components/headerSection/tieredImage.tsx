export default function () {
	const aspectratio = "aspect-w-1 aspect-h-1";
	return (
		<div class="bg-white">
			<div class="mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
				<div class="grid grid-cols-1 items-center gap-y-16 gap-x-8 lg:grid-cols-2">
					<div>
						<div class="border-b border-gray-200 pb-10">
							<h2 class="font-medium text-gray-500">Machined Kettle</h2>
							<p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
								Elegant simplicity
							</p>
						</div>

						<dl class="mt-10 space-y-10">
							<div>
								<dt class="text-sm font-medium text-gray-900">Sleek design</dt>
								<dd class="mt-3 text-sm text-gray-500">
									The machined kettle has a smooth black finish and contemporary shape that stands
									apart from most plastic appliances.
								</dd>
							</div>

							<div>
								<dt class="text-sm font-medium text-gray-900">
									Comfort handle
								</dt>
								<dd class="mt-3 text-sm text-gray-500">
									Shaped for steady pours and insulated to prevent burns.
								</dd>
							</div>

							<div>
								<dt class="text-sm font-medium text-gray-900">
									One-button control
								</dt>
								<dd class="mt-3 text-sm text-gray-500">
									The one button control has a digital readout for setting temperature and turning
									the kettle on and off.
								</dd>
							</div>

							<div>
								<dt class="text-sm font-medium text-gray-900">Long spout</dt>
								<dd class="mt-3 text-sm text-gray-500">
									Designed specifically for controlled pour-overs that don&#039;t slash or sputter.
								</dd>
							</div>
						</dl>
					</div>

					<div>
						<div
							class={`${aspectratio} overflow-hidden rounded-lg bg-gray-100`}
						>
							<img
								src="https://tailwindui.com/img/ecommerce-images/product-feature-09-main-detail.jpg"
								alt="Black kettle with long pour spot and angled body on marble counter next to coffee mug and pour-over system."
								class="h-full w-full object-cover object-center"
							/>
						</div>
						<div class="mt-4 grid grid-cols-2 gap-4 sm:mt-6 sm:gap-6 lg:mt-8 lg:gap-8">
							<div
								class={`${aspectratio} overflow-hidden rounded-lg bg-gray-100`}
							>
								<img
									src="https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-01.jpg"
									alt="Detail of temperature setting button on kettle bass with digital degree readout."
									class="h-full w-full object-cover object-center"
								/>
							</div>
							<div
								class={`${aspectratio} overflow-hidden rounded-lg bg-gray-100`}
							>
								<img
									src="https://tailwindui.com/img/ecommerce-images/product-feature-09-detail-02.jpg"
									alt="Kettle spout pouring boiling water into coffee grounds in pour-over mug."
									class="h-full w-full object-cover object-center"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
