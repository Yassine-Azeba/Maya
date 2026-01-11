'use server'
import { GetUser } from "./user"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { GetPlanes } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"

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
    if(!plane || plane.success === false || !plane.data) throw new Error("Can't find plane.")
    const user = await GetUser({userId:userId})
    if(!user || user.success === false || !user.data) throw new Error("Can't find user.")
    if(parentId){
        const parent = await GetLines({lineId:parentId})
        if(!parent || parent.success === false || !parent.data) throw new Error("Can't find parent.")
        if(parent.data[0].plane !== planeId) throw new Error("Parent is from another plane.")
        // Check duplicates
        const sameLevelLines = await GetLines({parentId:parentId})
        const filteredSameLevelLines = sameLevelLines.data.filter(line => line.name === name)
        if(filteredSameLevelLines.length > 0) throw new Error("Line already exist.")
    } else {
        // Check duplicate (top level)
        const topLevelLines = await GetLines({userId:userId})
        const filteredTopLevelLines = topLevelLines.data.filter(line => line.parent === null && line.name === name)
        if(filteredTopLevelLines.length > 0) throw new Error("Line already exist.")
    }
    try{
        const result = await db.insert(lines).values({
            name: name,
            description: description,
            userId : userId,
            parent : parentId,
            plane : planeId,
        }).returning()
        return {success: true, message: "Line created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

// ✅✅ Read
interface GetLinesProps {
    userId? : string,
    lineId? : string,
    planeId? : string,
    name? : string,
    parentId? : string
}
export async function GetLines({userId,lineId,planeId,name,parentId}:GetLinesProps) {
    // Only one props should be used to retrieve a line (either user, space, line or name)
    const props = [userId,lineId,planeId,name,parentId].filter((p) => p !== undefined)
    if(props.length !== 1 ) throw new Error("Invalid inputs.")
    try {
        if(userId){
            const user = await GetUser({userId:userId})
            if(!user || user.success === false || !user.data) throw new Error("User doesn't exist.")
            const result = await db.select().from(lines).where(eq(lines.userId,userId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(planeId){
            const plane = await GetPlanes({planeId:planeId})
            if(!plane || plane.success === false || !plane.data) throw new Error("Plane doesn't exist.")
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
        if(parentId){
            const result = await db.select().from(lines).where(eq(lines.parent,parentId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
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

// ✅✅ Get parents
interface GetLineParentsProps {
    lineId : string
}
export async function GetLineParents({lineId}:GetLineParentsProps) {
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
    return {success: true, message: "All parents lines retrieved successfully.", data: parents}
}

// ✅✅ Checks : is Parent ?
interface IsParentProps {
    parentlineId : string,
    lineId : string
}
export async function IsParent({parentlineId,lineId}:IsParentProps) {
    const parentLine = await GetLines({lineId:parentlineId})
    if(!parentLine || parentLine.success === false || !parentLine.data) return {success: false, message: "Line does not exist", data: null}
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Line does not exist", data: null}

    const lineParents = await GetLineParents({lineId : lineId})
    if(lineParents && lineParents.success === true && lineParents.data && lineParents.data.includes(parentlineId)) return {success: true, message: "Parent line is parent of Line.", data: null}
    return {success: false, message: "Parent Line is not parent of Line.", data: null}
}

// ✅✅ Checks : lines from the same plane ?
interface areLineFromSamePlaneProps {
    lineIdA : string,
    lineIdB : string
}
export async function AreLineFromSamePlane({lineIdA,lineIdB}:areLineFromSamePlaneProps) {
    const lineA = await GetLines({lineId:lineIdA})
    if(!lineA || lineA.success === false || !lineA.data) return {success: false, message: "Line does not exist", data: null}
    const lineB = await GetLines({lineId:lineIdB})
    if(!lineB || lineB.success === false || !lineB.data) return {success: false, message: "Line does not exist", data: null}

    if(lineA.data[0].plane === lineB.data[0].plane) return {success: true, message: "Both lines are from the same plane.", data: null}
    return {success: false, message: "Lines are from different planes.", data: null}
}

// ✅✅ Checks : is parent line same as line ?
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
    if(!line || line.success === false || !line.data) throw new Error("Line does not exist.")
    
    if(parentId){
        // Does parent exist ?
        const parent = await GetLines({lineId:parentId})
        if(!parent || parent.success === false || !parent.data) throw new Error("Can't find parent.")
        // is parent same as line ?
        const isParentLineIsLine = await isParentLineSameAsLine({parentLineId:parentId,lineId:lineId})
        if(!isParentLineIsLine.success) throw new Error(isParentLineIsLine.message)
        // is parent from same plane ?
        const isParentFromSamePlane = await AreLineFromSamePlane({lineIdA:lineId,lineIdB:parentId})
        if(!isParentFromSamePlane.success) throw new Error(isParentFromSamePlane.message)
        // is parent above ?
        const isParentAbove = await IsParent({lineId:parentId,parentlineId:lineId})
        if(isParentAbove.success) throw new Error("The parent you provide is a child of the line you are updating.")
        // Check duplicates
        const sameLevelLines = await GetLines({parentId:parentId})
        const filteredSameLevelLines = sameLevelLines.data.filter(line => line.name === name)
        if(filteredSameLevelLines.length > 0) throw new Error("Line already exist.")
    }
    try{
        const result = await db.update(lines).set({
            name: name?name:line.data[0].name,
            description: description?description:line.data[0].name,
            parent : parentId?parentId:line.data[0].parent,
        }).where(eq(lines.lineId,lineId)).returning()
        return {success: true, message: "Line updated successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}


// ✅✅ Delete
interface DeleteLineProps {
    lineId : string
}
export async function DeleteLine({lineId}:DeleteLineProps) {
    try {
        const result = await db.delete(lines).where(eq(lines.lineId,lineId)).returning()
        return {success: true, message: "Line successfully deleted.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}