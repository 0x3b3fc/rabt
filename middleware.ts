import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  // Protect admin routes - require admin role
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  // Protect user routes - require authentication
  if (
    nextUrl.pathname.startsWith('/dashboard') ||
    nextUrl.pathname.startsWith('/apply') ||
    nextUrl.pathname.startsWith('/application')
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    // If admin tries to access user routes, redirect to admin dashboard
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    }
  }

  // Redirect authenticated users from auth pages
  if (nextUrl.pathname === '/login' || nextUrl.pathname === '/register') {
    if (isLoggedIn) {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
      }
      return NextResponse.redirect(new URL('/dashboard', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
