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
import CreateLine from "@/data/create/lines"

const formSchema = z.object({
  name: z.string().min(2, {error:"Minimum 2 caracters."}).max(255, {error:"Maximum 255 caracters."}),
  description : z.string().max(2000, {error:"Maximum 2000 caracters."})
})

interface CreateLineFormProps {
    user : {
        id: string;
        name: string | null;
        email: string | null
    }
    plane : {
        planeId : string,
        name : string
    },
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
export default function CreateLineForm({user,plane,lines,setDialogOpen}:CreateLineFormProps){
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(undefined)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    async function onSubmit(values:z.infer<typeof formSchema>) {
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(CreateLine({
            name : values.name,
            description : values.description,
            parentLineId : parent,
            plane : plane,
            user : user 
        }),{
            loading : "Loading ...",
            success : "Line created successfully",
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
                            <Input placeholder="Line name" {...field}/>
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
                <Button type="submit" className="mt-2">Create Line</Button>
            </form>
        </Form>
    )
}