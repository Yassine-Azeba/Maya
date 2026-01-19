"use client"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { ChevronDown } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./animate-ui/components/radix/popover"

interface DatePickerProps {
    date: string,
    disabled : boolean,
    setDate : Dispatch<SetStateAction<string>>
}
export default function DatePicker({date,disabled,setDate}:DatePickerProps){
    const [selectedDate, setSelectedDate] = useState<Date|undefined>(new Date())
    return(
        <div className="flex flex-col gap-3">
            <Popover>
                <PopoverTrigger disabled={disabled} asChild>
                    <Button variant={"outline"} className="w-full justify-between">{selectedDate?selectedDate.toLocaleDateString():"Select Date"} <ChevronDown /></Button>
                </PopoverTrigger>
                <PopoverContent>
                    <Calendar mode="single" captionLayout="dropdown" selected={selectedDate} onSelect={(e) => {
                        setSelectedDate(e)
                        setDate(e?e.toLocaleDateString():"")
                    }} />
                </PopoverContent>
            </Popover>
        </div>
    )
}