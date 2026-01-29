'use server'
import { db } from ".."
import { and, eq } from "drizzle-orm"
import { GetLineById } from "./lines"
import { GetAttributById } from "./attributs"
import { DrizzleQueryError } from "drizzle-orm"
import { attributValues } from "../schema/attributs"

interface GetAttributValuesProps {
    lineId : string
}
export async function GetLineAttributValues({lineId}:GetAttributValuesProps) {
    const line = await GetLineById({lineId:lineId}) // Check if line exist
    try{
        const result = await db.select().from(attributValues).where(eq(attributValues.line,lineId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface CreateLineAttributValueProps {
    lineId : string,
    attributId : string,
    value : string
}
export async function CreateLineAttributValue({lineId,attributId,value}:CreateLineAttributValueProps) {
    const line = await GetLineById({lineId:lineId}) // Check if line exist
    const attribut = await GetAttributById({attributId:attributId}) // Check if attribut exist
    try {
        const result = await db.insert(attributValues).values({
            line : lineId,
            attribut : attributId,
            value : value
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

interface UpdateLineAttributValueProps {
    lineId : string,
    attributId : string,
    value : string
}
export async function UpdateLineAttributValue({lineId,attributId,value}:UpdateLineAttributValueProps) {
    const line = await GetLineById({lineId:lineId}) // Check if line exist
    const attribut = await GetAttributById({attributId:attributId}) // Check if attribut exist
    try {
        const result = await db.update(attributValues).set({
            value : value
        }).where(and(
            eq(attributValues.attribut, attributId),
            eq(attributValues.line, lineId),
        )).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface DeleteLineAttributValueProps {
    attributValuesId : string,
}
export async function DeleteLineAttributValue({attributValuesId}:DeleteLineAttributValueProps) {
    try {
            const result = await db.delete(attributValues).where(eq(attributValues.attributValuesId,attributValuesId)).returning()
            return result
        } catch (error) {
            if(error instanceof DrizzleQueryError){
                throw new Error(error.message)
            } else {
                throw new Error("Unknown error occured. Please try again.")
            }
        }
}