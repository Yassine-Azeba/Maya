"use client"
import { signIn } from "next-auth/react";

export default function SignInButton(){
    return <button onClick={() => signIn('google')} className="cursor-pointer hover:underline">Sign In with Google</button>
}