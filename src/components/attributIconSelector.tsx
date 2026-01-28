'use client'
import { Dispatch, SetStateAction } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {Binary,Mail,Link2,Smartphone,Minus,Calendar,TextInitial,Sigma,Brackets,} from "lucide-react"

const attributIcons : {label : "Text"|"Number"|"Date"|"Email"|"Link"|"Phone"|"Line"|"Selection", icon : any}[] = [
    {label : "Text", icon : TextInitial},
    {label : "Number", icon : Sigma},
    {label : "Date", icon : Calendar},
    {label : "Email", icon : Mail},
    {label : "Link", icon : Link2},
    {label : "Phone", icon : Smartphone},
    {label : "Line", icon : Minus},
    {label : "Selection", icon : Brackets},
]

interface AttributIconSelectorProps {
    icon : string,
    setIcon : Dispatch<SetStateAction<"Text" | "Number" | "Date" | "Email" | "Phone" | "Line" | "Selection" | "Link">>
}
export default function AttributIconSelector({icon,setIcon}:AttributIconSelectorProps){
    return(
        <Select value={icon}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an icon"/>
            </SelectTrigger>
            <SelectContent>
                {attributIcons.map(icon => 
                <SelectItem key={icon.label} value={icon.label}  onSelect={() => setIcon(icon.label)} className="flex items-center gap-2">
                    <icon.icon />
                    {icon.label}
                </SelectItem>)}
            </SelectContent>
        </Select>
    )
}

// interface CustomAttributIconProps {
//     icon : string
//     size? : number,
//     color? : string
// }
// export function CustomAttributIcon({icon,size,color}:CustomAttributIconProps){
//     const customAttributIcon = customAttributIcons.filter(ic => ic.stringItem === icon)[0]
//     return(
//         <customAttributIcon.item size={size} color={color}/>
//     )
// }