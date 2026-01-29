'use server'
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { GetUserById } from "./user"
import { planes } from "../schema/planes"
import { DrizzleQueryError } from "drizzle-orm"
import IsPlaneNameUnique from "../server/actions/check-duplicatePlane"

interface GetUserPlanesProps {
    userId : string
}
export async function GetUserPlanes({userId}:GetUserPlanesProps) {
    const user = await GetUserById({userId:userId})
    try{
        const result = await db.select().from(planes).where(eq(planes.userId,user.id))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetPlaneByIdProps {
    planeId : string
}
export async function GetPlaneById({planeId}:GetPlaneByIdProps) {
    try{
        const result = await db.select().from(planes).where(eq(planes.planeId,planeId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetPlaneByNameProps {
    planeName : string,
    userId : string
}
export async function GetPlaneByName({planeName,userId}:GetPlaneByNameProps) {
    try{
        const result = await db.select().from(planes).where(
            and(
                eq(planes.name,planeName),
                eq(planes.userId,userId)
            )
        )
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface CreatePlaneProps {
    userId : string,
    name : string,
    icon : string,
    description?:string
}
export async function CreatePlane({userId,name,icon,description}:CreatePlaneProps) {
    const user = await GetUserById({userId:userId}) // Check if user exist
    const isNameUnique = await IsPlaneNameUnique({name:name,userId:userId}) // Check duplicates
    if(isNameUnique === false) throw new Error('Another plane holds this name.')
    try {
        const result = await db.insert(planes).values({
            name: name,
            description: description,
            icon : icon,
            userId : userId
        }).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface UpdatePlaneProps {
    planeId : string,
    name? : string,
    icon? : string,
    description?:string | null
}
export async function UpdatePlane({planeId,name,icon,description}:UpdatePlaneProps) {
    const plane = await GetPlaneById({planeId:planeId}) // Check if plane exist
    if(name){
        const isNameUnique = await IsPlaneNameUnique({name:name,userId:plane[0].userId,planeId:planeId}) // Check duplicates
        if(isNameUnique === false) throw new Error('Another plane holds this name.')
    }
    try {
        const result = await db.update(planes).set({
            name : name ?? plane[0].name,
            description : description ?? plane[0].description,
            icon : icon ?? plane[0].icon
        }).where(eq(planes.planeId,planeId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface DeletePlaneProps {
    planeId : string
}
export async function DeletePlane({planeId}:DeletePlaneProps) {
    try {
        const result = await db.delete(planes).where(eq(planes.planeId,planeId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}