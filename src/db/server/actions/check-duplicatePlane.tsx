"use server"
import { GetUserPlanes } from "@/db/queries/planes"

interface IsPlaneNameUniqueProps {
    name : string,
    userId : string,
    planeId? : string,
}
export default async function IsPlaneNameUnique({name,userId,planeId}:IsPlaneNameUniqueProps) {
    const planes = await GetUserPlanes({userId:userId})
    if(planeId)return planes.filter(plane => plane.name === name && plane.planeId!==planeId).length>0 ? false : true
    return planes.filter(plane => plane.name === name).length>0 ? false : true
}