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
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"
import { Switch } from "@/components/animate-ui/components/radix/switch"
import IconSelector, { CustomAttributIcon } from "@/components/icon-selector"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UpdateCustomAttributs } from "@/data/update/custom-attributs"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
    name: z.string().max(255, {error:"255 characters maximum."}).optional(),
})

interface UpdateCustomAttributFormProps {
    userEmail : string,
    planeName : string,
    attributs : {
        customAttributId: string;
        name: string;
        type: "string" | "number" | "boolean" | "date" | "email" | "url" | "phone" | "line" | null;
        icon: string;
        plane: string;
        line: string | null;
        userId: string;
        appliesToChildrens: boolean;
        requiredForChildrens: boolean;
        defaultValue: string | null;
    }[],
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

export default function UpdateCustomAttributForm({userEmail,planeName,attributs,lines,setDialogOpen}:UpdateCustomAttributFormProps){
    const router = useRouter()

    const [selectedAttribut,setSelectedAttribut] = useState<string>("")
    const attributToUpdate = attributs.filter(a => a.customAttributId === selectedAttribut)[0]
    
    const [icon, setIcon] = useState("TextInitial")
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
    function CorrectIcon(type:string,reverse?: boolean){
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
        if(reverse){
            const result = customAttributIcons.filter(icon => icon.item === type)[0]
            return result.label
        }
        const result = customAttributIcons.filter(icon => icon.label === type)[0]
        return result.item
    }
    function onSubmit(values : z.infer<typeof formSchema>){
        if(setDialogOpen){setDialogOpen(false)}
        toast.promise(UpdateCustomAttributs({
            userEmail : userEmail,
            planeName : planeName,
            customAttributId: attributToUpdate.customAttributId,
            name : (values.name && values.name!=="")?values.name:attributToUpdate.name,
            type : CorrectType(icon),
            icon : CorrectIcon(icon),
            appliesForChildren : appliesToChildrens,
            requiredForChildren : requiredForChildrens,
            defaultValue : defaultValue,
        }),{
            loading: "Loading ...",
            success: "Attribut updated successfully.",
            error: (data) => `${data.message}`
        })
        router.refresh()
    }
    return(
        <div className="flex flex-col gap-2">
            <div className="w-full flex items-center justify-center">
                <Select value={selectedAttribut} onValueChange={(value) => {
                    const attribut = attributs.filter(a => a.customAttributId === value)[0]
                    setIcon(CorrectIcon(attribut.icon,true))
                    setDefaultValue(attribut.defaultValue??"")
                    setAppliesToChildrens(attribut.appliesToChildrens)
                    setRequiredForChildrens(attribut.requiredForChildrens)
                    setSelectedAttribut(value)
                }}>
                    <SelectTrigger className="w-1/3 max-sm:w-full">
                        <SelectValue placeholder="Select an attribut to update." />
                    </SelectTrigger>
                    <SelectContent>
                        {attributs.map(attribut => <SelectItem key={attribut.customAttributId} value={attribut.customAttributId} className="flex items-center gap-2"><CustomAttributIcon icon={attribut.icon}/> {attribut.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Separator />
            {(selectedAttribut !== "")?<Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="flex gap-2 max-sm:flex-col">
                        <div className="w-2/3 max-sm:w-full">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder={attributToUpdate.name} {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className="w-1/3 max-sm:w-full flex flex-col gap-0.5">
                            <h1 className="text-sm font-medium">Icon</h1>
                            <IconSelector type="custom-attribut" icon={icon} setIcon={setIcon}/>
                        </div>
                    </div>
                    <div className="w-full flex items-center gap-2 max-sm:flex-col">
                        <div className="w-1/2 max-sm:w-full flex items-center gap-2 max-sm:gap-4">
                            <Switch checked={appliesToChildrens} disabled={requiredForChildrens} onClick={() => setAppliesToChildrens(!appliesToChildrens)}/>
                            Applies to children
                        </div>
                        <div className="w-1/2 max-sm:w-full flex items-center gap-2 max-sm:gap-4">
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
                    <Button type="submit" className="mt-2">Update</Button>
                </form>
            </Form>:
            <></>}
        </div>
    )
}
