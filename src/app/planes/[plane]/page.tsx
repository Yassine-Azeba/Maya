import { GetUser } from "@/data/user"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"

export default async function Plane({params}:{params:Promise<{plane:string}>}) {
    const {plane} = await params
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planeData = await GetPlanes({planeId:plane})
    return(
        <div className="flex items-center justify-center w-full h-full">
            <h1>Plane Name : {planeData.data[0].name}</h1>
        </div>
    )
}