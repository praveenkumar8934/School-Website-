import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "your_resend_api_key_here" && resendApiKey.trim() !== ""
  ? new Resend(resendApiKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, generatedId } = body;

    if (!type || !name || !email || !generatedId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!resend) {
      console.warn("Resend is not configured. Email will not be sent.");
      return NextResponse.json({ success: false, message: "Email service disabled." }, { status: 200 });
    }

    const isStudent = type === "student";
    const portalRole = isStudent ? "Student" : "Faculty";
    const idLabel = isStudent ? "Admission Number (Student ID)" : "Faculty ID";
    
    // Fallback base URL depending on deployment or local dev
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const loginUrl = `${baseUrl}/login`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Application Approved - Nova Academy</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 35px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
            .content { padding: 40px 30px; text-align: center; }
            .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #0f172a; }
            .message { font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 30px; }
            .id-box { background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; margin: 0 auto 30px auto; max-width: 400px; }
            .id-label { font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px; }
            .id-value { font-size: 24px; font-weight: 800; color: #0f172a; font-family: monospace; letter-spacing: 0.05em; }
            .button { display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-weight: 600; padding: 14px 28px; border-radius: 8px; font-size: 15px; transition: background-color 0.2s; }
            .button:hover { background-color: #2563eb; }
            .footer { background-color: #f8fafc; color: #94a3b8; font-size: 12px; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Nova Academy!</h1>
            </div>
            <div class="content">
              <div class="greeting">Dear ${name},</div>
              <div class="message">
                We are thrilled to inform you that your application has been successfully <strong>approved</strong>! 
                You are officially registered as a ${portalRole} at Nova Academy.
              </div>
              
              <div class="id-box">
                <div class="id-label">Your Official ${idLabel}</div>
                <div class="id-value">${generatedId}</div>
              </div>
              
              <div class="message">
                You can now log in to the ${portalRole} Portal using your registered email and the password you created during application.
              </div>
              
              <a href="${loginUrl}" class="button">Log In to Portal</a>
            </div>
            <div class="footer">
              <p>Nova Academy Registrar Office</p>
              <p>If you have any questions, please reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResult = await resend.emails.send({
      from: "Nova Academy <onboarding@resend.dev>", // Using testing domain for dev
      to: email,
      subject: `🎉 Application Approved! Your ${idLabel} Inside`,
      html: htmlContent,
    });

    if (emailResult.error) {
      console.error("Resend API failed to send approval notification:", emailResult.error);
      return NextResponse.json({ success: false, message: "Email delivery failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Approval email sent successfully" }, { status: 200 });

  } catch (error: any) {
    console.error("Internal Server Error in email notify route:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
