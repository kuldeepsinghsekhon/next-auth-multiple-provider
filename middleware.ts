import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  
  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')|| req.nextUrl.pathname.startsWith('/blog/editor') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }
})

export const config = {
  matcher: [
   // '/dashboard/:path*',
   // '/dashboard/:path*',
   // '/blog/editor/:path*'
  ]
}