import { db } from '../db/schema'
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GoogleProvider from "next-auth/providers/google"
import { AuthOptions, getServerSession } from "next-auth"

export const authOptions : AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    adapter: DrizzleAdapter(db),
    providers: [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ]
}

export const getSession = () => getServerSession(authOptions)