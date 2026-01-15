'use server'
import { db } from "@/lib/drizzle"
import { planes } from "@/db/planes"
import { GetPlanes } from "../get/planes"
import { DrizzleQueryError, eq } from "drizzle-orm"

interface UpdatePlaneProps {
    planeId: string,
    name: string,
    description: string | null,
    icon: string,
    userEmail : string
}
export async function UpdatePlane({planeId,name,description,icon,userEmail}:UpdatePlaneProps) {
    const allPlanes = await GetPlanes({userEmail:userEmail})
    // Check if plane already exist (name is unique)
    const filteredPlane = allPlanes.filter(userPlane => userPlane.name === name && userPlane.planeId !== planeId)
    if(filteredPlane && filteredPlane.length > 0) throw new Error("Another plane already have this name.")
    try {
        const result = await db.update(planes).set({
            name : name,
            description : description,
            icon : icon
        }).where(eq(planes.planeId,planeId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}