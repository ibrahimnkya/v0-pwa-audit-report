import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and verification code are required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify OTP - token is the 6-digit code
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email"
    })

    if (error) {
      console.error("Supabase verify OTP error:", error)
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification code. Please try again." },
        { status: 400 }
      )
    }

    // Log access to report_access table for compliance
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || 
               headersList.get("x-real-ip") || 
               "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    const { error: insertError } = await supabase
      .from("report_access")
      .insert({
        email,
        ip_address: ip.split(",")[0].trim(),
        user_agent: userAgent.substring(0, 500),
        consent_given: true,
        accessed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error("Failed to log access record:", insertError)
    }

    return NextResponse.json({ 
      success: true,
      user: data.user 
    })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
