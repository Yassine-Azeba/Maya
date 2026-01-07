'use server'
import { eq } from "drizzle-orm"
import { GetUser } from "./user"
import { db } from "@/lib/drizzle"
import { DrizzleQueryError } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"
import { GetPlanes } from "./planes"
import { GetLines } from "./lines"

// Custom Attributs
// ✅✅ Read
interface GetCustomAttributProps {
    customAttributId? : string,
    userId? : string,
    lineId? : string,
    planeId? : string,
    name? : string
}
export async function GetCustomAttributs({customAttributId,userId,lineId,planeId,name}:GetCustomAttributProps){
    const props = [customAttributId,userId,lineId,planeId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return {success: false, message: "Invalid inputs.", data: null}
    try{
        if(userId){
            const user = await GetUser({userId:userId})
            if(!user || user.success === false || !user.data) return {success: false, message: "User doesn't exist.", data: null}
            const result = await db.select().from(customAttributs).where(eq(customAttributs.userId,userId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(planeId){
            const plane = await GetPlanes({planeId:planeId})
            if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane doesn't exist.", data: null}
            const result = await db.select().from(customAttributs).where(eq(customAttributs.plane,planeId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(lineId){
            const line = await GetLines({lineId:lineId})
            if(!line || line.success === false || !line.data) return {success: false, message: "Line doesn't exist.", data: null}
            const result = await db.select().from(customAttributs).where(eq(customAttributs.line,lineId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(name){
            const result = await db.select().from(customAttributs).where(eq(customAttributs.name,name))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(customAttributId){
            const result = await db.select().from(customAttributs).where(eq(customAttributs.customAttributId,customAttributId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        return {success: false,message: "Unknown error occured.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Create
interface CreateCustomAttributsProps {
    name: string,
    type : "string" | "number" | "boolean",

    userId : string,
    planeId : string,
    lineId? : string,
    
    appliesToChildren : boolean,
    requiredForChildren : boolean,
    defaultValue? : string
}
export async function CreateCustomAttribut({name,type,userId,planeId,lineId,appliesToChildren,requiredForChildren,defaultValue}:CreateCustomAttributsProps) {   
    if(requiredForChildren){
        if(!appliesToChildren) return {success: false, message: "Attribut must be applied to childrens before being required for childrens.", data: null}
        if(defaultValue === undefined) return {success: false, message: "Attribut is required, please define a default value for already existing lines.", data: null}
    }
    const user = await GetUser({userId : userId})
    if(!user || user.success === false || !user.data) return {success: false, message: "User doesn't exist.", data: null}
    const plane = await GetPlanes({planeId:planeId})
    if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane doesn't exist.", data: null}
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Line doesn't exist.", data: null}
    try {
        const result = await db.insert(customAttributs).values({
            name : name,
            type : type,
            userId : userId,
            plane : planeId,
            line : lineId,
            appliesToChildrens : appliesToChildren,
            requiredForChildrens : requiredForChildren,
            defaultValue : defaultValue

        })
        return {success: true, message: "Attribut created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Update
interface UpdateCustomAttributProps {
    customAttributId : string,
    name? : string,
    type? : "string" | "number" | "boolean",

    lineId? : string,
    
    appliesToChildren? : boolean,
    requiredForChildren? : boolean,
    defaultValue? : string
}
export async function UpdateCustomAttributs({customAttributId,name,type,lineId,appliesToChildren,requiredForChildren,defaultValue}:UpdateCustomAttributProps) {
    const attribut = await GetCustomAttributs({customAttributId : customAttributId})
    if(!attribut || attribut.success === false || !attribut.data) return {success: false, message: "Attribut doesn't exist.", data: null}
    try{
        const result = await db.update(customAttributs).set({
            name : name?name:attribut.data[0].name,
            type : type?type:attribut.data[0].type,
            line : lineId?lineId:attribut.data[0].line,
            appliesToChildrens : appliesToChildren?appliesToChildren:attribut.data[0].appliesToChildrens,
            requiredForChildrens : requiredForChildren?requiredForChildren:attribut.data[0].requiredForChildrens,
            defaultValue : defaultValue?defaultValue:attribut.data[0].defaultValue,
        }).where(eq(customAttributs.customAttributId,customAttributId)).returning()
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Delete
interface DeleteCustomAttributProps {
    customAttibutId : string
}
export async function DeleteCustomAttribut({customAttibutId}:DeleteCustomAttributProps) {
    try {
        const result = await db.delete(customAttributs).where(eq(customAttributs.customAttributId,customAttibutId)).returning()
        return {success: true, message: "Attribut successfully deleted.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}
