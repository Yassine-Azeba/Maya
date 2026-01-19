"use client"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import CreatePlane from "@/data/create/planes"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import IconSelector from "@/components/icon-selector"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
    name: z.string().min(2, {error:"2 characters minimum."}).max(255, {error:"255 characters maximum."}),
    description : z.string().max(2000, {error:"2000 characters maximum."})
})

interface CreatePlaneFormProps {
    userEmail: string,
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export default function CreatePlaneForm({userEmail,setDialogOpen}:CreatePlaneFormProps){
    const router = useRouter()
    const [icon, setIcon] = useState("Folder")
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(CreatePlane({userEmail:userEmail,name:values.name,description:values.description,icon:icon}),{
            loading: "Loading ...",
            success: (data) => `${data.message}`,
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
                        <IconSelector type="plane" icon={icon} setIcon={setIcon}/>
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