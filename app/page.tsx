"use client"

import { useState, useEffect, useRef } from "react"
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
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

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
      {/* ── Header: logo + name ── */}
      <SidebarHeader className="h-16 px-4 flex flex-row items-center gap-3 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary flex-shrink-0 overflow-hidden">
         <Image
                  src="/images/optin-logo.webp"
                  alt="Optin Technology Limited"
                  width={140}
                  height={45}
                  className="h-10 w-auto opacity-80"
                />
        </div>
        <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden min-w-0">
          <span className="font-mono text-[11px] font-semibold tracking-wide text-foreground truncate">
            Optin<span className="text-muted-foreground font-normal">.co.tz</span>
          </span>
          <span className="text-[10px] text-muted-foreground truncate">Technical Audit</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Nav sections ── */}
      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupLabel className="px-2 mb-1 font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">
            Report Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionClick(section.id)}
                      isActive={activeSection === section.id}
                      tooltip={section.title}
                      className="h-9 gap-2.5 px-2 rounded-md"
                    >
                      <span className="font-mono text-[10px] text-primary/60 w-5 flex-shrink-0 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-[12.5px] truncate">{section.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: confidential tag ── */}
      <SidebarFooter className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <Lock className="h-3 w-3 text-destructive flex-shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden font-mono tracking-wider uppercase truncate">
            Confidential
          </span>
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground/50 group-data-[collapsible=icon]:hidden font-mono">
          April 2026 — Jamboride
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
  const scrollRef = useRef<HTMLDivElement>(null)

  // ── Auth check on mount ──
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

  // ── Scroll spy: update active section as user scrolls ──
  useEffect(() => {
    if (state !== "report") return

    const container = scrollRef.current
    if (!container) return

    const sectionIds = sections.map((s) => s.id)

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root: container,
        // Trigger when section enters the top 40% of the viewport
        rootMargin: "-10% 0px -55% 0px",
        threshold: 0,
      }
    )

    // Observe after a short delay to allow the report to render
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 300)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [state])

  // ── Handlers ──
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

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-mono tracking-widest uppercase">
          Loading...
        </div>
      </div>
    )
  }

  // ── Gate screens ──
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

  // ── Report view ──
  return (
    <SidebarProvider defaultOpen={true}>
      <ReportSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

      <SidebarInset>
        {/* ── Top Bar ── */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-xl px-4 lg:px-6">
          {/* Left: trigger + branding */}
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground flex-shrink-0" />
            <div className="h-4 w-px bg-border hidden sm:block flex-shrink-0" />

            {/* Logo + wordmark (hidden on mobile) */}
            <div className="hidden sm:flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src="/images/optin-logo.webp"
                  alt="Optin Technology Limited"
                  width={140}
                  height={45}
                  className="h-10 w-auto opacity-80"
                />
              </div>
              <span className="font-mono text-xs tracking-wide text-muted-foreground truncate">
                <strong className="text-primary font-semibold">Optin</strong>.co.tz
              </span>
              <div className="h-3 w-px bg-border flex-shrink-0" />
              <span className="hidden md:block font-mono text-[10px] tracking-wider uppercase text-muted-foreground/50 truncate">
                Technical Audit — Jamboride — April 2026
              </span>
            </div>
          </div>

          {/* Right: CTAs + confidential badge + sign out */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Download PDF */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hidden sm:flex"
              onClick={() => window.print()}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Download PDF</span>
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hidden sm:flex"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: "Jamboride Audit Report", url: window.location.href })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Share</span>
            </Button>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Confidential badge */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-destructive border border-destructive/30 rounded-full px-2.5 py-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              <span className="hidden xs:inline">Confidential</span>
            </div>

            {/* Sign out */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground gap-1.5 text-xs hidden sm:flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign out</span>
            </Button>
          </div>
        </header>

        {/* ── Access strip (moved from AuditReport) ── */}
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-2 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-primary/60">
          <span>Prepared by Optin Digital Solutions Ltd — optin.co.tz</span>
          <div className="flex items-center gap-4">
            <span className="text-primary">Client: Jamboride — April 2026</span>
            {email && (
              <span className="text-muted-foreground hidden sm:inline">
                Viewing as: {email}
              </span>
            )}
          </div>
        </div>

        {/* ── Scrollable report content ── */}
        <main
          ref={scrollRef}
          className="min-h-[calc(100vh-3.5rem)] bg-background overflow-y-auto"
        >
          <AuditReport userEmail={email} onLogout={handleLogout} />
        </main>

        {/* ── Footer ── */}
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
