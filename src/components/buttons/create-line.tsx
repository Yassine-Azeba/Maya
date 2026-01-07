'use client'
import React, { useState } from "react"
import CreateLineForm from "../forms/create-line"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"

interface CreateLineButtonProps {
    planeId : string,
    userId : string,
    children : React.ReactNode,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[] | undefined
}
export default function CreateLineButton({planeId,userId,lines,children}:CreateLineButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Create Line</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>New Line</DialogTitle>
                    </DialogHeader>
                    <CreateLineForm userId={userId} planeId={planeId} lines={lines} setIsOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}