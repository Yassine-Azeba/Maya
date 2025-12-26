"use client"
import { useState } from "react"
import { Button } from "./ui/button"
import { LayersPlus } from "lucide-react"
import CreatePlaneForm from "./form-plane-create"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

interface CreatePlaneButtonProps {
    userId: string
}
export default function CreatePlaneButton({userId}:CreatePlaneButtonProps){
    const [isDialogOpen, setDialogOpen] = useState(false)
    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button className="h-8 w-full flex items-center gap-4">New plane <LayersPlus size={12}/></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><LayersPlus />New Plane</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Create your two-dimensional workspace to arrange dots and lines your way.
                </AlertDialogDescription>
                <CreatePlaneForm userId={userId} isDialogOpen={isDialogOpen} setDialogOpen={setDialogOpen}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}