"use server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/drizzle"
import { objects } from "@/db/objects"

// Create
export async function CreateObject(name:string,spaceId:string,user:string,parent?:string,description?:string) {
    if(!name || !spaceId) return null
    await db.insert(objects).values({
        name : name,
        description : description,
        space: spaceId,
        parent : parent,
        user : user
    })
}

// Read
export async function GetObjects(userId?:string,spaceId?:string,objectId?:string,name?:string) {
    const props = [userId,spaceId,objectId,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return null
    if(userId){
        const result = await db.select().from(objects).where(eq(objects.user,userId))
        return result
    }
    if(spaceId){
        const result = await db.select().from(objects).where(eq(objects.space,spaceId))
        return result
    }
    if(objectId){
        const result = await db.select().from(objects).where(eq(objects.objectId,objectId))
        return result
    }
    if(name){
        const result = await db.select().from(objects).where(eq(objects.name,name))
        return result
    }
}

// Update
export async function UpdateObject(objectId:string,name?:string,description?:string,parent?:string,space?:string) {
    if(!objectId) return null
    if(name){
        await db.update(objects).set({
            name : name
        }).where(eq(objects.objectId,objectId))
    }
    if(description){
        await db.update(objects).set({
            description : description
        }).where(eq(objects.objectId,objectId))
    }
    if(parent){
        await db.update(objects).set({
            parent : parent
        }).where(eq(objects.objectId,objectId))
    }
    if(space){
        await db.update(objects).set({
            space : space
        }).where(eq(objects.objectId,objectId))
    }
}

// Delete
export async function DeleteObject(objectId:string) {
    if(!objectId) return null
    await db.delete(objects).where(eq(objects.objectId,objectId))    
}

// Check
export async function CheckParent(objectId:string,parentObjectId:string) {
    if(!objectId || !parentObjectId) return null
    const object = await db.select().from(objects).where(eq(objects.objectId,objectId))
    if(object[0].objectId === parentObjectId){
        return true
    }
    return CheckParent(object[0].objectId,parentObjectId)
}