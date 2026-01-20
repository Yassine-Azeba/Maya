'use server'
import { db } from "@/lib/drizzle"
import { DrizzleQueryError, eq } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"

interface DeleteCustomAttributProps {
    attributId : string
}
export async function DeleteCustomAttribut({attributId}:DeleteCustomAttributProps) {
    try {
        const result = await db.delete(customAttributs).where(eq(customAttributs.customAttributId,attributId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}