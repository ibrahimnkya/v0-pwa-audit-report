"use client"

import { useState, useEffect } from "react"
import { ConsentForm } from "@/components/consent-form"
import { OTPVerification } from "@/components/otp-verification"
import { AuditReport } from "@/components/audit-report"
import { createClient } from "@/lib/supabase/client"

type AppState = "consent" | "verify" | "report"

export default function Home() {
  const [state, setState] = useState<AppState>("consent")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        setEmail(user.email)
        setState("report")
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail })
      })

      const data = await response.json()

      if (data.success) {
        setEmail(submittedEmail)
        setState("verify")
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch {
      return { success: false, error: "Failed to send verification code" }
    }
  }

  const handleVerify = async (otp: string) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()

      if (data.success) {
        setState("report")
        return { success: true }
      }

      return { success: false, error: data.error }
    } catch {
      return { success: false, error: "Verification failed" }
    }
  }

  const handleResend = async () => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      return { success: data.success, error: data.error }
    } catch {
      return { success: false, error: "Failed to resend code" }
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setEmail("")
    setState("consent")
  }

  const handleBack = () => {
    setEmail("")
    setState("consent")
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // Render based on state
  switch (state) {
    case "consent":
      return <ConsentForm onEmailSubmit={handleEmailSubmit} />
    case "verify":
      return (
        <OTPVerification
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          onBack={handleBack}
        />
      )
    case "report":
      return <AuditReport userEmail={email} onLogout={handleLogout} />
    default:
      return <ConsentForm onEmailSubmit={handleEmailSubmit} />
  }
}
