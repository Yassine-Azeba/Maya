'use client'
import React, { useState } from "react"
import UpdateLineForm from "../forms/update-line"
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
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
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