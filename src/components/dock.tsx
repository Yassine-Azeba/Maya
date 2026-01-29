import { Download, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./animate-ui/components/radix/checkbox";
import { DeleteLinesButton, UpdateLineButton } from "@/features/lines/lines-dialogs";

interface DockProps {
    selectedLines: string[],
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[]
}
export default function Dock({selectedLines,lines}:DockProps){
    return(
        <div className={`${selectedLines.length>0?"opacity-100":"opacity-0"} transition-opacity duration-400 absolute w-full bottom-0 p-4 flex items-center justify-center`}>
            <div className={`${selectedLines.length>0?"":"hidden"} rounded-md bg-muted flex items-center gap-2 p-1 px-2`}>
                <Checkbox checked disabled/>
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-sm font-bold">x</h1>
                    <h1 className="text-xs text-muted-foreground">Line selected</h1>
                </div>
                <span className="min-w-48 max-sm:min-w-20"/>
                {selectedLines.length === 1?
                <UpdateLineButton lineToUpdate={lines.filter(l => l.lineId === selectedLines[0])[0]} lines={lines}>
                    <Button size={"icon-sm"} variant={"outline"}><Edit /></Button>
                </UpdateLineButton>:<></>}
                <DeleteLinesButton linesId={selectedLines}>
                    <Button size={"icon-sm"} variant={"destructive"}><Trash2 /></Button>
                </DeleteLinesButton>
                <Button size={"icon-sm"} className="bg-green-800"><Download /></Button>
            </div>
        </div>
    )
}