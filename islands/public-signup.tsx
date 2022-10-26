// deno-lint-ignore-file require-await no-explicit-any
import {JSX} from 'preact'
import {useEffect, useState} from 'preact/hooks'

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/


interface SuccessProps{
  display: boolean | Error
  msg: string
  shutClose : ()=>void
}



function SuccessfulConfirm(props: SuccessProps){
return (
<div class={`${props.display ? '' : 'hidden' } rounded-md bg-green-50 p-4`}>
  <div class="flex">
    <div class="flex-shrink-0">
      {/* <!-- Heroicon name: mini/check-circle --> */}
      <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm font-medium text-green-800">{props.msg}</p>
    </div>
    <div class="ml-auto pl-3">
      <div class="-mx-1.5 -my-1.5">
        <button type="button" 
        onClick={()=>{props.shutClose()}}
        class="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50">
          <span class="sr-only">Dismiss</span>
          {/* <!-- Heroicon name: mini/x-mark --> */}
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>)
}


interface FailureProps{
  display: boolean | Error
  msg: string
  shutClose : ()=>void
}
function FailureNotifucation(props: FailureProps){
  
  return (
    <div class={`${props.display ? '' : 'hidden' } rounded-md bg-red-50 p-4`}>
      <div class="flex">
        <div class="flex-shrink-0">
        {/* <!-- Heroicon name: mini/x-circle --> */}
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{props.msg}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button type="button" 
            onClick={()=>{props.shutClose()}}
            class="inline-flex rounded-md bg-red-100 p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-200">
              <span class="sr-only">Dismiss</span>
              {/* <!-- Heroicon name: mini/x-mark --> */}
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>)
}

export function SignUp() {
  
  const [email, setEmail] = useState('')
  const [shouldDisplayConfirmBox, setDisplayConfirmBox] = useState(false as (boolean | Error) )

  const onClick: JSX.GenericEventHandler<EventTarget>  = async (e) => {  
    e.preventDefault()
    console.log('clicked', {email})
    
    // clear
    setDisplayConfirmBox(true)
    setEmail('')
  }
  
  return (
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">

        <FailureNotifucation display={shouldDisplayConfirmBox} msg='Yikes - not sure about...Successfully uploaded' shutClose={()=>{setDisplayConfirmBox(false)}}/>

        <div class="rounded-lg bg-indigo-700 px-6 py-6 md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
          <div class="xl:w-0 xl:flex-1">
            <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">Request an Invite to Feeds.City</h2>
            <p class="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">New Invites Given Daily</p>
          </div>

          <div class="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
            <form class="sm:flex">
              <label htmlFor="email-address" class="sr-only"> Email address </label>
              <input
                required
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"                  
                class="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                value={email}
                placeholder="Enter your email"
                onfocusout={(e:any)=>{ e.preventDefault(); setEmail(String((e.target.value))); }}
              />
              <button
                type="submit"
                onClick={onClick}
                class="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
              >
                Request
              </button>
            </form>
            <p class="mt-3 text-sm text-indigo-200">
              We protect your data. Check out our {' '} <a href="#" class="font-medium text-white underline"> Privacy Policy. </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    )
  }
  
  export default SignUp