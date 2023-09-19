import { Fragment } from 'preact'
import { Menu, Transition } from 'npm:@headlessui/react'
import { Ellipsis_horizontal } from '$components/heroicons/solid.tsx'

const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}
const clients = [
  {
    id: 1,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: {
      date: 'December 13, 2022', 
      dateTime: '2022-12-13', 
      amount: '$2,000.00', 
      status: 'Overdue' as keyof typeof statuses,
    },
  },
  {
    id: 2,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    lastInvoice: { 
      date: 'January 22, 2023', 
      dateTime: '2023-01-22', 
      amount: '$14,000.00', 
      status: 'Paid' as keyof typeof statuses,
    },
  },
  {
    id: 3,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    lastInvoice: { 
      date: 'January 23, 2023', 
      dateTime: '2023-01-23', 
      amount: '$7,600.00', 
      status: 'Paid' as keyof typeof statuses,
    },
  },
]

export default function LogoCardGrid() {
  return (
    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {clients.map((client) => (
        <li key={client.id} class="overflow-hidden rounded-xl border border-gray-200">
          <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <img
              src={client.imageUrl}
              alt={client.name}
              class="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div class="text-sm font-medium leading-6 text-gray-900">{client.name}</div>
            <Menu as="div" class="relative ml-auto">
              <Menu.Button class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span class="sr-only">Open options</span>
                <Ellipsis_horizontal class="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                      <a
                        href="#"
                        class='ui-active:bg-gray-50 block px-3 py-1 text-sm leading-6 text-gray-900'
                      >
                        View<span class="sr-only">, {client.name}</span>
                      </a>
                  </Menu.Item>
                  <Menu.Item>
                      <a href="#"
                        class='ui-active:bg-gray-50 block px-3 py-1 text-sm leading-6 text-gray-900'
                      >
                        Edit<span class="sr-only">, {client.name}</span>
                      </a>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div class="flex justify-between gap-x-4 py-3">
              <dt class="text-gray-500">Last invoice</dt>
              <dd class="text-gray-700">
                <time dateTime={client.lastInvoice.dateTime}>{client.lastInvoice.date}</time>
              </dd>
            </div>
            <div class="flex justify-between gap-x-4 py-3">
              <dt class="text-gray-500">Amount</dt>
              <dd class="flex items-start gap-x-2">
                <div class="font-medium text-gray-900">{client.lastInvoice.amount}</div>
                <div
                  class={`${statuses[client.lastInvoice.status]} 
                  rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset`}
                >
                  {client.lastInvoice.status}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
