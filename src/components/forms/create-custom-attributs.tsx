"use client"
import { z } from "zod"
import { toast } from "sonner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import DatePicker from "../date-picker"
import { Textarea } from "../ui/textarea"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { RainbowButton } from "../ui/rainbow-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateCustomAttribut } from "@/data/custom-attributs"
import { Checkbox } from "../animate-ui/components/radix/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Binary, Calendar, Mail, Minus, QrCode, Sigma, Smartphone, TextInitial } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"

const formSchema = z.object({
  name: z.string().min(2, {error:"Too short."}).max(255, {error:"Too long."})
})
interface CreateCustomAttributsForm {
    userId: string,
    planeId : string
    setDialogOpen? : Dispatch<SetStateAction<boolean>>
}
export default function CreateCustomAttributsForm({userId,planeId,setDialogOpen}:CreateCustomAttributsForm){
    const router = useRouter()
    
    const [defaultValue,setDefaultValue] = useState<string>("")
    const [appliesToChildren,setAppliesToChildren] = useState(false)
    const [requiredForChildrens,setRequiredForChildrens] = useState(false)
    const [type,setType] = useState("string")
    const typeGroups = ["Default","Selection"]
    const possibleTypes : {
        group: string,
        value : "string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line",
        icon : any,
        disabled : boolean
    }[] = [
        {group: "Default" ,value : "string", icon : TextInitial, disabled: false},
        {group: "Default" ,value : "number", icon : Sigma, disabled: false},
        {group: "Default" ,value : "date", icon : Calendar, disabled: false},
        {group: "Default" ,value : "boolean", icon : Binary, disabled: false},
        {group: "Default" ,value : "email", icon : Mail, disabled: false},
        {group: "Default" ,value : "url", icon : QrCode, disabled: false},
        {group: "Default" ,value : "phone", icon : Smartphone, disabled: false},
        {group: "Selection" ,value : "line", icon : Minus, disabled: true},
    ]
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })
    function CorrectType(type : string){
        const result = possibleTypes.filter(possibleType => possibleType.value === type)[0].value
        return result?result:"string"

    }
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(CreateCustomAttribut({
            name : values.name,
            type : CorrectType(type),
            userId : userId,
            planeId : planeId,
            lineId : undefined,
            appliesToChildren : appliesToChildren,
            requiredForChildren : requiredForChildrens,
            defaultValue : defaultValue
        }),{
            loading: "Loading ...",
            success: (data) => `${data.message}`,
            error: "Something wrong happened ..."
        })
        router.refresh()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium">Type</h1>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a type"/>
                        </SelectTrigger>
                        <SelectContent>
                            {typeGroups.map(group => <SelectGroup key={group}>
                                <SelectLabel>{group}</SelectLabel>
                                {possibleTypes.filter(pT => pT.group === group).map(pT => <SelectItem key={pT.value} value={pT.value} className="flex items-center gap-2" disabled={pT.disabled}>
                                    <pT.icon />
                                    {pT.value}
                                </SelectItem>
                                )}
                            </SelectGroup>)}
                        </SelectContent>
                    </Select>
                </div>
                <FormField control={form.control} name="name" render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Custom attribut name" {...field}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <div className="flex items-center gap-2">
                    <Label>
                        <Checkbox checked={appliesToChildren} disabled={requiredForChildrens} onCheckedChange={() => setAppliesToChildren(!appliesToChildren)}/>
                        Applies to children ?
                    </Label>
                    <Label>
                        <Checkbox checked={requiredForChildrens} onCheckedChange={() => {
                            if(!appliesToChildren){setAppliesToChildren(!appliesToChildren)}
                            setRequiredForChildrens(!requiredForChildrens)
                        }}/>
                        Is Required for children ?
                    </Label>
                </div>
                {requiredForChildrens?<div className="flex flex-col gap-2">
                    <h1 className="text-sm font-medium">Default Value</h1>
                    {
                        (type==="string")?<Textarea placeholder="Default Value" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                        (type==="number")?<Input placeholder="Default Value" type="number" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                        (type==="date")?<DatePicker date={defaultValue} setDate={setDefaultValue} />:
                        (type==="boolean")?<DatePicker date={defaultValue} setDate={setDefaultValue} />:
                        (type==="email")?<Input placeholder="Default Value" type="email" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                        (type==="url")?<Input placeholder="https://..." value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                        (type==="phone")?<Input placeholder="+33.6..." value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                        (type==="line")?<Input />:<></>
                    }
                </div>:<></>}
                <RainbowButton type="submit" className="mt-2">Submit</RainbowButton>
            </form>
        </Form>
    )
}