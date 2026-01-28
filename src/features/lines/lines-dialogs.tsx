'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeleteLine } from "@/db/queries/lines"
import { CreateLineForm, UpdateLineForm } from "./lines-forms"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface CreateLineButtonProps {
    userId : string,
    planeId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[]
    children : React.ReactNode
}
export function CreateLineButton({userId,planeId,lines,children}:CreateLineButtonProps){
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
                    <CreateLineForm userId={userId} planeId={planeId} lines={lines} setDialogOpen={setIsOpen} />
                </DialogPanel>
            </Dialog>
        </div>
    )
}

interface UpdateLineButtonProps {
    lineToUpdate : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    },
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[]
    children : React.ReactNode
}
export function UpdateLineButton({lineToUpdate,lines,children}:UpdateLineButtonProps){
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
                    <UpdateLineForm lineToUpdate={lineToUpdate} lines={lines} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}

interface DeleteLineButtonProps {
    lineId: string,
    children : React.ReactNode
}
export function DeleteLineButton({lineId,children}:DeleteLineButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    async function onSubmitDeleteLine(lineId : string) {
        setIsOpen(false)
        await toast.promise(DeleteLine({lineId:lineId}),{
            loading: "Loading ...",
            success: "Line deleted successfully.",
            error: (data) => `${data.message}`
        })
        router.refresh()
    }
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Delete Line</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Delete Line</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this line ? All children items (lines, views, tools) will be deleted too.</DialogDescription>
                    </DialogHeader>
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeleteLine(lineId)}>Delete</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}