'use client'
import { Dispatch, SetStateAction } from "react"
import { Mail,Link2,Smartphone,Minus,Calendar,TextInitial,Sigma,Brackets } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AttributIcons : {label : "Text"|"Number"|"Date"|"Email"|"Link"|"Phone"|"Line"|"Selection", item : any}[] = [
    {label: "Text", item: TextInitial},
    {label: "Number", item: Sigma},
    {label: "Date", item: Calendar},
    {label: "Email", item: Mail},
    {label: "Link", item: Link2},
    {label: "Phone", item: Smartphone},
    {label: "Line", item: Minus},
    {label: "Selection", item: Brackets},
]

interface AttributIconSelectorProps {
    type : "Text" | "Number" | "Date" | "Email" | "Link" | "Phone" | "Line" | "Selection",
    setType : Dispatch<SetStateAction<"Text"|"Number"|"Date"|"Email"|"Link"|"Phone"|"Line"|"Selection">>
}
export default function AttributIconSelector({type,setType}:AttributIconSelectorProps){
    return(
        <Select value={type}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an icon"/>
            </SelectTrigger>
            <SelectContent>
                {AttributIcons.map(i => <SelectItem key={i.label} value={i.label} onSelect={() => setType(i.label)} className="flex items-center gap-2"><i.item />{i.label}</SelectItem>)}
            </SelectContent>
        </Select>
    )
}