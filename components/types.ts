// https://tailwindcss.com/docs/customizing-colors
// console.log([...document.getElementById('default-color-palette').nextSibling.nextSibling.nextSibling.children].map(node => `'${node.firstChild.firstChild.innerText}'`).join('| '))
export type Color = 
| 'Slate'
| 'Gray'
| 'Zinc'
| 'Neutral'
| 'Stone'
| 'Red'
| 'Orange'
| 'Amber'
| 'Yellow'
| 'Lime'
| 'Green'
| 'Emerald'
| 'Teal'
| 'Cyan'
| 'Sky'
| 'Blue'
| 'Indigo'
| 'Violet'
| 'Purple'
| 'Fuchsia'
| 'Pink'
| 'Rose'



interface IconSVG{
    svg: string
  }
  
  interface IconSrc{
    src: string
  }
  
export type Icon = IconSVG | IconSrc

export interface IconText{
    i: Icon
    text: string
}
  