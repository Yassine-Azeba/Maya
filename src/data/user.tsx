"use server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { users } from "@/db/schema"
import { DrizzleQueryError } from "drizzle-orm"

// ✅✅ Read
interface GetUserByIdProps {
    userId?:string,
    email?:string
}
export async function GetUser({userId,email}:GetUserByIdProps) {
    if(!userId && !email) throw new Error("Provide at least one prop.")
    try {
        if(userId && email) throw new Error("Only one prop is required.")
        if(userId) {
            const result = await db.select().from(users).where(eq(users.id,userId))
            return {success: true, message: "User retrieved.", data: result}
        }
        if(email){
            const result = await db.select().from(users).where(eq(users.email,email))
            return {success: true, message: "User retrieved.", data: result}
        }
        throw new Error("Unknown error occured.")
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}