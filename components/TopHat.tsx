import { ComponentChildren, createContext } from "preact";
import { useEffect } from 'preact/hooks'
import {Head} from '$fresh/runtime.ts'

type Values<Type> = Type[keyof Type];
type HeadTags = 'title' | 'style' | 'meta' | 'base' | 'link'  | 'script' | 'noscript'

interface TopHatProps  {
    icon: string | Record<string, string>[]
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

const addElementList = (type: HeadTags, data: (string | Record<string, string>)[])=>{
    data.forEach(d => { addElement(type, d) });
}

const addElement = (type:HeadTags  , data: Values<Omit<TopHatProps, 'children'>>) =>
    document.getElementsByTagName('head')[0].appendChild(
        typeof data ==='string' 
            ? (()=>{
                const el = document.createElement(type)
                el.innerHTML = data
                return el
            })()
            : Object.entries(data)
                .reduce((elm, [key, val])=>{
                    elm.setAttribute(key, String(val))
                    return elm
                },document.createElement(type))
    )

export function TopHat(props: Partial<TopHatProps>){
    return <></>
}

export function TopHatBlack(props: Partial<TopHatProps> & {title: string}, children: unknown[]){
    return <Head>
            <title>{props.title}</title>
            {props.meta && props.meta.map(m => <meta {...m} />)}
            {props.description && <meta name="description" content={props.description} />}
            {props.keywords && <meta name="keywords" content={props.keywords} />}
            {props.canonical && <meta name="canonical" content={props.canonical} />}
            {props.icon && typeof props.icon ==='string' && <link rel="icon" href={props.icon} />}
            {props.icon && typeof props.icon !=='string' && props.icon.map(i => <link {...i} />)}
            { props.og && Object.entries(props.og)
                    .map(([key, val])=><meta property={`og:${key}`} content={val} /> ) 
            }
            {props.children}
        </Head>
}

export default TopHat