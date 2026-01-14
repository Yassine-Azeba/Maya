'use client'
import React, { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import CreatePlaneForm from "@/data/forms/planes/create"

interface CreatePlaneButtonProps {
    userEmail : string,
    children : React.ReactNode
}
export default function CreatePlaneButton({userEmail,children}:CreatePlaneButtonProps){
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
                    <CreatePlaneForm userEmail={userEmail} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
