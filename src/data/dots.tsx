'use server'
import { eq } from "drizzle-orm"
import { dots } from "@/db/dots"
import { db } from "@/lib/drizzle"
import { GetLines, isParentLineFromSamePlane } from "./lines"
import { DrizzleQueryError } from "drizzle-orm"
import { GetPlanes } from "./planes"

// TODO : Update and Test

// Create
interface CreateDotProps {
    userId:string,
    name:string,
    lineId: string,
    planeId:string, // Plane id
    description?:string,
    parent?: string // dot id
}
export async function CreateDot({userId,name,lineId,description,parent,planeId}:CreateDotProps) {
    if(!userId || !name || !lineId || !planeId) return {success: false, message: "Invalid inputs.", data: null}
    // Check line
    const line = await GetLines({lineId:lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Line does not exist.", data: null}
    // Check plane
    const plane = await GetPlanes({planeId:planeId})
    if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane does not exist.", data: null}
    // Check if line belongs to plane 
    const isLineFromPlane = await isParentLineFromSamePlane({parentLineId:lineId,planeId:planeId})
    if(!isLineFromPlane || isLineFromPlane.success === false) return {success: false, message: "Line is not from the selected Plane.", data: null}
    try{
        if(parent){
            // Check if parent is from the same plane (parent & planeId) => Yes
            // const parentDotFromSamePlane = await isParentDotFromSamePlane({dotId}) => Update function to take either both dots or one dot and plane
            const result = await db.insert(dots).values({
                name : name,
                description : description,
                line : lineId,
                plane : planeId,
                user : userId,
                parent : parent
            }).returning()
            return {success: true, message: "Dot created successfully.", data: result}
        }
        const result = await db.insert(dots).values({
            name : name,
            description : description,
            line : lineId,
            plane : planeId,
            user : userId
        }).returning()
        return {success: true, message: "Dot created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅ Read
interface GetDotsProps {
    userId?:string,
    planeId?: string
    lineId?:string,
    dotId?:string,
    name?:string
}
export async function GetDots({userId,planeId,lineId,dotId,name}:GetDotsProps) {
    // Only one props should be used to retrieve a dot.
    const props = [userId,planeId,lineId,dotId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return {success: false, message: "Invalid inputs.", data: null}
    try {
        if(userId){ // Case 1 : Retrieve User's Dot(s)
            const result = await db.select().from(dots).where(eq(dots.user,userId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(planeId){ // Case 2 : Retrieve Plane's Dot(s)
            const result = await db.select().from(dots).where(eq(dots.plane,planeId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(lineId){ // Case 3 : Retrieve Line's Dot(s)
            const result = await db.select().from(dots).where(eq(dots.line,lineId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(dotId){ // Case 4 : Retrieve Dot by Id
            const result = await db.select().from(dots).where(eq(dots.dotId,dotId))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
        if(name){ // Case 5 : Retrieve Dot(s) by name
            const result = await db.select().from(dots).where(eq(dots.name,name))
            return {success: true, message: "Dot(s) successfully retrieved.", data: result}
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅ Check : is parent Dot from the same plane
interface isParentDotFromSamePlaneProps {
    dotId:string,
    parent:string
}
export async function isParentDotFromSamePlane({dotId,parent}:isParentDotFromSamePlaneProps) {
    // Check if props exist
    if(!dotId || !parent) return {success: false, message: "Missing input(s).", data: null}
    const dot = await GetDots({dotId:dotId})
    const parentDot = await GetDots({dotId:parent})
    // Check if line and parentline exist
    if(!dot || dot.success === false || !dot.data) return {success: false, message: "Can't find dot.", data: null}
    if(!parentDot || parentDot.success === false || !parentDot.data) return {success: false, message: "Can't find parent line.", data: null}
    // Check if line plane and parent line plane are the same
    if(parentDot.data[0].plane === dot.data[0].plane) return {success: true, message: "Dot and parent Dot are from the same plane.", data: null}
    return {success: false, message: "Unknown error occured.", data: null}
}

// ✅ Check : is parent dot not a child of dot
interface isParentDotAboveProps{
    dotId : string,
    parent? : string | null,
}
export async function isParentDotAbove({dotId,parent}:isParentDotAboveProps) {
    // Check line
    if(!dotId) return {success: false, message: "Can't find line.", data: null}
    const dot = await GetDots({dotId : dotId})
    if(!dot || dot.success === false || !dot.data) return {success: false, message: "Can't find dot.", data: null}
    // Check parent
    if(!parent) return {success: true, message: "Parent is above child.", data: null}
    const parentDot = await GetDots({dotId : parent})
    if(!parentDot || parentDot.success === false || !parentDot.data) return {success: true, message: "Parent is above child.", data: null}
    // Check if parent === child
    if(dotId === parent) return {success: false, message: "Parent is child or below child.", data: null}
    // Recursively test with parent line of parent line
    const px = await GetDots({dotId : parent})
    if(px && px.success === true && px.data) 
        return await isParentDotAbove({dotId : dotId, parent : px.data[0].parent})
    return {success: false, message: "Unknown error occured.", data: null}
}

// ✅ Check : is dot line from the same plane
interface isDotLineFromSamePlaneProps {
    dotId? : string,
    plane? : string,
    lineId : string
}
export async function isDotLineFromSamePlane({dotId,plane,lineId}:isDotLineFromSamePlaneProps) {
    if(!lineId) return {success: false, message: "Missing inputs.", data: null}
    if(!dotId && !plane) return {success: false, message: "Missing inputs, please provide plane or dot id.", data: null}
    if(dotId){
        const dot = await GetDots({dotId:dotId})
        const line = await GetLines({lineId:lineId})
        if(!dot || dot.success === false || !dot.data)  return {success : false, message : "Can't find Dot.", data: null}
        if(!line || line.success === false || !line.data)  return {success : false, message : "Can't find Line.", data: null}
        if(dot.data[0].plane === line.data[0].plane) return {success : true, message : "Line is from the same plane as dot.", data: null}
        return {success : false, message : "Unknown error occured.", data: null}
    }
    if(plane){
        const line = await GetLines({lineId:lineId})
        if(!line || line.success === false || !line.data)  return {success : false, message : "Can't find Line.", data: null}
        if(plane === line.data[0].plane) return {success : true, message : "Line is from the same plane as dot.", data: null}
        return {success : false, message : "Unknown error occured.", data: null}
    }
    return {success : false, message : "Unknown error occured.", data: null}
}

// Update
interface UpdateDotProps {
    dotId: string,
    name?: string,
    description?: string,
    lineId?: string,
    parentId?: string
}
export async function UpdateDot({dotId,name,description,lineId,parentId}:UpdateDotProps) {
    if(!dotId) return {success : false, message : "Can't find the Dot.", data: null}
    const dot = await GetDots({dotId:dotId})
    if(!dot || dot.success === false || !dot.data) return {success : false, message : "Can't find the Dot.", data: null}
}

// ✅ Delete
interface DeleteDotProps {
    dotId : string
}
export async function DeleteDot({dotId}:DeleteDotProps) {
    if(!dotId) return {success: false, message: "Invalid input.", data: null}
    try {
        const result = await db.delete(dots).where(eq(dots.dotId,dotId))
        if(result.rowCount === 1) return {success: true, message: "Dot deleted successfully.", data: null}
        else return {success: false, message: "Unknown error occured. Please try again.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}