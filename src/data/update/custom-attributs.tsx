'use server'
import { db } from "@/lib/drizzle"
import { DrizzleQueryError, eq } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"
import { GetPlanesWithCustomAttributs } from "../get/planes"

interface UpdateCustomAttributsProps {
    planeName : string,
    userEmail : string,
    customAttributId : string,
    name: string,
    type : "string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line",
    icon : string,
    appliesForChildren : boolean,
    requiredForChildren : boolean,
    defaultValue : string,
}
export async function UpdateCustomAttributs({planeName,userEmail,customAttributId,name,type,icon,appliesForChildren,requiredForChildren,defaultValue}:UpdateCustomAttributsProps) {
    const plane = await GetPlanesWithCustomAttributs({name:planeName,userEmail:userEmail}) // Check if plane exist
    const allCustomAttributs = plane.map(data => data.custom_attributs).filter(data => data !== null)
    
    if(!appliesForChildren && requiredForChildren) throw new Error("Attributs can't be required for childrens if not applied to childrens.")
    if(allCustomAttributs.filter(data => data.customAttributId !== customAttributId && data.name === name).length>0) throw new Error("Another attribut have this name.")
    
    try {
        const result = await db.update(customAttributs).set({
            name : name,
            type : type,
            icon : icon,
            appliesToChildrens : appliesForChildren,
            requiredForChildrens : requiredForChildren,
            defaultValue : defaultValue
        }).where(eq(customAttributs.customAttributId,customAttributId)).returning()
        // TODO :
        // if(requiredForChildren){
        //     const planeWithLines = await GetPlanesWithLines({userEmail:userEmail})
        //     const allLines = planeWithLines.map(data => data.lines).filter(line => line !== null)
        //     if(lineId){
        //         const childrenLine = GetChildren({lineId:lineId,lines:allLines})
        //         // For each childrenLine : Create CustomAttributLink
        //     } else {
        //         // For each allLines : Create CustomAttributLink
        //     }
        // } 
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}