import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const normalizedEmail = String(email || "").trim().toLowerCase()

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { success: false, error: "Authentication service is not configured. Please contact support." },
        { status: 500 }
      )
    }

    const supabase = await createClient()

    // Send OTP via Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
        data: {
          consent_given: true,
          consent_date: new Date().toISOString(),
          auth_method: "otp",
        }
      }
    })

    if (error) {
      const errorMessage = (error.message || "").toLowerCase()
      console.error("Supabase OTP error:", error)

      if (errorMessage.includes("email rate limit exceeded")) {
        return NextResponse.json(
          { success: false, error: "Too many OTP requests. Please wait a minute and try again." },
          { status: 429 }
        )
      }

      if (errorMessage.includes("email logins are disabled")) {
        return NextResponse.json(
          { success: false, error: "Email OTP is disabled in Supabase Auth settings." },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: false, error: error.message || "Failed to send verification code." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
