import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_nova_secret_key_12345"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/teacher-dashboard') ||
    pathname.startsWith('/dashboard')
  ) {
    const token = request.cookies.get('nova_session_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // RBAC Checks
      if (pathname.startsWith('/admin-dashboard') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      if (pathname.startsWith('/teacher-dashboard') && payload.role !== 'faculty' && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      if (pathname.startsWith('/dashboard') && payload.role !== 'student') {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Invalid token
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/teacher-dashboard/:path*', '/dashboard/:path*'],
};
