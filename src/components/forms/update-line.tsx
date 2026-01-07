"use client"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useForm } from "react-hook-form"
import { UpdateLine } from "@/data/lines"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { RemoveChildren } from "@/lib/remove-childrens"
interface UpdateLineFormProps {
    lineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}

const formSchema = z.object({
  name: z.string().min(1, {error:"Give your line a little more space: 1 characters minimum."}).max(255, {error:"This line name is flying too far — 255 characters is the limit."}),
  description : z.string().max(5000, {error:"That's a very long description you got here."})
})
export default function UpdateLineForm({lineId,lines,setDialogOpen}:UpdateLineFormProps){
    const line = lines.filter(line => line.lineId === lineId)[0]
    const parentLine = lines.filter(line => line.parent === line.parent)[0]
    const linesWithoutChildrens = RemoveChildren({lineId:lineId,lines:lines})
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(parentLine.lineId)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen) setDialogOpen(false)
            toast.promise(UpdateLine({
                lineId:lineId,
                name:values.name,
                description:values.description
            }),{
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
                            <Input placeholder={line.name} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={line.description??"Plane Description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {(linesWithoutChildrens && linesWithoutChildrens.length > 0)?
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Parent</h1>
                        <Select defaultValue={undefined} onValueChange={setParent}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Parent"/>
                            </SelectTrigger>
                            <SelectContent>
                                {linesWithoutChildrens.map(line => <SelectItem key={line.lineId} value={line.lineId}>{line.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>:<></>}
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </Form>
    )
}