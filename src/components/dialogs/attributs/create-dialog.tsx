'use client'
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import CreateCustomAttributForm from "@/components/forms/custom-attributs/create";

interface CreateCustomAttributsButtonProps {
    userEmail : string,
    planeId : string,
    lineId? : string,
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
export default function CreateCustomAttributsButton({userEmail,planeId,lines,children}:CreateCustomAttributsButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Create Custom Attributs</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>New Attribut</DialogTitle>
                    </DialogHeader>
                    <CreateCustomAttributForm userEmail={userEmail} planeId={planeId} lines={lines} />
                </DialogPanel>
            </Dialog>
        </div>
    )
}
