'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeleteCustomAttribut } from "@/data/delete/custom-attributs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface DeleteCustomAttributProps {
    attributId: string,
    children : React.ReactNode
}
export default function DeleteCustomAttributButton({attributId,children}:DeleteCustomAttributProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    async function onSubmitDeletePlane(attributId : string) {
        setIsOpen(false)
        await toast.promise(DeleteCustomAttribut({attributId:attributId}),{
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
                        <DialogDescription>Are you sure you want to delete this attribut ? All values for each lines will be deleted.</DialogDescription>
                    </DialogHeader>
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeletePlane(attributId)}>Delete</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
