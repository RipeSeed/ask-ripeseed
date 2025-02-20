// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const checkIfUserExists = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/check-user`, {
    method: 'GET',
  })

  const data = await res.json()
  return data.exists
}

export async function middleware(req: NextRequest) {
  const { nextUrl } = req

  const userExists = await checkIfUserExists()
  if (nextUrl.pathname === '/register' && userExists) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (nextUrl.pathname === '/dashboard' && !userExists) {
    return NextResponse.redirect(new URL('/register', req.url))
  }

  if (nextUrl.pathname === '/dashboard') {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard/knowledgebase'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/register', '/login'],
}
