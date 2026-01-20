'use server'
import { eq } from "drizzle-orm"
import { GetUser } from "./users"
import { lines } from "@/db/lines"
import { db } from "@/lib/drizzle"
import { DrizzleQueryError } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"

interface GetCustomAttributsProps {
    attributId : string
}
export async function GetCustomAttributs({attributId}:GetCustomAttributsProps) {
    try{
        const result = await db.select().from(customAttributs).where(eq(customAttributs.customAttributId,attributId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetUserCustomAttributsProps {
    userEmail : string
}
export async function GetUserCustomAttributs({userEmail}:GetUserCustomAttributsProps) {
    const user = await GetUser({email:userEmail})
    try{
        const result = await db.select().from(customAttributs).where(eq(customAttributs.userId,user.id))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}