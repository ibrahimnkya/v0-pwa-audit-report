"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Shield, Lock, FileText, AlertTriangle, Mail } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
          <h1 className="text-2xl font-bold text-foreground">Confidential Document Access</h1>
          <p className="text-muted-foreground mt-2">IT Infrastructure Audit Report</p>
        </div>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-foreground">Access Authorization Required</CardTitle>
                <CardDescription>
                  Please review and accept the terms below to access this confidential report
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Warning Banner */}
            <Alert className="mb-6 border-amber-500/50 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>CONFIDENTIAL:</strong> This document contains sensitive security information
                about JamboRide&apos;s IT infrastructure. Unauthorized
                access, distribution, or disclosure is strictly prohibited.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
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
                  className="h-12 border-2 focus:border-primary"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A verification code will be sent to this email address
                </p>
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-foreground leading-relaxed cursor-pointer">
                    <span className="font-medium">Terms of Access:</span> I confirm that I am an
                    authorized representative of JamboRide or
                    have been explicitly granted access to this document by JamboRide or Optin Technology Limited.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="nda"
                    checked={agreedToNDA}
                    onCheckedChange={(checked) => setAgreedToNDA(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="nda" className="text-sm text-foreground leading-relaxed cursor-pointer">
                    <span className="font-medium">Non-Disclosure Agreement:</span> I agree not to share,
                    copy, distribute, or disclose any information contained in this audit report to
                    unauthorized parties. I understand that violation of this agreement may result in
                    legal action.
                    <button
                      type="button"
                      onClick={() => setShowNDAModal(true)}
                      className="text-primary hover:underline ml-1"
                    >
                      View full NDA terms
                    </button>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="data"
                    checked={agreedToDataPolicy}
                    onCheckedChange={(checked) => setAgreedToDataPolicy(checked === true)}
                    className="mt-1"
                  />
                  <label htmlFor="data" className="text-sm text-foreground leading-relaxed cursor-pointer">
                    <span className="font-medium">Data Processing:</span> I consent to Optin Technology
                    Limited recording my email address, access time, and IP address for audit trail
                    purposes in accordance with data protection regulations.
                  </label>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={!allAgreed || !isValidEmail || isLoading}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="h-4 w-4" />
                    Sending Verification Code...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Request Access
                  </span>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                <span>Document prepared by Optin Technology Limited</span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-2">
                For technical support, contact{" "}
                <a href="mailto:info@optin.co.tz" className="text-primary hover:underline">
                  info@optin.co.tz
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

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
      </div>
    </div>
  )
}
