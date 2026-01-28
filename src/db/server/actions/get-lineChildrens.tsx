
interface GetChildrenProps {
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
export function GetChildren({lineId,lines}:GetChildrenProps){
    var lineChildrenIds : string[] = []
    var linesToCheck : string[] = [lineId]

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