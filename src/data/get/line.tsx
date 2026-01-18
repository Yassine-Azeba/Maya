'use server'
import { eq } from "drizzle-orm"
import { lines } from "@/db/lines"
import { db } from "@/lib/drizzle"
import { DrizzleQueryError } from "drizzle-orm"
import { GetUser } from "./users"

interface GetLinesProps {
    lineId:string
}
export async function GetLines({lineId}:GetLinesProps) {
    try{
        const result = await db.select().from(lines).where(eq(lines.lineId,lineId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetUserLinesProps {
    userEmail : string
}
export async function GetUserLines({userEmail}:GetUserLinesProps) {
    const user = await GetUser({email:userEmail})
    try{
        const result = await db.select().from(lines).where(eq(lines.userId,user.id))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}