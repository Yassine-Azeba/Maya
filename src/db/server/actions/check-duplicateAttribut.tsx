import { GetPlaneAttributs } from "@/db/queries/attributs";


interface IsAttributNameUniqueProps {
    name : string,
    planeId : string
}
export default async function IsAttributNameUnique({name,planeId}:IsAttributNameUniqueProps) {
    const attributs = await GetPlaneAttributs({planeId:planeId})
    return attributs.filter(attribut => attribut.name === name).length>0 ? true : false
}