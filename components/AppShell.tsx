import { ComponentChildren } from "preact";
import { useState, useLayoutEffect } from "preact/hooks";
import {AppShellMenuBar} from '../islands/AppShellMenuBar.tsx'

interface AppShellProps{
  children: ComponentChildren
}

// AppShell Should embed a menu bar comppnent and expose the props to callers
// 

export function AppShell(props: AppShellProps){

  const [isOpen, setIsOpen] = useState(false)
  const [listOfMenuItems] = useState([
    {href:'#/', name:'Feed'}, 
    {href:'#/team', name:'Team'}, 
    {href:'#/create', name:'Create'}, 
  ])
  // <MenuBar />
  // <UserMenu isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />

  const [isProfileOpen, setProfileIsOpen] = useState(false)



  return (
  <div class="min-h-full">
    <AppShellMenuBar activeSection='home' />
    {/* Current Page Dashboard */}
    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* <!-- Replace with your content --> */}
          <div class="px-4 py-8 sm:px-0">
            {props.children}
          </div>
          {/* <!-- /End replace --> */}
        </div>
      </main>
    </div>

  </div>)
}

export default AppShell