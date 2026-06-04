import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only');

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Lookup student in the students table first to see if they are approved
    // Wait, the admission_form table has the password_hash.
    // The students table is just a copy of the admission_form data upon approval.
    // Let's check both or just admission_form.
    let loginEmail = email;
    
    // Support login by student ID as well
    if (!loginEmail.includes('@')) {
      const { data: student } = await supabase
        .from('students')
        .select('parent_email, email')
        .eq('student_id', loginEmail)
        .single();
      
      if (student) {
        loginEmail = student.parent_email || student.email || loginEmail;
      }
    }

    // Now check the admission_form for this email to get the password_hash
    const { data: admissionData, error } = await supabase
      .from('admission_form')
      .select('id, student_id, student_name, parent_email, status, password_hash')
      .eq('parent_email', loginEmail)
      .single();

    if (error || !admissionData) {
      return NextResponse.json(
        { success: false, message: "Invalid login credentials." },
        { status: 401 }
      );
    }

    if (admissionData.status !== 'approved') {
      return NextResponse.json(
        { success: false, message: "Your admission is still pending approval." },
        { status: 401 }
      );
    }

    if (!admissionData.password_hash) {
      return NextResponse.json(
        { success: false, message: "Account not properly configured. Please contact administration." },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admissionData.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid login credentials." },
        { status: 401 }
      );
    }

    // Generate JWT cookie
    const alg = 'HS256';
    const jwt = await new SignJWT({
      id: admissionData.id,
      student_id: admissionData.student_id,
      email: admissionData.parent_email,
      name: admissionData.student_name,
      role: 'student'
    })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      user: {
        id: admissionData.id,
        student_id: admissionData.student_id,
        email: admissionData.parent_email,
        name: admissionData.student_name,
        role: 'student'
      }
    });

    response.cookies.set({
      name: 'student_session',
      value: jwt,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    console.error("Student login error:", err);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
