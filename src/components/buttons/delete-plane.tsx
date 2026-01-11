'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { DeletePlane } from "@/data/planes"
import { Trash2, TriangleAlert } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { FlipButton, FlipButtonBack, FlipButtonFront } from "../animate-ui/components/buttons/flip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"

interface DeletePlaneButtonProps {
    planeId: string,
    children : React.ReactNode
}
export default function DeletePlaneButton({planeId,children}:DeletePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
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
                        <DialogDescription className="flex items-center gap-2"><TriangleAlert size={12}/> All lines, dots and tools related to this plane will be deleted.</DialogDescription>
                        <DialogDescription>Are you sure you want to delete this plane ?</DialogDescription>
                    </DialogHeader>
                    <FlipButton onClick={() => {
                        setIsOpen(false)
                        toast.promise(DeletePlane({planeId:planeId}), {
                            loading: "Loading ...",
                            success: (data) => `${data.message}`,
                            error: (data) => `${data.message}`
                        })
                        router.refresh()
                    }}>
                        <FlipButtonFront className="w-full">Delete</FlipButtonFront>
                        <FlipButtonBack className="w-full" variant={"destructive"}><Trash2 /></FlipButtonBack>
                    </FlipButton>
                </DialogPanel>
            </Dialog>
        </div>
    )
}