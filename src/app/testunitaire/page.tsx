import { GetEchos } from "@/data/echos"
import { GetObjects } from "@/data/objects"
import { GetSpaces } from "@/data/spaces"
import { GetUser } from "@/data/user"
import { getSession } from "@/lib/nextauth"


export default async function TestUnitaire(){
    const session = await getSession()
    const user = await GetUser(session?.user?.email!)
    const userId = user?user[0].id:undefined

    const spaces = await GetSpaces(undefined,undefined,userId)
    const objects = await GetObjects(userId,undefined,undefined,undefined)
    const echos = await GetEchos(undefined,undefined,undefined,userId,undefined)

    return(
        <div className="w-full h-screen flex flex-col p-4 gap-2">
            {/* Session */}
            <h1>Session : {session?.user?.email}</h1>
            <span className="w-full h-0.5 border-b border-gray-500"/>
            {/* Neon User */}
            <h1>Uer (neon) :</h1>
            {(user === null)?<h1 className="text-red-400">No User</h1>:<></>}
            {user?.map(user => <div key={user.id} className="flex flex-col gap-1 text-xs">
                <h1>Email : {user.email}</h1>
                <h1>Id : {user.id}</h1>
                <h1>Name : {user.name}</h1>
            </div>)}
            <span className="w-full h-0.5 border-b border-gray-500"/>
            {/* Spaces */}
            <h1>Spaces :</h1>
            {(spaces === null || spaces === undefined || spaces.length === 0)?<h1 className="text-red-400">No Spaces</h1>:<></>}
            <div className="flex gap-1 text-xs">
                {spaces?.map(space => <div key={space.spaceId} className="flex flex-col gap-1">
                    <h1>Id : {space.spaceId}</h1>
                    <h1>Name : {space.name}</h1>
                    <h1>Description : {space.description}</h1>
                    <h1>User : {space.userId}</h1>
                </div>)}
            </div>
            <span className="w-full h-0.5 border-b border-gray-500"/>
            {/* Objects */}
            <h1>Objects :</h1>
            {(objects === null || objects === undefined || objects.length === 0)?<h1 className="text-red-400">No Objects</h1>:<></>}
            <div className="flex gap-1 text-xs">
                {objects?.map(object => <div key={object.objectId} className="flex flex-col gap-1">
                    <h1>Id : {object.objectId}</h1>
                    <h1>Name : {object.name}</h1>
                    <h1>Description : {object.description}</h1>
                    <h1>Space : {object.space}</h1>
                    <h1>User : {object.user}</h1>
                    <h1>Parent : {object.parent}</h1>
                </div>)}
            </div>
            <span className="w-full h-0.5 border-b border-gray-500"/>
            {/* Echos */}
            <h1>Echos :</h1>
            {(echos === null || echos === undefined || echos.length === 0)?<h1 className="text-red-400">No Echos</h1>:<></>}
            <div className="flex gap-1 text-xs">
                {echos?.map(echo => <div key={echo.echoId} className="flex flex-col gap-1">
                    <h1>Id : {echo.echoId}</h1>
                    <h1>Name : {echo.name}</h1>
                    <h1>Description : {echo.description}</h1>
                    <h1>Space : {echo.space}</h1>
                    <h1>User : {echo.user}</h1>
                    <h1>Object : {echo.object}</h1>
                    <h1>Parent : {echo.parent}</h1>
                </div>)}
            </div>
        </div>
    )
}