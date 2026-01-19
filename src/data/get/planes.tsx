'use server'
import { GetUser } from "./users"
import { lines } from "@/db/lines"
import { db } from "@/lib/drizzle"
import { planes } from "@/db/planes"
import { and, eq, sql } from "drizzle-orm"
import { DrizzleQueryError } from "drizzle-orm"
import { customAttributs } from "@/db/custom-attributs"

interface GetPlanesProps {
    name?:string,
    userEmail:string
}
export async function GetPlanes({name,userEmail}:GetPlanesProps) {
    const user = await GetUser({email:userEmail})
    try{
        if(name){ 
            const result = await db.select().from(planes).where(
                and(
                    eq(planes.name,name),
                    eq(planes.userId,user.id)
                )
            )
            return result
        } else { 
            const result = await db.select().from(planes).where(eq(planes.userId,user.id))
            return result
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

export async function GetPlanesWithLines({name,userEmail}:GetPlanesProps) {
    const user = await GetUser({email:userEmail})
    try{
        if(name){
            const result = await db.select().from(planes).leftJoin(lines, eq(lines.plane,planes.planeId))
            .where(
                and(
                    eq(planes.name,name),
                    eq(planes.userId,user.id)
                )
            )
            return result            
        } else {
            const result = await db.select().from(planes)
            .leftJoin(lines, eq(lines.plane,planes.planeId))
            .where(eq(planes.userId,user.id))
            return result
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }    
}

export async function GetPlanesWithLinesCount({name,userEmail}:GetPlanesProps) {
    const user = await GetUser({email:userEmail})
    try{
        if(name){
            const result = await db.select({
                planeId: planes.planeId,
                name : planes.name,
                description: planes.description,
                icon : planes.icon,
                lineCount : sql<number>`COUNT(${lines.lineId})`
            }).from(planes).leftJoin(lines, eq(lines.plane,planes.planeId))
            .where(
                and(
                    eq(planes.name,name),
                    eq(planes.userId,user.id)
                )
            ).groupBy(planes.planeId)
            return result            
        } else {
            const result = await db.select({
                planeId: planes.planeId,
                name : planes.name,
                description: planes.description,
                icon : planes.icon,
                lineCount : sql<number>`COUNT(${lines.lineId})`
            }).from(planes)
            .leftJoin(lines, eq(lines.plane,planes.planeId))
            .where(eq(planes.userId,user.id))
            .groupBy(planes.planeId)
            return result
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }    
}

export async function GetPlanesWithCustomAttributs({name,userEmail}:GetPlanesProps) {
    const user = await GetUser({email:userEmail})
    try{
        if(name){
            const result = await db.select().from(planes).leftJoin(customAttributs, eq(customAttributs.plane,planes.planeId))
            .where(
                and(
                    eq(planes.name,name),
                    eq(planes.userId,user.id)
                )
            )
            return result            
        } else {
            const result = await db.select().from(planes)
            .leftJoin(customAttributs, eq(customAttributs.plane,planes.planeId))
            .where(eq(planes.userId,user.id))
            return result
        }
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }  
}