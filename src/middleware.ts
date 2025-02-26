import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt';

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
  const userExists = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (isAdminRoute(nextUrl.pathname) && !userExists) {
    return NextResponse.json({ message: 'You are not authenticated.' }, { status: 401 });
  }
  if (nextUrl.pathname === '/register' && userExists) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (nextUrl.pathname.startsWith('/dashboard')) {

    if (!userExists) {
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
  matcher: ['/dashboard', '/register', '/dashboard/:path*', '/api/knowledgebase/:path*', '/api/config'],
}
