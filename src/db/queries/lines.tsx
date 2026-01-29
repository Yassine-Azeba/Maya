'use server'
import { db } from ".."
import { eq, inArray } from "drizzle-orm"
import { GetUserById } from "./user"
import { GetPlaneById } from "./planes"
import { lines } from "../schema/lines"
import { DrizzleQueryError } from "drizzle-orm"
import IsLineInPlane from "../server/actions/check-isLineInSamePlane"
import IsLineAbove from "../server/actions/check-isLineAbove"

interface GetLineByIdProps {
    lineId : string
}
export async function GetLineById({lineId}:GetLineByIdProps) {
    try{
        const result = await db.select().from(lines).where(eq(lines.lineId,lineId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetUserLinesProps {
    userId : string
}
export async function GetUserLines({userId}:GetUserLinesProps) {
    try{
        const result = await db.select().from(lines).where(eq(lines.userId,userId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface GetPlaneLinesProps {
    planeId : string
}
export async function GetPlaneLines({planeId}:GetPlaneLinesProps) {
    try{
        const result = await db.select().from(lines).where(eq(lines.plane,planeId))
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface CreateLineProps {
    name : string,
    description? : string,
    planeId : string,
    userId : string,
    parentLineId? : string
}
export async function CreateLine({name,description,planeId,userId,parentLineId}:CreateLineProps) {
    const user = await GetUserById({userId:userId}) // Check if user exist
    const plane = await GetPlaneById({planeId:planeId}) // Check if plane exist
    if(parentLineId){ // Check if parent line is in the correct plane
        const isLineInPlane = await IsLineInPlane({lineId:parentLineId,planeId:planeId})
        if(isLineInPlane === false) throw new Error('Parent belongs to another plane.')
    }
    try {
        const result = await db.insert(lines).values({
            name: name,
            description : description,
            plane: planeId,
            userId : userId,
            parent : parentLineId,
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

interface UpdateLineProps {
    lineId : string,
    name? : string,
    description? : string | null,
    parentLineId? : string | null
}
export async function UpdateLine({lineId,name,description,parentLineId}:UpdateLineProps) {
    const line = await GetLineById({lineId:lineId}) // Check if line exist
    if(parentLineId){
        const parentLine = await GetLineById({lineId:parentLineId}) // Check if parent line exist
        // Check if parent line is in the correct plane 
        const isLineInPlane = await IsLineInPlane({lineId:parentLineId,planeId:line[0].plane}) 
        if(isLineInPlane === false) throw new Error('Parent belongs to another plane.')
        // Check if parent is not child of lineId
        const isLineAbove = await IsLineAbove({userId:line[0].userId,parentLineId:parentLineId,lineId:lineId})
        if(isLineAbove === true) throw new Error('Parent is child of Line.')
    }
    try {
        const result = await db.update(lines).set({
            name : name ?? line[0].name,
            description : description ?? line[0].description,
            parent:parentLineId ?? line[0].parent
        }).where(eq(lines.lineId,lineId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }
}

interface DeleteLinesProps {
    linesId : string[]
}
export async function DeleteLines({linesId}:DeleteLinesProps) {
    try {
        const result = await db.delete(lines).where(inArray(lines.lineId,linesId)).returning()
        return result
    } catch (error) {
        if(error instanceof DrizzleQueryError){
            throw new Error(error.message)
        } else {
            throw new Error("Unknown error occured. Please try again.")
        }
    }    
}