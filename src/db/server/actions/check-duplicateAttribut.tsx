import { GetPlaneAttributs } from "@/db/queries/attributs";


interface IsAttributNameUniqueProps {
    name : string,
    planeId : string,
    attributId? : string
}
export default async function IsAttributNameUnique({name,planeId,attributId}:IsAttributNameUniqueProps) {
    const attributs = await GetPlaneAttributs({planeId:planeId})
    if(attributId) return attributs.filter(attribut => attribut.name === name && attribut.attributId !== attributId).length>0 ? false : true
    return attributs.filter(attribut => attribut.name === name).length>0 ? false : true
}