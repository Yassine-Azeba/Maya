'use client'
import React, { useState } from "react"
import UpdatePlaneForm from "../forms/update-plane"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"
interface UpdatePlaneButtonProps {
    plane : {
        planeId: string,
        name : string,
        description : string | null,
        userId : string
    },
    descriptionOnly? : boolean,
    children : React.ReactNode
}
export default function UpdatePlaneButton({plane,descriptionOnly,children}:UpdatePlaneButtonProps){
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
                    <UpdatePlaneForm plane={plane} descriptionOnly={descriptionOnly} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}