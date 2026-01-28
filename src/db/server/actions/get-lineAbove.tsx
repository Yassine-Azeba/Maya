import { GetChildren } from "./get-lineChildrens";

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
export default function GetUpperLines({lineId,lines}:GetUpperLinesProps){
    const childrens = GetChildren({lineId:lineId,lines:lines})
    const upperLines = lines.filter(line => !childrens.includes(line.lineId))
    return upperLines
}