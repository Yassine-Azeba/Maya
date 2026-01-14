"use client"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UpdatePlane } from "@/data/update/planes"
import { Textarea } from "@/components/ui/textarea"
import IconSelector from "@/components/icon-selector"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  name: z.string()
    .min(2, {error:"Give your plane a little more space: 2 characters minimum."})
    .max(255, {error:"This plane name is flying too far — 255 characters is the limit."})
    .optional(),
  description : z.string()
    .max(2000, {error:"You can create as many plane as you want, but 2000 for the description is the limit."})
    .optional()
})

interface UpdatePlaneFormProps {
    userEmail : string,
    plane : { 
        planeId: string;
        name: string;
        description: string | null;
        icon: string;
        userId: string;
    },
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export default function UpdatePlaneForm({userEmail,plane,setDialogOpen}:UpdatePlaneFormProps){
    const router = useRouter()
    const [icon, setIcon] = useState(plane.icon)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: plane.name,
            description: plane.description??""
        }
    })
    async function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        await toast.promise(
            UpdatePlane({
                userEmail:userEmail,
                planeId : plane.planeId,
                name:values.name??plane.name,
                description:values.description??plane.description,
                icon:icon
            }),{
            loading: "Loading ...",
            success: "Plane updated successfully",
            error: (data) => `${data.message}`,
        })
        router.push(`/planes/${values.name??plane.name}`)
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
                                    <Input placeholder={plane.name} {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="w-1/3 flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <IconSelector icon={icon} setIcon={setIcon}/>
                    </div>
                </div>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={plane.description??"description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="mt-2">Update</Button>
            </form>
        </Form>
    )
}