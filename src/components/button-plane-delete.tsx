'use client'
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { DeletePlane } from "@/data/planes"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"

interface DeletePlaneButtonProps {
    planeId: string
}
export default function DeletePlaneButton({planeId}:DeletePlaneButtonProps){
    const router = useRouter()
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={"destructive"} className="flex items-center justify-center w-full text-sm font-normal">Delete Plane <Trash /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this plane ?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>Deleting this plane will automatically delete all elements related to this plane wich includes lines, dots and all tools. Are you sure you want to delete ?</AlertDialogDescription>
                <div className="flex items-center gap-2 w-full">
                    <Button variant={'destructive'} className="flex items-center" onClick={() => {
                        toast.promise(DeletePlane({planeId:planeId}),{
                            loading: "Loading ...",
                            success: (data) => `${data.message}`,
                            error: "Something wrong happened ..."
                        })
                        router.refresh()
                    }}>To the trash <Trash /></Button>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}