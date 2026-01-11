'use client'
import { toast } from "sonner"
import React, { useState } from "react"
import { DeleteLine } from "@/data/lines"
import { useRouter } from "next/navigation"
import { Trash2, TriangleAlert } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { FlipButton, FlipButtonBack, FlipButtonFront } from "../animate-ui/components/buttons/flip"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"

interface DeleteLineButtonProps {
    lineId: string,
    children : React.ReactNode
}
export default function DeleteLineButton({lineId,children}:DeleteLineButtonProps){
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
                <TooltipContent><p>Delete Line</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Delete Line</DialogTitle>
                        <DialogDescription className="flex items-center gap-2"><TriangleAlert size={12}/> All children lines and tools related to this line will be deleted.</DialogDescription>
                        <DialogDescription>Are you sure you want to delete this line ?</DialogDescription>
                    </DialogHeader>
                    <FlipButton onClick={() => {
                        setIsOpen(false)
                        toast.promise(DeleteLine({lineId:lineId}), {
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