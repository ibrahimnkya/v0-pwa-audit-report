"use client"

import { useState, useEffect } from "react"
import { ConsentForm } from "@/components/consent-form"
import { OTPVerification } from "@/components/otp-verification"
import { AuditReport } from "@/components/audit-report"
import { createClient } from "@/lib/supabase/client"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Database,
  TrendingDown,
  Server,
  GitBranch,
  Lock,
  ExternalLink,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type AppState = "consent" | "verify" | "report"

const sections = [
  { id: "s1", title: "Root Cause Analysis", icon: AlertTriangle, badge: "8 Issues" },
  { id: "s2", title: "Architecture Weaknesses", icon: Layers, badge: "Systemic" },
  { id: "s3", title: "Steps Taken (Phase 1)", icon: CheckCircle2, badge: "Done" },
  { id: "s4", title: "Architecture Proposal", icon: GitBranch, badge: "Phase 2-3" },
  { id: "s5", title: "Firebase Evaluation", icon: Database, badge: "Hybrid" },
  { id: "s6", title: "Cost Reduction", icon: TrendingDown, badge: "Projected" },
  { id: "s7", title: "Backend Stack", icon: Server, badge: "Phase 2-3" },
  { id: "s8", title: "Migration Plan", icon: FileText, badge: "Active" },
]

function ReportSidebar({
  activeSection,
  onSectionClick,
}: {
  activeSection: string
  onSectionClick: (id: string) => void
}) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif font-black text-lg flex-shrink-0">
            O
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-mono text-xs tracking-wider">
              <span className="text-primary font-medium">Optin</span>
              <span className="text-muted-foreground">.co.tz</span>
            </span>
            <span className="text-[10px] text-muted-foreground">Technical Audit</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] tracking-widest uppercase text-primary/50">
            Report Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionClick(section.id)}
                      isActive={activeSection === section.id}
                      tooltip={section.title}
                      className="gap-3"
                    >
                      <span className="font-mono text-[10px] text-primary/70 w-4">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="h-4 w-4" />
                      <span className="text-[13px]">{section.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <Lock className="h-3 w-3 text-destructive" />
          <span className="group-data-[collapsible=icon]:hidden font-mono tracking-wider uppercase">
            Confidential
          </span>
        </div>
        <div className="mt-2 text-[10px] text-muted-foreground/60 group-data-[collapsible=icon]:hidden">
          April 2026 - Jamboride
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function Home() {
  const [state, setState] = useState<AppState>("consent")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("s1")

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

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
        body: JSON.stringify({ email: submittedEmail }),
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
        body: JSON.stringify({ email, otp }),
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
        body: JSON.stringify({ email }),
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

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-mono tracking-widest uppercase">
          Loading...
        </div>
      </div>
    )
  }

  // Gate screens — consent & OTP use existing components as-is
  if (state === "consent") {
    return (
      <ConsentForm
        onEmailSubmit={handleEmailSubmit}
        onOtpVerify={async (_, otp) => handleVerify(otp)}
      />
    )
  }

  if (state === "verify") {
    return (
      <OTPVerification
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
      />
    )
  }

  // Report view with sidebar
  return (
    <SidebarProvider defaultOpen={true}>
      <ReportSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />
      <SidebarInset>
        {/* Top Bar */}
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-xl px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center font-serif text-sm font-black text-primary-foreground">
                O
              </div>
              <span className="font-mono text-xs tracking-wider text-muted-foreground">
                <strong className="text-primary font-medium">Optin</strong>.co.tz
              </span>
            </div>
          </div>

          <div className="hidden md:block font-mono text-[10px] tracking-wider uppercase text-muted-foreground/50">
            Technical Audit Report — Jamboride — April 2026
          </div>

          <div className="flex items-center gap-3">
            {/* Confidential badge */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-destructive border border-destructive/30 rounded-full px-2.5 py-1">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              <span>Confidential</span>
            </div>
            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-1.5 text-xs hidden sm:flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </header>

        {/* Report Content */}
        <main className="min-h-[calc(100vh-3.5rem)] bg-background">
          <AuditReport userEmail={email} onLogout={handleLogout} />
        </main>

        {/* Footer */}
        <footer className="border-t bg-background py-6 print:hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Optin Digital Solutions Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a
                href="https://optin.co.tz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                Contact <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
