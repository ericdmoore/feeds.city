const people = [
	{ name: "Lindsay Walton", title: "Front-end Developer", email: "lindsay.walton@example.com", role: "Member" },
	// More people...
];

function isLast<T>(index: number, array: T[]) {
	return index === array.length - 1;
}

export default function StickHeaders() {
	return (
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="sm:flex sm:items-center">
				<div class="sm:flex-auto">
					<h1 class="text-base font-semibold leading-6 text-gray-900">Users</h1>
					<p class="mt-2 text-sm text-gray-700">
						A list of all the users in your account including their name, title, email and role.
					</p>
				</div>
				<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
					<button
						type="button"
						class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Add user
					</button>
				</div>
			</div>
			<div class="mt-8 flow-root">
				<div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
					<div class="inline-block min-w-full py-2 align-middle">
						<table class="min-w-full border-separate border-spacing-0">
							<thead>
								<tr>
									<th
										scope="col"
										class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
									>
										Name
									</th>
									<th
										scope="col"
										class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
									>
										Title
									</th>
									<th
										scope="col"
										class="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
									>
										Email
									</th>
									<th
										scope="col"
										class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
									>
										Role
									</th>
									<th
										scope="col"
										class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
									>
										<span class="sr-only">Edit</span>
									</th>
								</tr>
							</thead>
							<tbody>
								{people.map((person, personIdx) => (
									<tr key={person.email}>
										<td
											class={`${isLast(personIdx, people) ? "border-b border-gray-200" : ""} 
                        whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8`}
										>
											{person.name}
										</td>
										<td
											class={`${isLast(personIdx, people) ? "border-b border-gray-200" : ""} 
                      whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 sm:table-cell`}
										>
											{person.title}
										</td>
										<td
											class={`${isLast(personIdx, people) ? "border-b border-gray-200" : ""} 
                        whitespace-nowrap hidden px-3 py-4 text-sm text-gray-500 lg:table-cell`}
										>
											{person.email}
										</td>
										<td
											class={`${isLast(personIdx, people) ? "border-b border-gray-200" : ""}
                        whitespace-nowrap px-3 py-4 text-sm text-gray-500`}
										>
											{person.role}
										</td>
										<td
											class={` ${isLast(personIdx, people) ? "border-b border-gray-200" : ""}
                        relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-8 lg:pr-8`}
										>
											<a href="#" class="text-indigo-600 hover:text-indigo-900">
												Edit<span class="sr-only">, {person.name}</span>
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
