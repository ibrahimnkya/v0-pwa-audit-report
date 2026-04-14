import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Send OTP via Supabase Auth (code instead of magic link)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // Setting emailRedirectTo to undefined ensures Supabase sends a 6-digit code
        // instead of a magic link
        emailRedirectTo: undefined,
        data: {
          consent_given: true,
          consent_date: new Date().toISOString(),
        }
      }
    })

    if (error) {
      console.error("[v0] Supabase OTP error:", error)
      return NextResponse.json(
        { success: false, error: "Failed to send verification code. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send OTP error:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
