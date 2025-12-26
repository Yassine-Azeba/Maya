"use client"
import { useState } from "react"
import { SquarePen } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import UpdatePlaneForm from "./form-plane-update"

interface UpdatePlaneButtonProps {
    plane : {
        planeId: string,
        name : string,
        description : string | null,
        userId : string
    }
}
export default function UpdatePlaneButton({plane}:UpdatePlaneButtonProps){
    const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false)
    return(
        <AlertDialog open={isUpdateDialogOpen} onOpenChange={setUpdateDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={"ghost"} className="flex items-center justify-center w-full text-sm font-normal">Update plane</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><SquarePen />Update Plane</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Update your plane.
                </AlertDialogDescription>
                <UpdatePlaneForm plane={plane} isDialogOpen={isUpdateDialogOpen} setDialogOpen={setUpdateDialogOpen}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}