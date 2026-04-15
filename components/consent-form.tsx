"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { 
  Shield, Lock, AlertTriangle, Mail, Sparkles, 
  CheckCircle2, ArrowLeft, Fingerprint, Timer 
} from "lucide-react"
import Image from "next/image"

// --- Components for the OTP Input (Shadcn style) ---
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface ConsentFormProps {
  // Updated to handle both stages
  onEmailSubmit: (email: string) => Promise<{ success: boolean; error?: string }>
  onOtpVerify: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
}

export function ConsentForm({ onEmailSubmit, onOtpVerify }: ConsentFormProps) {
  const [step, setStep] = useState<"request" | "verify">("request")
  const [email, setEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  
  // Consent States
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToNDA, setAgreedToNDA] = useState(false)
  const [agreedToDataPolicy, setAgreedToDataPolicy] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNDAModal, setShowNDAModal] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds

  const allAgreed = agreedToTerms && agreedToNDA && agreedToDataPolicy
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // Timer logic for the 5-minute expiry UI
  useEffect(() => {
    if (step === "verify" && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allAgreed || !isValidEmail) return

    setIsLoading(true)
    setError(null)

    const result = await onEmailSubmit(email)
    if (result.success) {
      setStep("verify")
      setTimeLeft(300) // Reset timer
    } else {
      setError(result.error || "Failed to send code. Please try again.")
    }
    setIsLoading(false)
  }

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (otpCode.length !== 6) return

    setIsLoading(true)
    setError(null)

    const result = await onOtpVerify(email, otpCode)
    if (!result.success) {
      setError(result.error || "Invalid or expired code.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#d7eef6] dark:bg-background flex items-center justify-center p-4 sm:p-6 font-sans">
      <Card className="w-full max-w-6xl overflow-hidden rounded-[28px] border-4 border-white/70 bg-background shadow-2xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          
          {/* Left Sidebar - Context */}
          <div className="bg-primary/10 p-8 lg:p-12 flex flex-col justify-between gap-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary/70 font-semibold uppercase tracking-wider text-xs">
                  Step {step === "request" ? "1" : "2"} of 2
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-primary leading-tight">
                  {step === "request" ? "Authorize secure report access" : "Verify your identity"}
                </h1>
                <p className="text-muted-foreground">
                  {step === "request" 
                    ? "Confirm your identity and accept the confidentiality terms to continue."
                    : `We've sent a 6-digit verification code to ${email}.`}
                </p>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-primary font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  OTP-protected session
                </div>
                <p className="text-sm text-muted-foreground">
                  Access is logged and monitored for compliance with Optin Technology security policies.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Verification codes are sent by email and validated before report access is granted.
              </p>
            </div>

            <div className="flex items-center gap-3">
               <Image
                  src="/images/optin-logo.webp"
                  alt="Optin Technology Limited"
                  width={140}
                  height={45}
                  className="h-10 w-auto opacity-80"
                />
            </div>
          </div>

          {/* Right Section - Interaction */}
          <div className="p-8 lg:p-12 bg-white/50">
            {step === "request" ? (
              /* --- STAGE 1: CONSENT FORM --- */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Shield className="h-7 w-7 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Technical Audit</CardTitle>
                  <CardDescription>Confidential Report — JamboRide</CardDescription>
                </CardHeader>

                <Alert className="mb-6 border-amber-400/60 bg-amber-50/80">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-xs leading-relaxed">
                    <strong>CONFIDENTIAL:</strong> Unauthorized access or disclosure is strictly prohibited. 
                    IP addresses are logged.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Business Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-xl border-primary/30 bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <ConsentItem 
                      id="terms" 
                      label="Terms of Access" 
                      checked={agreedToTerms} 
                      onChange={setAgreedToTerms}
                      description="I am an authorized representative of JamboRide or have explicit authorization."
                    />
                    <ConsentItem 
                      id="nda" 
                      label="Non-Disclosure" 
                      checked={agreedToNDA} 
                      onChange={setAgreedToNDA}
                      description="I will not share or copy report content."
                      action={() => setShowNDAModal(true)}
                    />
                    <ConsentItem 
                      id="data" 
                      label="Data Logging" 
                      checked={agreedToDataPolicy} 
                      onChange={setAgreedToDataPolicy}
                      description="I consent to logging my email and IP address for audit purposes."
                    />
                  </div>

                  {error && <ErrorMessage message={error} />}

                  <Button
                    type="submit"
                    disabled={!allAgreed || !isValidEmail || isLoading}
                    className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  >
                    {isLoading ? <Spinner className="mr-2" /> : <Lock className="mr-2 h-4 w-4" />}
                    {isLoading ? "Sending OTP..." : "Request Access Code"}
                  </Button>
                </form>
              </div>
            ) : (
              /* --- STAGE 2: OTP VERIFICATION --- */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col justify-center">
                <button 
                  onClick={() => setStep("request")}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to consent
                </button>

                <div className="text-center space-y-4 mb-8">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
                    <Fingerprint className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Check your inbox</h2>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Enter the 6-digit security code sent to <br/>
                    <span className="font-semibold text-foreground">{email}</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={setOtpCode}
                      onComplete={() => handleVerifyOtp()}
                    >
                      <InputOTPGroup className="gap-2">
                        {[0, 1, 2, 3, 4, 5].map((i) => (
                          <InputOTPSlot 
                            key={i} 
                            index={i} 
                            className="h-14 w-12 rounded-xl border-primary/20 text-xl font-bold" 
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Timer className={`h-4 w-4 ${timeLeft < 60 ? 'text-destructive animate-pulse' : ''}`} />
                    Code expires in: <span className="font-mono font-bold text-foreground">{formatTime(timeLeft)}</span>
                  </div>

                  {error && <ErrorMessage message={error} />}

                  <Button
                    onClick={() => handleVerifyOtp()}
                    disabled={otpCode.length !== 6 || isLoading || timeLeft === 0}
                    className="w-full h-12 rounded-xl text-base font-semibold"
                  >
                    {isLoading ? <Spinner className="mr-2" /> : "Verify & View Report"}
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground">
                    Didn&apos;t receive the code? Check your spam folder or{" "}
                    <button 
                      type="button" 
                      onClick={handleRequestOtp}
                      className="text-primary font-semibold hover:underline"
                    >
                      resend
                    </button>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-border pt-4 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-primary" /> Verified Session
              </span>
              <span>© 2026 Optin Tech</span>
            </div>
          </div>
        </div>
      </Card>

      {/* NDA Modal Logic remained the same */}
      {showNDAModal && (
         <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-xl shadow-2xl rounded-3xl overflow-hidden border-none">
              <CardHeader className="bg-primary text-primary-foreground p-6">
                <CardTitle>Non-Disclosure Agreement</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4 text-sm leading-relaxed">
                <p>The <strong>IT Infrastructure Audit Report</strong> contains highly sensitive vulnerability data. By accessing this document, you agree to strictly maintain confidentiality for 5 years.</p>
                <div className="bg-muted p-4 rounded-xl font-mono text-[11px]">Audit ID: OPTIN-SEC-2026-JR</div>
                <Button onClick={() => setShowNDAModal(false)} className="w-full mt-4 rounded-xl">I Understand & Accept</Button>
              </CardContent>
            </Card>
         </div>
      )}
    </div>
  )
}

// --- Helper Sub-components ---

function ConsentItem({ id, label, description, checked, onChange, action }: any) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-primary/10 px-4 py-3 hover:border-primary/40 transition-all cursor-pointer bg-white/40">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(c) => onChange(c === true)}
        className="mt-1"
      />
      <div className="space-y-1">
        <span className="text-sm font-semibold text-primary block">{label}</span>
        <span className="text-[12px] text-muted-foreground leading-tight block">
          {description}
          {action && (
            <button type="button" onClick={action} className="ml-1 text-primary hover:underline">
              View terms
            </button>
          )}
        </span>
      </div>
    </label>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="py-2 px-3 rounded-xl border-destructive/20 bg-destructive/5">
      <AlertDescription className="text-xs">{message}</AlertDescription>
    </Alert>
  )
}
