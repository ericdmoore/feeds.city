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
  