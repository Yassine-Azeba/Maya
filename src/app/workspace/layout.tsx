import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GetPlanes } from "@/data/planes"
import { GetUser } from "@/data/user"
import { getSession } from "@/lib/nextauth"

export default async function WorkspaceLayout({children}: Readonly<{children: React.ReactNode}>){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    return(
        <SidebarProvider style={{"--sidebar-width": "calc(var(--spacing) * 72)","--header-height": "calc(var(--spacing) * 12)",} as React.CSSProperties}>
            <AppSidebar userId={user.data![0].id} planes={planes.data}/>
            <SidebarInset>
                <AppHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}