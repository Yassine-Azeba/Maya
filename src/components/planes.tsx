'use client'
import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsContents } from "@/components/animate-ui/components/animate/tabs"
import { Button } from "./ui/button"
import { SquarePlus } from "lucide-react"
import { Card } from "./ui/card"

interface PlaneTabsProps {
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[]
}
export function PlaneTabs({lines}:PlaneTabsProps){
    const [tab,setTab] = useState("List")
    return(
        <div className="w-full h-full">
            <Tabs value={tab} className="w-full h-full">
                <ScrollArea className="w-full" >
                    <div className="w-full border-b flex items-center gap-4 px-8 pb-1">
                        <Button variant={(tab==="List")?"secondary":"ghost"} size={"sm"} onClick={() => setTab("List")}>List</Button>
                        <Button variant={(tab==="Add")?"secondary":"ghost"} size={"sm"} onClick={() => setTab("Add")}><SquarePlus /></Button>
                    </div>
                    <ScrollBar orientation="horizontal"/>
                </ScrollArea>
                <TabsContents>
                    <TabsContent value="List">
                        <div className="w-full h-full flex items-center justify-center">
                            {/* <PlaneList lines={lines}/> */}
                        </div>
                    </TabsContent>
                    <TabsContent value="Add">
                        <div className="w-full h-full flex items-center justify-center">
                            <h1>Add</h1>
                        </div>
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </div>
    )
}

interface PlaneListProps {
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[]
}
export function PlaneList({lines}:PlaneListProps){
    return(
        <Card></Card>
    )
}