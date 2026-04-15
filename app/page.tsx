"use client"

import { useState, useEffect, useRef } from "react"
import { ConsentForm } from "@/components/consent-form"
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

type AppState = "consent" | "report"

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

function OptinLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/optin-logo.webp"
      alt="Optin Technology Limited"
      width={140}
      height={45}
      className={className ?? "h-8 w-auto"}
      priority
    />
  )
}

function ReportSidebar({
  activeSection,
  onSectionClick,
}: {
  activeSection: string
  onSectionClick: (id: string) => void
}) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* ── Header ── */}
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 h-full">
          {/* Logo mark — always visible */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden">
            <OptinLogo className="h-16 w-auto" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      {/* ── Nav ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50">
            Report Sections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section, index) => {
                const Icon = section.icon
                const isActive = activeSection === section.id
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionClick(section.id)}
                      isActive={isActive}
                      tooltip={section.title}
                      className="h-9 gap-2.5"
                    >
                      <span className="font-mono text-[10px] text-primary/60 w-5 shrink-0 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="text-[12.5px] truncate">{section.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:justify-center">
          <Lock className="h-3 w-3 text-destructive shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden font-mono tracking-wider uppercase truncate">
            Confidential
          </span>
        </div>
        <div className="mt-0.5 text-[10px] text-muted-foreground/50 group-data-[collapsible=icon]:hidden font-mono">
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
  const mainRef = useRef<HTMLDivElement>(null)

  // ── Auth check on mount ──
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

  // ── Scroll spy: IntersectionObserver on the main scroll container ──
  useEffect(() => {
    if (state !== "report") return

    const container = mainRef.current
    if (!container) return

    const sectionIds = sections.map((s) => s.id)

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the topmost intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        root: container,
        rootMargin: "-10% 0px -55% 0px",
        threshold: 0,
      }
    )

    // Small delay to allow the report to fully render before observing
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
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: "Failed to send verification code" }
    }
  }

  const handleVerify = async (email: string, otp: string) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await response.json()
      if (data.success) {
        setEmail(email)
        setState("report")
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: "Verification failed" }
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

  const handleDownload = () => window.print()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Jamboride Audit Report", url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-mono tracking-widest uppercase">
          Loading…
        </div>
      </div>
    )
  }

  // ── Consent / OTP gate ──
  if (state === "consent") {
    return (
      <ConsentForm
        onEmailSubmit={handleEmailSubmit}
        onOtpVerify={handleVerify}
      />
    )
  }

  // ── Report view ──
  return (
    <SidebarProvider defaultOpen={true}>
      <ReportSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

      <SidebarInset>
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-xl px-4 lg:px-6 print:hidden">
          {/* Left: trigger + branding */}
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0" />
            <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

            <div className="hidden sm:flex items-center gap-2.5 min-w-0">
              {/* Logo */}
              <div className="h-18 w-18 rounded-md overflow-hidden shrink-0">
                <OptinLogo className="h-18 w-auto" />
              </div>
            </div>
          </div>

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Download PDF */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hidden sm:flex"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Download PDF</span>
            </Button>

            {/* Share */}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hidden sm:flex"
              onClick={handleShare}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Share</span>
            </Button>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Confidential badge */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-destructive border border-destructive/30 rounded-full px-2.5 py-1 shrink-0">
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

        {/* ── Access strip ── */}
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-2 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-primary/60 print:hidden">
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

        {/* ── Scrollable report ── */}
        <main
          ref={mainRef}
          className="overflow-y-auto bg-background"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <AuditReport userEmail={email} onLogout={handleLogout} />

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
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
