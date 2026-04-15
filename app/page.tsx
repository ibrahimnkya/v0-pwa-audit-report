"use client"

import { useState, useEffect, useRef } from "react"
import { ConsentForm } from "@/components/consent-form"
import { AuditReport } from "@/components/audit-report"
import { createClient } from "@/lib/supabase/client"
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
import { cn } from "@/lib/utils"
import Image from "next/image"

type AppState = "consent" | "report"

const sections = [
  { id: "s1", number: "01", title: "Root Cause Analysis", icon: AlertTriangle, badge: "8 Issues" },
  { id: "s2", number: "02", title: "Architecture Weaknesses", icon: Layers, badge: "Systemic" },
  { id: "s3", number: "03", title: "Steps Taken (Phase 1)", icon: CheckCircle2, badge: "Done" },
  { id: "s4", number: "04", title: "Architecture Proposal", icon: GitBranch, badge: "Phase 2–3" },
  { id: "s5", number: "05", title: "Firebase Evaluation", icon: Database, badge: "Hybrid" },
  { id: "s6", number: "06", title: "Cost Reduction", icon: TrendingDown, badge: "Projected" },
  { id: "s7", number: "07", title: "Backend Stack", icon: Server, badge: "Phase 2–3" },
  { id: "s8", number: "08", title: "Migration Plan", icon: FileText, badge: "Active" },
]

function OptinLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/optin-logo.webp"
      alt="Optin Technology Limited"
      width={120}
      height={36}
      className={className ?? "h-7 w-auto object-contain"}
      priority
    />
  )
}

// ── Sidebar — always open, no collapsible ──────────────────────────────────
function ReportSidebar({
  activeSection,
  onSectionClick,
}: {
  activeSection: string
  onSectionClick: (id: string) => void
}) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-background/95 backdrop-blur-xl overflow-y-auto">
      {/* Header */}
      <div className="h-16 flex items-center px-5 border-b border-border shrink-0">
        <OptinLogo className="h-7 w-auto object-contain" />
      </div>

      {/* Nav */}
      <div className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="px-3 mb-3 font-mono text-[9px] tracking-widest uppercase text-muted-foreground/40">
          Report Sections
        </p>
        <nav className="space-y-0.5">
          {sections.map((section, index) => {
            const Icon = section.icon
            const isActive = activeSection === section.id
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="font-mono text-[10px] tabular-nums w-5 shrink-0 opacity-50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[12.5px] truncate flex-1">{section.title}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-5 py-4 border-t border-border space-y-0.5">
        <div className="flex items-center gap-2 text-[10px] text-destructive font-mono tracking-wider uppercase">
          <Lock className="h-3 w-3 shrink-0" />
          Confidential
        </div>
        <div className="text-[10px] text-muted-foreground/40 font-mono">
          April 2026 — Jamboride
        </div>
      </div>
    </aside>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [state, setState] = useState<AppState>("consent")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("s1")
  const mainRef = useRef<HTMLDivElement>(null)

  // Auth check
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

  // Scroll spy
  useEffect(() => {
    if (state !== "report") return
    const container = mainRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveSection(visible[0].target.id)
      },
      { root: container, rootMargin: "-10% 0px -55% 0px", threshold: 0 }
    )

    const timer = setTimeout(() => {
      sections.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 300)

    return () => { clearTimeout(timer); observer.disconnect() }
  }, [state])

  const handleEmailSubmit = async (submittedEmail: string) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail }),
      })
      const data = await response.json()
      if (data.success) { setEmail(submittedEmail); return { success: true } }
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
      if (data.success) { setEmail(email); setState("report"); return { success: true } }
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
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleDownload = () => window.print()
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Jamboride Audit Report", url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm font-mono tracking-widest uppercase">
          Loading…
        </div>
      </div>
    )
  }

  if (state === "consent") {
    return <ConsentForm onEmailSubmit={handleEmailSubmit} onOtpVerify={handleVerify} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — always visible, never collapses */}
      <ReportSidebar activeSection={activeSection} onSectionClick={handleSectionClick} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur-xl px-4 lg:px-6 shrink-0 print:hidden">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo visible on mobile (sidebar hidden on mobile) */}
            <div className="flex lg:hidden items-center shrink-0">
              <OptinLogo className="h-7 w-auto object-contain" />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs hidden sm:flex"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Download PDF</span>
            </Button>

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

            <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-destructive border border-destructive/30 rounded-full px-2.5 py-1 shrink-0">
              <div className="w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
              <span className="hidden xs:inline">Confidential</span>
            </div>

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

        {/* Access strip */}
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-2 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-primary/60 shrink-0 print:hidden">
          <span>Prepared by Optin Digital Solutions Ltd — optin.co.tz</span>
          <div className="flex items-center gap-4">
            <span className="text-primary">Client: Jamboride — April 2026</span>
            {email && (
              <span className="text-muted-foreground hidden sm:inline">Viewing as: {email}</span>
            )}
          </div>
        </div>

        {/* Scrollable report content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-background">
          <AuditReport userEmail={email} onLogout={handleLogout} />

          <footer className="border-t bg-background py-6 print:hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Optin Digital Solutions Ltd. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
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
      </div>
    </div>
  )
}
