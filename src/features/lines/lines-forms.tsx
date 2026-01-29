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
import { CreateLine, UpdateLine } from "@/db/queries/lines"
import GetUpperLines from "@/db/server/actions/get-lineAbove"
import { createLineSchema, updateLineSchema } from "@/db/server/validators/lines-validators"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateLineFormProps {
    userId : string,
    planeId : string,
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
export function CreateLineForm({userId,planeId,lines,setDialogOpen}:CreateLineFormProps){
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(undefined)
    const form = useForm<z.infer<typeof createLineSchema>>({
        resolver : zodResolver(createLineSchema),
        defaultValues: {
            name: "",
            description: "",
            parentLineId : undefined
        }
    })
    async function onSubmit(values:z.infer<typeof createLineSchema>) {
        if(setDialogOpen){setDialogOpen(false)}
        await toast.promise(CreateLine({
            name : values.name,
            description : values.description,
            planeId : planeId,
            userId : userId,
            parentLineId : parent
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
                {(lines && lines.length > 0)?<div className="flex flex-col gap-0.5">
                    <h1 className="text-sm font-medium">Parent</h1>
                    <Select value={parent} onValueChange={setParent}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Parent"/>
                        </SelectTrigger>
                        <SelectContent>
                            {lines.map(line => <SelectItem key={line.lineId} value={line.lineId}>{line.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>:<></>}
                <Button type="submit" className="mt-2">Create</Button>
            </form>
        </Form>
    )
}

interface UpdateLineFormProps {
    lineToUpdate : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    },
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
export function UpdateLineForm({lineToUpdate,lines,setDialogOpen}:UpdateLineFormProps){
    const router = useRouter()
    const [parent,setParent] = useState<string|undefined>(undefined)
    const upperLines = GetUpperLines({lineId:lineToUpdate.lineId,lines:lines})

    const form = useForm<z.infer<typeof updateLineSchema>>({
        resolver : zodResolver(updateLineSchema),
        defaultValues: {
            name: lineToUpdate.name,
            description: lineToUpdate.description??"",
            parentLineId: lineToUpdate.parent??undefined
        }
    })
    async function onSubmit(values:z.infer<typeof updateLineSchema>) {
        if(setDialogOpen){setDialogOpen(false)}
        await toast.promise(UpdateLine({
            lineId : lineToUpdate.lineId,
            name : values.name??lineToUpdate.name,
            parentLineId : parent ?? lineToUpdate.parent,
            description : values.description??lineToUpdate.description,
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
                            <Input placeholder={lineToUpdate.name??"Line name"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="description" render={({field}) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea placeholder={lineToUpdate.description??"Plane description"} {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                {(upperLines && upperLines.length > 0)?
                <div className="flex flex-col gap-0.5">
                    <h1 className="text-sm font-medium">Parent</h1>
                    <Select value={parent} onValueChange={setParent}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={lineToUpdate.name??"Parent"}/>
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