'use client'
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import UpdateLineForm from "@/components/forms/lines/update";

interface UpdateLineButtonProps {
    userEmail : string,
    lineToUpdate : string,
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
export default function UpdateLineButton({userEmail,lineToUpdate,lines,children}:UpdateLineButtonProps){
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
                    <UpdateLineForm userEmail={userEmail} lines={lines} lineToUpdate={lineToUpdate}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
