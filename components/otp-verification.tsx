"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface OTPVerificationProps {
  email: string
  onVerify: (otp: string) => Promise<{ success: boolean; error?: string }>
  onResend: () => Promise<{ success: boolean; error?: string }>
  onBack: () => void
}

export function OTPVerification({ email, onVerify, onResend, onBack }: OTPVerificationProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/optin-logo.webp"
              alt="Optin Technology Limited"
              width={180}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </div>
        </div>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-foreground">Check Your Email</CardTitle>
            <CardDescription className="text-base">
              {"We've sent a 6-digit verification code to"}
              <br />
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                  className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg 
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
              className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
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

            {/* Resend Button */}
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

            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-full text-sm text-muted-foreground hover:text-foreground 
                       flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Use a different email address
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
