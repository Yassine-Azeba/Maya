'use server'
import { eq } from "drizzle-orm"
import { dots } from "@/db/dots"
import { GetUser } from "./user"
import { db } from "@/lib/drizzle"
import { GetPlanes } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"
import { GetLineParents, GetLines } from "./lines"

// ✅✅Create
interface CreateDotProps {
    name: string,
    description? : string,
    userId : string,
    lineId : string,
    planeId : string,
    parentId? : string
}
export async function CreateDot({name,description,userId,lineId,planeId,parentId}:CreateDotProps) {
    const user = await GetUser({userId:userId})
    if(!user || user.success === false || !user.data) return {success: false, message: "User doesn't exist.", data: null}
    const line = await GetLines({lineId: lineId})
    if(!line || line.success === false || !line.data || line.data[0].plane !== planeId) return {success: false, message: "Line doesn't exist or is in another plane.", data: null}
    const plane = await GetPlanes({planeId:planeId})
    if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane doesn't exist.", data: null}
    if(parentId){
        const parentDot = await GetDots({dotId:parentId})
        if(!parentDot || parentDot.success === false || !parentDot.data) return {success: false, message: "Parent Dot doesn't exist.", data: null}
        // is parent dot from same plane ?
        if(parentDot.data[0].plane !== planeId) return {success: false, message: "Parent Dot is in another plane.", data: null}
        // is parent dot from same line ?
        if(parentDot.data[0].line === lineId) return {success: false, message: "Parent Dot must be in a line above.", data: null}
        // is line of parent dot (parentDot.data[0].line), above dot's line (lineId)
        const lineParents = await GetLineParents({lineId:parentDot.data[0].line})
        if(lineParents.data?.includes(lineId)) return {success: false, message: "Parent Dot must be in a line above.", data: null}
    }
    try{
        const result = await db.insert(dots).values({
            name: name,
            description: description,
            user : userId,
            line : lineId,
            plane : planeId,
            parent : parentId,
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
interface GetDotsProps {
    userId? : string,
    planeId? : string
    lineId? : string,
    dotId? : string,
    name? : string
}
export async function GetDots({userId,planeId,lineId,dotId,name}:GetDotsProps) {
    // Only one props should be used to retrieve an line (either user, space, line or name)
    const props = [userId,planeId,lineId,dotId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return {success: false, message: "Invalid inputs.", data: null}
    try {
        if(userId){
            const user = await GetUser({userId:userId})
            if(!user || user.success === false || !user.data) return {success: false, message: "User doesn't exist.", data: null}
            const result = await db.select().from(dots).where(eq(dots.user,userId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(planeId){
            const plane = await GetPlanes({planeId:planeId})
            if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane doesn't exist.", data: null}
            const result = await db.select().from(dots).where(eq(dots.plane,planeId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(lineId){
            const line = await GetLines({lineId:lineId})
            if(!line || line.success === false || !line.data) return {success: false, message: "Line doesn't exist.", data: null}
            const result = await db.select().from(dots).where(eq(dots.line,lineId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(dotId){
            const result = await db.select().from(dots).where(eq(dots.dotId,dotId))
            return {success: true, message: "Dot successfully retrieved.", data: result}
        }
        if(name){
            const result = await db.select().from(dots).where(eq(dots.name,name))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
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

// ✅✅ Get Parent
interface GetDotParentsProps {
    dotId : string
}
export async function GetDotParents({dotId}:GetDotParentsProps) {
    const dot = await GetDots({dotId:dotId})
    if(!dot || dot.success === false || !dot.data) return {success: false, message: "Can't find dot.", data: null}
    var parents : string[] = []
    var parentDotId : string | null = dot.data[0].parent
    while(parentDotId) {
        parents.push(parentDotId)
        const newDot = await GetDots({dotId:parentDotId})
        if(!newDot || newDot.success === false || !newDot.data) { 
            parentDotId = null
        } else {
            parentDotId = newDot.data[0].parent
        }
    }
    return {success: true, message: "All parent dots retrieved successfully.", data: parents}
}

// ✅✅ Check : is Parent ?
interface IsDotParentProps {
    parentDotId : string,
    dotId : string
}
export async function IsParent({dotId,parentDotId}:IsDotParentProps) {
    const parentDot = await GetDots({dotId:parentDotId})
    if(!parentDot || parentDot.success === false || !parentDot.data) return {success: false, message: "Line does not exist", data: null}
    const dot = await GetDots({dotId:dotId})
    if(!dot || dot.success === false || !dot.data) return {success: false, message: "Line does not exist", data: null}
    
    const dotsParents = await GetDotParents({dotId : dotId})
    if(dotsParents && dotsParents.success === true && dotsParents.data && dotsParents.data.includes(parentDotId)) return {success: true, message: "Parent dot is parent of dot.", data: null}
    return {success: false, message: "Parent dot is not parent of dot.", data: null}
}

// ✅✅ Check : are dots from same plane ?
interface areDotsFromSamePlaneProps {
    dotIdA : string,
    dotIdB : string
}
export async function AreLineFromSamePlane({dotIdA,dotIdB}:areDotsFromSamePlaneProps) {
    const dotA = await GetDots({dotId:dotIdA})
    if(!dotA || dotA.success === false || !dotA.data) return {success: false, message: "Dot does not exist", data: null}
    const dotB = await GetDots({dotId:dotIdB})
    if(!dotB || dotB.success === false || !dotB.data) return {success: false, message: "Dot does not exist", data: null}
    
    if(dotA.data[0].plane === dotB.data[0].plane) return {success: true, message: "Both dots are from the same plane.", data: null}
    return {success: false, message: "Dots are from different planes.", data: null}
}

// ✅✅ Check : are dots from same line ?
interface areDotsFromSameLineProps {
    dotIdA : string,
    dotIdB : string
}
export async function AreLineFromSameLine({dotIdA,dotIdB}:areDotsFromSameLineProps) {
    const dotA = await GetDots({dotId:dotIdA})
    if(!dotA || dotA.success === false || !dotA.data) return {success: null, message: "Dot does not exist", data: null}
    const dotB = await GetDots({dotId:dotIdB})
    if(!dotB || dotB.success === false || !dotB.data) return {success: null, message: "Dot does not exist", data: null}
    
    if(dotA.data[0].line === dotB.data[0].line) return {success: true, message: "Both dots are from the same line.", data: null}
    return {success: false, message: "Dots have different lines.", data: null}
}

// ✅✅ Check : is Parent Dot same as Dot
interface isParentDotSameAsDotProps {
    parentDotId : string,
    dotId : string
}
export async function isParentLineSameAsLine({dotId,parentDotId}:isParentDotSameAsDotProps) {
    if(dotId === parentDotId) return {success: false, message: "Parent dot is dot itself.", data: null}
    return {success: true, message: "Dots is different from his parent.", data: null}
}

// ✅✅ Update
interface UpdateDotProps {
    dotId : string,
    name?: string,
    description? : string,
    parentId? : string
}
export async function UpdateDot({dotId,name,description,parentId}:UpdateDotProps){
    const dot = await GetDots({dotId:dotId})
    if(!dot || dot.success === false || !dot.data) return {success: null, message: "Dot does not exist", data: null}
    if(parentId){
        const parent = await GetDots({dotId:parentId})
        if(!parent || parent.success === false || !parent.data) return {success: null, message: "Parent dot does not exist", data: null}
        // is parent dot from same plane ?
        if(parent.data[0].plane !== dot.data[0].plane) return {success: false, message: "Parent Dot is in another plane.", data: null}
        // is parent dot from same line ?
        if(parent.data[0].line === dot.data[0].line) return {success: false, message: "Parent Dot must be in a line above.", data: null}
        // is line of parent dot (parentDot.data[0].line), above dot's line (lineId)
        const lineParents = await GetLineParents({lineId:parent.data[0].line})
        if(lineParents.data?.includes(dot.data[0].line)) return {success: false, message: "Parent Dot must be in a line above.", data: null}
    }
    try{
        const result = await db.update(dots).set({
            name: name?name:dot.data[0].name,
            description: description?description:dot.data[0].name,
            parent : parentId?parentId:dot.data[0].parent,
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
interface DeleteDotProps {
    dotId : string
}
export async function DeleteDot({dotId}:DeleteDotProps) {
    try {
        const result = await db.delete(dots).where(eq(dots.dotId,dotId))
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