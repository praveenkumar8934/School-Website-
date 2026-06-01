import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase integration not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the email exists in faculty_registrations
    const { data, error } = await supabase
      .from("faculty_registrations")
      .select("status, full_name, faculty_id, assigned_class, assigned_section, assigned_subject, role_type, gender")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return NextResponse.json({ status: "not_found" }, { status: 200 });
      }
      console.error("Supabase select error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { 
        status: data.status, 
        name: data.full_name, 
        faculty_id: data.faculty_id,
        assigned_class: data.assigned_class,
        assigned_section: data.assigned_section,
        assigned_subject: data.assigned_subject,
        role_type: data.role_type,
        gender: data.gender
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in check-faculty-status route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
