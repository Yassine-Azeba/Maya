"use client"
import { z } from "zod"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import AttributIconSelector from "./attributs-icons"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateAttribut, UpdateAttribut } from "@/db/queries/attributs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createAttributSchema, updateAttributSchema } from "@/db/server/validators/attributs-validators"

interface CreateAttributFormProps {
    userId : string,
    planeId : string,
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export function CreateAttributForm({userId,planeId,setDialogOpen}:CreateAttributFormProps){
    const router = useRouter()
    const [inputValue,setInputValue] = useState("")
    const [selectValues,setSelectValues] = useState<string[]>([])
    const [type,setType] = useState<"Text"|"Number"|"Date"|"Email"|"Link"|"Phone"|"Line"|"Selection">("Text")
    const form = useForm<z.infer<typeof createAttributSchema>>({
        resolver : zodResolver(createAttributSchema),
        defaultValues: { 
            name: "",
            type : "Text",
            selectionValues : []
        }
    })
    function onSubmit(values : z.infer<typeof createAttributSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(CreateAttribut({
            name : values.name,
            type : values.type,
            planeId : planeId,
            userId : userId,
            selectionValues : selectValues
        }),{
            loading: "Loading ...",
            success: "Attribut created successfully.",
            error: (data) => `${data.message}`
        })
        router.refresh()
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-2 max-sm:flex-col">
                    <div className="w-2/3 max-sm:w-full">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Attribut name" {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="w-1/3 max-sm:w-full flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <AttributIconSelector type={type} setType={setType} />
                    </div>
                </div>
                {type === "Selection"?
                <div className="flex flex-col gap-1">
                    <h1>Selection Values</h1>
                    <div className="flex gap-2 items-center">
                        <div className="w-4/5">
                            <Input placeholder="value" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}/>
                        </div>
                        <div className="w-1/5">
                            <Button variant={"outline"} size={"icon-sm"} onClick={() => 
                                setSelectValues(prev => prev.includes(inputValue)?prev:[...prev,inputValue])}>
                                    <Plus />
                            </Button>
                        </div>
                    </div>
                </div>
                :<></>}
                <Button type="submit" className="mt-2">Create</Button>
            </form>
        </Form>
    )
}

interface UpdateAttributFormProps {
    attributToUpdate : {
        attributId: string;
        name: string;
        type: "Text" | "Number" | "Date" | "Email" | "Link" | "Phone" | "Line" | "Selection";
        plane: string;
        userId: string;
        selectionValues: string[] | null;
    },
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export function UpdateAttributForm({attributToUpdate,setDialogOpen}:UpdateAttributFormProps){
    const router = useRouter()
    const [inputValue,setInputValue] = useState("")
    const [selectValues,setSelectValues] = useState<string[]>(attributToUpdate.selectionValues??[])
    const [type,setType] = useState<"Text"|"Number"|"Date"|"Email"|"Link"|"Phone"|"Line"|"Selection">(attributToUpdate.type)
    const form = useForm<z.infer<typeof updateAttributSchema>>({
        resolver : zodResolver(updateAttributSchema),
        defaultValues: { 
            name: attributToUpdate.name,
            type : attributToUpdate.type,
            selectionValues : attributToUpdate.selectionValues??[]
        }
    })
    function onSubmit(values : z.infer<typeof updateAttributSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(UpdateAttribut({
            attributId : attributToUpdate.attributId,
            name : values.name,
            type : values.type,
            selectionValues : selectValues
        }),{
            loading: "Loading ...",
            success: "Attribut updated successfully.",
            error: (data) => `${data.message}`
        })
        router.refresh()
    }
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex gap-2 max-sm:flex-col">
                    <div className="w-2/3 max-sm:w-full">
                        <FormField control={form.control} name="name" render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={attributToUpdate.name} {...field}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                    <div className="w-1/3 max-sm:w-full flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <AttributIconSelector type={type} setType={setType} />
                    </div>
                </div>
                {type === "Selection"?
                <div className="flex flex-col gap-1">
                    <h1>Selection Values</h1>
                    <div className="flex gap-2 items-center">
                        <div className="w-4/5">
                            <Input placeholder="value" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}/>
                        </div>
                        <div className="w-1/5">
                            <Button variant={"outline"} size={"icon-sm"} onClick={() => 
                                setSelectValues(prev => prev.includes(inputValue)?prev:[...prev,inputValue])}>
                                    <Plus />
                            </Button>
                        </div>
                    </div>
                </div>
                :<></>}
                <Button type="submit" className="mt-2">Update</Button>
            </form>
        </Form>
    )
}