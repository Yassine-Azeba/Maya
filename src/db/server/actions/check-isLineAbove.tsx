import { GetUserLines } from "@/db/queries/lines";
import { GetChildren } from "./get-lineChildrens";


interface IsLineAboveProps {
    userId : string,
    lineId : string,
    parentLineId : string,
}
export default async function IsLineAbove({userId,lineId,parentLineId}:IsLineAboveProps) {
    const allLines = await GetUserLines({userId:userId})
    const lineChildrens = GetChildren({lineId:lineId,lines:allLines})
    return lineChildrens.includes(parentLineId) ? false : true
}