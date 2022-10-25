import { JSX } from 'preact';
import {useState, useId, useRef, useEffect} from 'preact/hooks'
import outlineHeroIncons from '../components/heroicons/outline.tsx'
import solidHeroIncons from '../components/heroicons/solid.tsx'

export function Menu (){
    const solidEntries :[string, JSX.Element][] = Object.entries(solidHeroIncons)
    const outlineEntries :[string, JSX.Element][] = Object.entries(outlineHeroIncons)

    const captionRef = useRef(null as null | HTMLParagraphElement);  
    const [elemHovered, setElemHovered]  = useState(0)
    const [showOutline, setShowOutline]  = useState(true)
        
    const toggleOutlinesAndSolids = () => { setShowOutline(!showOutline) }
    const showCaption = (i:number) => () => { setElemHovered(i) }
    
    // const onHover = () => useEffect(()=>{
    //     if(captionRef.current) { captionRef.current.style.setProperty('color','black') }
    //     return ()=>{
    //         if(captionRef.current){ captionRef.current.style.setProperty('color', 'white')}
    //     }
    // },[captionRef])
        
    return (
        <div class='container  mx-auto px-20 my-40 max-w-lg'>
            <div class={`${showOutline? 'text-gray-300' : 'text-gray-800'} flex flex-row justify-center`}
                onClick={toggleOutlinesAndSolids} >
                <h1 class='flex mb-10 text-5xl'>Hero Icons</h1>
            </div>
            <div class="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-15 gap-8">
                { outlineEntries.map(([name, outlineComp], i)=>{
                    return (
                        <div key={i} class="flex flex-col flex-auto">
                            <div 
                                onMouseOver={showCaption(i)}
                                onTouchEnd={showCaption(i)}
                                class={`${showOutline ? '': 'hidden'} h-8 w-8 hover:text-blue-600`}
                                >
                                {outlineComp } 
                            </div>
                            <div onClick={toggleOutlinesAndSolids} 
                                onMouseOver={showCaption(i)}
                                onTouchEnd={showCaption(i)}
                                class={`${showOutline ? 'hidden': ''} h-8 w-8 hover:text-blue-600`}
                                > 
                                {solidEntries[i][1]}
                            </div>
                            <p ref={captionRef} class={`${i === elemHovered ? 'text-base' : 'text-white'}`}
                                onMouseOver={showCaption(i)}
                                onTouchEnd={showCaption(i)}
                            > {name} </p>
                        </div>)
                })}
            </div>
        </div>
    )
} 

export default Menu