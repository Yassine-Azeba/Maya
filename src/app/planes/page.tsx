
import { getSession } from "@/lib/nextauth"

export default async function Planes() {
    const session = await getSession()
    return(
        <div className="flex items-center justify-center h-full w-full">
            ???
        </div>
    )
}