import Link from "next/link"
import { GetUser } from "@/data/user"
import { GetLines } from "@/data/lines"
import { GetPlanes } from "@/data/planes"
import { getSession } from "@/lib/nextauth"
import { Button } from "@/components/ui/button"
import CreatePlaneForm from "@/components/forms/create-plane"
import CreateLineButton from "@/components/buttons/create-line"
import CreatePlaneButton from "@/components/buttons/create-plane"
import UpdatePlaneButton from "@/components/buttons/update-plane"
import DeletePlaneButton from "@/components/buttons/delete-plane"
import { ArrowUpRight, Edit2, LayersPlus, Plus, SquarePlus, Trash2 } from "lucide-react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/animate/tabs"

export default async function Workspace(){
    const session = await getSession()
    const user = await GetUser({email:session?.user?.email!})
    const planes = await GetPlanes({userId:user.data![0].id})
    const lines = await GetLines({userId:user.data![0].id})
    return(
        <div className="w-full h-full">
            {(planes.data && planes.data.length>0)?<div className="w-full h-full p-2">
                <Tabs defaultValue={planes.data[0].name}>
                    <TabsList>
                        {/* TODO : overflow when too much tabs */}
                        {planes.data.map(plane => <TabsTrigger key={plane.name} value={plane.name}>{plane.name}</TabsTrigger>)}
                        <TabsTrigger value={"New Plane"}><SquarePlus /></TabsTrigger>
                    </TabsList>
                    <Card>
                        <TabsContents>
                            {planes.data.map(plane => {
                                const planeLines = lines.data?.filter(line => line.plane === plane.planeId)
                                return(
                                    <TabsContent className="flex flex-col gap-2" key={plane.name} value={plane.name}>
                                        <CardHeader>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-sm">{plane.name}</CardTitle>
                                                <UpdatePlaneButton plane={plane}>
                                                    <Edit2 size={12}/>
                                                </UpdatePlaneButton>
                                                <DeletePlaneButton plane={plane}>
                                                    <Trash2 size={12}/>
                                                </DeletePlaneButton>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CardDescription className="text-xs">{plane.description}</CardDescription>
                                                <UpdatePlaneButton descriptionOnly plane={plane}>
                                                    <div className="text-muted-foreground"><Edit2 size={10}/></div>
                                                </UpdatePlaneButton>
                                            </div>
                                            <CardAction>
                                                <CreateLineButton planeId={plane.planeId} lines={planeLines} userId={user.data![0].id}>
                                                    <Button variant={"outline"} size={"icon-sm"}>
                                                        <Plus />
                                                    </Button>
                                                </CreateLineButton>
                                            </CardAction>
                                        </CardHeader>
                                        <CardContent>
                                            {/* <DotList planeId={plane.planeId} lines={planeLines} /> */}
                                        </CardContent>
                                    </TabsContent>
                                )})
                            }
                            <TabsContent className="p-28" value="New Plane">
                                <CreatePlaneForm userId={user.data![0].id}/>
                            </TabsContent>
                        </TabsContents>
                    </Card>
                </Tabs>
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
                        <CreatePlaneButton userId={user.data![0].id}>
                            <Button className="h-8 w-full flex items-center gap-4">New plane <LayersPlus size={12}/></Button>
                        </CreatePlaneButton>
                    </EmptyContent>
                    <Button variant={"link"} className="text-muted-foreground">
                        <Link href={"/help"} className="flex items-center">Get help<ArrowUpRight className="pt-0.5" /></Link>
                    </Button>
                </Empty>
            </div>}
        </div>
    )
}