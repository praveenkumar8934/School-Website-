import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { admissionsSchema } from "@/lib/zod-schemas";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admissions@novaacademy.edu";

// Only instantiate Resend if a valid API key is available
const resend = resendApiKey && resendApiKey !== "your_resend_api_key_here" && resendApiKey.trim() !== ""
  ? new Resend(resendApiKey)
  : null;

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    // 1. Zod Server-side Validation
    const validationResult = admissionsSchema.safeParse(body);
    if (!validationResult.success) {
      // Format Zod errors to return field-specific message details
      const formattedErrors = validationResult.error.issues.map((issue: any) => ({
        field: issue.path.join("."),
        message: issue.message
      }));
      return NextResponse.json(
        { success: false, errors: formattedErrors },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Hash the password securely using bcryptjs
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    // 1.5 Check if email is already registered
    const { data: existingUser, error: checkError } = await supabase
      .from("admission_form")
      .select("id")
      .eq("parent_email", data.parentEmail.trim().toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: "An admission application is already registered with this parent's email address. Please use the Student Portal to check your status." 
        },
        { status: 409 }
      );
    }

    // 2. Insert record into Supabase public.admission_form table
    const { error } = await supabase
      .from("admission_form")
      .insert([
        {
          student_name: data.studentName.trim(),
          dob: data.dob,
          gender: data.gender,
          religion: data.religion.trim(),
          blood_group: "N/A",
          marksheet: "N/A",
          student_photo: data.studentPhoto, // Holds base64 encoded picture string
          father_name: data.fatherName.trim(),
          mother_name: data.motherName.trim(),
          parent_phone: data.parentPhone.trim(),
          alt_phone: data.altPhone ? data.altPhone.trim() : null,
          parent_email: data.parentEmail.trim().toLowerCase(),
          emergency_contact: data.emergencyContact.trim(),
          prev_school: data.prevSchool.trim(),
          prev_class: data.prevClass.trim(),
          grade: data.grade,
          aadhar_number: data.aadharNumber.trim(),
          aadhar_image: data.aadharImage,
          address: data.address.trim(),
          city: data.city.trim(),
          state: data.state.trim(),
          pin_code: data.pinCode.trim(),
          status: "pending",
          password_hash: passwordHash,
          payment_status: "pending",
          payment_id: null
        }
      ]);

    if (error) {
      console.error("Supabase Database Insertion Error inside admissions-submit route:", error);
      return NextResponse.json(
        { success: false, message: "Failed to save admissions details. Database insertion failed." },
        { status: 500 }
      );
    }

    // 3. Dispatch detailed HTML email notification to admissions department (Resend)
    if (resend) {
      try {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>New Admissions Registration Received</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 0; }
                .container { max-width: 650px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; }
                .header { background: linear-gradient(135deg, #0f2744 0%, #1e4a7a 100%); color: #ffffff; padding: 35px 20px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em; }
                .header p { margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 30px; }
                .section-title { font-size: 15px; font-weight: 700; text-transform: uppercase; color: #3b82f6; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px; margin-top: 25px; margin-bottom: 14px; letter-spacing: 0.05em; }
                .section-title:first-child { margin-top: 0; }
                .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .data-table tr { border-bottom: 1px solid #f1f5f9; }
                .data-table td { padding: 10px; font-size: 14px; color: #0f172a; }
                .data-table td.label { font-weight: 600; color: #64748b; width: 35%; font-size: 12px; text-transform: uppercase; background-color: #f8fafc; }
                .footer { background-color: #f1f5f9; color: #64748b; font-size: 12px; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; }
                .footer p { margin: 4px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Nova Academy</h1>
                  <p>Complete Student Admission Form Submitted</p>
                </div>
                <div class="content">
                  
                  <div class="section-title">1. Student Information</div>
                  <table class="data-table">
                    <tr>
                      <td class="label">Student Name</td>
                      <td>${data.studentName}</td>
                    </tr>
                    <tr>
                      <td class="label">Date of Birth</td>
                      <td>${data.dob}</td>
                    </tr>
                    <tr>
                      <td class="label">Gender</td>
                      <td>${data.gender}</td>
                    </tr>
                    <tr>
                      <td class="label">Religion</td>
                      <td>${data.religion}</td>
                    </tr>
                  </table>

                  <div class="section-title">2. Parent & Contacts Details</div>
                  <table class="data-table">
                    <tr>
                      <td class="label">Father Name</td>
                      <td>${data.fatherName}</td>
                    </tr>
                    <tr>
                      <td class="label">Mother Name</td>
                      <td>${data.motherName}</td>
                    </tr>
                    <tr>
                      <td class="label">Mobile Number</td>
                      <td><a href="tel:${data.parentPhone}">${data.parentPhone}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Alternate Contact</td>
                      <td>${data.altPhone ? `<a href="tel:${data.altPhone}">${data.altPhone}</a>` : "N/A"}</td>
                    </tr>
                    <tr>
                      <td class="label">Parent Email</td>
                      <td><a href="mailto:${data.parentEmail}">${data.parentEmail}</a></td>
                    </tr>
                    <tr>
                      <td class="label">Emergency Contact</td>
                      <td><a href="tel:${data.emergencyContact}">${data.emergencyContact}</a></td>
                    </tr>
                  </table>

                  <div class="section-title">3. Academic Profile</div>
                  <table class="data-table">
                    <tr>
                      <td class="label">Previous School</td>
                      <td>${data.prevSchool}</td>
                    </tr>
                    <tr>
                      <td class="label">Previous Class</td>
                      <td>${data.prevClass}</td>
                    </tr>
                    <tr>
                      <td class="label">Class Applying For</td>
                      <td><strong>${data.grade}</strong></td>
                    </tr>
                  </table>

                  <div class="section-title">4. Residential & Verification</div>
                  <table class="data-table">
                    <tr>
                      <td class="label">Aadhar Number</td>
                      <td>${data.aadharNumber}</td>
                    </tr>
                    <tr>
                      <td class="label">Aadhar Image</td>
                      <td><a href="${data.aadharImage}" target="_blank" style="color:#3b82f6;">View Uploaded Aadhar</a></td>
                    </tr>
                    <tr>
                      <td class="label">Residential Address</td>
                      <td>${data.address}, ${data.city}, ${data.state} - ${data.pinCode}</td>
                    </tr>
                  </table>
                  
                </div>
                <div class="footer">
                  <p>This is an automated enrollment notification from Nova Academy Registrar Office.</p>
                  <p>&copy; 2026 Nova Academy. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        const emailResult = await resend.emails.send({
          from: "Nova Academy Admissions <onboarding@resend.dev>",
          to: adminEmail,
          subject: `🎓 New Student Admission Form: ${data.studentName} (${data.grade})`,
          html: htmlContent,
        });

        if (emailResult.error) {
          console.error("Resend API failed to dispatch admissions email:", emailResult.error);
        } else {
          console.log(`Admissions email notice sent successfully. ID: ${emailResult.data?.id}`);
        }

        // Send payment confirmation email to parent
        const parentEmailResult = await resend.emails.send({
          from: "Nova Academy Admissions <onboarding@resend.dev>",
          to: data.parentEmail,
          subject: `💳 Payment Confirmation: Registration Fee for ${data.studentName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h2 style="color: #1e4a7a;">Payment Receipt</h2>
              <p>Dear ${data.fatherName} / ${data.motherName},</p>
              <p>We have successfully received the admission registration fee for <strong>${data.studentName}</strong>.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Student Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Class Applied:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.grade}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Amount Paid:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹1,000.00</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${data.paymentId || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Status:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd; color: green;">Completed</td>
                </tr>
              </table>
              <p>The application is now under review. We will contact you soon regarding the next steps.</p>
              <p>Regards,<br>Nova Academy Admissions Team</p>
            </div>
          `,
        });
        
        if (parentEmailResult.error) {
          console.error("Failed to send parent confirmation email:", parentEmailResult.error);
        }

      } catch (emailErr) {
        console.error("Resend Email Notification crashed inside admissions-submit:", emailErr);
      }
    }

    return NextResponse.json(
      { success: true, message: "Student admissions form registered successfully!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Internal Server Error in admissions-submit Route:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
