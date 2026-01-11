'use client'
import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import CreatePlaneButton from "./plane/create/dialog"
import { HexagonBackground } from "./ui/shadcn-io/hexagon-background"
import { Brackets, CirclePlus, Component, Grid, LayersPlus, List, Minus, SearchIcon } from "lucide-react"
import Link from "next/link"

interface WorkspaceProps {
    userId : string,
    planes: {
        planeId: string;
        name: string;
        description: string | null;
        userId: string;
    }[];
}
export default function WorkspaceComponent({userId,planes}:WorkspaceProps){
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant={view==="grid"?"secondary":"ghost"} size={"sm"} className="flex items-center gap-2 text-xs" onClick={() => setView("grid")}><Grid size={12}/>Grid view</Button>
                    <Button variant={view==="list"?"secondary":"ghost"} size={"sm"} className="flex items-center gap-2 text-xs" onClick={() => setView("list")}><List size={12}/>List view</Button>
                    <CreatePlaneButton userId={userId}>
                        <Button variant={"outline"} size={"sm"} className="flex items-center text-xs"><CirclePlus />New Plane</Button>
                    </CreatePlaneButton>
                </div>
            </div>
            {(view==="grid")?
            <div className="grid grid-cols-4 gap-4 p-4">
                {(search!=="")?
                    filteredPlanes.map(plane => <GridPlaneItem key={plane.planeId} plane={plane}/>):
                    planes.map(plane => <GridPlaneItem key={plane.planeId} plane={plane}/>
                    )
                }
                <CreatePlaneButton userId={userId}>
                    <div className="w-full h-44 p-2 hover:p-0.5 border-dashed border rounded-md hover:scale-105 transition-all flex items-center justify-center text-muted-foreground">
                        <LayersPlus size={24}/>
                    </div>
                </CreatePlaneButton>
            </div>:<div></div>}
        </div>
    )
}

interface PlaneItem {
    plane : {
        planeId: string;
        name: string;
        description: string | null;
        userId: string;
    }
}
function GridPlaneItem({plane}:PlaneItem){
    return(
        <Link href={`/plane/${plane.name}`}>
            <div className="w-full h-44 p-2 hover:p-0.5 border rounded-md flex flex-col hover:scale-105 transition-all">
                <div className="w-full h-3/4 relative">
                    <HexagonBackground className="border absolute inset-0 rounded-sm w-full h-full flex items-end justify-start" hexagonSize={30}>
                        <div className="relative z-10 flex flex-col justify-end p-2 max-w-full">
                            <h1 className="text-sm truncate">{plane.name}</h1>
                            <h1 className="text-xs truncate">{plane.description}</h1>
                        </div>
                    </HexagonBackground>
                </div>
                <div className="w-full h-1/4 grid grid-cols-3 text-muted-foreground text-xs">
                    <div className="flex items-center justify-center gap-2"><Minus size={12} className="rotate-45" />30 lines</div>
                    <div className="flex items-center justify-center gap-2"><Component size={12} />12 views</div>
                    <div className="flex items-center justify-center gap-2"><Brackets size={12} />4 attributs</div>
                </div>
            </div>
        </Link>
    )
} 