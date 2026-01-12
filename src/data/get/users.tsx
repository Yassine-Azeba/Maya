"use server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { users } from "@/db/schema"
import { DrizzleQueryError } from "drizzle-orm"

interface GetUserByIdProps {
    email:string
}
export async function GetUser({email}:GetUserByIdProps) {
    try {
        const result = await db.select().from(users).where(eq(users.email,email))
        if(result.length === 0) throw new Error("Can't find user.")
        if(result.length > 1) throw new Error("Unknown error occured.")
        return result[0]
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}