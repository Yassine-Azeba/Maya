import Link from "next/link"
import { getSession } from "@/lib/nextauth"
import LineTable from "@/components/line-table"
import AppSidebar from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { Separator } from "@/components/ui/separator"
import { SidebarInset } from "@/components/ui/sidebar"
import { Braces, Edit, EllipsisVertical, Trash } from "lucide-react"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/animate-ui/components/radix/popover"
import { GetUserByEmail } from "@/db/queries/user"
import { GetPlaneByName } from "@/db/queries/planes"
import { GetPlaneLines } from "@/db/queries/lines"
import { GetPlaneAttributs } from "@/db/queries/attributs"
import { PlaneIcon } from "@/features/planes/planes-icons"
import { DeletePlaneButton, UpdatePlaneButton } from "@/features/planes/planes-dialogs"

export default async function Plane({params}:{params:Promise<{plane:string}>}) {
    const {plane} = await params
    const decodedSlug = decodeURIComponent(plane)
    const session = await getSession()
    const user = await GetUserByEmail({email:session?.user?.email!})
    const planeData = await GetPlaneByName({planeName:decodedSlug,userId:user.id})
    const planeId = (planeData.length>0)?planeData[0].planeId:""
    const lines = await GetPlaneLines({planeId:planeId})
    const attributs = await GetPlaneAttributs({planeId:planeId})
    
    const title = (planeData.length>0)?planeData[0].name:"Not found"
    const pagePlane = (planeData.length>0)?planeData[0]:null
    return(
        <>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <AppHeader title={title} />
                <div className="relative w-full h-full">
                    {pagePlane && planeData.length>0?
                        <div className="w-full h-full flex flex-col">
                            {/* Plane information Display */}
                            <div className="flex items-center justify-between py-2 px-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full border">
                                        <PlaneIcon icon={pagePlane.icon} size={12}/>
                                    </div>
                                    <div>
                                        <h1 className="text-xl">{pagePlane.name}</h1>
                                        <h1 className="text-sm text-muted-foreground">{pagePlane.description}</h1>
                                    </div>
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button size={"icon-sm"} variant={'outline'}>
                                            <EllipsisVertical/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="flex flex-col gap-1">
                                                <h1 className="text-sm">Edit your plane</h1>
                                                <h1 className="text-xs text-muted-foreground">Update the plane name, description or icon.</h1>
                                            </div>
                                            <UpdatePlaneButton planeToUpdate={pagePlane}>
                                                <Button size={"sm"} variant={"secondary"} className="w-full flex items-center gap-2"><Edit size={12} />Edit</Button>
                                            </UpdatePlaneButton>
                                            <DeletePlaneButton planeId={pagePlane.planeId}>
                                                <Button size={"sm"} variant={"destructive"} className="w-full flex items-center gap-2"><Trash size={12} />Delete</Button>
                                            </DeletePlaneButton>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <Separator />
                            <LineTable user={user} plane={pagePlane} lines={lines} attributs={attributs}/>
                        </div>
                        :
                        <div className="h-full w-full relative antialiased">
                            <div className="w-full h-full flex justify-center items-center flex-col gap-2 relative z-10">
                                <h1 className="text-xl">This plane doesn't exist.</h1>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                    <h1>Create new plane in your workspace :</h1>
                                    <Link className="text-orange-400 underline" href={"/workspace"}>/Workspace</Link>
                                </div>
                            </div>
                            <BackgroundBeams />
                        </div>
                    }
                </div>
            </SidebarInset>
        </>
    )
}