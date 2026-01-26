"use client"

import { Braces, Check, ChevronDown, FileChartColumn, Filter, SearchIcon, SquarePlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Checkbox } from "./animate-ui/components/radix/checkbox";
import CreateLineButton from "./dialogs/lines/create-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./animate-ui/components/radix/popover";
import { CustomAttributIcon } from "./icon-selector";
import { Separator } from "./ui/separator";


interface LineTableProps {
    user : {
        id: string;
        name: string | null;
        email: string | null;
    },
    plane : {
        planeId: string;
        name: string;
    },
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    attributs : {
        customAttributId: string;
        name: string;
        type: "string" | "number" | "boolean" | "date" | "email" | "url" | "phone" | "line" | null;
        icon: string;
        plane: string;
        line: string | null;
        userId: string;
        appliesToChildrens: boolean;
        requiredForChildrens: boolean;
        defaultValue: string | null;
    }[]
}
export default function LineTable({user,plane,lines,attributs}:LineTableProps){
    const [search,setSearch] = useState<string>("")
    const [selectedAttributs,setAttribut] = useState<string[]>(attributs.slice(0,3).map(v => v.customAttributId))
    
    const refs = useRef<Map<string, HTMLDivElement>>(new Map())
    const isSyncing = useRef(false)

    const onScroll = (sourceId: string) => {
        if (isSyncing.current) return;
        const source = refs.current.get(sourceId);
        if (!source) return;
        isSyncing.current = true;
        const { scrollLeft } = source;
        refs.current.forEach((el, id) => {
        if (id !== sourceId) {
            el.scrollLeft = scrollLeft;
        }
        });
        requestAnimationFrame(() => {
            isSyncing.current = false
        })
    }

    return(
        <div className="flex flex-col gap-2 py-2 px-4">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2 max-sm:hidden">
                    <Button variant={"outline"} size={"sm"} className="flex items-center gap-2"><Filter size={12}/>Filters <ChevronDown size={12}/></Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} size={"sm"} className="flex items-center gap-2"><Braces size={12}/>Attributs <ChevronDown size={12}/></Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col gap-2 w-full">
                                <h1>Attributs</h1>
                                <Separator />
                                {(attributs.length>0)?attributs.map(attribut => <div 
                                key={attribut.customAttributId} 
                                onClick={() => setAttribut(prev => 
                                    prev.includes(attribut.customAttributId)
                                        ? prev.filter(v => v!== attribut.customAttributId)
                                        : [...prev,attribut.customAttributId]
                                )}
                                className={`flex items-center justify-between gap-2 rounded-sm cursor-pointer hover:bg-muted ${selectedAttributs.includes(attribut.customAttributId)?"bg-muted":""} px-2 py-0.5`}>
                                    <div className="flex min-w-0 items-center gap-2">
                                        <CustomAttributIcon icon={attribut.icon} size={12}/>
                                        <h1 className="min-w-0 max-w-max truncate">{attribut.name}</h1>
                                    </div>
                                    <div className={`${selectedAttributs.includes(attribut.customAttributId)?"":"hidden"}`}>
                                        <Check size={12}/>
                                    </div>
                                </div>):<div>No attributs created.</div>}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-10" placeholder="Search..." type="search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                    <CreateLineButton user={user} plane={plane} lines={lines}>
                        <Button size={"sm"} className="flex items-center gap-2"><SquarePlus size={12}/>New Line</Button>
                    </CreateLineButton>
                </div>
            </div>
            {/* Table Header */}
            <div 
            ref={(el) => {
                if (el) refs.current.set("headrow", el);
                else refs.current.delete("headrow");
            }}
            onScroll={() => onScroll("headrow")}
            className="min-w-0 w-full max-w-full rounded-md bg-muted h-8 overflow-auto scrollbar-hide flex items-center gap-4 px-4">
                <Checkbox size={"sm"} className="bg-background/40"/>
                <div className="min-w-44 max-w-44 text-sm font-semibold"><h1>Name</h1></div>
                <div className="min-w-56 max-w-56 text-sm font-semibold"><h1>Description</h1></div>
                {selectedAttributs.map(col => {
                    const attribut = attributs.filter(a => a.customAttributId === col)[0]
                    return (<div key={col} className="min-w-44 max-w-44 flex text-sm font-semibold text-ellipsis items-center gap-1">
                        <div className="min-w-4"><CustomAttributIcon icon={attribut.icon} size={10}/></div>
                        <h1 className="truncate">{attribut.name}</h1>
                    </div>)
                })}
            </div>
            {/* Table Content */}
            <div>
                {(lines.length>0)?
                lines.map(line => 
                    <div 
                    key={line.lineId} 
                    ref={(el) => {
                        if (el) refs.current.set(line.lineId, el);
                        else refs.current.delete(line.lineId);
                    }}
                    onScroll={() => onScroll(line.lineId)}
                    className="min-w-0 w-full max-w-full rounded-md h-8 overflow-auto scrollbar-hide flex items-center gap-4 px-4">
                        <Checkbox size={"sm"} className="bg-background/40"/>
                        <div className="min-w-44 max-w-44 text-sm font-semibold"><h1>{line.name}</h1></div>
                        <div className="min-w-56 max-w-56 text-sm font-semibold"><h1>{line.description}</h1></div>
                        {selectedAttributs.map(col => {
                            const attribut = attributs.filter(a => a.customAttributId === col)[0]
                            return (<div key={col} className="min-w-44 max-w-44 flex text-sm font-semibold text-ellipsis items-center gap-1">
                                <div className="min-w-4"><CustomAttributIcon icon={attribut.icon} size={10}/></div>
                                <h1 className="truncate">{attribut.name}</h1>
                            </div>)
                        })}
                    </div>
                )
                :<></>}
            </div>
        </div>
    )
}