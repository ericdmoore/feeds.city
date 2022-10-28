import { JSX } from "preact";
import { Check_circle } from "./heroicons/outline.tsx";

interface SimplePricingProps {
    title:{
        h2: string
        p: string
    }
    lBox:{
        h3:string
        p:string
        dividerText:string
        greenCheckText: string[]
    },
    rBox:{
        top: string
        price:{amt:string; unit:string}
        clarification:{href:string, text: () => string | JSX.Element}
        ctaBtn:{href:string, text: ()=> string | JSX.Element} 
        teaser:{href:string, text: ()=> string | JSX.Element}
    }
}

export default function SimplePricing(props: Partial<SimplePricingProps>){
    const p = {
        title:{
            h2: 'Simple no-tricks pricing',
            p: `If you're not satisfied, contact us within the first 14 days and we'll send you a full refund.`,
            ...props.title
        },
        lBox:{
            h3: 'Lifetime Membership',
            p: 'Lorem ipsum dolor sit amet consect etur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.',
            dividerText: `What's included`,
            greenCheckText: ['Private forum access', 'Member resources', 'Entry to annual conference', 'Official member t-shirt'],
            ...props.lBox
        },
        rBox:{
            top: 'Pay once, own it forever',
            price:{amt:'$349', unit:'USD'},
            clarification:{href:'#', text: ()=> 'Learn about our membership policy'},
            ctaBtn:{href:'#', text: ()=> 'Get Access'},
            teaser:{href:'#', text: () => <> Get a free sample <span class="font-normal text-gray-500">(20MB)</span> </>},
        },
        ...props
    } as SimplePricingProps

    const GreenCheckText = (greenCheckText:string | JSX.Element) => <li class="flex items-start lg:col-span-1">
        <div class="flex-shrink-0">
            <Check_circle class="h-5 w-5 text-green-400"/>
        </div>
        <p class="ml-3 text-sm text-gray-700">{greenCheckText}</p>
    </li>


return (
<div class="bg-gray-100">
  <div class="pt-12 sm:pt-16 lg:pt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">{p.title.h2}</h2>
        <p class="mt-4 text-xl text-gray-600">{p.title.p}</p>
      </div>
    </div>
  </div>
  <div class="mt-8 bg-white pb-16 sm:mt-12 sm:pb-20 lg:pb-28">
    <div class="relative">
      <div class="absolute inset-0 h-1/2 bg-gray-100"></div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto max-w-lg overflow-hidden rounded-lg shadow-lg lg:flex lg:max-w-none">
          {/* lBox */}
          <div class="flex-1 bg-white px-6 py-8 lg:p-12">
            <h3 class="text-2xl font-bold text-gray-900 sm:text-3xl sm:tracking-tight">{p.lBox.h3}</h3>
            <p class="mt-6 text-base text-gray-500">{p.lBox.p}</p>
            <div class="mt-8">
              <div class="flex items-center">
                <h4 class="flex-shrink-0 bg-white pr-4 text-base font-semibold text-indigo-600">{p.lBox.dividerText}</h4>
                <div class="flex-1 border-t-2 border-gray-200"></div>
              </div>
              <ul role="list" class="mt-8 space-y-5 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5 lg:space-y-0">
                {p.lBox.greenCheckText.map( t => GreenCheckText(t))}
              </ul>
            </div>
          </div>
        
          {/* rBox */}
          <div class="bg-gray-50 py-8 px-6 text-center lg:flex lg:flex-shrink-0 lg:flex-col lg:justify-center lg:p-12">
            <p class="text-lg font-medium leading-6 text-gray-900">{p.rBox.top}</p>
            <div class="mt-4 flex items-center justify-center text-5xl font-bold tracking-tight text-gray-900">
              <span>{p.rBox.price.amt}</span>
              <span class="ml-3 text-xl font-medium tracking-normal text-gray-500">{p.rBox.price.unit}</span>
            </div>
            <p class="mt-4 text-sm">
              <a href={p.rBox.clarification.href} 
                class="font-medium text-gray-500 underline">
                    {p.rBox.clarification.text()}
              </a>
            </p>
            <div class="mt-6">
              <div class="rounded-md shadow">
                <a  href={p.rBox.ctaBtn.href} 
                    class="flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-5 py-3 text-base font-medium text-white hover:bg-gray-900">
                        {p.rBox.ctaBtn.text()}
                </a>
              </div>
            </div>
            <div class="mt-4 text-sm">
              <a href={p.rBox.teaser.href} class="font-medium text-gray-900"> {p.rBox.teaser.text()} </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>)
}