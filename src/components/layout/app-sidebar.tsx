'use client'
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../animate-ui/primitives/radix/collapsible"
import { BellDot, ChevronRight, ChevronsUpDown, CircleDot, CircleQuestionMark, CircleUserRound, Layers, LayersPlus, LayoutDashboard, LogOut, Settings } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../animate-ui/components/radix/dropdown-menu"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../animate-ui/components/radix/sidebar"

interface AppSidebarProps {
		planes? : {
		planeId: string;
		name: string;
		description: string | null;
		icon: string;
		userId: string;
	}[]
}
export default function AppSidebar({planes}:AppSidebarProps){
    const {data:session, status} = useSession()
	const isMobile = useIsMobile()
    return(
        <Sidebar variant="inset" collapsible="icon">
            {/* Header Title */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size={"lg"}>
                            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                                <CircleDot className="size-4" />
                            </div>
                            <span className="truncate font-semibold">Dimensions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            {/* Content */}
            <SidebarContent className="scrollbar-hide">
                {/* Plane/dot List */}
                <SidebarGroup>
                    <SidebarMenu>
						<SidebarMenuItem>
							<Link href={"/workspace"} className="w-full">
								<SidebarMenuButton tooltip={"Dashboard"}>
										<LayoutDashboard />
										<span>Dashboard</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
						{(planes && planes?.length>0)?
                        <Collapsible asChild defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={"Planes"}>
                                        <Layers/>
                                        <span>Planes</span>
                                        <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {planes?.map(plane => <SidebarMenuSubItem key={plane.planeId}>
                                            <SidebarMenuSubButton className="truncate" href={`/planes/${plane.planeId}`}>{plane.name}</SidebarMenuSubButton>
                                        </SidebarMenuSubItem>)}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>:<></>
						}
                    </SidebarMenu>
                </SidebarGroup>
                {/* Settings and Notification */}
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href={"/settings"} className="flex items-center gap-2">
										<Settings />
										<h1>Settings</h1>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href={"/help"} className="flex items-center gap-2">
										<CircleQuestionMark />
										<h1>Get Help</h1>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            {/* Footer */}
            <SidebarFooter>
                <SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size={"lg"} className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={session?.user?.image!} alt={session?.user?.name!} />
                						<AvatarFallback className="rounded-lg">{session?.user?.name?.slice(0,2).toUpperCase()}</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-medium">{session?.user?.name}</span>
										<span className="text-muted-foreground truncate text-xs">{session?.user?.email}</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage src={session?.user?.image!} alt={session?.user?.name!}/>
											<AvatarFallback className="rounded-lg">{session?.user?.name?.slice(0,2).toUpperCase()}</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-medium">{session?.user?.name}</span>
											<span className="text-muted-foreground truncate text-xs">{session?.user?.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuItem><Link className="flex items-center gap-4" href={"/settings"}><CircleUserRound />Account</Link></DropdownMenuItem>
									<DropdownMenuItem><Link className="flex items-center gap-4" href={"/notifications"}><BellDot />Notifications</Link></DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive" className="cursor-pointer" onClick={() => signOut()}><LogOut />Logout</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}