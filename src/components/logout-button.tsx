"use client"
import { signOut } from "next-auth/react";

export default function LogOutButton(){
    return <button onClick={() => signOut()} className="cursor-pointer hover:underline">Log Out</button>
}