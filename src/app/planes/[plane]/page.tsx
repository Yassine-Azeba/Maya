import Link from "next/link"
import { GetUser } from "@/data/get/users"
import { getSession } from "@/lib/nextauth"
import AppSidebar from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { GetPlanesWithLines } from "@/data/get/planes"
import { SidebarInset } from "@/components/ui/sidebar"
import { BackgroundBeams } from "@/components/ui/shadcn-io/background-beams"
import { PlaneIcon } from "@/components/icon-selector"
import { Edit, EllipsisVertical, Trash } from "lucide-react"
import { PlaneTabs } from "@/components/planes"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/animate-ui/components/radix/popover"
import { Button } from "@/components/animate-ui/components/buttons/button"
import UpdatePlaneButton from "@/components/dialogs/planes/update-dialog"
import DeletePlaneButton from "@/components/dialogs/planes/delete-dialog"
import { Card } from "@/components/ui/card"
import CreateLineButton from "@/components/dialogs/lines/create-dialog"
import DeleteLineButton from "@/components/dialogs/lines/delete-dialog"

export default async function Plane({params}:{params:Promise<{plane:string}>}) {
    const {plane} = await params
    const decodedSlug = decodeURIComponent(plane)
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planeData = await GetPlanesWithLines({userEmail:user.email!,name:decodedSlug})
    
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
                            <div className="w-full h-full px-4 py-2">
                                {(lines.length>0)?
                                    <Card className="w-full h-full px-2 py-4">
                                        {lines.map(line => <div key={line.lineId} className="w-full px-2 py-0.5 bg-accent rounded-md flex justify-between text-sm">
                                            <div className="flex flex-col gap-0.5">
                                                <h1>{line.name}</h1>
                                                <h1 className="text-muted-foreground">{line.description}</h1>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant={"outline"} size={'icon-sm'}><Edit /></Button>
                                                <DeleteLineButton lineId={line.lineId}>
                                                    <Button variant={"outline"} size={'icon-sm'}><Trash /></Button>
                                                </DeleteLineButton>
                                            </div>
                                        </div>)}
                                        <CreateLineButton user={user} plane={pagePlane} lines={lines}>
                                            <Button className="w-full" variant={"outline"}>New Line</Button>
                                        </CreateLineButton>
                                    </Card>
                                    :
                                    <Card className="w-full h-full">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <CreateLineButton user={user} plane={pagePlane} lines={lines}>
                                                <Button>Create your first line</Button>
                                            </CreateLineButton>
                                        </div>
                                    </Card>
                                }
                            </div>
                        </div>
                        :
                        <div className="h-full w-full relative antialiased">
                            <div className="w-full h-full flex justify-center items-center flex-col gap-2 relative z-10">
                                <h1 className="text-xl">This plane doesn't exist.</h1>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                    <h1>Create the plane in your workspace :</h1>
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