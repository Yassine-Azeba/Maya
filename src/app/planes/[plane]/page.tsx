import Link from "next/link"
import { GetUser } from "@/data/get/users"
import { getSession } from "@/lib/nextauth"
import { Card } from "@/components/ui/card"
import AppSidebar from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { GetPlanesWithLines } from "@/data/get/planes"
import { SidebarInset } from "@/components/ui/sidebar"
import { PlaneIcon } from "@/components/icon-selector"
import { Braces, Edit, EllipsisVertical, Trash } from "lucide-react"
import { GetUserCustomAttributs } from "@/data/get/custom-attributs"
import DeletePlaneButton from "@/components/dialogs/planes/delete-dialog"
import UpdatePlaneButton from "@/components/dialogs/planes/update-dialog"
import { Button } from "@/components/animate-ui/components/buttons/button"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"
import CustomAttributsButton from "@/components/dialogs/attributs/create-view-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/animate-ui/components/radix/popover"
import { Separator } from "@/components/ui/separator"
import LineTable from "@/components/line-table"

export default async function Plane({params}:{params:Promise<{plane:string}>}) {
    const {plane} = await params
    const decodedSlug = decodeURIComponent(plane)
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planeData = await GetPlanesWithLines({userEmail:user.email!,name:decodedSlug})
    const customAttributs = await GetUserCustomAttributs({userEmail:session?.user?.email!})
    
    const title = (planeData.length>0)?planeData[0].planes.name:"Not found"
    const pagePlane = (planeData.length>0)?planeData[0].planes:null
    const lines = planeData.map(data => data.lines).filter(line => line !== null)
    return(
        <>
            <AppSidebar />
            <SidebarInset className="overflow-x-hidden">
                <AppHeader title={title} />
                <div className="w-full h-full">
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
                                <div className="flex items-center gap-2">
                                    <CustomAttributsButton customAttributs={customAttributs} userEmail={user.email!} planeName={pagePlane.name} lines={lines}>
                                        <Button size={"icon-sm"} variant={'outline'}>
                                            <Braces />
                                        </Button>
                                    </CustomAttributsButton>
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
                                                <UpdatePlaneButton userEmail={user.email!} plane={pagePlane}>
                                                    <Button size={"sm"} variant={"secondary"} className="w-full flex items-center gap-2"><Edit size={12} />Edit</Button>
                                                </UpdatePlaneButton>
                                                <DeletePlaneButton planeId={pagePlane.planeId}>
                                                    <Button size={"sm"} variant={"destructive"} className="w-full flex items-center gap-2"><Trash size={12} />Delete</Button>
                                                </DeletePlaneButton>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <Separator />
                            <LineTable user={user} plane={pagePlane} lines={lines} attributs={customAttributs}/>
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