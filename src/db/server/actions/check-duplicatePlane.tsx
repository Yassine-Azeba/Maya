"use server"
import { GetUserPlanes } from "@/db/queries/planes"

interface IsPlaneNameUniqueProps {
    name : string,
    userId : string
}
export default async function IsPlaneNameUnique({name,userId}:IsPlaneNameUniqueProps) {
    const planes = await GetUserPlanes({userId:userId})
    return planes.filter(plane => plane.name === name).length>0 ? false : true
}