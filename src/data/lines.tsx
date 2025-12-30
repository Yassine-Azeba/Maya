'use server'
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { GetPlanes } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"
import { GetUser } from "./user"

// ✅✅ Create
interface CreateLineProps {
    name: string,
    description? : string,
    userId : string,
    planeId : string,
    parentId? : string
}
export async function CreateLine({name,description,userId,planeId,parentId}:CreateLineProps) {
    const plane = await GetPlanes({planeId:planeId})
    if(!plane || plane.success === false || !plane.data) return {success: false, message: "Can't find plane.", data: null}
    const user = await GetUser({userId:userId})
    if(!user || user.success === false || !user.data) return {success: false, message: "Can't find user.", data: null}

    if(parentId){
        const parent = await GetLines({lineId:parentId})
        if(!parent || parent.success === false || !parent.data) return {success: false, message: "Can't find parent.", data: null}
        if(parent.data[0].plane !== planeId) return {success: false, message: "Parent is from another plane.", data: null}
    }
    try{
        const result = await db.insert(lines).values({
            name: name,
            description: description,
            user : userId,
            parent : parentId,
            plane : planeId
        }).returning()
        return {success: true, message: "Line created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }

}

// ✅✅ Read
interface GetLinesProps {
    userId? : string,
    lineId? : string,
    planeId? : string,
    name? : string
}
export async function GetLines({userId,lineId,planeId,name}:GetLinesProps) {
    // Only one props should be used to retrieve an line (either user, space, line or name)
    const props = [userId,lineId,planeId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return {success: false, message: "Invalid inputs.", data: null}
    try {
        if(userId){
            const user = await GetUser({userId:userId})
            if(!user || user.success === false || !user.data) return {success: false, message: "User doesn't exist.", data: null}
            const result = await db.select().from(lines).where(eq(lines.user,userId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(planeId){
            const plane = await GetPlanes({planeId:planeId})
            if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane doesn't exist.", data: null}
            const result = await db.select().from(lines).where(eq(lines.plane,planeId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(lineId){
            const result = await db.select().from(lines).where(eq(lines.lineId,lineId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(name){
            const result = await db.select().from(lines).where(eq(lines.name,name))
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

// ✅✅ Get parents
interface GetParentsProps {
    lineId : string
}
export async function GetParents({lineId}:GetParentsProps) {
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Can't find line.", data: null}
    var parents : string[] = []
    var parentLineId : string | null = line.data[0].parent
    while(parentLineId) {
        parents.push(parentLineId)
        const newLine = await GetLines({lineId:parentLineId})
        if(!newLine || newLine.success === false || !newLine.data) { 
            parentLineId = null
        } else {
            parentLineId = newLine.data[0].parent
        }
    }
    return {success: true, message: "All line parents retrieved successfully.", data: parents}
}

// ✅✅ Checks : isParent
interface IsParentProps {
    parentlineId : string,
    lineId : string
}
export async function IsParent({parentlineId,lineId}:IsParentProps) {
    const parentLine = await GetLines({lineId:parentlineId})
    if(!parentLine || parentLine.success === false || !parentLine.data) return {success: false, message: `${parentLine} doesn't exist.`, data: null}
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: `${line} doesn't exist.`, data: null}

    const lineParents = await GetParents({lineId : lineId})
    if(lineParents && lineParents.success === true && lineParents.data && lineParents.data.includes(parentlineId)) return {success: true, message: "Parent line is parent of Line.", data: null}
    return {success: false, message: "Parent Line is not parent of Line.", data: null}
}

// ✅✅ Checks : lines from the same plane
interface areLineFromSamePlaneProps {
    lineIdA : string,
    lineIdB : string
}
export async function AreLineFromSamePlane({lineIdA,lineIdB}:areLineFromSamePlaneProps) {
    const lineA = await GetLines({lineId:lineIdA})
    if(!lineA || lineA.success === false || !lineA.data) return {success: false, message: `${lineA} doesn't exist.`, data: null}
    const lineB = await GetLines({lineId:lineIdB})
    if(!lineB || lineB.success === false || !lineB.data) return {success: false, message: `${lineB} doesn't exist.`, data: null}

    if(lineA.data[0].plane === lineB.data[0].plane) return {success: true, message: "Both lines are from the same plane.", data: null}
    return {success: false, message: "Lines are from different planes.", data: null}
}

// ✅✅ Checks : is parent line same as line
interface isParentLineSameAsLineProps {
    parentLineId : string,
    lineId : string
}
export async function isParentLineSameAsLine({parentLineId,lineId}:isParentLineSameAsLineProps) {
    if(parentLineId === lineId) return {success: false, message: "Parent line is line itself.", data: null}
    return {success: true, message: "Line is different from parent.", data: null}
}

// ✅✅ Update
interface UpdateLineProps {
    lineId : string,
    name? : string,
    description? : string,
    parentId? : string
}
export async function UpdateLine({lineId,name,description,parentId}:UpdateLineProps){
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Line does not exist.", data: null} 
    
    if(parentId){
        // Does parent exist ?
        const parent = await GetLines({lineId:parentId})
        if(!parent || parent.success === false || !parent.data) return {success: false, message: "Can't find parent.", data: null}
        // is parent same as line ?
        const isParentLineIsLine = await isParentLineSameAsLine({parentLineId:parentId,lineId:lineId})
        if(!isParentLineIsLine.success) return {success: false, message: isParentLineIsLine.message, data: null}
        // is parent from same plane ?
        const isParentFromSamePlane = await AreLineFromSamePlane({lineIdA:lineId,lineIdB:parentId})
        if(!isParentFromSamePlane.success) return {success: false, message: isParentFromSamePlane.message, data: null}
        // is parent above ?
        const isParentAbove = await IsParent({lineId:parentId,parentlineId:lineId})
        if(isParentAbove.success) return {success: false, message: "The parent you provide is a child of the line you are updating.", data: null}
    }
    try{
        const result = await db.update(lines).set({
            name: name?name:line.data[0].name,
            description: description?description:line.data[0].name,
            parent : parentId?parentId:line.data[0].parent,
        }).returning()
        return {success: true, message: "Line created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}


// ✅✅ Delete
interface DeleteLineProps {
    lineId : string
}
export async function DeleteLine({lineId}:DeleteLineProps) {
    if(!lineId) return {success: false, message: "Invalid input.", data: null}
    try {
        const result = await db.delete(lines).where(eq(lines.lineId,lineId))
        if(result.rowCount === 1) return {success: true, message: "Line deleted successfully.", data: null}
        else return {success: false, message: "Unknown error occured. Please try again.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}