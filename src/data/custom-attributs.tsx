'use server'
import { eq } from "drizzle-orm"
import { GetUser } from "./user"
import { db } from "@/lib/drizzle"
import { GetLines } from "./lines"
import { GetPlanes } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"

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
    if(props.length !== 1 ) throw new Error("Invalid inputs.")
    try{
        if(userId){
            const user = await GetUser({userId:userId})
            if(!user || user.success === false || !user.data) throw new Error("User doesn't exist.")
            const result = await db.select().from(customAttributs).where(eq(customAttributs.userId,userId))
            return {success: true, message: "Attribut successfully retrieved.", data: result}
        }
        if(planeId){
            const plane = await GetPlanes({planeId:planeId})
            if(!plane || plane.success === false || !plane.data) throw new Error("Plane doesn't exist.")
            const result = await db.select().from(customAttributs).where(eq(customAttributs.plane,planeId))
            return {success: true, message: "Attribut successfully retrieved.", data: result}
        }
        if(lineId){
            const line = await GetLines({lineId:lineId})
            if(!line || line.success === false || !line.data) throw new Error("Line doesn't exist.")
            const result = await db.select().from(customAttributs).where(eq(customAttributs.line,lineId))
            return {success: true, message: "Attribut successfully retrieved.", data: result}
        }
        if(name){
            const result = await db.select().from(customAttributs).where(eq(customAttributs.name,name))
            return {success: true, message: "Attribut successfully retrieved.", data: result}
        }
        if(customAttributId){
            const result = await db.select().from(customAttributs).where(eq(customAttributs.customAttributId,customAttributId))
            return {success: true, message: "Attribut successfully retrieved.", data: result}
        }
        throw new Error("Unknown error occured.")
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

// ✅✅ Create
interface CreateCustomAttributsProps {
    name: string,
    type : "string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line",

    userId : string,
    planeId : string,
    lineId? : string,
    
    appliesToChildren : boolean,
    requiredForChildren : boolean,
    defaultValue? : string
}
export async function CreateCustomAttribut({name,type,userId,planeId,lineId,appliesToChildren,requiredForChildren,defaultValue}:CreateCustomAttributsProps) {   
    if(requiredForChildren){
        if(!appliesToChildren) throw new Error("Attribut must be applied to childrens before being required for childrens.")
        if(defaultValue === undefined) throw new Error("Attribut is required, please define a default value for already existing lines.")
    }
    const user = await GetUser({userId : userId})
    if(!user || user.success === false || !user.data) throw new Error("User doesn't exist.")
    const plane = await GetPlanes({planeId:planeId})
    if(!plane || plane.success === false || !plane.data) throw new Error("Plane doesn't exist.")
    // Check duplicate (plane level)
    const planeCustomAttributs = await GetCustomAttributs({planeId:planeId})
    const filteredPlaneCustomAttributs = planeCustomAttributs.data.filter(attribut => attribut.name === name)
    if(filteredPlaneCustomAttributs.length > 0) throw new Error("This attribut already exist in plane's configuration.")
    if(lineId){
        const line = await GetLines({lineId:lineId})
        if(!line || line.success === false || !line.data) throw new Error("Line doesn't exist.")
        // Check duplicates (line level - same line)
        const lineCustomAttributs = await GetCustomAttributs({lineId:lineId})
        const filteredLineCustomAttributs = lineCustomAttributs.data.filter(attribut => attribut.name === name)
        if(filteredLineCustomAttributs.length > 0) throw new Error("This attribut already exist for this line.")
        // Check duplicate (line level - parent line + assignedToChildren)
        if(line.data[0].parent){
            const parentLineCustomAttributs = await GetCustomAttributs({lineId:line.data[0].parent})
            const filteredParentLineCustomAttributs = parentLineCustomAttributs.data.filter(attribut => attribut.name === name && appliesToChildren)
            if(filteredParentLineCustomAttributs.length > 0) throw new Error("This attribut already exist (inherited from parent line).")
        }
    }
    try {
        const result = await db.insert(customAttributs).values({
            name : name,
            type : type,
            userId : userId,
            plane : planeId,
            line : lineId?lineId:null,
            appliesToChildrens : appliesToChildren,
            requiredForChildrens : requiredForChildren,
            defaultValue : defaultValue
        }).returning()
        return {success: true, message: "Attribut created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

// ✅✅ Update
interface UpdateCustomAttributProps {
    customAttributId : string,
    name? : string,
    type? : "string"|"number"|"date"|"boolean"|"email"|"url"|"phone"|"line",

    lineId? : string,
    
    appliesToChildren? : boolean,
    requiredForChildren? : boolean,
    defaultValue? : string
}
export async function UpdateCustomAttributs({customAttributId,name,type,lineId,appliesToChildren,requiredForChildren,defaultValue}:UpdateCustomAttributProps) {
    const attribut = await GetCustomAttributs({customAttributId : customAttributId})
    if(!attribut || attribut.success === false || !attribut.data) throw new Error("Attribut doesn't exist.")
    // Check duplicate (plane level)
    const planeCustomAttributs = await GetCustomAttributs({planeId:attribut.data[0].plane})
    const filteredPlaneCustomAttributs = planeCustomAttributs.data.filter(attribut => attribut.name === name)
    if(filteredPlaneCustomAttributs.length > 0) throw new Error("This attribut already exist in plane's configuration.")
    if(lineId){
        const line = await GetLines({lineId:lineId})
        if(!line || line.success === false || !line.data) throw new Error("Line doesn't exist.")
        // Check duplicates (line level - same line)
        const lineCustomAttributs = await GetCustomAttributs({lineId:lineId})
        const filteredLineCustomAttributs = lineCustomAttributs.data.filter(attribut => attribut.name === name)
        if(filteredLineCustomAttributs.length > 0) throw new Error("This attribut already exist for this line.")
        // Check duplicate (line level - parent line + assignedToChildren)
        if(line.data[0].parent){
            const parentLineCustomAttributs = await GetCustomAttributs({lineId:line.data[0].parent})
            const filteredParentLineCustomAttributs = parentLineCustomAttributs.data.filter(attribut => attribut.name === name && appliesToChildren)
            if(filteredParentLineCustomAttributs.length > 0) throw new Error("This attribut already exist (inherited from parent line).")
        }
    }
    try{
        const result = await db.update(customAttributs).set({
            name : name?name:attribut.data[0].name,
            type : type?type:attribut.data[0].type,
            line : lineId?lineId:attribut.data[0].line,
            appliesToChildrens : appliesToChildren?appliesToChildren:attribut.data[0].appliesToChildrens,
            requiredForChildrens : requiredForChildren?requiredForChildren:attribut.data[0].requiredForChildrens,
            defaultValue : defaultValue?defaultValue:attribut.data[0].defaultValue,
        }).where(eq(customAttributs.customAttributId,customAttributId)).returning()
        return {success: true, message: "Attribut successfully updated.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
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
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}
