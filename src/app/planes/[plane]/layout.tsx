import {SidebarProvider} from '@/components/animate-ui/components/radix/sidebar'

export default async function PlaneLayout({children}: Readonly<{children: React.ReactNode}>){
    return(
        <SidebarProvider>
            {children}
        </SidebarProvider>
    )
}