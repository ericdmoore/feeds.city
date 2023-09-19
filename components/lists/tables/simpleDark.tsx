const people = [
    { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
    // More people...
  ]
  
  export default function SimpleDark() {
    return (
      <div class="bg-gray-900">
        <div class="mx-auto max-w-7xl">
          <div class="bg-gray-900 py-10">
            <div class="px-4 sm:px-6 lg:px-8">
              <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                  <h1 class="text-base font-semibold leading-6 text-white">Users</h1>
                  <p class="mt-2 text-sm text-gray-300">
                    A list of all the users in your account including their name, title, email and role.
                  </p>
                </div>
                <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                  <button
                    type="button"
                    class="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Add user
                  </button>
                </div>
              </div>
              <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table class="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">
                            Name
                          </th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Title
                          </th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Email
                          </th>
                          <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-white">
                            Role
                          </th>
                          <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                            <span class="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-800">
                        {people.map((person) => (
                          <tr key={person.email}>
                            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                              {person.name}
                            </td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{person.title}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{person.email}</td>
                            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{person.role}</td>
                            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <a href="#" class="text-indigo-400 hover:text-indigo-300">
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
          </div>
        </div>
      </div>
    )
  }
  