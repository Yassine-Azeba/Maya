import { GetChildren } from "./get-childrens"

interface GetUpperLinesProps {
    lineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
}
export function GetUpperLines({lineId, lines}:GetUpperLinesProps){
    const lineChildrens = GetChildren({lineId:lineId,lines:lines})
    const upperLines = lines.filter(line => !lineChildrens.includes(line.lineId))
    return upperLines
}