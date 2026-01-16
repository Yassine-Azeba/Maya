'use server'
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { DrizzleQueryError, eq } from "drizzle-orm"

interface DeleteLineProps {
    lineId : string
}
export async function DeleteLine({lineId}:DeleteLineProps) {
    try {
        const result = await db.delete(lines).where(eq(lines.lineId,lineId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}