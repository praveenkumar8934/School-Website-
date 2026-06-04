import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { supabase } from "@/lib/supabase";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only');

export async function GET(request: NextRequest) {
  try {
    const studentToken = request.cookies.get('student_session')?.value;
    if (!studentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(studentToken, JWT_SECRET);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.student_id as string;

    const [
      { data: profile },
      { data: attendanceData },
      { data: marksData },
      { data: feeData },
      { data: notices },
      { data: sysSettings }
    ] = await Promise.all([
      supabase.from("students").select("*").eq("student_id", userId).single(),
      supabase.from("attendance").select("*").eq("student_id", userId),
      supabase.from("marks").select("*").eq("student_id", userId),
      supabase.from("fees").select("*").eq("student_id", userId).order("due_date", { ascending: true }),
      supabase.from("notices").select("*").order("created_at", { ascending: false }).limit(5),
      supabase.from("system_settings").select("*").eq("id", 1).single()
    ]);

    return NextResponse.json({
      profile,
      attendanceData: attendanceData || [],
      marksData: marksData || [],
      feeData: feeData || [],
      notices: notices || [],
      sysSettings: sysSettings || null
    });

  } catch (err) {
    console.error("Dashboard data error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
