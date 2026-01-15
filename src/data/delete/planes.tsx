'use server'
import { db } from "@/lib/drizzle"
import { planes } from "@/db/planes"
import { DrizzleQueryError, eq } from "drizzle-orm"

interface DeletePlaneProps {
    planeId : string
}
export async function DeletePlane({planeId}:DeletePlaneProps) {
    try {
        const result = await db.delete(planes).where(eq(planes.planeId,planeId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}