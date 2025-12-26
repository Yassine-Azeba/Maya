import Link from "next/link"
import { GetUser } from "@/data/user"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreatePlaneButton from "@/components/button-plane-create"
import DeletePlaneButton from "@/components/button-plane-delete"
import UpdatePlaneButton from "@/components/button-plane-update"
import { ArrowUpRight, EllipsisVertical, LayersPlus } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default async function Workspace(){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    return(
        <div className="w-full h-full">
            {(planes.data && planes.data.length>0)?<div className="w-full flex flex-col py-3 px-6 gap-3">
                <h1 className="text-xl font-medium">Planes</h1>
                <div className="w-full grid grid-cols-3 gap-2 max-sm:grid-cols-1">
                    {planes.data.map(plane => <Link key={plane.planeId} href={`/plane/${plane.name}`}>
                        <Card className="w-full h-20 py-2 px-4">
                            <div className="w-full h-full flex flex-col gap-3">
                                <div className="grid grid-cols-12">
                                    <div className="col-span-11 flex flex-col gap-0.5">
                                        <h1 className="text-sm font-medium truncate">{plane.name}</h1>
                                        <h1 className="text-muted-foreground text-xs truncate">{plane.description}</h1>
                                    </div>
                                    <div className="col-span-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <div className="text-muted-foreground cursor-pointer pl-2">
                                                    <EllipsisVertical size={16} />
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="flex flex-col gap-1">
                                                <DropdownMenuItem asChild><UpdatePlaneButton plane={plane}/></DropdownMenuItem>
                                                <DropdownMenuItem asChild><DeletePlaneButton planeId={plane.planeId}/></DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>)}
                </div>
            </div>:<div>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <LayersPlus />
                        </EmptyMedia>
                        <EmptyTitle>No Plane Yet</EmptyTitle>
                        <EmptyDescription>You haven't created a plane yet. Get started by creating your first plane.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <CreatePlaneButton userId={user.data![0].id}/>
                    </EmptyContent>
                    <Button variant={"link"} className="text-muted-foreground">
                        <Link href={"/help"} className="flex items-center">Get help<ArrowUpRight className="pt-0.5" /></Link>
                    </Button>
                </Empty>
            </div>}
        </div>
    )
}