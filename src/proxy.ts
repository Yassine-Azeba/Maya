import { NextRequest, NextResponse } from "next/server"
import { getSession } from "./lib/nextauth"


const publicPath = ['/']

export async function proxy(request : NextRequest){
    const { pathname } = request.nextUrl
    if(publicPath.includes(pathname)) return NextResponse.next()
    
    const session = await getSession()
    if(!session || !session.user || !session.user.email){
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }
    return NextResponse.next()
}

export const config = {
    matcher : "/workspace"
}