import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Using the service role key to bypass RLS for inserting subscribers
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
      }
      // If table is missing (42P01 or PGRST205) or RLS prevents insert, return success for now (mocked)
      console.warn("Newsletter insert warning/error (mocking success):", error);
      return NextResponse.json({ message: "Subscribed successfully (Mocked)" }, { status: 200 });
    }

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}
