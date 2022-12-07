import type {Color} from '../types.ts'
import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { X_circle, X_mark, Check_circle, Cloud_arrow_up, Ellipsis_horizontal} from '../components/heroicons/outline.tsx'


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

interface NotificaitonProps {
  display: boolean | HiddenPendingHappyError
  color: Color
  msg: string;
  shutClose: () => void;
}


interface SingUpProps {
  token: string;
  exp: number
}

type HiddenPendingHappyError = 0 | 1 | 2 | Error;
// 0 = Hidden
// 1 = pending
// 2 - Happy
// Error - Error 


function NotificationSuccess(props: NotificaitonProps) {
  // green
  return (
    <div class={`${props.display === 2 ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}>
      <div class="flex">
        <div class="flex-shrink-0">
          <Check_circle class={`h-5 w-5 text-${props.color}-400`}/>
        </div>
        <div class="ml-3">
          <p class={`text-sm font-medium text-${props.color}-800`}>{props.msg}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={props.shutClose}
              class={`inline-flex rounded-md bg-${props.color}-50 p-1.5 text-${props.color}-500 hover:bg-${props.color}-100 focus:outline-none focus:ring-2 focus:ring-${props.color}-600 focus:ring-offset-2 focus:ring-offset-${props.color}-50`}
            >
              <span class="sr-only">Dismiss</span>
              <X_mark class="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationFailure(props: NotificaitonProps) {
  // red
  return (
    <div class={`${props.display instanceof Error ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}>
      <div class="flex">
        <div class="flex-shrink-0">
          <X_circle class={`h-5 w-5 text-${props.color}-400`}/>
        </div>
        <div class="ml-3">
          <p class={`text-sm font-medium text-${props.color}-800`}>{props.msg}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={ props.shutClose }
              class={`inline-flex rounded-md bg-${props.color}-100 p-1.5 text-${props.color}-500 hover:bg-${props.color}-200 focus:outline-none focus:ring-2 focus:ring-${props.color}-600 focus:ring-offset-2 focus:ring-offset-${props.color}-200`}
            >
              <span class="sr-only">Dismiss</span>
              <X_mark class="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationPending(props: NotificaitonProps) {
  return (
    <div class={`${props.display ===1 ? "" : "hidden"} rounded-md bg-${props.color}-50 p-4`}>
      <div class="flex">
        <div class="flex-shrink-0">
          <Cloud_arrow_up class={`h-5 w-5 text-${props.color}-400`}/>
        </div>
        <div class="ml-3">
          <p class={`text-sm font-medium text-${props.color}-800`}>{props.msg}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={props.shutClose}
              class={`inline-flex rounded-md bg-${props.color}-100 p-1.5 text-${props.color}-500 hover:bg-${props.color}-200 focus:outline-none focus:ring-2 focus:ring-${props.color}-600 focus:ring-offset-2 focus:ring-offset-${props.color}-200`}
            >
              <span class="sr-only">Dismiss</span>
              <X_mark class="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



export function SignUp(props: Partial<SingUpProps>) {
  const [email, setEmail] = useState("");
  const [pendingMessage, setPendingMessage] = useState("...sending");
  const [shouldDisplayConfirmBox, setDisplayConfirmBox] = useState( 0 as HiddenPendingHappyError);

  const expMS = new Date(props.exp! * 1000).getTime()
  const nowMS = new Date().getTime()

  useEffect(() => {
    setTimeout(() => {
      setPendingMessage('The session has timeed out. Please Refresh The page to submit.')
      setDisplayConfirmBox(1)
    }, expMS - nowMS)
  })

  const submitEmail = async (email: string, token?: string) => {
    const u = new URL(window.location.href)
    u.searchParams.append('token', token ?? 'TOKEN_NOT_PROVIDED' )
    u.searchParams.append('email', encodeURIComponent(email))
    
    const res = await fetch(u, {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.json().catch((er) => ({_error: er}))
  }

  const onClick: JSX.GenericEventHandler<EventTarget> = async (e) => {
    e.preventDefault();    
    setDisplayConfirmBox(1)
    const resp = await submitEmail(email, props.token)
    if('_error' in resp){
      setDisplayConfirmBox(resp.error);
    }else{
      setDisplayConfirmBox(2)
    }
    setEmail(""); // clear out input box
  };

  // const handleEnter: JSX.KeyboardEventHandler<HTMLInputElement> = (e)=>{
  //   e.preventDefault();
  //   if(e.charCode === 13) {
  //     e.preventDefault();
  //     const t  = e.target as HTMLInputElement;
  //     setEmail(String(t.value));
  //   }
  // }

  const setEmailForAnyChange: JSX.GenericEventHandler<HTMLInputElement> = (e)=>{
    e.preventDefault();
    setEmail(String((e.target as HTMLInputElement).value));
  }

  return (
    <section class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        <NotificationPending
          display={shouldDisplayConfirmBox}
          color="gray"
          msg={pendingMessage}
          shutClose={() => setDisplayConfirmBox(0) }
        />
        <NotificationSuccess
          display={shouldDisplayConfirmBox}
          color='green'
          msg="Request Sent!"
          shutClose={() => setDisplayConfirmBox(0) }
        />
        <NotificationFailure
          display={shouldDisplayConfirmBox}
          color='red'
          msg="Hmm.... Something Went wrong, Please try again, in 10 minutes"
          shutClose={() => setDisplayConfirmBox(0) }
        />

        <div class="rounded-lg bg-indigo-700 px-6 py-6 md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
          <div class="xl:w-0 xl:flex-1">
            <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Request an Invite to Feeds.City 
            </h2>
            <p class="mt-3 max-w-3xl text-lg leading-6 text-indigo-200">
              New Invites Given Daily
            </p>
          </div>

          <div class="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
            <form class="sm:flex">
              <label htmlFor="email-address" class="sr-only">
                Email address
              </label>
              <input
                required
                id="email-address"
                name="email-address"
                type="email"
                autoComplete="email"
                value={email}
                placeholder="Enter your email"
                class="w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700"
                onInput={setEmailForAnyChange}
                onfocusout={setEmailForAnyChange}
              />
              <button
                type="submit"
                onClick={onClick}
                class="mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700 sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0"
              >
                {
                  shouldDisplayConfirmBox === 1 
                    ? <Ellipsis_horizontal class=''/>
                    : <p>Request</p> 
                }
              </button>
            </form>
            <p class="mt-3 text-sm text-indigo-200">
              We protect your data. Check out our{"   "}
              <a href="#" class="font-medium text-white underline">
                Privacy Policy.
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
