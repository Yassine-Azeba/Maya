import Link from "next/link"
import { GetUser } from "@/data/user"
import { Layers } from "lucide-react"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"
import { Button } from "@/components/ui/button"
import WorkspaceComponent from "@/components/workspace"
import CreatePlaneButton from "@/components/plane/create/dialog"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"

export default async function Workspace(){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    return(
        <div className="w-full h-full">
            {(planes.data && planes.data.length>0)?
            <WorkspaceComponent userId={user.data![0].id} planes={planes.data}/>:
            <div className="h-full w-full relative antialiased">
                <div className="w-full h-full flex justify-center items-center flex-col gap-2 relative z-10">
                    <div className="w-24 h-24 rounded-full border bg-gray-300/35 flex items-center justify-center text-muted-foreground">
                        <Layers size={38}/>
                    </div>
                    <h1 className="text-xl">Nothing here yet.</h1>
                    <h1 className="text-muted-foreground text-sm">Planes help you organize your work by grouping related lines under one subject.</h1>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <h1>Check the </h1>
                        <Link className="text-orange-400 underline" href={"/help"}>/help</Link>
                        <h1>page if you feel lost.</h1>
                    </div> 
                    <CreatePlaneButton userId={user.data![0].id}>
                        <Button variant={"outline"}>Create your first plane</Button>
                    </CreatePlaneButton>
                </div>
                <BackgroundBeams />
            </div>}
        </div>
    )
}