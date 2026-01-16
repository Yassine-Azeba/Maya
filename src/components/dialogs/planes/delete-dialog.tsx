'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeletePlane } from "@/data/delete/planes"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"

interface DeletePlaneButtonProps {
    plane : {
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        userId: string;
    }
    children : React.ReactNode
}
export default function DeletePlaneButton({plane,children}:DeletePlaneButtonProps){
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
                    <Button variant={"destructive"} size={"sm"} onClick={() => onSubmitDeletePlane(plane.planeId)}>Delete plane</Button>
                </DialogPanel>
            </Dialog>
        </div>
    )
}
