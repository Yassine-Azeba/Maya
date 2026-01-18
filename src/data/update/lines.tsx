'use server'
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { DrizzleQueryError, eq } from "drizzle-orm"
import { GetLines, GetUserLines } from "../get/line"
import { GetUpperLines } from "@/lib/get-upper-lines"

interface UpdateLineProps {
    userEmail : string,
    lineId: string,
    linePlaneId : string,
    name : string,
    description? : string,
    parent? : string,
}
export async function UpdateLine({userEmail,lineId,linePlaneId,name,description,parent}:UpdateLineProps) {
    if(parent){
        // Check if parent is in the same plane
        const parentLine = await GetLines({lineId:parent})
        if(parentLine[0].plane !== linePlaneId) throw new Error('Parent line belongs to another plane.')
        // Check if parent is not child of line to update
        const allLines = await GetUserLines({userEmail:userEmail})
        const upperLines = GetUpperLines({lineId:lineId,lines:allLines}).map(l => l.lineId)
        if(parent === lineId || !upperLines.includes(parent)) throw new Error('Invalid parent.')
    }
    try {
        const result = await db.update(lines).set({
            name : name,
            description : description,
            parent:parent
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