'use client'
import React, { Dispatch, SetStateAction } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"

interface UpdateCustomAttributProps {
    attribut : {
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
    },
    setTabValue : Dispatch<SetStateAction<string>>,
    setAttributToUpdate : Dispatch<SetStateAction<{
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
    } | undefined>>,
    children : React.ReactNode
}
export default function UpdateCustomAttributButton({attribut,setAttributToUpdate,setTabValue,children}:UpdateCustomAttributProps){
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => {
                        setAttributToUpdate(attribut)
                        setTabValue("update")
                    }}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Update Attribut</p></TooltipContent>
            </Tooltip>
        </div>
    )
}
