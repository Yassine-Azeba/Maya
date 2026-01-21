"use client"
import { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DatePicker from "@/components/date-picker"
import PhoneInput from "@/components/phone-input"
import { Textarea } from "@/components/ui/textarea"
import IconSelector from "@/components/icon-selector"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateCustomAttributs } from "@/data/create/custom-attributs"
import { Switch } from "@/components/animate-ui/components/radix/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
    name: z.string().min(2, {error:"2 characters minimum."}).max(255, {error:"255 characters maximum."}),
})

interface CreateCustomAttributFormProps {
    userEmail : string,
    planeName : string,
    lineId? : string,
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

export default function CreateCustomAttributForm({userEmail,planeName,lines,lineId,setDialogOpen}:CreateCustomAttributFormProps){
    const router = useRouter()

    const [icon, setIcon] = useState("string")
    const [defaultValue,setDefaultValue] = useState("")
    const [appliesToChildrens,setAppliesToChildrens] = useState(false)
    const [requiredForChildrens,setRequiredForChildrens] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: { name: "" }
    })
    function CorrectType(type : string){
        const types : Array<"string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line"> = ["string","number","date","boolean","email","url","phone","line"]
        const result = types.filter(t => t === type)[0]
        return result?result:"string"
    }
    function CorrectIcon(type:string){
        const customAttributIcons = [
            {label: "string", display : "Text", item: "TextInitial"},
            {label: "number", display : "Number", item: "Sigma"},
            {label: "date", display : "Date", item: "Calendar"},
            {label: "boolean", display : "Boolean", item: "Binary"},
            {label: "email", display : "Email", item: "Mail"},
            {label: "url", display : "Link (url)", item: "Link2"},
            {label: "phone", display : "Phone", item: "Smartphone"},
            {label: "line", display : "Line", item: "Minus"},
        ]
        const result = customAttributIcons.filter(icon => icon.label === type)[0]
        return result.item
    }
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(CreateCustomAttributs({
            userEmail : userEmail,
            planeName : planeName,
            lineId : lineId,
            name : values.name,
            type : CorrectType(icon),
            icon : CorrectIcon(icon),
            appliesForChildren : appliesToChildrens,
            requiredForChildren : requiredForChildrens,
            defaultValue : defaultValue,
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
                <div className="flex gap-2">
                    <div className="w-2/3">
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
                    <div className="w-1/3 flex flex-col gap-0.5">
                        <h1 className="text-sm font-medium">Icon</h1>
                        <IconSelector type="custom-attribut" icon={icon} setIcon={setIcon}/>
                    </div>
                </div>
                <div className="w-full flex items-center gap-2">
                    <div className="w-1/2 flex items-center gap-2">
                        <Switch checked={appliesToChildrens} disabled={requiredForChildrens} onClick={() => setAppliesToChildrens(!appliesToChildrens)}/>
                        Applies to children
                    </div>
                    <div className="w-1/2 flex items-center gap-2">
                        <Switch checked={requiredForChildrens} onClick={() => {
                            if(!appliesToChildrens)setAppliesToChildrens(!appliesToChildrens)
                            setRequiredForChildrens(!requiredForChildrens)
                        }}/>
                        Required
                    </div>
                </div>
                <FormItem>
                    <FormLabel>Default value  {requiredForChildrens?"*":""} :</FormLabel>
                    <FormControl>
                        {
                            icon===('string')?<Textarea disabled={!appliesToChildrens} required={requiredForChildrens} placeholder="default value" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                            icon===('number')?<Input disabled={!appliesToChildrens} required={requiredForChildrens} placeholder="number" type="number" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                            icon===('date')?<DatePicker disabled={!appliesToChildrens} date={defaultValue} setDate={setDefaultValue}/>:
                            icon===('boolean')?<div className="flex items-center gap-2">
                                <Button size={"sm"} className="w-1/2" variant={defaultValue==="true"?"outline":"ghost"} onClick={() => setDefaultValue("true")} type="button">True</Button>
                                <Button size={"sm"} className="w-1/2" variant={defaultValue==="false"?"outline":"ghost"} onClick={() => setDefaultValue("false")} type="button">False</Button>
                            </div>:
                            icon===('email')?<Input disabled={!appliesToChildrens} required={requiredForChildrens} placeholder="@..." type="email" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                            icon===('url')?<Input disabled={!appliesToChildrens} required={requiredForChildrens} placeholder="https://" value={defaultValue} onChange={(e) => setDefaultValue(e.target.value)}/>:
                            icon===('phone')?<PhoneInput disabled={!appliesToChildrens} value={defaultValue} setValue={setDefaultValue}/>:
                            icon===('line')?<Select value={defaultValue} onValueChange={setDefaultValue} disabled={!appliesToChildrens}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Line"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {lines.map(l => <SelectItem key={l.lineId} value={l.lineId}>{l.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        :<></>}
                    </FormControl>
                    <FormMessage />
                </FormItem>
                <Button type="submit" className="mt-2">Create</Button>
            </form>
        </Form>
    )
}
