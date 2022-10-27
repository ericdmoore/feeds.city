export function AboutHero(){
  
    return (
<div class="bg-gray-50">
  <div class="relative overflow-hidden">
    <div class="absolute inset-y-0 h-full w-full" aria-hidden="true">
      <div class="relative h-full">
        <svg class="absolute right-full translate-y-1/3 translate-x-1/4 transform sm:translate-x-1/2 md:translate-y-1/2 lg:translate-x-full" width="404" height="784" fill="none" viewBox="0 0 404 784">
          <defs>
            <pattern id="e229dbec-10e9-49ee-8ec3-0286ca089edf" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
        </svg>
        <svg class="absolute left-full -translate-y-3/4 -translate-x-1/4 transform sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
          <defs>
            <pattern id="d2a68204-c383-44b1-b99f-42ccff4e5365" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="4" height="4" class="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="404" height="784" fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
        </svg>
      </div>
    </div>

    <div class="relative pt-6 pb-16 sm:pb-24">
      <div>
        <div class="mx-auto max-w-7xl px-4 sm:px-6">
          <nav class="relative flex items-center justify-between sm:h-10 md:justify-center" aria-label="Global">
            <div class="flex flex-1 items-center md:absolute md:inset-y-0 md:left-0">
              <div class="flex w-full items-center justify-between md:w-auto">
                <a href="#">
                  <span class="sr-only">Your Company</span>
                  <img class="h-8 w-auto sm:h-10" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
                </a>
                <div class="-mr-2 flex items-center md:hidden">
                  <button type="button" class="inline-flex items-center justify-center rounded-md bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    {/* <!-- Heroicon name: outline/bars-3 --> */}
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="hidden md:flex md:space-x-10">
              <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Product</a>

              <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Features</a>

              <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Marketplace</a>

              <a href="#" class="font-medium text-gray-500 hover:text-gray-900">Company</a>
            </div>
            <div class="hidden md:absolute md:inset-y-0 md:right-0 md:flex md:items-center md:justify-end">
              <span class="inline-flex rounded-md shadow">
                <a href="#" class="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
              </span>
            </div>
          </nav>
        </div>

        {/* <!--
          Mobile menu, show/hide based on menu open state.

          Entering: "duration-150 ease-out"
            From: "opacity-0 scale-95"
            To: "opacity-100 scale-100"
          Leaving: "duration-100 ease-in"
            From: "opacity-100 scale-100"
            To: "opacity-0 scale-95"
        --> */}
        <div class="absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden">
          <div class="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black ring-opacity-5">
            <div class="flex items-center justify-between px-5 pt-4">
              <div>
                <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt=""/>
              </div>
              <div class="-mr-2">
                <button type="button" class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span class="sr-only">Close main menu</span>
                  {/* <!-- Heroicon name: outline/x-mark --> */}
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="space-y-1 px-2 pt-2 pb-3">
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Product</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Features</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Marketplace</a>
              <a href="#" class="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900">Company</a>
            </div>
            <a href="#" class="block w-full bg-gray-50 px-5 py-3 text-center font-medium text-indigo-600 hover:bg-gray-100 hover:text-indigo-700">Log in</a>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block">Data to enrich your</span>
            <span class="block text-indigo-600">online business</span>
          </h1>
          <p class="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
        </div>
      </div>
    </div>

    <div class="relative">
      <div class="absolute inset-0 flex flex-col" aria-hidden="true">
        <div class="flex-1"></div>
        <div class="w-full flex-1 bg-gray-800"></div>
      </div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <img class="relative rounded-lg shadow-lg" src="https://tailwindui.com/img/component-images/top-nav-with-multi-column-layout-screenshot.jpg" alt="App screenshot"/>
      </div>
    </div>
  </div>
  <div class="bg-gray-800">
    <div class="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h2 class="text-center text-base font-semibold text-gray-400">Trusted by over 26,000 forward-thinking companies</h2>
      <div class="mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img class="h-12" src="https://tailwindui.com/img/logos/tuple-logo-gray-400.svg" alt="Tuple"/>
        </div>
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img class="h-12" src="https://tailwindui.com/img/logos/mirage-logo-gray-400.svg" alt="Mirage"/>
        </div>
        <div class="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
          <img class="h-12" src="https://tailwindui.com/img/logos/statickit-logo-gray-400.svg" alt="StaticKit"/>
        </div>
        <div class="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
          <img class="h-12" src="https://tailwindui.com/img/logos/transistor-logo-gray-400.svg" alt="Transistor"/>
        </div>
        <div class="col-span-2 flex justify-center md:col-span-3 lg:col-span-1">
          <img class="h-12" src="https://tailwindui.com/img/logos/workcation-logo-gray-400.svg" alt="Workcation"/>
        </div>
      </div>
    </div>
  </div>
</div>)
}

export default AboutHero