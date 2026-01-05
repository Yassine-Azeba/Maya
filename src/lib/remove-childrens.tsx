
interface GetChildrenProps {
    firstLineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        user: string;
    }[],
}
export function GetChildren({firstLineId,lines}:GetChildrenProps){
    var lineChildrenIds : string[] = []
    var linesToCheck : string[] = [firstLineId]

    while(linesToCheck.length > 0){
        linesToCheck.map(line => lineChildrenIds.push(line))

        var newLinesToCheck: string[] = []
        linesToCheck.map(lineToCheck => {
            const childrensOfLineToCheck = lines.filter(line => line.parent === lineToCheck)
            childrensOfLineToCheck.map(line => newLinesToCheck.push(line.lineId))
        })
        linesToCheck = newLinesToCheck
    }

    return lineChildrenIds
}
interface RemoveChildrenProps {
    lineId : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        user: string;
    }[],
}
export function RemoveChildren({lineId, lines}:RemoveChildrenProps){
    const lineChildrens = GetChildren({firstLineId:lineId,lines:lines})
    const filteredLines = lines.filter(line => !lineChildrens.includes(line.lineId))
    return filteredLines
}