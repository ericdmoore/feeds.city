import type { Icon } from '../components/types.ts'
import {
  Chevron_down, 
  Cursor_arrow_rays, 
  Shield_check,
  Squares_2x2,
  Arrow_path,
  Play,
  Phone,
  Chart_bar,
  Bars_3,
  Lifebuoy,
  Calendar,
  Bookmark_square
} from '../components/heroicons/outline.tsx'
import {useState} from 'preact/hooks'

interface CTA  {
  text:string
  href:string
  class?:string
}

interface MenuItem {
  icon: Icon, 
  text:string
}

interface HeroProps{
  logo?: Icon
  h1?: string
  h1span?: string
  p?: string
  cta?:{
    left:CTA
    right:CTA 
  }
  img?: {
    src:string, 
    alt:string
  }
  nav:{
    menu?: {
      Solutions: {
        body:{
          Analytics: MenuItem
          Engagement: MenuItem
          Secuitty: MenuItem
          Integration: MenuItem
          Automations: MenuItem
        }, 
        footer:{
          'Watch Demo': MenuItem
          'Contact Sales': MenuItem
        }
      } 
      Pricing: string
      Docs: string
      More: {
        body:{
          'Help Center': MenuItem,
          Guides: MenuItem
          Events: MenuItem
          Security: MenuItem
        }, 
        footer?: null
      } 
    }
    _: {
      'Sign Up': {href: '/register'}
      'Sign In': {href: '/login'}
    }
  }
}

