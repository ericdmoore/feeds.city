import { ComponentChildren, createContext } from "preact";
import {Head} from '$fresh/runtime.ts'

type LinkImageKeys = 'rel' | 'link' | 'sizes'

interface TopHatProps  {
    icon: string | Record<LinkImageKeys, string>[]
    title: string
    description: string
    keywords: string
    canonical: string
    meta: Record<string, string>[]
    og: Record<string, string>
    twitter: Record<string, string>
    styles: string[] 
    scripts: string[]
    children: ComponentChildren
    // jsonld: JSONish
}

const toMetaTag = (key:string, val:string, prefix?:string)=> <meta property={`${prefix}${key}`} content={val} />

export function TopHatBlack(props: Partial<TopHatProps> & {title: string}, children: unknown[]){
    return <Head>
            <title>{props.title}</title>
            {props.meta && props.meta.map(m => <meta {...m} />)}
            {props.description && <meta name="description" content={props.description} />}
            {props.keywords && <meta name="keywords" content={props.keywords} />}
            {props.canonical && <meta name="canonical" content={props.canonical} />}
            {props.icon && typeof props.icon ==='string' && <link rel="icon" href={props.icon} />}
            {props.icon && typeof props.icon !=='string' && props.icon.map(i => <link {...i} />)}
            {props.og && Object.entries(props.og).map(([key, val])=>toMetaTag(key, val, 'og:') )  }
            {props.children}
        </Head>
}

export default TopHatBlack