'use client'
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import UpdatePlaneForm from "@/components/forms/planes/update";

interface UpdatePlaneButtonProps {
    userEmail : string,
    plane : { planeId: string;
        name: string;
        description: string | null;
        icon: string;
        userId: string;
    },
    children : React.ReactNode
}
export default function UpdatePlaneButton({userEmail,plane,children}:UpdatePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Update Plane</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Update Plane</DialogTitle>
                    </DialogHeader>
                    <UpdatePlaneForm plane={plane} userEmail={userEmail} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
