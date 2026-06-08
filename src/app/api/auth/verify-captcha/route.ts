import { NextRequest, NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/captcha";

export async function POST(request: NextRequest) {
  try {
    const { answer, token } = await request.json();

    if (!answer || !token) {
      return NextResponse.json(
        { success: false, message: "Missing captcha answer or token." },
        { status: 400 }
      );
    }

    const isValid = verifyCaptcha(answer, token);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Incorrect captcha." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
