'use server'
import { GetLines } from "../get/line"

interface IsLineInSamePlaneProps {
    lineId : string,
    planeId : string
}
export default async function IsLineInSamePlane({lineId,planeId}:IsLineInSamePlaneProps){
    const line = await GetLines({lineId:lineId})
    if(line[0].plane === planeId) return true
    throw new Error("Parent line is not in the same plane.")
}