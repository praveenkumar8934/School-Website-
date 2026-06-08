import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.JWT_SECRET;
if (!JWT_SECRET_STRING) {
  throw new Error('JWT_SECRET is not set in environment variables');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function GET(request: NextRequest) {
  try {
    const studentToken = request.cookies.get('student_session')?.value;

    if (!studentToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(studentToken, JWT_SECRET);

    if (payload && payload.role === 'student') {
      return NextResponse.json({ 
        user: {
          id: payload.id,
          email: payload.email,
          user_metadata: {
            role: payload.role,
            student_id: payload.student_id,
            name: payload.name
          }
        } 
      }, { status: 200 });
    }

    return NextResponse.json({ user: null }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
