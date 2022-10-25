import { JSX,  } from 'preact';
import {useState, useRef, useEffect} from 'preact/hooks'
import outlineHeroIncons from '../components/heroicons/outline.tsx'
import solidHeroIncons from '../components/heroicons/solid.tsx'

export function Menu (){

    const solidEntries :[string, JSX.Element][] = Object.entries(solidHeroIncons)
    const outlineEntries :[string, JSX.Element][] = Object.entries(outlineHeroIncons)

    // const ref = useRef(null)
    const [elemHovered, setElemHovered]  = useState(0)
    const [showOutline, setShowOutline]  = useState(true)

    const onClick = ()=>{ setShowOutline(!showOutline) }
    const showCaption = (i:number)=>()=>{ setElemHovered(i) }
    
    // const showCaption = useEffect(()=>{
    //     const elem = ref.current
    //     if(elem){
    //         elem.style.setProperty('--caption', elemHovered)
    //     }
    // },[elemHovered])
    
    return (
        <div class='container  mx-auto px-20 my-40 max-w-lg'>
            <div class="flex flex-row justify-center">
                <h1 class='flex mb-10 text-5xl'>Hero Icons</h1>
            </div>
            <div class="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-15 gap-8">
                { outlineEntries.map(([name, outlineComp], i)=>{
                    return (
                        <div class="flex flex-col flex-auto">
                            <div class={`${showOutline ? '': 'hidden'} h-8 w-8 hover:text-blue-600`}
                                onClick={onClick} 
                                onMouseOver={showCaption(i)}
                                >
                                {outlineComp } 
                            </div>
                            <div class={`${showOutline ? 'hidden': ''} h-8 w-8 hover:text-blue-600`}
                                onClick={onClick} 
                                onMouseOver={showCaption(i)}
                                > 
                                {solidEntries[i][1]}
                            </div>
                            {/* text-white hover:text-black */}
                            <p class={`${i === elemHovered ? 'text-base' : 'text-white'}`}
                                onMouseOver={showCaption(i)}
                            > {name} </p>
                        </div>)
                })}
            </div>
        </div>
    )
} 

export default Menu