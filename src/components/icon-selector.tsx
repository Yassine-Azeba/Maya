'use client'
import { Dispatch, SetStateAction } from "react"
import {
    Binary,Mail,Link2,Smartphone,Minus,
    Calendar,Clock,Star,Heart,Shield,Lock,
    Cloud,CloudCog,CloudUpload,CloudDownload,Wifi,Network,
    Rocket,Lightbulb,Sparkles,Flame,TrendingUp,Compass,Map,
    Settings,Sliders,Wrench,Drill,ToolCase,Gauge,Cpu,Database,HardDrive,
    Folder,Folders,Archive,Inbox,Layers,LayoutGrid,Boxes,Package,Briefcase,
    Book,Notebook,StickyNote,FileText,Clipboard,CheckSquare,ListTodo,Target,TextInitial,Sigma,} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

const planeIcons = [
    {label: "Folder", item: Folder},{label: "Folders", item: Folders},{label: "Archive", item: Archive},{label: "Inbox", item: Inbox},{label: "Layers", item: Layers},{label: "LayoutGrid", item: LayoutGrid},{label: "Boxes", item: Boxes},{label: "Package", item: Package},{label: "Briefcase", item: Briefcase},{label: "Settings", item: Settings},
    {label: "Sliders", item: Sliders},{label: "Wrench", item: Wrench},{label: "Drill", item: Drill},{label: "ToolCase", item: ToolCase},{label: "Gauge", item: Gauge},{label: "Cpu", item: Cpu},{label: "Database", item: Database},{label: "HardDrive", item: HardDrive},{label: "Cloud", item: Cloud},{label: "CloudCog", item: CloudCog},
    {label: "CloudUpload", item: CloudUpload},{label: "CloudDownload", item: CloudDownload},{label: "Wifi", item: Wifi},{label: "Network", item: Network},{label: "Book", item: Book},{label: "Notebook", item: Notebook},{label: "StickyNote", item: StickyNote},{label: "FileText", item: FileText},{label: "Clipboard", item: Clipboard},{label: "CheckSquare", item: CheckSquare},
    {label: "ListTodo", item: ListTodo},{label: "Target", item: Target},{label: "Rocket", item: Rocket},{label: "Lightbulb", item: Lightbulb},{label: "Sparkles", item: Sparkles},{label: "Flame", item: Flame},{label: "TrendingUp", item: TrendingUp},{label: "Compass", item: Compass},{label: "Map", item: Map},{label: "Calendar", item: Calendar},
    {label: "Clock", item: Clock},{label: "Star", item: Star},{label: "Heart", item: Heart},{label: "Shield", item: Shield},{label: "Lock", item: Lock}
]
const customAttributIcons = [
    {label: "string", display : "Text", item: TextInitial},
    {label: "number", display : "Number", item: Sigma},
    {label: "date", display : "Date", item: Calendar},
    {label: "boolean", display : "Boolean", item: Binary},
    {label: "email", display : "Email", item: Mail},
    {label: "url", display : "Link (url)", item: Link2},
    {label: "phone", display : "Phone", item: Smartphone},
    {label: "line", display : "Line", item: Minus},
]

interface IconSelectorProps {
    icon : string,
    type : "plane" | "custom-attribut",
    setIcon : Dispatch<SetStateAction<string>>
}
export default function IconSelector({icon,type,setIcon}:IconSelectorProps){
    return(
        <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an Icon"/>
            </SelectTrigger>
            <SelectContent>
                {(type==="plane")?
                    planeIcons.map(icon => <SelectItem key={icon.label} value={icon.label} className="flex items-center gap-2"><icon.item />{icon.label}</SelectItem>):
                    customAttributIcons.map(icon => <SelectItem key={icon.label} value={icon.label} className="flex items-center gap-2"><icon.item />{icon.display}</SelectItem>)
                }
            </SelectContent>
        </Select>
    )
}

interface PlaneIconProps {
    icon : string
    size? : number,
    color? : string
}
export function PlaneIcon({icon,size,color}:PlaneIconProps){
    const planeIcon = planeIcons.filter(ic => ic.label === icon)[0]
    return(
        <planeIcon.item size={size} color={color}/>
    )
}

interface CustomAttributIconProps {
    icon : string
    size? : number,
    color? : string
}
export function CustomAttributIcon({icon,size,color}:PlaneIconProps){
    const customAttributIcon = customAttributIcons.filter(ic => ic.label === icon)[0]
    return(
        <customAttributIcon.item size={size} color={color}/>
    )
}