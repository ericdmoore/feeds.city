const plans = [
    {
      id: 1,
      name: 'Hobby',
      memory: '4 GB RAM',
      cpu: '4 CPUs',
      storage: '128 GB SSD disk',
      price: '$40',
      isCurrent: false,
    },
    {
      id: 2,
      name: 'Startup',
      memory: '8 GB RAM',
      cpu: '6 CPUs',
      storage: '256 GB SSD disk',
      price: '$80',
      isCurrent: true,
    },
    // More plans...
  ]
  
  function isZeroth(idx: number){
    return idx === 0
  }

  export default function WithBorder() {
    return (
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-base font-semibold leading-6 text-gray-900">Plans</h1>
            <p class="mt-2 text-sm text-gray-700">
              Your team is on the <strong class="font-semibold text-gray-900">Startup</strong> plan. The next payment
              of $80 will be due on August 4, 2022.
            </p>
          </div>
          <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Update credit card
            </button>
          </div>
        </div>
        <div class="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Plan
                </th>
                <th
                  scope="col"
                  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Memory
                </th>
                <th
                  scope="col"
                  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  CPU
                </th>
                <th
                  scope="col"
                  class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                >
                  Storage
                </th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Price
                </th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Select</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, planIdx) => (
                <tr key={plan.id}>
                  <td
                    class={`
                      ${isZeroth(planIdx) ? '' : 'border-t border-transparent'} 
                      relative py-4 pl-4 pr-3 text-sm sm:pl-6`}
                  >
                    <div class="font-medium text-gray-900">
                      {plan.name}
                      {plan.isCurrent ? <span class="ml-1 text-indigo-600">(Current Plan)</span> : null}
                    </div>
                    <div class="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
                      <span>
                        {plan.memory} / {plan.cpu}
                      </span>
                      <span class="hidden sm:inline">·</span>
                      <span>{plan.storage}</span>
                    </div>
                    {planIdx !== 0 ? <div class="absolute -top-px left-6 right-0 h-px bg-gray-200" /> : null}
                  </td>
                  <td
                    class={`${isZeroth(planIdx) ? '' : 'border-t border-gray-200'}
                    hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell`
                  }
                  >
                    {plan.memory}
                  </td>
                  <td
                    class={`${isZeroth(planIdx) ? '' : 'border-t border-gray-200'} 
                    hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell
                    `}
                  >
                    {plan.cpu}
                  </td>
                  <td
                    class={`${isZeroth(planIdx) ? '' : 'border-t border-gray-200'} 
                    hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell
                    `}
                  >
                    {plan.storage}
                  </td>
                  <td
                    class={`${isZeroth(planIdx) ? '' : 'border-t border-gray-200'} 
                      px-3 py-3.5 text-sm text-gray-500
                    `}
                  >
                    <div class="sm:hidden">{plan.price}/mo</div>
                    <div class="hidden sm:block">{plan.price}/month</div>
                  </td>
                  <td
                    class={`${isZeroth(planIdx) ? '' : 'border-t border-transparent'} 
                      relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6
                    `}
                  >
                    <button
                      type="button"
                      class="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
                      disabled={plan.isCurrent}
                    >
                      Select<span class="sr-only">, {plan.name}</span>
                    </button>
                    {planIdx !== 0 ? <div class="absolute -top-px left-0 right-6 h-px bg-gray-200" /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  