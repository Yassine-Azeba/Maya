'use server'
import { db } from ".."
import { eq } from "drizzle-orm"
import { GetUserById } from "./user"
import { GetPlaneById } from "./planes"
import { DrizzleQueryError } from "drizzle-orm"
import { attributs } from "../schema/attributs"
import IsAttributNameUnique from "../server/actions/check-duplicateAttribut"

interface GetPlaneAttributsProps {
    planeId : string
}
export async function GetPlaneAttributs({planeId}:GetPlaneAttributsProps) {
    try{
        const result = await db.select().from(attributs).where(eq(attributs.plane,planeId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetAttributByIdProps {
    attributId : string
}
export async function GetAttributById({attributId}:GetAttributByIdProps) {
    try{
        const result = await db.select().from(attributs).where(eq(attributs.attributId,attributId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface CreateAttributProps {
    name : string,
    type : "Text" | "Number" | "Date" | "Email" | "Link" | "Phone" | "Line" | "Selection",
    selectionValues : string[],
    planeId : string,
    userId : string
}
export async function CreateAttribut({name,type,selectionValues,planeId,userId}:CreateAttributProps) {
    const user = await GetUserById({userId:userId}) // Check if user exits
    const plane = await GetPlaneById({planeId:planeId}) // Check if plane exist
    const isNameUnique = await IsAttributNameUnique({name:name,planeId:planeId}) // Check duplicates
    if(isNameUnique === false) throw new Error('Another attribut holds this name.')
    try{
        const result = await db.insert(attributs).values({
            name : name,
            type : type,
            selectionValues : selectionValues,
            plane : planeId,
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

interface UpdateAttributProps {
    attributId : string,
    name? : string,
    type? : "Text" | "Number" | "Date" | "Email" | "Link" | "Phone" | "Line" | "Selection";
    selectionValues? : string[]
}
export async function UpdateAttribut({attributId,name,type,selectionValues}:UpdateAttributProps){
    const attribut = await GetAttributById({attributId:attributId}) // check if attribut exist
    if(name){
        const isNameUnique = await IsAttributNameUnique({name:name,planeId:attribut[0].plane}) // Check duplicates
        if(isNameUnique === false) throw new Error('Another attribut holds this name.')
    }
    try {
        const result = await db.update(attributs).set({
            name : name ?? attribut[0].name,
            type : type ?? attribut[0].type,
            selectionValues : selectionValues ?? attribut[0].selectionValues
        }).where(eq(attributs.attributId,attributId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface DeleteAttributProps {
    attributId : string
}
export async function DeleteAttribut({attributId}:DeleteAttributProps) {
    try {
        const result = await db.delete(attributs).where(eq(attributs.attributId,attributId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}