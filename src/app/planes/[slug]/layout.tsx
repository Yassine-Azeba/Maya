import { GetUser } from "@/data/user"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"
import AppSidebar from '@/components/app-sidebar'
import {SidebarProvider,SidebarInset,SidebarTrigger} from '@/components/animate-ui/components/radix/sidebar';

export default async function PlanePageLayout({children}: Readonly<{children: React.ReactNode}>) {
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    return(
        <SidebarProvider>
            <AppSidebar userId={user.data![0].id} planes={planes.data} type={"workspace_sidebar"}/>
            <SidebarInset>
                <SidebarTrigger />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
    
}