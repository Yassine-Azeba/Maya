'use client'
import { Edit, Eye, Plus, Trash } from "lucide-react"
import React, { useState } from "react"
import DeleteCustomAttributButton from "./delete-dialog"
import { CustomAttributIcon } from "@/components/icon-selector"
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox"
import CreateCustomAttributForm from "@/components/forms/custom-attributs/create"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/animate-ui/components/animate/tooltip"
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/animate-ui/components/animate/tabs"
import { Dialog, DialogHeader, DialogPanel, DialogTitle } from "@/components/animate-ui/components/headless/dialog"
import { Button } from "@/components/ui/button"
import UpdateCustomAttributButton from "@/components/dialogs/attributs/update-button"
import UpdateCustomAttributForm from "@/components/forms/custom-attributs/update"

interface CreateCustomAttributsButtonProps {
    userEmail : string,
    planeName : string,
    lineId? : string,
    lines : {
        lineId: string;
        name: string;
        description: string | null;
        parent: string | null;
        plane: string;
        userId: string;
    }[],
    customAttributs : {
        customAttributId: string;
        name: string;
        type: "string" | "number" | "boolean" | "date" | "email" | "url" | "phone" | "line" | null;
        icon: string;
        plane: string;
        line: string | null;
        userId: string;
        appliesToChildrens: boolean;
        requiredForChildrens: boolean;
        defaultValue: string | null;
    }[]
    children : React.ReactNode
}
export default function CustomAttributsButton({userEmail,planeName,lineId,lines,customAttributs,children}:CreateCustomAttributsButtonProps){
    const [isOpen,setIsOpen] = useState(false)
    const [tabValue, setTabValue] = useState("create")
    return(
        <div>
            <Tooltip>
                <TooltipTrigger>
                    <div onClick={() => setIsOpen(true)}>
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent><p>Create Attributs</p></TooltipContent>
            </Tooltip>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <div>
                    <DialogPanel className={"sm:min-w-4xl w-full max-h-11/12 overflow-auto scrollbar-hide"}>
                        <Tabs value={tabValue}>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-1">
                                    Attributs
                                    <Button size={"icon-sm"} variant={tabValue==="view"?"secondary":"ghost"} onClick={() => setTabValue('view')}><Eye /></Button>
                                    <Button size={"icon-sm"} variant={tabValue==="update"?"secondary":"ghost"} onClick={() => setTabValue('update')}><Edit /></Button>
                                    <Button size={"icon-sm"} variant={tabValue==="create"?"secondary":"ghost"} onClick={() => setTabValue('create')}><Plus /></Button>
                                </DialogTitle>
                            </DialogHeader>
                            <TabsContents>
                                <TabsContent value="view">
                                        <div className="flex flex-col max-sm:w-xs">
                                            {(customAttributs.length>0)?customAttributs.sort((a,b) => { 
                                                if(a.line === null && b.line !== null) return -1
                                                if(a.line !== null && b.line === null) return 1
                                                return 0
                                            }).map(attribut => 
                                                <div key={attribut.customAttributId} className="p-2 w-full border-b flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <CustomAttributIcon icon={attribut.icon} size={12}/>
                                                        <div className="flex flex-col">
                                                            <h1 className="truncate text-sm">{attribut.name}</h1>
                                                            <h1 className="truncate text-xs text-muted-foreground">
                                                                {attribut.defaultValue}
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="max-sm:hidden flex items-center gap-2">
                                                            <div className="flex items-center gap-1"><Checkbox size={"sm"} disabled checked={attribut.appliesToChildrens} />Applies to children</div>
                                                            <div className="flex items-center gap-1"><Checkbox size={"sm"} disabled checked={attribut.requiredForChildrens} />Required for children</div>
                                                        </div>
                                                        <DeleteCustomAttributButton attributId={attribut.customAttributId}>
                                                            <Trash size={12}/>
                                                        </DeleteCustomAttributButton>
                                                    </div>
                                                </div>
                                            ):<div className="w-full h-28 flex items-center justify-center">
                                                <h1>No attributs yet.</h1>
                                            </div>}
                                        </div>
                                </TabsContent>
                                <TabsContent value="update">
                                    <UpdateCustomAttributForm userEmail={userEmail} planeName={planeName} attributs={customAttributs} lines={lines}/>
                                </TabsContent>
                                <TabsContent value="create">
                                    <CreateCustomAttributForm userEmail={userEmail} planeName={planeName} lineId={lineId} lines={lines} />
                                </TabsContent>
                            </TabsContents>
                        </Tabs>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    )
}
