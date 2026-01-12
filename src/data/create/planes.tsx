'use server'
import { db } from "@/lib/drizzle"
import { DrizzleQueryError } from "drizzle-orm"
import { GetUser } from "../get/users"
import { GetPlanes } from "../get/planes"
import { planes } from "@/db/planes"

interface CreatePlaneProps {
    userEmail:string,
    name:string,
    icon:string,
    description?:string
}
export default async function CreatePlane({userEmail,name,icon,description}:CreatePlaneProps){
    const user = await GetUser({email:userEmail})
    // [Check] Check if plane already exist
    const userPlanes = await GetPlanes({userEmail:userEmail})
    const filteredPlanes = userPlanes.filter(plane => plane.name===name)
    if(filteredPlanes.length > 0) throw new Error("Another plane already have this name.")
    
    try {
        const result = await db.insert(planes).values({
            name: name,
            description: description,
            icon: icon,
            userId : user.id,
        }).returning()
        return {success: true, message: "Plane created successfully.", data: result}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}