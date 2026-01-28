import Link from "next/link"
import { Layers } from "lucide-react"
import { getSession } from "@/lib/nextauth"
import { Button } from "@/components/ui/button"
import AppSidebar from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import WorkspaceComponent from "@/components/layout/workspace"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"
import { GetUserByEmail } from "@/db/queries/user"
import { GetUserPlanes } from "@/db/queries/planes"
import { CreatePlaneButton } from "@/features/planes/planes-dialogs"

export default async function Workspace(){
    const session = await getSession()
    const user = await GetUserByEmail({email:session?.user?.email!})
    const planes = await GetUserPlanes({userId:user.id})
    return(
        <>
            <AppSidebar planes={planes}/>
            <SidebarInset className="overflow-x-hidden">
                <AppHeader />
                <div className="w-full h-full">
                    {(planes && planes.length>0)?
                    <WorkspaceComponent userId={user.id} planes={planes}/>:
                    <div className="h-full w-full relative antialiased">
                        <div className="w-full h-full flex justify-center items-center flex-col gap-2 relative z-10">
                            <div className="w-24 h-24 rounded-full border flex items-center justify-center text-muted-foreground">
                                <Layers size={38}/>
                            </div>
                            <h1 className="text-xl">Nothing here yet.</h1>
                            <h1 className="text-muted-foreground text-sm">Planes help you organize your work by grouping related lines under one subject.</h1>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                <h1>Check the </h1>
                                <Link className="text-orange-400 underline" href={"/help"}>/help</Link>
                                <h1>page if you feel lost.</h1>
                            </div> 
                            <CreatePlaneButton userId={user.id}>
                                <Button variant={"outline"}>Create your first plane</Button>
                            </CreatePlaneButton>
                        </div>
                        <BackgroundBeams />
                    </div>}
                </div>
            </SidebarInset>
        </>
    )
}