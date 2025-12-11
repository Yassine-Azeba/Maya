import { getSession } from "@/lib/nextauth"
import SignInButton from "@/components/signin-button"
import LogOutButton from "@/components/logout-button";

export default async function Home() {
	const session = await getSession()
	return (
		<div className="max-h-screen min-h-screen min-w-screen max-w-lvh flex items-center justify-center flex-col gap-4">
			{session?<h1>You are connected</h1>:<h1>User not connected</h1>}
			{session?<LogOutButton />:<SignInButton />}
		</div>		
	);
}
