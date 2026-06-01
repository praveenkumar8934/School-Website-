import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateAdmissionForm } from "@/lib/validation";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admissions@novaacademy.edu";

// Only instantiate Resend if a real API key is supplied
const resend = resendApiKey && resendApiKey !== "your_resend_api_key_here" && resendApiKey.trim() !== ""
  ? new Resend(resendApiKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    // Check if request is valid JSON
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid request payload." },
        { status: 400 }
      );
    }

    // 1. Honeypot check (Spam protection)
    // If the hidden 'website' field is filled in, it is definitely a bot submission.
    // We return a silent 200 success response so the bot thinks it succeeded, but we do NOT save it.
    if (body.website && body.website.trim() !== "") {
      console.warn("Spam bot detected via honeypot field. Silent response triggered.");
      return NextResponse.json(
        { success: true, message: "Inquiry processed successfully." },
        { status: 200 }
      );
    }

    // 2. Validate form inputs on the server-side
    const validationErrors = validateAdmissionForm(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, errors: validationErrors },
        { status: 400 }
      );
    }

    const { studentName, parentName, email, phone, grade, address, message } = body;

    // 3. Database insertion into Supabase PostgreSQL
    const { error } = await supabase
      .from("admissions")
      .insert([
        {
          student_name: studentName.trim(),
          parent_name: parentName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          grade: grade,
          address: address.trim(),
          message: message ? message.trim() : null,
          status: "pending",
        },
      ]);

    if (error) {
      console.error("Supabase Database Insertion Error:", error);
      return NextResponse.json(
        { success: false, message: "Could not submit admission form at this time. Please try again later." },
        { status: 500 }
      );
    }

    // 4. Send Email Notification to Admin (Resend)
    if (resend) {
      try {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>New Admission Inquiry Received</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: #ffffff; padding: 30px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
                .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 30px; }
                .section-title { font-size: 16px; font-weight: 600; text-transform: uppercase; color: #475569; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; margin-bottom: 16px; letter-spacing: 0.05em; }
                .footer { background-color: #f1f5f9; color: #64748b; font-size: 12px; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; }
                .footer p { margin: 4px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Nova Academy</h1>
                  <p>New Admission Inquiry Submitted</p>
                </div>
                <div class="content">
                  <div class="section-title">Applicant Details</div>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; width: 35%; font-weight: bold; color: #64748b; font-size: 13px;">STUDENT NAME</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${studentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 13px;">PARENT / GUARDIAN</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${parentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 13px;">EMAIL ADDRESS</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 13px;">PHONE NUMBER</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;"><a href="tel:${phone}">${phone}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 13px;">APPLYING FOR</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${grade}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; background-color: #f8fafc; border: 1px solid #f1f5f9; font-weight: bold; color: #64748b; font-size: 13px;">HOME ADDRESS</td>
                      <td style="padding: 10px; border: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">${address}</td>
                    </tr>
                  </table>

                  ${
                    message
                      ? `
                    <div class="section-title" style="margin-top: 25px;">Message / Additional Info</div>
                    <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #f1f5f9; font-style: italic; color: #334155; line-height: 1.5;">
                      "${message.trim().replace(/\n/g, "<br>")}"
                    </div>
                  `
                      : ""
                  }
                  
                </div>
                <div class="footer">
                  <p>This is an automated notification from Nova Academy Admission Portal.</p>
                  <p>&copy; 2026 Nova Academy. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        const emailResponse = await resend.emails.send({
          from: "Nova Academy Admissions <onboarding@resend.dev>",
          to: adminEmail,
          subject: `🔔 New Admission Inquiry: ${studentName} (${grade})`,
          html: htmlContent,
        });

        if (emailResponse.error) {
          console.error("Resend API Error details:", emailResponse.error);
        } else {
          console.log(`Email notification successfully sent to admin: ${adminEmail}, ID: ${emailResponse.data?.id}`);
        }
      } catch (emailErr) {
        console.error("Failed to send email notification via Resend SDK:", emailErr);
        // Do not crash the response - database insertion was successful!
      }
    } else {
      console.warn("Resend API Key is not configured. Skipping email notification.");
    }

    // 5. Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Admission inquiry submitted successfully! Our admissions team will contact you soon."
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("API Route Internal Error:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected server-error occurred. Please try again." },
      { status: 500 }
    );
  }
}
