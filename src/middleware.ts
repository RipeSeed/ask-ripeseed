// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { nextUrl } = req

  if (nextUrl.pathname === '/dashboard') {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard/knowledgebase'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard'],
}
