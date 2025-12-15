"use server"
import { eq } from "drizzle-orm"
import { echos } from "@/db/echo"
import { db } from "@/lib/drizzle"

// Create
export async function CreateEcho(user:string,name:string,space:string,object:string,description?:string,parent?:string) {
    if(!user || !name || !space || !object) return null
    await db.insert(echos).values({
        name : name,
        description : description,
        parent : parent,
        space : space,
        user : user,
        object : object
    })
}

// Read
export async function GetEchos(echoId?:string,space?:string, object?:string, user?:string, name?:string) {
    const props = [echoId,space,object,user,name].filter((p) => p !== undefined)
    if(props.length !== 1 ) return null
    if(echoId){
        const result = await db.select().from(echos).where(eq(echos.echoId,echoId))
        return result
    }
    if(space){
        const result = await db.select().from(echos).where(eq(echos.space,space))
        return result
    }
    if(user){
        const result = await db.select().from(echos).where(eq(echos.user,user))
        return result
    }
    if(object){
        const result = await db.select().from(echos).where(eq(echos.object,object))
        return result
    }
    if(name){
        const result = await db.select().from(echos).where(eq(echos.name,name))
        return result
    }
}

// Update
export async function UpdateEcho(echoId:string,name?:string,description?:string,parent?:string,object?:string) {
    if(!echoId) return null
    if(name){
        await db.update(echos).set({
            name : name
        }).where(eq(echos.echoId,echoId))
    }
    if(description){
        await db.update(echos).set({
            description : description
        }).where(eq(echos.echoId,echoId))
    }
    if(parent){
        await db.update(echos).set({
            parent : parent
        }).where(eq(echos.echoId,echoId))
    }
    if(object){
        await db.update(echos).set({
            object : object
        }).where(eq(echos.echoId,echoId))
    }
}

// Delete
export async function DeleteEcho(echoId:string) {
    if(!echoId) return null
    await db.delete(echos).where(eq(echos.echoId,echoId))   
}
