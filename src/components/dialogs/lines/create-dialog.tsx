'use client'
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import CreateLineForm from "@/components/forms/lines/create";

interface CreateLineButtonProps {
    user : {
        id: string;
        name: string | null;
        email: string | null
    }
    plane : {
        planeId : string,
        name : string
    },
    lines: {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    children : React.ReactNode
}
export default function CreateLineButton({user,plane,lines,children}:CreateLineButtonProps){
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
                    <CreateLineForm user={user} plane={plane} lines={lines} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
