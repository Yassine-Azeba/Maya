"use client"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { UpdatePlane } from "@/data/planes"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

const formSchema = z.object({
  name: z.string().min(2, {error:"Give your plane a little more space: 2 characters minimum."}).max(255, {error:"This plane name is flying too far — 255 characters is the limit."}),
  description : z.string().max(2000, {error:"You can create as many plane as you want, but 2000 for the description is the limit."})
})
const formSchemaDesriptionOnly = z.object({
  description : z.string().max(2000, {error:"You can create as many plane as you want, but 2000 for the description is the limit."})
})

interface UpdatePlaneFormProps {
    plane : {
        planeId: string,
        name : string,
        description : string | null,
        userId : string
    },
    descriptionOnly? : boolean,
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export default function UpdatePlaneForm({plane,descriptionOnly,setDialogOpen}:UpdatePlaneFormProps){
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen) setDialogOpen(false)
            toast.promise(UpdatePlane({
                planeId:plane.planeId,
                name:values.name,
                description:values.description}),{
            loading: "Loading ...",
            success: (data) => `${data.message}`,
            error: "Something wrong happened ..."
        })
        router.refresh()
    }
    // Description Only
    const formOnlyDescription = useForm<z.infer<typeof formSchemaDesriptionOnly>>({
        resolver : zodResolver(formSchemaDesriptionOnly),
        defaultValues: {
            description: ""
        }
    })
    function onSubmitDescriptionOnly(values : z.infer<typeof formSchemaDesriptionOnly>){
        if(setDialogOpen) setDialogOpen(false)
        toast.promise(UpdatePlane({planeId:plane.planeId,description:values.description}),{
            loading: "Loading ...",
            success: (data) => `${data.message}`,
            error: "Something wrong happened ..."
        })
        router.refresh()
    }
    if(descriptionOnly === true) return(
        <Form {...formOnlyDescription}>
            <form onSubmit={formOnlyDescription.handleSubmit(onSubmitDescriptionOnly)} className="flex flex-col gap-2">
                <FormField control={formOnlyDescription.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={plane.description??"Plane Description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </Form>
    )
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder={plane.name} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={plane.description??"Plane Description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </Form>
    )
}