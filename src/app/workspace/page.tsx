import Link from "next/link"
import { Layers } from "lucide-react"
import { GetUser } from "@/data/get/users"
import { getSession } from "@/lib/nextauth"
import { Button } from "@/components/ui/button"
import AppSidebar from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import WorkspaceComponent from "@/components/workspace"
import { GetPlanesWithLinesCount } from "@/data/get/planes"
import CreatePlaneButton from "@/components/dialogs/planes/create-dialog"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"

export default async function Workspace(){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanesWithLinesCount({userEmail:user.email!})
    return(
        <>
            <AppSidebar planes={planes}/>
            <SidebarInset className="overflow-x-hidden">
                <AppHeader />
                <div className="w-full h-full">
                    {(planes && planes.length>0)?
                    <WorkspaceComponent userEmail={user.email!} planes={planes}/>:
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
                            <CreatePlaneButton userEmail={user.email!}>
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