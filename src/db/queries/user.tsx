"use server"
import { db } from ".."
import { eq } from "drizzle-orm"
import { users } from "@/db/schema/schema"
import { DrizzleQueryError } from "drizzle-orm"

interface GetUserByEmailProps {
    email:string
}
export async function GetUserByEmail({email}:GetUserByEmailProps) {
    try {
        const result = await db.select().from(users).where(eq(users.email,email))
        if(result.length === 0) throw new Error("Can't find user.")
        return result[0]
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetUserByIdProps {
    userId : string
}
export async function GetUserById({userId}:GetUserByIdProps) {
    try {
        const result = await db.select().from(users).where(eq(users.id,userId))
        if(result.length === 0) throw new Error("Can't find user.")
        return result[0]
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}