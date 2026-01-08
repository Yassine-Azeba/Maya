'use client'
import React, { useState } from "react"
import { Separator } from "../ui/separator"
import CreateCustomAttributsForm from "../forms/create-custom-attributs"
import { Braces, CheckCheck, CircleX, SquarePlus, X } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"
import { Tooltip, TooltipContent, TooltipTrigger } from "../animate-ui/components/animate/tooltip"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "../animate-ui/components/headless/dialog"
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "../animate-ui/components/animate/tabs"

interface CustomAttributsButtonProps {
    userId : string,
    planeId : string,
    children : React.ReactNode,
    object : "Plane" | "Line",
    customAttributs : {
        customAttributId: string;
        name: string;
        type: "string" | "number" | "boolean" | "date" | null;
        plane: string;
        line: string | null;
        userId: string;
        appliesToChildrens: boolean;
        requiredForChildrens: boolean;
        defaultValue: string | null;
    }[] | undefined
}
export default function CustomAttributsButton({userId,planeId,customAttributs,object,children}:CustomAttributsButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    return (
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>{object}'s Custom Attributs</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogPanel>
                    <DialogHeader>
                        <DialogTitle>{object}'s Custom Attributs</DialogTitle>
                    </DialogHeader>
                    <Tabs>
                        <TabsList>
                            <TabsTrigger value={"list"}>List</TabsTrigger>
                            <TabsTrigger value={"add"}><SquarePlus /></TabsTrigger>
                        </TabsList>
                        <TabsContents>
                            <TabsContent value="list" className="max-w-full">
                                {(customAttributs&&customAttributs?.length>0)?<div className="flex flex-col gap-2">
                                    {/* Head */}
                                    <div className="grid grid-cols-5 text-xs font-medium">
                                        <h1>Name</h1>
                                        <h1>Type</h1>
                                        <h1>Applies to children ?</h1>
                                        <h1>Required for childrens ?</h1>
                                        <h1>Default value</h1>
                                    </div>
                                    {customAttributs.map(attribut => <div key={attribut.customAttributId}>
                                        <div className="grid grid-cols-5 text-xs font-medium items-center p-1">
                                            <h1>{attribut.name}</h1>
                                            <h1>{attribut.type}</h1>
                                            <h1>{attribut.appliesToChildrens?<CheckCheck size={12}/>:<CircleX size={12}/>}</h1>
                                            <h1>{attribut.requiredForChildrens?<CheckCheck size={12}/>:<CircleX size={12}/>}</h1>
                                            <h1>{attribut.defaultValue?attribut.defaultValue:"-"}</h1>
                                        </div>
                                        <Separator />
                                    </div>)}
                                    <div className="flex items-center justify-center w-full text-xs font-medium text-muted-foreground">
                                        {customAttributs.length} custom attributs
                                    </div>
                                </div>:
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyMedia variant={"icon"}>
                                            <Braces />
                                        </EmptyMedia>
                                        <EmptyTitle>No custom attributs</EmptyTitle>
                                        <EmptyDescription>You haven't created a custom attribut yet.</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>}
                            </TabsContent>
                            <TabsContent value="add">
                                <CreateCustomAttributsForm userId={userId} planeId={planeId}/>
                            </TabsContent>
                        </TabsContents>
                    </Tabs>
                </DialogPanel>
            </Dialog>
        </div>
    )
}