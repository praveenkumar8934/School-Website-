import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_nova_secret_key_12345"
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password, portalType } = body;

    if (!identifier || !password || !portalType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const normalizedPassword = password.trim();
    let userPayload: any = null;

    // Global Hardcoded Admin Check
    if (normalizedIdentifier === "admin@nova.edu") {
      if (normalizedPassword !== "Admin@123") {
        return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
      }
      userPayload = {
        id: "ADMIN-001",
        name: "System Administrator",
        email: "admin@nova.edu",
        status: "approved",
        role: "admin",
      };
    } else if (normalizedIdentifier.startsWith("admin")) {
      return NextResponse.json({ error: "Unauthorized administrative access" }, { status: 403 });
    } else {
      const cleanIdentifier = identifier.trim();

      if (portalType === "student") {
        const { data, error } = await supabase
          .from("admission_form")
          .select("id, student_name, student_id, parent_email, status, password_hash")
          .or(`parent_email.ilike.${cleanIdentifier},student_id.ilike.${cleanIdentifier}`)
          .single();

        if (error || !data) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, data.password_hash);
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        userPayload = {
          id: data.id,
          name: data.student_name,
          studentId: data.student_id,
          email: data.parent_email,
          status: data.status,
          role: "student",
        };
      } else if (portalType === "faculty") {
        const { data, error } = await supabase
          .from("faculty_registrations")
          .select("id, full_name, faculty_id, email, status, password_hash")
          .or(`email.ilike.${cleanIdentifier},faculty_id.ilike.${cleanIdentifier}`)
          .single();

        if (error || !data) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, data.password_hash);
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        userPayload = {
          id: data.id,
          name: data.full_name,
          facultyId: data.faculty_id,
          email: data.email,
          status: data.status,
          role: "faculty",
        };
      } else {
        return NextResponse.json({ error: "Invalid portal type" }, { status: 400 });
      }
    }

    if (!userPayload) {
      return NextResponse.json({ error: "User payload generation failed" }, { status: 500 });
    }

    // Generate JWT
    const token = await new SignJWT(userPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Set HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "nova_session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: userPayload
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
