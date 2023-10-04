import { Fragment } from "preact";
// import { Menu, Transition } from 'npm:@headlessui/react'
import { Ellipsis_vertical } from "$components/heroicons/solid.tsx";

const statuses = {
	Complete: "text-green-700 bg-green-50 ring-green-600/20",
	"In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
	Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
} as const;

const projects = [
	{
		id: 1,
		name: "GraphQL API",
		href: "#",
		status: "Complete" as keyof typeof statuses,
		createdBy: "Leslie Alexander",
		dueDate: "March 17, 2023",
		dueDateTime: "2023-03-17T00:00Z",
	},
	{
		id: 2,
		name: "New benefits plan",
		href: "#",
		status: "In progress" as keyof typeof statuses,
		createdBy: "Leslie Alexander",
		dueDate: "May 5, 2023",
		dueDateTime: "2023-05-05T00:00Z",
	},
	{
		id: 3,
		name: "Onboarding emails",
		href: "#",
		status: "In progress" as keyof typeof statuses,
		createdBy: "Courtney Henry",
		dueDate: "May 25, 2023",
		dueDateTime: "2023-05-25T00:00Z",
	},
	{
		id: 4,
		name: "iOS app",
		href: "#",
		status: "In progress" as keyof typeof statuses,
		createdBy: "Leonard Krasner",
		dueDate: "June 7, 2023",
		dueDateTime: "2023-06-07T00:00Z",
	},
	{
		id: 5,
		name: "Marketing site redesign",
		href: "#",
		status: "Archived" as keyof typeof statuses,
		createdBy: "Courtney Henry",
		dueDate: "June 10, 2023",
		dueDateTime: "2023-06-10T00:00Z",
	},
];

export default function Example() {
	return (
		<ul role="list" class="divide-y divide-gray-100">
			{projects.map((project) => (
				<li key={project.id} class="flex items-center justify-between gap-x-6 py-5">
					<div class="min-w-0">
						<div class="flex items-start gap-x-3">
							<p class="text-sm font-semibold leading-6 text-gray-900">{project.name}</p>
							<p
								class={`${statuses[project.status]} 
                    rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 
                    text-xs font-medium ring-1 ring-inset`}
							>
								{project.status}
							</p>
						</div>
						<div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
							<p class="whitespace-nowrap">
								Due on <time dateTime={project.dueDateTime}>{project.dueDate}</time>
							</p>
							<svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
								<circle cx={1} cy={1} r={1} />
							</svg>
							<p class="truncate">Created by {project.createdBy}</p>
						</div>
					</div>
					<div class="flex flex-none items-center gap-x-4">
						<a
							href={project.href}
							class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
						>
							View project<span class="sr-only">, {project.name}</span>
						</a>
						<div as="div" class="relative flex-none">
							<button class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
								<span class="sr-only">Open options</span>
								<Ellipsis_vertical class="h-5 w-5" aria-hidden="true" />
							</button>
							{
								/* <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              > */
							}
							<div class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
								<div>
									<a
										href="#"
										class="ui-active:bg-gray-50 block px-3 py-1 text-sm leading-6 text-gray-900"
									>
										Edit
										<span class="sr-only">, {project.name}</span>
									</a>
								</div>
								<div>
									<a
										href="#"
										class="ui-active:bg-gray-50 block px-3 py-1 text-sm leading-6 text-gray-900"
									>
										Move<span class="sr-only">, {project.name}</span>
									</a>
								</div>
								<div>
									<a
										href="#"
										class="ui-active:bg-gray-50 block px-3 py-1 text-sm leading-6 text-gray-900"
									>
										Delete<span class="sr-only">, {project.name}</span>
									</a>
								</div>
							</div>
							{/* </Transition> */}
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
