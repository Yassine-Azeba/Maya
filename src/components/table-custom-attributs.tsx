
import { CheckCheck, X } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface CustomAttributsTableProps {
    object : "Plane" | "Line",
    customAttributs : {
        customAttributId: string;
        name: string;
        type: "string" | "number" | "boolean" | "date"  | null;
        plane: string;
        line: string | null;
        userId: string;
        appliesToChildrens: boolean;
        requiredForChildrens: boolean;
        defaultValue: string | null;
    }[] | undefined
}
export default function CustomAttributsTable({object,customAttributs}:CustomAttributsTableProps){
    return(
        <div className="max-w-full">
            <Table>
                <TableCaption>List of {object}'s custom attributs.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Applies to Children ?</TableHead>
                        <TableHead>Is required ?</TableHead>
                        <TableHead>Default Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customAttributs?.map(attribut => <TableRow key={attribut.customAttributId}>
                        <TableCell>{attribut.name}</TableCell>
                        <TableCell>{attribut.type}</TableCell>
                        <TableHead>{attribut.appliesToChildrens?<CheckCheck />:<X/>}</TableHead>
                        <TableHead>{attribut.requiredForChildrens?<CheckCheck />:<X/>}</TableHead>
                        <TableHead>{attribut.defaultValue}</TableHead>
                    </TableRow>)}
                </TableBody>
            </Table>
        </div>
    )
}