import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_nova_secret_key_12345"
);

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("nova_session_token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({ user: payload });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
