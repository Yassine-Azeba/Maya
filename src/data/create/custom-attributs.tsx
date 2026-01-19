'use server'
import { db } from "@/lib/drizzle"
import { GetUser } from "../get/users"
import { DrizzleQueryError } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"
import { GetPlanesWithCustomAttributs } from "../get/planes"

interface CreateCustomAttributsProps {
    userEmail : string,
    planeName : string,
    lineId? : string,
    name: string,
    type : "string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line",
    icon : string,
    appliesForChildren : boolean,
    requiredForChildren : boolean,
    defaultValue : string
}
export default async function CreateCustomAttributs({name,type,icon,appliesForChildren,requiredForChildren,defaultValue,userEmail,planeName,lineId}:CreateCustomAttributsProps) {
    const user = await GetUser({email:userEmail}) // Check if user exist
    const plane = await GetPlanesWithCustomAttributs({name:planeName,userEmail:userEmail}) // Check if plane exist
    const allCustomAttributs = plane.map(data => data.custom_attributs).filter(data => data !== null)
    
    if(!appliesForChildren && requiredForChildren) throw new Error("Attributs can't be required for childrens if not applied to childrens.")
    if(allCustomAttributs.map(data => data.name).includes(name)) throw new Error("Custom attribut already exist.")
    
    try {
        const result = await db.insert(customAttributs).values({
            name : name,
            type : type,
            icon : icon,
            plane : plane[0].planes.planeId,
            userId : user.id,
            line : lineId,
            appliesToChildrens : appliesForChildren,
            requiredForChildrens : requiredForChildren,
            defaultValue : defaultValue
        }).returning()
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