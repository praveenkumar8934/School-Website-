import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only');

export async function GET() {
  const cookieStore = await cookies();
  const studentToken = cookieStore.get('student_session')?.value;

  // 1. Check custom student session first
  if (studentToken) {
    try {
      const { payload } = await jwtVerify(studentToken, JWT_SECRET);
      if (payload && payload.role === 'student') {
        return NextResponse.json({ user: { role: 'student', email: payload.email, id: payload.id } }, { status: 200 });
      }
    } catch (err) {
      // Invalid token, fall through to Supabase auth
    }
  }

  // 2. Check Supabase session
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Ensure the user actually has a valid role for this app (ignores leftover localhost cookies from other projects)
  const role = data.user.user_metadata?.role;
  if (!role || !['student', 'faculty', 'admin'].includes(role)) {
    return NextResponse.json({ error: "Not authenticated for this app" }, { status: 401 });
  }

  return NextResponse.json({ user: { ...data.user, role } }, { status: 200 });
}
