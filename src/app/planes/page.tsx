import Link from "next/link"
import { getSession } from "@/lib/nextauth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AppSidebar from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetUserByEmail } from "@/db/queries/user"
import { GetUserPlanes } from "@/db/queries/planes"
import { CreatePlaneButton } from "@/features/planes/planes-dialogs"
import { PlaneIcon } from "@/features/planes/planes-icons"

export default async function Planes() {
    const session = await getSession()
    const user = await GetUserByEmail({email:session?.user?.email!})
    const planes = await GetUserPlanes({userId:user.id})
    return(
        <>
            <AppSidebar planes={planes}/>
            <SidebarInset className="overflow-x-hidden">
                <AppHeader />
                <div className="w-full h-full flex items-center justify-center">
                    {(planes && planes.length>0)?
                    <Card className="px-4 py-1">
                        <ScrollArea className="max-h-72">
                            <div className="flex flex-col gap-0.5">
                                {planes.map(plane => <Link key={plane.planeId} href={`/planes/${plane.name}`}>
                                        <Button variant={"ghost"} className="flex items-center gap-2">
                                            <PlaneIcon icon={plane.icon} size={12} />
                                            {plane.name}
                                        </Button>
                                </Link>)}
                            </div>
                        </ScrollArea>
                    </Card>
                    :
                    <CreatePlaneButton userId={user.id}>
                        <Button variant={"outline"}>Create your first plane</Button>
                    </CreatePlaneButton>}
                </div>
            </SidebarInset>
        </>
    )
}