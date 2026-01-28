"use client"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import PlaneIconSelector from "./planes-icons"
import { Button } from "@/components/ui/button"
import { CreatePlane, UpdatePlane } from "@/db/queries/planes"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { createPlaneSchema, updatePlaneSchema } from "@/db/server/validators/planes-validators"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { setTimeout } from "timers/promises"

interface CreatePlaneFormProps {
    userId: string,
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export function CreatePlaneForm({userId,setDialogOpen}:CreatePlaneFormProps){
    const router = useRouter()
    const [icon, setIcon] = useState("Folder")
    const form = useForm<z.infer<typeof createPlaneSchema>>({
        resolver : zodResolver(createPlaneSchema),
        defaultValues: {
            name: "",
            description: "",
            icon: "Folder"
        }
    })
    async function onSubmit(values : z.infer<typeof createPlaneSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        await toast.promise(CreatePlane({userId:userId,name:values.name,description:values.description,icon:icon}),{
            loading: "Loading ...",
            success: "Plane created successfully",
            error: (data) => `${data.message}`
        })
        router.refresh()
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="w-2/3">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Plane name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="w-1/3 flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <PlaneIconSelector icon={icon} setIcon={setIcon}/>
                    </div>
                </div>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Plane description" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="mt-2">Create</Button>
            </form>
        </Form>
    )
}

interface UpdatePlaneFormProps {
    planeToUpdate : {
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        userId: string;
    },
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export function UpdatePlaneForm({planeToUpdate,setDialogOpen}:UpdatePlaneFormProps){
    const router = useRouter()
    const [icon, setIcon] = useState(planeToUpdate.icon)
    const form = useForm<z.infer<typeof updatePlaneSchema>>({
        resolver : zodResolver(updatePlaneSchema),
        defaultValues: {
            name: planeToUpdate.name,
            description: planeToUpdate.description??""
        }
    })
    async function onSubmit(values : z.infer<typeof updatePlaneSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        await toast.promise(
            UpdatePlane({
                planeId : planeToUpdate.planeId,
                name: values.name??planeToUpdate.name,
                description:values.description??planeToUpdate.description,
                icon:icon
            }),{
            loading: "Loading ...",
            success: "Plane updated successfully",
            error: (data) => `${data.message}`,
        })
        router.push(`/planes/${values.name??planeToUpdate.name}`)
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="w-2/3">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={planeToUpdate.name} {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="w-1/3 flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <PlaneIconSelector icon={icon} setIcon={setIcon}/>
                    </div>
                </div>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={planeToUpdate.description??"Description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="mt-2">Update</Button>
            </form>
        </Form>
    )
}