'use client'
import { useState } from "react"
import { Button } from "./ui/button"
import CreateLineButton from "./buttons/create-line"
import UpdateLineButton from "./buttons/update-line"
import { Edit, SquarePlus, Trash2 } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"
import DeleteLineButton from "./buttons/delete-line"

interface ListProps {
    userId : string,
    planeId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        user: string;
    }[] | undefined
}
export default function List({userId,planeId,lines}:ListProps){
    if(lines === undefined || lines.length === 0) return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant={"icon"}>
                    <SquarePlus />
                </EmptyMedia>
                <EmptyTitle>No line yet</EmptyTitle>
                <EmptyDescription>Create your first line.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <CreateLineButton planeId={planeId} userId={userId} lines={lines}>
                    <Button>Create line</Button>
                </CreateLineButton>
            </EmptyContent>
        </Empty>
    )
    const firstLine = lines.filter(line => line.parent === null)
    return (
        <div className="w-full flex flex-col gap-0.5">
            {firstLine.map(line => <ListItem margin={0} key={line.lineId} lineId={line.lineId} lines={lines} />)}
        </div>
    )
}

interface ListItemProps {
    lineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        user: string;
    }[],
    margin : number,
}
function ListItem({lineId,lines,margin}:ListItemProps){
    const line = lines.filter(line => line.lineId === lineId)[0]
    const childrens =  lines.filter(line => line.parent === lineId)
    const [isChildrenOpen,setChildrenOpen] = useState(false)
    return(
        <>
            <div className="flex items-center">
                <div className="flex items-center max-w-96">
                    {Array.from({length:margin}).map((_,i) => <span key={i} className="w-2"/>)}
                </div>
                <div onClick={() => setChildrenOpen(!isChildrenOpen)} className="w-full rounded-sm bg-muted py-1 px-4 flex items-center justify-between">
                    <h1 className="text-sm font-medium">{line.name}</h1>
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <h1 className="text-xs">{childrens.length} Childrens</h1>
                        <UpdateLineButton lineId={line.lineId} lines={lines}><Edit size={12}/></UpdateLineButton>
                        <DeleteLineButton lineId={line.lineId}><Trash2 size={12} color="red" className="opacity-50"/></DeleteLineButton>
                        {margin}
                    </div>
                </div>
            </div>
            {isChildrenOpen?childrens.map(child => <ListItem margin={margin+1} key={child.lineId} lineId={child.lineId} lines={lines} />):<></>}
        </>
    )
}