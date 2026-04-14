"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Mail, RefreshCw, CheckCircle2, Sparkles, Shield } from "lucide-react"
import Image from "next/image"

interface OTPVerificationProps {
  email: string
  onVerify: (otp: string) => Promise<{ success: boolean; error?: string }>
  onResend: () => Promise<{ success: boolean; error?: string }>
}

export function OTPVerification({ email, onVerify, onResend }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(60)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== "") && value) {
      handleSubmit(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (code?: string) => {
    const otpCode = code || otp.join("")
    if (otpCode.length !== 6) return

    setIsLoading(true)
    setError(null)

    const result = await onVerify(otpCode)
    
    if (!result.success) {
      setError(result.error || "Invalid verification code")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }
    setIsLoading(false)
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    
    setIsResending(true)
    setError(null)

    const result = await onResend()
    
    if (result.success) {
      setResendCooldown(60)
    } else {
      setError(result.error || "Failed to resend code")
    }
    setIsResending(false)
  }

  return (
    <div className="min-h-screen bg-[#d7eef6] dark:bg-background flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-6xl overflow-hidden rounded-[28px] border-4 border-white/70 bg-background shadow-2xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          <div className="bg-primary/10 p-8 lg:p-12 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <p className="text-primary/70 font-semibold">step 2/2</p>
              <h1 className="text-4xl font-bold tracking-tight text-primary leading-tight">
                Verify your access code
              </h1>
              <p className="text-muted-foreground">
                Enter the 6-digit OTP sent to your email to access the confidential report.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Secure verification
              </div>
              <p className="text-sm text-muted-foreground">
                Codes expire quickly for your security. Request a new code if needed.
              </p>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <Image
                  src="/images/optin-logo.webp"
                  alt="Optin Technology Limited"
                  width={160}
                  height={52}
                  className="h-12 w-auto"
                  priority
                />
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                {"We've sent a 6-digit verification code to"}
                <br />
                <span className="font-semibold text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-0">
              <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl 
                           focus:border-primary focus:ring-2 focus:ring-primary/20 
                           outline-none transition-all bg-background text-foreground"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={() => handleSubmit()}
                disabled={otp.some(d => !d) || isLoading}
                className="w-full h-12 text-base font-semibold rounded-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Verify & Access Report
                  </span>
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isResending}
                  className="text-sm text-muted-foreground hover:text-primary disabled:cursor-not-allowed 
                         inline-flex items-center gap-1 transition-colors"
                >
                  {isResending ? (
                    <Spinner className="h-3 w-3" />
                  ) : (
                    <RefreshCw className="h-3 w-3" />
                  )}
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend verification code"
                  }
                </button>
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  )
}
