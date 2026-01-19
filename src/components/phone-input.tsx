"use client"
import { Input } from "./ui/input"
import { Dispatch, SetStateAction, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"

const countryCodesNorthAmerica = [
    {code:"+1",country:"United States"},
    {code:"+52",country:"Mexico"},
]
const countryCodesEurope = [
    {code:"+32",country:"Belgium"},
    {code:"+33",country:"France"},
    {code:"+34",country:"Spain"},
    {code:"+351",country:"Portugal"},
    {code:"+353",country:"Irlande"},
    {code:"+44",country:"United Kingdom"},
    {code:"+45",country:"Danemark"},
    {code:"+49",country:"Germany"},
]
const countryCodesAfrica = [
    {code:"+212",country:"Morocco"},
    {code:"+20",country:"Egypt"},
    {code:"+213",country:"Algeria"},
    {code:"+216",country:"Tunisia"},
    {code:"+225",country:"Ivory Coast"},
    {code:"+234",country:"Nigeria"},
    {code:"+27",country:"South-Africa"},
    {code:"+249",country:"Sudan"},
]

interface PhoneInputProps {
    value: string,
    disabled : boolean,
    setValue : Dispatch<SetStateAction<string>>
}
export default function PhoneInput({value,disabled,setValue}:PhoneInputProps){
    const [code,setCode] = useState("")
    return(
        <div className="w-full flex items-center gap-2">
            <div>
            <Select value={code} onValueChange={setCode} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder="Country Code"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Other</SelectLabel>
                        <SelectItem value="other">other</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>North America</SelectLabel>
                        {countryCodesNorthAmerica.map(countryCode => 
                        <SelectItem key={countryCode.country} value={countryCode.code} className="flex items-center gap-2">
                            <div>{countryCode.code}</div>
                            <div>{countryCode.country}</div>
                        </SelectItem>)}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Africa</SelectLabel>
                        {countryCodesAfrica.map(countryCode => 
                        <SelectItem key={countryCode.country} value={countryCode.code} className="flex items-center gap-2">
                            <div>{countryCode.code}</div>
                            <div>{countryCode.country}</div>
                        </SelectItem>)}
                    </SelectGroup>
                    <SelectGroup>
                        <SelectLabel>Europe</SelectLabel>
                        {countryCodesEurope.map(countryCode => 
                        <SelectItem key={countryCode.country} value={countryCode.code} className="flex items-center gap-2">
                            <div>{countryCode.code}</div>
                            <div>{countryCode.country}</div>
                        </SelectItem>)}
                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>
            <div className="w-full">
                <Input disabled={disabled} value={value} onChange={(e) => {
                    if(code==="other") {
                        setValue(e.target.value)
                    } else {
                        if(value.includes(code)){
                            setValue(e.target.value)
                        } else {
                            setValue(code+e.target.value)
                        }
                    }
                }} />
            </div>
        </div>
    )
}