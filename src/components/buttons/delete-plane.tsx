'use client'
import React, { useState } from "react"
import { Dialog, DialogDescription, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"
import { Trash2, TriangleAlert } from "lucide-react"
import { FlipButton, FlipButtonBack, FlipButtonFront } from "../animate-ui/components/buttons/flip"
import { DeletePlane } from "@/data/planes"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeletePlaneButtonProps {
    plane : {
        planeId: string,
        name : string,
        description : string | null,
        userId : string
    },
    children : React.ReactNode
}
export default function DeletePlaneButton({plane,children}:DeletePlaneButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const router = useRouter()
    return(
        <div>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>Delete Plane</DialogTitle>
                        <DialogDescription className="flex items-center gap-2"><TriangleAlert size={12}/> All lines, dots and tools related to this plane will be deleted.</DialogDescription>
                        <DialogDescription>Are you sure you want to delete this plane ?</DialogDescription>
                    </DialogHeader>
                    <FlipButton onClick={() => {
                        setIsOpen(false)
                        toast.promise(DeletePlane({planeId:plane.planeId}), {
                            loading: "Loading ...",
                            success: (data) => `${data.message}`,
                            error: "Something wrong happened ..."
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