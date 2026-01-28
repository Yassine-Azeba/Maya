import { GetLineById } from "@/db/queries/lines";


interface IsLineInPlaneProps {
    lineId : string,
    planeId : string
}
export default async function IsLineInPlane({lineId,planeId}:IsLineInPlaneProps) {
    const line = await GetLineById({lineId:lineId})
    return (line[0].plane === planeId)? true : false
}