import { GetUser } from "@/data/user"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"
import AppSidebar from '@/components/app-sidebar'
import { AppHeader } from "@/components/app-header"
import {SidebarProvider,SidebarInset} from '@/components/animate-ui/components/radix/sidebar'

export default async function WorkspaceLayout({children}: Readonly<{children: React.ReactNode}>){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    return(
        <SidebarProvider>
            <AppSidebar userId={user.data![0].id} planes={planes.data} type={"workspace_sidebar"}/>
            <SidebarInset className="overflow-x-hidden">
                <AppHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}