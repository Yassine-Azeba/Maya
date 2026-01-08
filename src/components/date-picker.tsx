"use client"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "./ui/button"
import { ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./animate-ui/components/radix/popover"
import { Calendar } from "./ui/calendar"

interface DatePickerProps {
    date: string,
    setDate : Dispatch<SetStateAction<string>>
}
export default function DatePicker({date,setDate}:DatePickerProps){
    const [selectedDate, setSelectedDate] = useState<Date|undefined>(new Date())
    return(
        <div className="flex flex-col gap-3">
            <Popover>
                <PopoverTrigger asChild>
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