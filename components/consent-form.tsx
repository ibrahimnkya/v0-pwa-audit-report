"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Shield, Lock, AlertTriangle, Mail, Sparkles, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface ConsentFormProps {
  onEmailSubmit: (email: string) => Promise<{ success: boolean; error?: string }>
}

export function ConsentForm({ onEmailSubmit }: ConsentFormProps) {
  const [email, setEmail] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToNDA, setAgreedToNDA] = useState(false)
  const [agreedToDataPolicy, setAgreedToDataPolicy] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showNDAModal, setShowNDAModal] = useState(false)

  const allAgreed = agreedToTerms && agreedToNDA && agreedToDataPolicy
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!allAgreed || !isValidEmail) return

    setIsLoading(true)
    setError(null)

    const result = await onEmailSubmit(email)
    
    if (!result.success) {
      setError(result.error || "An error occurred. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#d7eef6] dark:bg-background flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-6xl overflow-hidden rounded-[28px] border-4 border-white/70 bg-background shadow-2xl">
        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          <div className="bg-primary/10 p-8 lg:p-12 flex flex-col justify-between gap-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-primary/70 font-semibold">step 1/2</p>
                <h1 className="text-4xl font-bold tracking-tight text-primary leading-tight">
                  Authorize secure report access
                </h1>
                <p className="text-muted-foreground">
                  Confirm your identity and accept the confidentiality terms to continue.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                OTP-protected session
              </div>
              <p className="text-sm text-muted-foreground">
                Verification codes are sent by email and validated before report access is granted.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-8 lg:p-12">
            <CardHeader className="p-0">
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
              <CardTitle className="text-2xl">Confidential Document Access</CardTitle>
              <CardDescription>
                IT Infrastructure Audit Report — JamboRide
              </CardDescription>
            </CardHeader>

            <Alert className="border-amber-400/60 bg-amber-50/80 dark:bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>CONFIDENTIAL:</strong> This document contains sensitive security information.
                Unauthorized access, distribution, or disclosure is strictly prohibited.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Business Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-primary/30 bg-background"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3 rounded-xl border border-primary/30 px-4 py-3 hover:border-primary transition-colors cursor-pointer">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <span className="font-medium">Terms of Access:</span> I am an authorized representative of
                    JamboRide, or have explicit authorization from JamboRide or Optin Technology Limited.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-primary/30 px-4 py-3 hover:border-primary transition-colors cursor-pointer">
                  <Checkbox
                    id="nda"
                    checked={agreedToNDA}
                    onCheckedChange={(checked) => setAgreedToNDA(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <span className="font-medium">Non-Disclosure Agreement:</span> I will not share, copy, or
                    disclose any report content to unauthorized parties.
                    <button
                      type="button"
                      onClick={() => setShowNDAModal(true)}
                      className="ml-1 text-primary hover:underline"
                    >
                      View full NDA terms
                    </button>
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-primary/30 px-4 py-3 hover:border-primary transition-colors cursor-pointer">
                  <Checkbox
                    id="data"
                    checked={agreedToDataPolicy}
                    onCheckedChange={(checked) => setAgreedToDataPolicy(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">
                    <span className="font-medium">Data Processing:</span> I consent to logging my email, access
                    time, and IP address for audit and compliance purposes.
                  </span>
                </label>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-primary/40 text-primary"
                  onClick={() => {
                    setAgreedToTerms(false)
                    setAgreedToNDA(false)
                    setAgreedToDataPolicy(false)
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={!allAgreed || !isValidEmail || isLoading}
                  className="w-full sm:flex-1 h-12 rounded-xl text-base font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Sending OTP...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Continue to verification
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="border-t border-border pt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Prepared by Optin Technology Limited • Support: info@optin.co.tz</span>
            </div>
          </div>
        </div>

        {/* NDA Modal */}
        {showNDAModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl max-h-[80vh] overflow-auto">
              <CardHeader>
                <CardTitle>Non-Disclosure Agreement</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm">
                <h4>1. Confidential Information</h4>
                <p>
                  The IT Infrastructure Audit Report and all information contained therein, 
                  including but not limited to security vulnerabilities, network configurations, 
                  system architectures, and recommendations, shall be treated as strictly 
                  confidential information.
                </p>
                
                <h4>2. Obligations</h4>
                <p>
                  The receiving party agrees to: (a) maintain the confidentiality of the 
                  information; (b) not disclose the information to any third party without 
                  prior written consent; (c) use the information solely for the purpose of 
                  reviewing and implementing security improvements.
                </p>
                
                <h4>3. Duration</h4>
                <p>
                  This agreement shall remain in effect for a period of five (5) years from 
                  the date of access to the confidential information.
                </p>
                
                <h4>4. Legal Consequences</h4>
                <p>
                  Breach of this agreement may result in legal action, including but not 
                  limited to injunctive relief and damages.
                </p>

                <Button 
                  onClick={() => setShowNDAModal(false)} 
                  className="w-full mt-4"
                >
                  I Understand
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  )
}
