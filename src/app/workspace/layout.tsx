import {SidebarProvider} from '@/components/animate-ui/components/radix/sidebar'

export default async function WorkspaceLayout({children}: Readonly<{children: React.ReactNode}>){
    return(
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}