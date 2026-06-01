import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase keys are missing.");
      return NextResponse.json({ error: "Supabase integration not configured" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();

    const {
      full_name,
      email,
      phone,
      department,
      qualification,
      experience_years,
      gender,
      password,
      confirmPassword,
    } = body;

    // Validate required fields
    if (!full_name || !email || !phone || !department || !qualification || experience_years === undefined || !gender || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Hash the password securely using bcryptjs
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert into the faculty_registrations table
    const { data, error } = await supabase
      .from("faculty_registrations")
      .insert([
        {
          full_name,
          email,
          phone,
          department,
          qualification,
          experience_years: parseInt(experience_years, 10),
          gender,
          status: "pending", // Always start as pending
          password_hash: passwordHash,
        }
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Registration request submitted successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in faculty-register route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
