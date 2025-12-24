'use client'
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"

export function AppHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4"/>
                <h1 className="text-base font-medium">Workspace</h1>
                <div className="ml-auto flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} size={"icon-sm"}><Menu size={12} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <div className="flex items-center gap-12 rounded-md hover:bg-muted p-1">
                                <h1 className="text-sm">Theme : </h1>
                                <AnimatedThemeToggler/>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
