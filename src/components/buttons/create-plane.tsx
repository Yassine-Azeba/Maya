'use client'
import React, { useState } from "react"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"
import CreatePlaneForm from "../forms/create-plane"

interface CreatePlaneButtonProps {
    userId : string,
    children : React.ReactNode
}
export default function CreatePlaneButton({userId,children}:CreatePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
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