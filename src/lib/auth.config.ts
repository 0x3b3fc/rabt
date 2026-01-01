import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith('/admin')
      const isOnUserRoute =
        nextUrl.pathname.startsWith('/dashboard') ||
        nextUrl.pathname.startsWith('/apply') ||
        nextUrl.pathname.startsWith('/application')
      const isOnAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register'

      // Admin routes require admin role
      if (isOnAdmin) {
        if (!isLoggedIn) return false
        // Role check is done in middleware after session is available
        return true
      }

      // User routes require authentication
      if (isOnUserRoute) {
        if (!isLoggedIn) return false
        return true
      }

      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isOnAuthPage) {
        const role = auth.user?.role
        if (role === 'ADMIN') {
          return Response.redirect(new URL('/admin/dashboard', nextUrl))
        }
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role as string
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
}
