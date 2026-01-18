"use client"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GetUpperLines } from "@/lib/get-upper-lines"
import { UpdateLine } from "@/data/update/lines"

const formSchema = z.object({
  name: z.string()
    .min(2, {error:"Minimum 2 caracters."})
    .max(255, {error:"Maximum 255 caracters."})
    .optional(),
  description : z.string()
    .max(2000, {error:"Maximum 2000 caracters."})
    .optional()
})

interface UpdateLineFormProps {
    userEmail : string,
    lineToUpdate : string,
    lines: {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export default function UpdateLineForm({userEmail,lineToUpdate,lines,setDialogOpen}:UpdateLineFormProps){
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(undefined)

    const line = lines.filter(l => l.lineId === lineToUpdate)[0]
    const upperLines = GetUpperLines({lineId:line.lineId,lines:lines})
    const initialParent = lines.filter(l => l.lineId === line.parent)[0]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: line.name,
            description: line.description??""
        }
    })
    async function onSubmit(values:z.infer<typeof formSchema>) {
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(UpdateLine({
            userEmail : userEmail,
            lineId : lineToUpdate,
            linePlaneId : line.plane,
            name : values.name??line.name,
            description : values.description??line.description??undefined,
            parent : parent??line.parent??undefined
        }),{
            loading : "Loading ...",
            success : "Line updated successfully",
            error: (data) => `${data.message}`
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
                            <Input placeholder={line.name??"Line name"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={line.description??"Plane description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {(upperLines && upperLines.length > 0)?
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Parent</h1>
                        <Select defaultValue={undefined} onValueChange={setParent}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={initialParent.name??"Parent"}/>
                            </SelectTrigger>
                            <SelectContent>
                                {upperLines.map(l => <SelectItem key={l.lineId} value={l.lineId}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>:<></>}
                <Button type="submit" className="mt-2">Update</Button>
            </form>
        </Form>
    )
}