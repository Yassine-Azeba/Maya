"use server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { spaces } from "@/db/spaces"

// Create
export async function CreateSpace(userId:string,name:string,description?:string) {
    if(!userId || !name) return null
    await db.insert(spaces).values({
        name: name,
        description: description,
        userId : userId
    })
}

// Read
export async function GetSpaces(spaceId?:string,name?:string,userId?:string) {
    if(!spaceId && !name && !userId) return null
    if((spaceId && name) || (spaceId && userId) || (name && userId)) return null
    if(spaceId){
        const result = await db.select().from(spaces).where(eq(spaces.spaceId,spaceId))
        return result
    }
    if(name){
        const result = await db.select().from(spaces).where(eq(spaces.name,name))
        return result
    }
    if(userId){
        const result = await db.select().from(spaces).where(eq(spaces.userId,userId))
        return result
    }
}

// Update
export async function UpdateSpace(spaceId:string,name?:string,description?:string) {
    if(!spaceId) return null
    if(name){
        await db.update(spaces).set({
            name : name
        }).where(eq(spaces.spaceId,spaceId))
    }
    if(description){
        await db.update(spaces).set({
            description : description
        }).where(eq(spaces.spaceId,spaceId))
    }
}

// Delete
export async function DeleteSpace(spaceId:string) {
    if(!spaceId) return null
    await db.delete(spaces).where(eq(spaces.spaceId,spaceId))
}
