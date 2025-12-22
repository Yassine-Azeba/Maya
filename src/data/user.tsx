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
    if(!userId && !email) return {success: false, message: "Provide at least one prop.", data: null}
    try {
        if(userId && email) return {success: false, message: "Only one prop is required.", data: null}
        if(userId) {
            const result = await db.select().from(users).where(eq(users.id,userId))
            return {success: true, message: "User retrieved.", data: result}
        }
        if(email){
            const result = await db.select().from(users).where(eq(users.email,email))
            return {success: true, message: "User retrieved.", data: result}
        }
        return {success: false, message: "Unknown error occured.", data: null}
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            return {success: false, message: error.message, data: null}
        } else {
            return {success: false, message: "Unknown error occured. Please try again.", data: null}
        }
    }
}