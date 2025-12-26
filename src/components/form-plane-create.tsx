"use client"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useForm } from "react-hook-form"
import { CreatePlane } from "@/data/planes"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { RainbowButton } from "./ui/rainbow-button"

const formSchema = z.object({
  name: z.string().min(2, {error:"Give your plane a little more space: 2 characters minimum."}).max(255, {error:"This plane name is flying too far — 255 characters is the limit."}),
  description : z.string().max(2000, {error:"You can create as many plane as you want, but 2000 for the description is the limit."})
})

interface CreatePlaneForm {
    userId: string,
    isDialogOpen : boolean,
    setDialogOpen : Dispatch<SetStateAction<boolean>>
}
export default function CreatePlaneForm({userId,isDialogOpen,setDialogOpen}:CreatePlaneForm){
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    function onSubmit(values : z.infer<typeof formSchema>){
        setDialogOpen(false)
        toast.promise(CreatePlane({userId:userId,name:values.name,description:values.description}),{
            loading: "Loading ...",
            success: (data) => `${data.message}`,
            error: "Something wrong happened ..."
        })
        router.refresh()
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Plane name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Plane description" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <RainbowButton type="submit" className="mt-2">Submit</RainbowButton>
            </form>
        </Form>
    )
}