"use server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { users } from "@/db/schema"

// Read
export async function GetUser(email : string) {
    if(!email) return null
    const result = await db.select().from(users).where(eq(users.email,email))
    return result
}
