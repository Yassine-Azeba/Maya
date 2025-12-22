'use server'
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { GetPlanes } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"

// ✅ Create
interface CreateLineProps {
    userId:string,
    name:string,
    description?:string,
    parent?: string, // Line id
    planeId?:string // Plane id
}
export async function CreateLine({userId,name,description,parent,planeId}:CreateLineProps) {
    if(!userId || !name || !planeId) return {success: false, message: "Invalid inputs.", data: null}
    const plane = await GetPlanes({planeId : planeId})
    if(!plane|| plane.success === false || !plane.data) return {success: false, message: "Plane does not exist.", data: null}
    try {
        if(parent){
            // Check if parent line exist
            const parentLine = await GetLines({lineId:parent})
            if(!parentLine || parentLine.success === false || !parentLine.data) return {success: false, message: "Provided parent does not exist.", data: null}
            // Check if parent line is from the correct plane (planeId)
            const parentLineFromSamePlane = await isParentLineFromSamePlane({parentLineId:parent,planeId:planeId})
            if(!parentLineFromSamePlane || parentLineFromSamePlane.success === false) return {success: false, message: "Invalid parent (from another space).", data: null}
            const result = await db.insert(lines).values({
                name: name,
                description: description,
                user : userId,
                parent : parent,
                plane : parentLine.data[0].plane
            }).returning()
            return {success: true, message: "Line created successfully.", data: result}
        } else {
            const result = await db.insert(lines).values({
                name: name,
                description: description,
                user : userId,
                plane : planeId
            }).returning()
            return {success: true, message: "Line created successfully.", data: result}
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅ Read
interface GetLinesProps {
    userId?:string,
    lineId?:string,
    planeId?:string,
    name?:string
}
export async function GetLines({userId,lineId,planeId,name}:GetLinesProps) {
    // Only one props should be used to retrieve an line (either user, space, line or name)
    const props = [userId,lineId,planeId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return {success: false, message: "Invalid inputs.", data: null}
    try {
        if(userId){ // Case 1 : Retrieve User's line(s)
            const result = await db.select().from(lines).where(eq(lines.user,userId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(lineId){ // Case 2 : Retrieve line by id
            const result = await db.select().from(lines).where(eq(lines.lineId,lineId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(planeId){ // Case 3 : Retrieve line(s) from a plane
            const result = await db.select().from(lines).where(eq(lines.plane,planeId))
            return {success: true, message: "Line(s) successfully retrieved.", data: result}
        }
        if(name){ // Case 1 : Retrieve line(s) by name
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

// ✅ Check : is parent line above child line
interface isParentLineAboveProps{
    lineId : string,
    parent? : string | null,
}
export async function isParentLineAbove({lineId,parent}:isParentLineAboveProps) {
    // Check line
    if(!lineId) return {success: false, message: "Can't find line.", data: null}
    const line = await GetLines({lineId : lineId})
    if(!line || line.success === false || !line.data) return {success: false, message: "Can't find line.", data: null}
    // Check parent
    if(!parent) return {success: true, message: "Parent is above child.", data: null}
    const parentLine = await GetLines({lineId : parent})
    if(!parentLine || parentLine.success === false || !parentLine.data) return {success: true, message: "Parent is above child.", data: null}
    // Check if parent === child
    if(lineId === parent) return {success: false, message: "Parent is child or below child.", data: null}
    // Recursively test with parent line of parent line
    const px = await GetLines({lineId : parent})
    if(px && px.success === true && px.data) 
        return await isParentLineAbove({lineId : lineId, parent : px.data[0].parent})
    return {success: false, message: "Unknown error occured.", data: null}
}

// ✅ Check : is parent line from the same plane as child line
interface isParentLineFromSamePlaneProps {
    lineId?:string,
    planeId?:string
    parentLineId:string
}
export async function isParentLineFromSamePlane({lineId,planeId,parentLineId}:isParentLineFromSamePlaneProps) {
    if(!parentLineId) return {success: false, message: "Missing input(s).", data: null}
    const parentLine = await GetLines({lineId:parentLineId})
    if(!parentLine || parentLine.success === false || !parentLine.data) return {success: false, message: "Line does not exist.", data: null}
    if(!planeId && !lineId) return {success: false, message: "Too many props, provide line or plane not both.", data: null}
    if(planeId){
        const plane = await GetPlanes({planeId:planeId})
        if(!plane || plane.success === false || !plane.data) return {success: false, message: "Plane does not exist.", data: null}
        if(parentLine.data[0].plane === planeId) return {success: true, message: "Parent Line is from the provided plane.", data: null}
        return {success: false, message: "Unexpected error occured.", data: null}
    }
    if(lineId){
        const line = await GetLines({lineId:lineId})
        if(!line || line.success === false || !line.data) return {success: false, message: "Line does not exist.", data: null}
        if(parentLine.data[0].plane === line.data[0].plane) return {success: true, message: "Parent Line plane and line plane are the same.", data: null}
        return {success: false, message: "Unexpected error occured.", data: null}
    }
    return {success: false, message: "Unknown error occured.", data: null}
}

// ✅ Update
interface UpdateLineProps {
    lineId:string,
    name?:string,
    description?:string,
    parent?:string
}
export async function UpdateLine({lineId,name,description,parent}:UpdateLineProps) {
    if(!lineId) return {success: false, message: "Missing parameter (line id).", data: null}
    const lineToUpdate = await GetLines({lineId:lineId})
    if(!lineToUpdate || lineToUpdate.success === false || !lineToUpdate.data) return {success: false, message: "Can't find line to update.", data: null}
    try {
        if(parent) { // Case 1 : Line's parent is updated
            const parentLine = await GetLines({lineId : parent})
            if(!parentLine || parentLine.success === false || !parentLine.data) return {success: false, message: "Can't find parent line.", data: null}
            
            const isParentAbove = await isParentLineAbove({lineId:lineId, parent:parent})
            const isParentFromSamePlane = await isParentLineFromSamePlane({lineId:lineId,parentLineId:parent})
            if(isParentAbove.success===true && isParentFromSamePlane.success===true){ // Case 1.1 : Parent is correct
                if(name && description) { // Case 1.1.1 : Uppdate name, description and parent
                    const result = await db.update(lines).set({
                        name : name,
                        description : description,
                        parent : parent
                    }).where(eq(lines.lineId,lineId)).returning()
                    return {success: true, message: "Plane successfully updated.", data: result}
                }
                if (name && !description) { // Case 1.1.2 : Uppdate name and parent
                    const result = await db.update(lines).set({
                        name : name,
                        parent : parent
                    }).where(eq(lines.lineId,lineId)).returning()
                    return {success: true, message: "Plane name successfully updated.", data: result}
                }
                if (!name && description) { // Case 1.1.3 : Uppdate description and parent
                    const result = await db.update(lines).set({
                        description : description,
                        parent : parent
                    }).where(eq(lines.lineId,lineId)).returning()
                    return {success: true, message: "Plane description successfully updated.", data: result}
                }
            } else { // Case 1.2 : Parent is incorrect (either)
                return {success: false, message: "Invalid parent selected.", data: null}
            }
        }
        // Case 2 : Line's parent is not updated
        if(name && description) { // Case 2.1 : Line's name and description are updated
            const result = await db.update(lines).set({
                name : name,
                description : description
            }).where(eq(lines.lineId,lineId)).returning()
            return {success: true, message: "Plane successfully updated.", data: result}
        }
        if (name && !description) { // Case 2.1 : Line's name and description are updated
            const result = await db.update(lines).set({
                name : name
            }).where(eq(lines.lineId,lineId)).returning()
            return {success: true, message: "Plane name successfully updated.", data: result}
        }
        if (!name && description) { // Case 2.1 : Line's name and description are updated
            const result = await db.update(lines).set({
                description : description
            }).where(eq(lines.lineId,lineId)).returning()
            return {success: true, message: "Plane description successfully updated.", data: result}
        }
        return {success: false, message: "Unknown error occured.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅ Delete
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