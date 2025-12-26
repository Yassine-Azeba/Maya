"use client"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import CreatePlaneButton from "./button-plane-create"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import {Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarHeader,SidebarMenu,SidebarMenuButton,SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar} from "@/components/ui/sidebar"
import { BellDot, Calendar, Calendars, ChevronRight, CircleAlert, CircleDot, CircleQuestionMark, CircleUserRound, EllipsisVertical, Focus, GanttChart, Handshake, Kanban, Layers, Link2, ListTodo, LogOut, MessageSquareDot, PieChart, Settings, TriangleAlert } from "lucide-react"

interface AppSideBarProps {
	userId : string,
	planes : {
        planeId: string;
        name: string;
        description: string | null;
        userId: string;
    }[] | null
}
export function AppSidebar({userId,planes}:AppSideBarProps) {
	const {data:session, status} = useSession()
	const { isMobile } = useSidebar()
	return (
        <Sidebar collapsible="offcanvas" variant={"inset"}>
			{/* ✅ Header : Title */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
                            <Link href="/workspace">
                                <CircleDot size={16}/>
                                <span className="text-base font-semibold">21 Dots.</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
			{/* ✅Content : Planes & Tools */}
			<SidebarContent>
				{/* ✅ First : Create & Display Planes */}
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu>
							<Collapsible asChild defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={"My Planes"}>
											<Layers />
											<span className="text-sm">My Planes</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{planes?planes.map(plane => <SidebarMenuSubItem key={plane.planeId}>
													<SidebarMenuSubButton href={`/planes/${plane.name}`} className="text-sm text-muted-foreground">
														{plane.name}
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>):<></>}
											<SidebarMenuSubItem>
												<CreatePlaneButton userId={userId} />
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				{/* ✅ Second : Tools */}
				<SidebarGroup>
					<SidebarGroupLabel>Tools</SidebarGroupLabel>
					<SidebarContent>
						<SidebarMenu>
							{/* Planning and Vizualization Tools */}
							<Collapsible asChild className="group/collapsibleone">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={"Planning and Vizualization"}>
											<Calendars />
											<span className="text-xs">Planning and Vizualization</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsibleone:rotate-90"/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><Kanban size={12} />Kanban</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><GanttChart size={12} />Gantt</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><Calendar size={12} />Calendar</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
							{/* Clarity and Focus Tools */}
							<Collapsible asChild className="group/collapsibletwo">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={"Clarity and Focus"}>
											<Focus />
											<span className="text-xs">Clarity and Focus</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsibletwo:rotate-90"/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><PieChart size={12} />Charts</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><CircleAlert size={12} />Priorities</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><TriangleAlert size={12} />Risks</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><Link2 size={12} />Dependencies</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
							{/* Collaboration and Communication Tools */}
							<Collapsible asChild className="group/collapsiblethree">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton tooltip={"Collaboration and Communication"}>
											<Handshake />
											<span className="text-xs">Collaboration and Communication</span>
											<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsiblethree:rotate-90"/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><ListTodo size={12} />Assignements</SidebarMenuSubButton>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<SidebarMenuSubButton className="flex items-center gap-2 text-xs cursor-pointer"><MessageSquareDot size={12} />Mentions</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarContent>
				</SidebarGroup>
				{/* ✅ Third : Settings and Notification */}
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
			{/* ✅ Footer : User Informations & Actions */}
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
									<EllipsisVertical className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
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
									<DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={() => signOut()}><LogOut />Logout</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
        </Sidebar>
    )
}

