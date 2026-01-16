'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeleteLine } from "@/data/delete/lines"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface DeleteLineButtonProps {
    lineId: string,
    children : React.ReactNode
}
export default function DeleteLineButton({lineId,children}:DeleteLineButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    async function onSubmitDeletePlane(lineId : string) {
        setIsOpen(false)
        await toast.promise(DeleteLine({lineId:lineId}),{
            loading: "Loading ...",
            success: "Plane deleted successfully.",
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
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeletePlane(lineId)}>Delete plane</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
