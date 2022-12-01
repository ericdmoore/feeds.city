import type { Icon } from '../../types.ts'



interface FeatureItem{
  title: string
  subtitle: string
  icon: Icon
}

interface FeatureProps {
  h2: string
  tagline: string
  supportingTagline:string
  featureList: FeatureItem[]
}

const IconElement = (props: {icon: Icon})=>{
  if('src' in props.icon){
    return <img {...props.icon} />
  } else {
    return props.icon()
  }
}

function FeatureItemElement(props: FeatureItem){
  return (
  <div class="relative">
    <dt>
      <div class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
        <IconElement icon={props.icon}/>
      </div>
      <p class="ml-16 text-lg font-medium leading-6 text-gray-900">{props.title}</p>
    </dt>
    <dd class="mt-2 ml-16 text-base text-gray-500">{props.subtitle}</dd>
  </div>
  )
}


export function PublicFeatures(props:FeatureProps){
    return (
<section class="bg-white py-12">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    
    <div class="lg:text-center">
      <h2 class="text-lg font-semibold text-indigo-600">{props.h2}</h2>
      <p class="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">{props.tagline}</p>
      <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">{props.supportingTagline}</p>
    </div>

    <div class="mt-10">
      <dl class="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
        
        {
          props.featureList.map((featureItem) => {
            return <FeatureItemElement {...featureItem}/>
          })
        }

      </dl>
    </div>
  
  </div>
</section>)
}

export default PublicFeatures