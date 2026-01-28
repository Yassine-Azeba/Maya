'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeleteAttribut } from "@/db/queries/attributs"
import { CreateAttributForm, UpdateAttributForm } from "./attributs-forms"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface CreateAttributButtonProps {
    userId : string,
    planeId : string,
    children : React.ReactNode
}
export function CreateAttributButton({userId,planeId,children}:CreateAttributButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Create Attribut</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>New Attribut</DialogTitle>
                    </DialogHeader>
                    <CreateAttributForm userId={userId} planeId={planeId} setDialogOpen={setIsOpen} />
                </DialogPanel>
            </Dialog>
        </div>
    )
}

interface UpdateAttributButtonProps {
    attributToUpdate : {
        attributId: string;
        name: string;
        type: "Text" | "Number" | "Date" | "Email" | "Link" | "Phone" | "Line" | "Selection";
        plane: string;
        userId: string;
        selectionValues: string[] | null;
    },
    children : React.ReactNode
}
export function UpdateAttributButton({attributToUpdate,children}:UpdateAttributButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Update Attribut</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Update Attribut</DialogTitle>
                    </DialogHeader>
                    <UpdateAttributForm attributToUpdate={attributToUpdate} setDialogOpen={setIsOpen}/>
                </DialogPanel>
            </Dialog>
        </div>
    )
}

interface DeleteAttributButtonProps {
    attributId: string,
    children : React.ReactNode
}
export function DeleteAttributButton({attributId,children}:DeleteAttributButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    async function onSubmitDeleteAttribut(attributId : string) {
        setIsOpen(false)
        await toast.promise(DeleteAttribut({attributId:attributId}),{
            loading: "Loading ...",
            success: "Attribut deleted successfully.",
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
                <TooltipContent><p>Delete Attribut</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Delete Attribut</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this attribut ? All values for each line will be deleted too.</DialogDescription>
                    </DialogHeader>
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeleteAttribut(attributId)}>Delete</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}