'use client'
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useForm } from "react-hook-form"
import { CreateLine } from "@/data/lines"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface CreateLineFormProps {
    planeId : string,
    userId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[] | undefined,
    setIsOpen?: Dispatch<SetStateAction<boolean>>,
}

const formSchema = z.object({
  name: z.string().min(2, {error:"Give your plane a little more space: 2 characters minimum."}).max(255, {error:"This plane name is flying too far — 255 characters is the limit."}),
  description : z.string().max(2000, {error:"You can create as many plane as you want, but 2000 for the description is the limit."}),
})

export default function CreateLineForm({planeId,userId,lines,setIsOpen}:CreateLineFormProps){
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(undefined)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    function onSubmit(values:z.infer<typeof formSchema>){
        if(setIsOpen){setIsOpen(false)}
        toast.promise(CreateLine({planeId:planeId,userId:userId,name:values.name,description:values.description?values.description:"",parentId:parent}),{
            loading : "Loading ...",
            success : (data) => `${data.message}`,
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
                {(lines && lines.length > 0)?
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Parent</h1>
                        <Select defaultValue={undefined} onValueChange={setParent}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Parent"/>
                            </SelectTrigger>
                            <SelectContent>
                                {lines.map(line => <SelectItem key={line.lineId} value={line.lineId}>{line.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>:<></>}
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </Form>
    )
}