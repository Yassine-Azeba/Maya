'use client'
import React, { useState } from "react"
import UpdatePlaneForm from "../forms/update-plane"
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
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
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