import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const ADMIN_ROUTE_PREFIXES = [
  '/api/knowledgebase',
  '/api/config',
];

const isAdminRoute = (pathname: string): boolean => {
  const normalizedPath = String(pathname).trim();
  return ADMIN_ROUTE_PREFIXES.some(prefix => normalizedPath.startsWith(prefix));
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const session = await auth()
  
  if (nextUrl.pathname === '/register') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    
    return NextResponse.next()
  }
  
  if (isAdminRoute(nextUrl.pathname) && !session) {
    return NextResponse.json({ message: 'You are not authenticated.' }, { status: 401 });
  }

  if (nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/register', req.url))
    }

    if (nextUrl.pathname === '/dashboard') {
      const url = req.nextUrl.clone()
      url.pathname = '/dashboard/knowledgebase'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard', 
    '/register', 
    '/dashboard/:path*', 
    '/api/knowledgebase/:path*', 
    '/api/config'
  ],
}
