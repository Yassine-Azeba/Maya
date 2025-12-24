import { getSession } from "@/lib/nextauth"
import SignInButton from "@/components/signin-button"
import Link from "next/link"
import { FlaskConical } from "lucide-react"

export default async function Home() {
	const session = await getSession()
	return (
		<div className="max-h-screen min-h-screen min-w-screen max-w-lvh flex items-center justify-center flex-col gap-4">
			{session?<h1>You are connected</h1>:<h1>User not connected</h1>}
			{session?<Link href='/workspace' className="flex items-center gap-2 cursor-pointer hover:underline">Workspace <FlaskConical size={12}/></Link>:<></>}
			<SignInButton />
		</div>		
	);
}
