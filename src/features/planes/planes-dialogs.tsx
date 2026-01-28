'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeletePlane } from "@/db/queries/planes"
import { CreatePlaneForm, UpdatePlaneForm } from "./planes-forms"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface CreatePlaneButtonProps {
    userId : string,
    children : React.ReactNode
}
export function CreatePlaneButton({userId,children}:CreatePlaneButtonProps){
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

interface UpdatePlaneButtonProps {
    planeToUpdate : {
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        userId: string;
    },
    children : React.ReactNode
}
export function UpdatePlaneButton({planeToUpdate,children}:UpdatePlaneButtonProps){
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
                    <UpdatePlaneForm planeToUpdate={planeToUpdate} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}

interface DeletePlaneButtonProps {
    planeId: string,
    children : React.ReactNode
}
export function DeletePlaneButton({planeId,children}:DeletePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    async function onSubmitDeletePlane(planeId : string) {
        setIsOpen(false)
        await toast.promise(DeletePlane({planeId:planeId}),{
            loading: "Loading ...",
            success: "Plane deleted successfully.",
            error: (data) => `${data.message}`
        })
        router.push('/workspace')
    }
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Delete Plane</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Delete Plane</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this plane ? All children items (lines, views, tools) will be deleted too.</DialogDescription>
                    </DialogHeader>
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeletePlane(planeId)}>Delete</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}