export function PublicHero(props: HeroProps){
  
  const [isSolutionsExpanded, setSolutionsExpanded] = useState(false)
  const [isMoreExpanded, setMoreExpanded] = useState(false)

return (
  <div class="relative bg-gray-50">
    <div class="relative bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6">
        <div class="flex items-center justify-between py-6 md:justify-start md:space-x-10">
          <div class="flex justify-start lg:w-0 lg:flex-1">
            <a href="#">
              <span class="sr-only">Feed City</span>
              <img class="h-8 w-auto sm:h-10" src="/feedCityRingDropsLogo.svg" alt="Feed City Logo"/>
            </a>
          </div>
          
          <div class="-my-2 -mr-2 md:hidden">
            <button type="button" 
              aria-expanded="false"
              onClick={()=>{setSolutionsExpanded(!isSolutionsExpanded); setMoreExpanded(false)}} 
              onfocusout={()=>{setMoreExpanded(false); setSolutionsExpanded(false)}}
              class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" 
              >
              <span class="sr-only">Open menu</span>
              <Bars_3 class="h-6 w-6" />
            </button>
          </div>
          
          <nav class="hidden space-x-10 md:flex">
            <div class="relative">
              {/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
              <button type="button" 
                onClick={()=>{setSolutionsExpanded(!isSolutionsExpanded); setMoreExpanded(false)}} 
                onfocusout={()=>{setMoreExpanded(false); setSolutionsExpanded(false)}}
                class="text-gray-500 group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" aria-expanded="false">
                <span>Solutions</span>
                <Chevron_down class='text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500'/>
              </button>
  
              {/* <!--
                'Solutions' flyout menu, show/hide based on flyout menu state.
  
                Entering: "transition ease-out duration-200"
                  From: "opacity-0 translate-y-1"
                  To: "opacity-100 translate-y-0"
                Leaving: "transition ease-in duration-150"
                  From: "opacity-100 translate-y-0"
                  To: "opacity-0 translate-y-1"
              --> */}
              <div class={`${isSolutionsExpanded ? '' :'hidden'} absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2`}>
                <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Chart_bar class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Analytics</p>
                        <p class="mt-1 text-sm text-gray-500">Get a better understanding of where your traffic is coming from.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Cursor_arrow_rays class="h-6 w-6 flex-shrink-0 text-indigo-600" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Engagement</p>
                        <p class="mt-1 text-sm text-gray-500">Speak directly to your customers in a more meaningful way.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Security</p>
                        <p class="mt-1 text-sm text-gray-500">Your customers&#039; data will be safe and secure.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Squares_2x2 class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Integrations</p>
                        <p class="mt-1 text-sm text-gray-500">Connect with third-party tools that you&#039;re already using.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Arrow_path class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Automations</p>
                        <p class="mt-1 text-sm text-gray-500">Build strategic funnels that will drive your customers to convert</p>
                      </div>
                    </a>
                  </div>
                  <div class="space-y-6 bg-gray-50 px-5 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                    <div class="flow-root">
                      <a href="#" class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100">
                        <Play class="h-6 w-6 flex-shrink-0 text-gray-400" />
                        <span class="ml-3">Watch Demo</span>
                      </a>
                    </div>
  
                    <div class="flow-root">
                      <a href="#" class="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100">
                        <Phone class="h-6 w-6 flex-shrink-0 text-gray-400"/> 
                        <span class="ml-3">Contact Sales</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Pricing</a>
            <a href="#" class="text-base font-medium text-gray-500 hover:text-gray-900">Docs</a>
  
            <div class="relative">
              {/* <!-- Item active: "text-gray-900", Item inactive: "text-gray-500" --> */}
              <button type="button" 
                aria-expanded="false"
                onClick={()=>{setMoreExpanded(!isMoreExpanded); setSolutionsExpanded(false) }} 
                onfocusout={()=>{setMoreExpanded(false); setSolutionsExpanded(false)}}
                class="text-gray-500 group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                >
                <span>More</span>
                <Chevron_down class="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500 focus:text-gray-600"/>
              </button>
  
              {/* <!--
                'More' flyout menu, show/hide based on flyout menu state.
  
                Entering: "transition ease-out duration-200"
                  From: "opacity-0 translate-y-1"
                  To: "opacity-100 translate-y-0"
                Leaving: "transition ease-in duration-150"
                  From: "opacity-100 translate-y-0"
                  To: "opacity-0 translate-y-1"
              --> */}

              <div class={`${isMoreExpanded ? '' : 'hidden'} absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0`}>
                <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Lifebuoy class="h-6 w-6 flex-shrink-0 text-indigo-600" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Help Center</p>
                        <p class="mt-1 text-sm text-gray-500">Get all of your questions answered in our forums or contact support.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Bookmark_square class="h-6 w-6 flex-shrink-0 text-indigo-600" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Guides</p>
                        <p class="mt-1 text-sm text-gray-500">Learn how to maximize our platform to get the most out of it.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Calendar class="h-6 w-6 flex-shrink-0 text-indigo-600" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Events</p>
                        <p class="mt-1 text-sm text-gray-500">See what meet-ups and other events we might be planning near you.</p>
                      </div>
                    </a>
  
                    <a href="#" class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50">
                      <Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600" />
                      <div class="ml-4">
                        <p class="text-base font-medium text-gray-900">Security</p>
                        <p class="mt-1 text-sm text-gray-500">Understand how we take your privacy seriously.</p>
                      </div>
                    </a>
                  </div>
                  <div class="bg-gray-50 px-5 py-5 sm:px-8 sm:py-8">
                    <div>
                      <h3 class="text-base font-medium text-gray-500">Recent Posts</h3>
                      <ul role="list" class="mt-4 space-y-4">
                        <li class="truncate text-base">
                          <a href="#" class="font-medium text-gray-900 hover:text-gray-700">Boost your conversion rate</a>
                        </li>
  
                        <li class="truncate text-base">
                          <a href="#" class="font-medium text-gray-900 hover:text-gray-700">How to use search engine optimization to drive traffic to your site</a>
                        </li>
  
                        <li class="truncate text-base">
                          <a href="#" class="font-medium text-gray-900 hover:text-gray-700">Improve your customer experience</a>
                        </li>
                      </ul>
                    </div>
                    <div class="mt-5 text-sm">
                      <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                        View all posts
                        <span aria-hidden="true"> &rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <a href={props.nav._['Sign In'].href} class="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">Sign in</a>
            <a href={props.nav._['Sign Up'].href} class="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Sign up</a>
          </div>
        </div>
      </div>
  
      {/* <!--
        Mobile menu, show/hide based on mobile menu state.
  
        Entering: "duration-200 ease-out"
          From: "opacity-0 scale-95"
          To: "opacity-100 scale-100"
        Leaving: "duration-100 ease-in"
          From: "opacity-100 scale-100"
          To: "opacity-0 scale-95"
      --> */}

      <div class={`${isSolutionsExpanded || isMoreExpanded ? '' : 'hidden'} absolute inset-x-0 top-0 z-10 origin-top-right transform p-2 transition md:hidden`}>
        <div class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="px-5 pt-5 pb-6">
            <div class="flex items-center justify-between">
              <div>
                <img class="h-8 w-auto" src="/feedCity.svg" alt="Feed City"/>
              </div>
              <div class="-mr-2">
                <button type="button" 
                onClick={()=>{setMoreExpanded(false); setSolutionsExpanded(false) }}
                onfocusout={()=>{setMoreExpanded(false); setSolutionsExpanded(false)}}
                class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span class="sr-only">Close menu</span>
                  {/* <!-- Heroicon name: outline/x-mark --> */}
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-6">
              <nav class="grid gap-y-8">
                <a href="#" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  {/* <!-- Heroicon name: outline/chart-bar --> */}
                  <Chart_bar class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                  <span class="ml-3 text-base font-medium text-gray-900">Analytics</span>
                </a>
  
                <a href="#" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <Cursor_arrow_rays class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                  <span class="ml-3 text-base font-medium text-gray-900">Engagement</span>
                </a>
  
                <a href="#" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <Shield_check class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                  <span class="ml-3 text-base font-medium text-gray-900">Security</span>
                </a>
  
                <a href="#" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <Squares_2x2 class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                  <span class="ml-3 text-base font-medium text-gray-900">Integrations</span>
                </a>
  
                <a href="#" class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                  <Arrow_path class="h-6 w-6 flex-shrink-0 text-indigo-600"/>
                  <span class="ml-3 text-base font-medium text-gray-900">Automations</span>
                </a>
              </nav>
            </div>
          </div>
          <div class="space-y-6 py-6 px-5">
            <div class="grid grid-cols-2 gap-y-4 gap-x-8">
              <a href="/pricing" class="text-base font-medium text-gray-900 hover:text-gray-700">Pricing</a>
              <a href="/docs" class="text-base font-medium text-gray-900 hover:text-gray-700">Docs</a>
              <a href="/help" class="text-base font-medium text-gray-900 hover:text-gray-700">Help Center</a>
              <a href="/guides" class="text-base font-medium text-gray-900 hover:text-gray-700">Guides</a>
              <a href="/events" class="text-base font-medium text-gray-900 hover:text-gray-700">Events</a>
              <a href="/security" class="text-base font-medium text-gray-900 hover:text-gray-700">Security</a>
            </div>
            <div>
              <a 
                href={props.nav._['Sign Up'].href} 
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                  Sign up
              </a>
              <p 
                class="mt-6 text-center text-base font-medium text-gray-500">
                Existing customer?
                <a href={props.nav._['Sign In'].href} class="text-indigo-600 hover:text-indigo-500">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <main class="lg:relative">
      <div class="mx-auto w-full max-w-7xl pt-16 pb-20 text-center lg:py-48 lg:text-left">
        <div class="px-4 sm:px-8 lg:w-1/2 xl:pr-16">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span class="block xl:inline">Subscribe On </span>
            <span class="block xl:inline">Your Terms </span>
            <span class="block xl:inline text-indigo-600"> with Feed City </span>
          </h1>
          <p class="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
          <div class="mt-10 sm:flex sm:justify-center lg:justify-start">
            <div class="rounded-md shadow">
              <a href="#"
                class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg">Get started</a>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a href="#" class="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg">Live demo</a>
            </div>
          </div>
        </div>
      </div>
      <div class="relative h-64 w-full sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-1/2">
        <img 
          class="absolute inset-0 h-full w-full object-cover" 
          src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80" alt=""/>
      </div>
    </main>
  </div>)
}

export default PublicHero