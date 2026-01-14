'use client'
import { Dispatch, SetStateAction } from "react"
import {Folder,Folders,Archive,Inbox,Layers,LayoutGrid,Boxes,Package,Briefcase,
Settings,Sliders,Wrench,Drill,ToolCase,Gauge,Cpu,Database,HardDrive,
Cloud,CloudCog,CloudUpload,CloudDownload,Wifi,Network,
Book,Notebook,StickyNote,FileText,Clipboard,CheckSquare,ListTodo,Target,
Rocket,Lightbulb,Sparkles,Flame,TrendingUp,Compass,Map,
Calendar,Clock,Star,Heart,Shield,Lock} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { size } from "zod"


interface IconSelectorProps {
    icon : string,
    setIcon : Dispatch<SetStateAction<string>>
}
const Icons = [
    {label: "Folder", item: Folder},{label: "Folders", item: Folders},{label: "Archive", item: Archive},{label: "Inbox", item: Inbox},{label: "Layers", item: Layers},{label: "LayoutGrid", item: LayoutGrid},{label: "Boxes", item: Boxes},{label: "Package", item: Package},{label: "Briefcase", item: Briefcase},{label: "Settings", item: Settings},
    {label: "Sliders", item: Sliders},{label: "Wrench", item: Wrench},{label: "Drill", item: Drill},{label: "ToolCase", item: ToolCase},{label: "Gauge", item: Gauge},{label: "Cpu", item: Cpu},{label: "Database", item: Database},{label: "HardDrive", item: HardDrive},{label: "Cloud", item: Cloud},{label: "CloudCog", item: CloudCog},
    {label: "CloudUpload", item: CloudUpload},{label: "CloudDownload", item: CloudDownload},{label: "Wifi", item: Wifi},{label: "Network", item: Network},{label: "Book", item: Book},{label: "Notebook", item: Notebook},{label: "StickyNote", item: StickyNote},{label: "FileText", item: FileText},{label: "Clipboard", item: Clipboard},{label: "CheckSquare", item: CheckSquare},
    {label: "ListTodo", item: ListTodo},{label: "Target", item: Target},{label: "Rocket", item: Rocket},{label: "Lightbulb", item: Lightbulb},{label: "Sparkles", item: Sparkles},{label: "Flame", item: Flame},{label: "TrendingUp", item: TrendingUp},{label: "Compass", item: Compass},{label: "Map", item: Map},{label: "Calendar", item: Calendar},
    {label: "Clock", item: Clock},{label: "Star", item: Star},{label: "Heart", item: Heart},{label: "Shield", item: Shield},{label: "Lock", item: Lock}
]
export default function IconSelector({icon,setIcon}:IconSelectorProps){
    return(
        <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an Icon"/>
            </SelectTrigger>
            <SelectContent>
                {Icons.map(icon => <SelectItem key={icon.label} value={icon.label} className="flex items-center gap-2"><icon.item />{icon.label}</SelectItem>)}
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
    const planeIcon = Icons.filter(ic => ic.label === icon)[0]
    return(
        <planeIcon.item size={size} color={color}/>
    )
}