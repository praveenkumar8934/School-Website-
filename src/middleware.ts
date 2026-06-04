import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only');

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/teacher-dashboard') ||
    pathname.startsWith('/dashboard')
  ) {
    // Check for custom student session FIRST for /dashboard
    if (pathname.startsWith('/dashboard')) {
      const studentToken = request.cookies.get('student_session')?.value;
      if (studentToken) {
        try {
          const { payload } = await jwtVerify(studentToken, JWT_SECRET);
          if (payload && payload.role === 'student') {
            return supabaseResponse; // Allow access
          }
        } catch (err) {
          // Token invalid, fall through to Supabase auth
        }
      }
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control based on user_metadata
    const role = user.user_metadata?.role;
    
    if (pathname.startsWith('/admin-dashboard') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    if (pathname.startsWith('/teacher-dashboard') && role !== 'faculty' && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/dashboard') && role !== 'student') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin-dashboard/:path*', '/teacher-dashboard/:path*', '/dashboard/:path*'],
};
