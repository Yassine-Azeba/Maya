'use server'
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { planes } from "@/db/planes"
import { DrizzleQueryError } from "drizzle-orm"
import { GetUser } from "./user"

// ✅✅ Create
interface CreatePlaneProps {
    userId:string,
    name:string,
    description?:string
}
export async function CreatePlane({userId,name,description}:CreatePlaneProps) {
    if(!userId || !name) return {success: false, message: "Invalid inputs.", data: null}
    // Check if user exist
    const user = await GetUser({userId:userId})
    if(!user || user.success === false || !user.data) return {success: false, message: "Invalid user.", data: null}
    const plane = await GetPlanes({userId:userId})
    const filteredPlane = plane.data?.filter(plane => plane.name === name)
    if(filteredPlane && filteredPlane.length > 0) return {success: false, message: "Plane already exist.", data: null}
    try{
        const result = await db.insert(planes).values({
            name: name,
            description: description,
            userId : userId
        }).returning()
        return {success: true, message: "Plane created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Read
interface GetPlanesProps {
    planeId?:string,
    name?:string,
    userId?:string
}
export async function GetPlanes({planeId,name,userId}:GetPlanesProps) {
    const props = [planeId,name,userId].filter((p) => p !== undefined)
    if(props.length !== 1) return {success: false, message: "Please provide only one parameter.", data: null}
    try{
        if(planeId){ // Case 1 : Retrieve plane by id
            const result = await db.select().from(planes).where(eq(planes.planeId,planeId))
            return {success: true, message: "Plane(s) successfully retrieved.", data: result}
        }
        if(name){ // Case 2 : Retrieve plane by name
            const result = await db.select().from(planes).where(eq(planes.name,name))
            return {success: true, message: "Plane(s) successfully retrieved.", data: result}
        }
        if(userId){ // Case 3 : Retrieve user's plane(s)
            const result = await db.select().from(planes).where(eq(planes.userId,userId))
            return {success: true, message: "Plane(s) successfully retrieved.", data: result}
        }
        return {success: false, message: "Unexpected error occured.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Update
interface UpdatePlaneProps {
    planeId:string,
    name?:string,
    description?:string
}
export async function UpdatePlane({planeId,name,description}:UpdatePlaneProps) {
    if(!planeId) return {success: false, message: "Missing parameter (plane id).", data: null}
    try {
        if(name && description) { // Case 1 : Update plane name and description
            const result = await db.update(planes).set({
                name : name,
                description : description
            }).where(eq(planes.planeId,planeId)).returning()
            return {success: true, message: "Plane successfully updated.", data: result}
        }
        if (name && !description) { // Case 2 : Update plane name only
            const result = await db.update(planes).set({
                name : name
            }).where(eq(planes.planeId,planeId)).returning()
            return {success: true, message: "Plane name successfully updated.", data: result}
        }
        if (!name && description) { // Case 3 : Update plane description only
            const result = await db.update(planes).set({
                description : description
            }).where(eq(planes.planeId,planeId)).returning()
            return {success: true, message: "Plane description successfully updated.", data: result}
        }
        return {success: false, message: "Unknown error occured (missing attributs ?).", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}

// ✅✅ Delete
interface DeletePlaneProps {
    planeId : string
}
export async function DeletePlane({planeId}:DeletePlaneProps) {
    if(!planeId) return {success: false, message: "Missing parameter (plane id).", data: null}
    try {
        const result = await db.delete(planes).where(eq(planes.planeId,planeId)).returning()
        return {success: true, message: "Plane successfully deleted.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}