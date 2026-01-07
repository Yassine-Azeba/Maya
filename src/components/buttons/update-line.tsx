'use client'
import React, { useState } from "react"
import UpdateLineForm from "../forms/update-line"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"

interface UpdateLineButtonProps {
    lineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    children : React.ReactNode
}
export default function UpdateLineButton({lineId,lines,children}:UpdateLineButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Update Line</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Update Line</DialogTitle>
                    </DialogHeader>
                    <UpdateLineForm lineId={lineId} lines={lines} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}