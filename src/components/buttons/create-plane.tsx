'use client'
import React, { useState } from "react"
import CreatePlaneForm from "../forms/create-plane"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"
interface CreatePlaneButtonProps {
    userId : string,
    children : React.ReactNode
}
export default function CreatePlaneButton({userId,children}:CreatePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Create Plane</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>New Plane</DialogTitle>
                    </DialogHeader>
                    <CreatePlaneForm userId={userId} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}