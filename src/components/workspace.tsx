'use client'
import Link from "next/link"
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { PlaneIcon } from "./icon-selector"
import CreatePlaneButton from "./dialogs/planes/create-dialog"
import { Brackets, CirclePlus, Component, Grid, LayersPlus, List, Minus, SearchIcon } from "lucide-react"

interface WorkspaceProps {
    userEmail : string,
    planes: {
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        lineCount: number;
    }[]
}
export default function WorkspaceComponent({userEmail,planes}:WorkspaceProps){
    const [view,setView] = useState<"list"|"grid">("grid")
    const [search,setSearch] = useState<string>("")
    const filteredPlanes = planes.filter(plane => plane.name.includes(search))
    return(
        <div className="h-full w-full flex flex-col gap-2">
            <div className="w-full flex items-center justify-between px-4 py-2 border-b">
                <div className="flex items-center  gap-2">
                    <div className="relative w-full max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-10"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant={view==="grid"?"secondary":"ghost"} size={"sm"} className="flex items-center gap-2 text-xs" onClick={() => setView("grid")}><Grid size={12}/>Grid view</Button>
                    <Button variant={view==="list"?"secondary":"ghost"} size={"sm"} className="flex items-center gap-2 text-xs" onClick={() => setView("list")}><List size={12}/>List view</Button>
                    <CreatePlaneButton userEmail={userEmail}>
                        <Button variant={"outline"} size={"sm"} className="flex items-center text-xs"><CirclePlus />New Plane</Button>
                    </CreatePlaneButton>
                </div>
            </div>
            {(view==="grid")?
            <div className="grid grid-cols-4 gap-4 p-4 max-sm:grid-cols-1">
                {(search!=="")?
                    filteredPlanes.map(plane => <GridPlaneItem key={plane.planeId} plane={plane}/>):
                    planes.map(plane => <GridPlaneItem key={plane.planeId} plane={plane}/>
                    )
                }
                <CreatePlaneButton userEmail={userEmail}>
                    <div className="w-full h-44 p-2 hover:p-0.5 border border-dashed hover:border-solid rounded-md hover:scale-105 transition-all flex items-center justify-center">
                        <LayersPlus size={24}/>
                    </div>
                </CreatePlaneButton>
            </div>:<div className="flex flex-col gap-2 p-4">
                {(search!=="")?
                    filteredPlanes.map(plane => <ListPlaneItem key={plane.planeId} plane={plane}/>):
                    planes.map(plane => <ListPlaneItem key={plane.planeId} plane={plane}/>
                    )
                }
                <CreatePlaneButton userEmail={userEmail}>
                    <div className="w-full flex items-center justify-center rounded-sm border border-dashed hover:border-solid h-14 hover:p-0.5 hover:scale-y-105 transition-all hover:bg-muted">
                        <LayersPlus size={24}/>
                    </div>
                </CreatePlaneButton>
            </div>}
        </div>
    )
}

interface PlaneItem {
    plane: {
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        lineCount: number;
    }
}
function GridPlaneItem({plane}:PlaneItem){
    return(
        <Link href={`/planes/${plane.name}`}>
            <div className="w-full h-44 p-2 hover:p-0.5 border rounded-md flex flex-col hover:scale-105 transition-all">
                <div className="w-full h-3/4">
                    <div className="border bg-muted rounded-sm w-full h-full flex items-end justify-start">
                        <div className=" flex flex-col gap-1 justify-end p-2 max-w-full">
                            <PlaneIcon icon={plane.icon} size={12}/>
                            <h1 className="text-sm truncate">{plane.name}</h1>
                            <h1 className="text-xs truncate text-muted-foreground">{plane.description}</h1>
                        </div>
                    </div>
                </div>
                <div className="w-full h-1/4 grid grid-cols-3 text-muted-foreground text-xs">
                    <div className="flex items-center justify-center gap-2"><Minus size={12} className="rotate-45" />{plane.lineCount} lines</div>
                    <div className="flex items-center justify-center gap-2"><Component size={12} />12 views</div>
                    <div className="flex items-center justify-center gap-2"><Brackets size={12} />4 attributs</div>
                </div>
            </div>
        </Link>
    )
}
function ListPlaneItem({plane}:PlaneItem){
    return(
        <Link href={`/planes/${plane.name}`}>
            <div className="w-full flex rounded-sm border h-14 hover:scale-y-105 transition-all hover:bg-muted p-2">
                <div className="w-1/2 max-w-full flex items-center gap-4 pl-2">
                    <div className="p-2 rounded-full bg-muted hover:bg-accent">
                        <PlaneIcon icon={plane.icon} size={12}/>
                    </div>
                    <div className="flex flex-col gap-1 h-full items-start max-w-full">
                        <h1 className="text-sm truncate">{plane.name}</h1>
                        <h1 className="text-xs truncate text-muted-foreground max-w-full">{plane.description?plane.description:"-"}</h1>
                    </div>
                </div>
                <Separator orientation="vertical" className="max-sm:hidden"/>
                <div className="w-1/6 flex items-center justify-center gap-2 text-muted-foreground text-xs max-sm:hidden"><Minus size={12} className="rotate-45" />{plane.lineCount} lines</div>
                <Separator orientation="vertical" className="max-sm:hidden"/>
                <div className="w-1/6 flex items-center justify-center gap-2 text-muted-foreground text-xs max-sm:hidden"><Component size={12} />12 views</div>
                <Separator orientation="vertical" className="max-sm:hidden"/>
                <div className="w-1/6 flex items-center justify-center gap-2 text-muted-foreground text-xs max-sm:hidden"><Brackets size={12} />4 attributs</div>
            </div>
        </Link>
    )
}