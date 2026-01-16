'use server'
import { db } from "@/lib/drizzle"
import { lines } from "@/db/lines"
import { GetUser } from "../get/users"
import { GetPlanes } from "../get/planes"
import { DrizzleQueryError } from "drizzle-orm"
import IsLineInSamePlane from "../check/check-line-plane"

interface CreateLineProps {
    name : string,
    description : string,
    parentLineId? : string,
    plane : {
        planeId : string,
        name : string
    },
    user : {
        id: string;
        name: string | null;
        email: string | null
    }
}
export default async function CreateLine({name,description,parentLineId,plane,user}:CreateLineProps){
    await GetUser({email:user.email!}) // Check if user exist
    await GetPlanes({name:plane.name,userEmail:user.email!}) // Check if plane exist
    if(parentLineId){
        await IsLineInSamePlane({lineId:parentLineId,planeId:plane.planeId}) // Check if parent line is in the same space
    }
    try{
        const result = await db.insert(lines).values({
            name: name,
            description: description,
            userId : user.id,
            parent : parentLineId,
            plane : plane.planeId,
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