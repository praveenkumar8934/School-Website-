import { NextResponse } from "next/server";
import { generateCaptcha } from "@/lib/captcha";

export const dynamic = "force-dynamic";

export async function GET() {
  const captcha = generateCaptcha();
  return NextResponse.json(captcha);
}
