import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, grade, message, securityAnswer, captchaToken } = data;

    if (!firstName || !lastName || !email || !grade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!securityAnswer || !captchaToken) {
      return NextResponse.json({ error: "Captcha is missing" }, { status: 400 });
    }

    // Verify Captcha
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    try {
      const captchaRes = await fetch(`${baseUrl}/api/auth/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: securityAnswer, token: captchaToken })
      });
      const captchaResult = await captchaRes.json();
      
      if (!captchaResult.success) {
        return NextResponse.json({ error: "Incorrect security check answer" }, { status: 400 });
      }
    } catch (err) {
      console.error("Captcha verification failed:", err);
      return NextResponse.json({ error: "Security check validation failed" }, { status: 500 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!resendApiKey || !adminEmail) {
      console.error("Resend API key or Admin Email not configured.");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const emailHtml = `
      <h2>New Admissions Inquiry</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Student Grade:</strong> ${grade}</p>
      <p><strong>Message:</strong></p>
      <p>${message || "No message provided."}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Acme <onboarding@resend.dev>", // Replace with verified domain if available
        to: [adminEmail],
        subject: `New Inquiry from ${firstName} ${lastName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Resend Error: ${JSON.stringify(errorData)}`);
    }

    return NextResponse.json({ message: "Inquiry sent successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send inquiry" },
      { status: 500 }
    );
  }
}
