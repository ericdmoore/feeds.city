const projects = [
	{
		id: 1,
		name: "Logo redesign",
		description: "New logo and digital asset playbook.",
		hours: "20.0",
		rate: "$100.00",
		price: "$2,000.00",
	},
	// More projects...
];

export default function Example() {
	return (
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="sm:flex sm:items-center">
				<div class="sm:flex-auto">
					<h1 class="text-base font-semibold leading-6 text-gray-900">Invoice</h1>
					<p class="mt-2 text-sm text-gray-700">
						For work completed from <time dateTime="2022-08-01">August 1, 2022</time> to{" "}
						<time dateTime="2022-08-31">August 31, 2022</time>.
					</p>
				</div>
				<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Print
					</button>
				</div>
			</div>
			<div class="-mx-4 mt-8 flow-root sm:mx-0">
				<table class="min-w-full">
					<colgroup>
						<col class="w-full sm:w-1/2" />
						<col class="sm:w-1/6" />
						<col class="sm:w-1/6" />
						<col class="sm:w-1/6" />
					</colgroup>
					<thead class="border-b border-gray-300 text-gray-900">
						<tr>
							<th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
								Project
							</th>
							<th
								scope="col"
								class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
							>
								Hours
							</th>
							<th
								scope="col"
								class="hidden px-3 py-3.5 text-right text-sm font-semibold text-gray-900 sm:table-cell"
							>
								Rate
							</th>
							<th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">
								Price
							</th>
						</tr>
					</thead>
					<tbody>
						{projects.map((project) => (
							<tr key={project.id} class="border-b border-gray-200">
								<td class="max-w-0 py-5 pl-4 pr-3 text-sm sm:pl-0">
									<div class="font-medium text-gray-900">{project.name}</div>
									<div class="mt-1 truncate text-gray-500">{project.description}</div>
								</td>
								<td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{project.hours}</td>
								<td class="hidden px-3 py-5 text-right text-sm text-gray-500 sm:table-cell">{project.rate}</td>
								<td class="py-5 pl-3 pr-4 text-right text-sm text-gray-500 sm:pr-0">{project.price}</td>
							</tr>
						))}
					</tbody>
					<tfoot>
						<tr>
							<th
								scope="row"
								colSpan={3}
								class="hidden pl-4 pr-3 pt-6 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
							>
								Subtotal
							</th>
							<th scope="row" class="pl-4 pr-3 pt-6 text-left text-sm font-normal text-gray-500 sm:hidden">
								Subtotal
							</th>
							<td class="pl-3 pr-4 pt-6 text-right text-sm text-gray-500 sm:pr-0">$8,800.00</td>
						</tr>
						<tr>
							<th
								scope="row"
								colSpan={3}
								class="hidden pl-4 pr-3 pt-4 text-right text-sm font-normal text-gray-500 sm:table-cell sm:pl-0"
							>
								Tax
							</th>
							<th scope="row" class="pl-4 pr-3 pt-4 text-left text-sm font-normal text-gray-500 sm:hidden">
								Tax
							</th>
							<td class="pl-3 pr-4 pt-4 text-right text-sm text-gray-500 sm:pr-0">$1,760.00</td>
						</tr>
						<tr>
							<th
								scope="row"
								colSpan={3}
								class="hidden pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:table-cell sm:pl-0"
							>
								Total
							</th>
							<th scope="row" class="pl-4 pr-3 pt-4 text-left text-sm font-semibold text-gray-900 sm:hidden">
								Total
							</th>
							<td class="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-0">$10,560.00</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
