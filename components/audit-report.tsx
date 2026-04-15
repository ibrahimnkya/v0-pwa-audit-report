"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2,
  AlertTriangle,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditReportProps {
  userEmail?: string
  onLogout?: () => void
}

interface Section {
  id: string
  number: string
  title: string
  badge: {
    text: string
    variant: "critical" | "done" | "next" | "future"
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const sections: Section[] = [
  { id: "s1", number: "01", title: "Root Cause Analysis", badge: { text: "8 Issues", variant: "critical" } },
  { id: "s2", number: "02", title: "Code & Architecture Weaknesses", badge: { text: "Systemic", variant: "critical" } },
  { id: "s3", number: "03", title: "Steps Taken (Phase 1 Complete)", badge: { text: "Done", variant: "done" } },
  { id: "s4", number: "04", title: "Refactored Architecture Proposal", badge: { text: "Phase 2-3", variant: "next" } },
  { id: "s5", number: "05", title: "Firebase Evaluation", badge: { text: "Hybrid Recommended", variant: "next" } },
  { id: "s6", number: "06", title: "Cost Reduction Estimate", badge: { text: "Projected", variant: "next" } },
  { id: "s7", number: "07", title: "Recommended Backend Stack", badge: { text: "Phase 2-3", variant: "next" } },
  { id: "s8", number: "08", title: "Implementation & Migration Plan", badge: { text: "Active", variant: "next" } },
]

// ─── Micro-components ─────────────────────────────────────────────────────────

const badgeVariants = {
  critical: "bg-destructive/15 text-destructive border-destructive/25",
  done: "bg-green-500/15 text-green-400 border-green-500/25",
  next: "bg-primary/10 text-primary border-primary/20",
  future: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

function SectionBadge({ text, variant }: { text: string; variant: keyof typeof badgeVariants }) {
  return (
    <Badge className={cn("font-mono text-[9px] tracking-wider uppercase", badgeVariants[variant])}>
      {variant === "done" && <Check className="h-3 w-3 mr-1" />}
      {text}
    </Badge>
  )
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <pre
      className={cn(
        "bg-muted/50 border border-border rounded-lg p-5 overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground",
        className
      )}
    >
      {children}
    </pre>
  )
}

function Callout({
  children,
  variant = "default",
}: {
  children: React.ReactNode
  variant?: "default" | "danger" | "done"
}) {
  return (
    <div
      className={cn(
        "border-l-2 rounded-r-lg p-4 text-sm leading-relaxed",
        variant === "default" && "border-primary bg-primary/5 text-muted-foreground",
        variant === "danger" && "border-destructive bg-destructive/5 text-muted-foreground",
        variant === "done" && "border-green-500 bg-green-500/5 text-muted-foreground"
      )}
    >
      {children}
    </div>
  )
}

function StepDone({ title, description }: { title: React.ReactNode; description: string }) {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-foreground mb-1">{title}</div>
        <div className="text-[13px] text-muted-foreground leading-relaxed">{description}</div>
      </div>
    </div>
  )
}

function IssueCard({
  title,
  pill,
  children,
}: {
  title: string
  pill: { text: string; variant: "red" | "amber" | "green" | "blue" }
  children: React.ReactNode
}) {
  const pillStyles = {
    red: "bg-destructive/15 text-destructive",
    amber: "bg-amber-500/15 text-amber-400",
    green: "bg-green-500/12 text-green-400",
    blue: "bg-blue-500/12 text-blue-400",
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className={cn(
              "font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full",
              pillStyles[pill.variant]
            )}
          >
            {pill.text}
          </span>
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
        </div>
        <div className="text-[13.5px] text-muted-foreground leading-relaxed">{children}</div>
      </CardContent>
    </Card>
  )
}

function StackCard({ tech, description }: { tech: string; description: React.ReactNode }) {
  return (
    <Card className="bg-card border-border hover:border-primary/40 transition-colors">
      <CardContent className="p-5">
        <div className="font-bold text-sm text-foreground mb-1.5">{tech}</div>
        <div className="text-[12.5px] text-muted-foreground leading-relaxed">{description}</div>
      </CardContent>
    </Card>
  )
}

// ─── Print styles injected via a style tag ────────────────────────────────────
// These only apply when the user triggers window.print() from the top bar.
const PrintStyles = () => (
  <style>{`
    @media print {
      /* Hide nav chrome */
      header, aside, [data-sidebar], .print\\:hidden { display: none !important; }

      /* Full-bleed white background */
      body, html { background: white !important; }

      /* Expand main to full width */
      main, [data-sidebar-inset] { margin: 0 !important; padding: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; }

      /* Report content */
      .audit-report-root { max-width: 100% !important; }

      /* Page numbers + document title in footer */
      @page {
        margin: 20mm 16mm 24mm;
      }
      @page :first {
        margin-top: 10mm;
      }

      /* Running footer: document title left, page number right */
      .print-page-footer {
        display: block !important;
        position: running(footer);
      }
      @page {
        @bottom-left {
          content: "Jamboride Architecture & Cost Optimization Audit — Optin Digital Solutions Ltd";
          font-family: monospace;
          font-size: 8pt;
          color: #888;
        }
        @bottom-right {
          content: "Page " counter(page) " of " counter(pages);
          font-family: monospace;
          font-size: 8pt;
          color: #888;
        }
      }

      /* Page breaks */
      section { page-break-inside: avoid; break-inside: avoid; }
      h2, h3 { page-break-after: avoid; break-after: avoid; }

      /* Accordion — force open for print */
      [data-state="closed"] > div[role="region"] { display: block !important; visibility: visible !important; height: auto !important; }
    }
  `}</style>
)

// ─── Main Component ───────────────────────────────────────────────────────────

export function AuditReport({ userEmail }: AuditReportProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="w-full audit-report-root">
      <PrintStyles />

      {/* ── Print-only cover header ── */}
      <div className="hidden print:flex items-center justify-between px-10 py-6 border-b border-border">
        <Image
          src="/images/optin-logo.webp"
          alt="Optin Technology Limited"
          width={140}
          height={45}
          className="h-10 w-auto"
        />
        <div className="text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          <div>Confidential</div>
          <div>April 2026</div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative py-20 px-10 max-w-[900px] mx-auto">
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest uppercase text-primary mb-6">
          <span>Technical Audit Report — April 2026</span>
          <div className="flex-1 h-px bg-primary/20 max-w-[120px]" />
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-foreground mb-3.5">
          Jamboride<br />
          Architecture & <em className="italic text-primary">Cost</em><br />
          Optimization Audit
        </h1>

        <p className="text-[15px] text-muted-foreground font-mono tracking-wide mb-12">
          Flutter — Firebase — Google Maps / Directions APIs
        </p>

        {/* Meta grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-border rounded-[14px] overflow-hidden bg-card">
          <div className="p-5 border-r border-border">
            <label className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 block mb-1.5">Scope</label>
            <span className="text-[13px] text-foreground font-medium">Customer App & Driver App (Flutter)</span>
          </div>
          <div className="p-5 border-r border-border">
            <label className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 block mb-1.5">Backend</label>
            <span className="text-[13px] text-foreground font-medium">Firebase (Firestore + Auth + Storage)</span>
          </div>
          <div className="p-5 border-r border-border">
            <label className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 block mb-1.5">Maps Stack</label>
            <span className="text-[13px] text-foreground font-medium">Google Maps, Directions, Distance Matrix, Places</span>
          </div>
          <div className="p-5">
            <label className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/60 block mb-1.5">Audited By</label>
            <span className="text-[13px] text-foreground font-medium">Optin Digital Solutions Ltd</span>
          </div>
        </div>
      </section>

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-primary">
        <div className="p-5 sm:p-6 border-r border-black/12 text-primary-foreground">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">8</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Critical Issues Found</div>
        </div>
        <div className="p-5 sm:p-6 border-r border-black/12 text-primary-foreground">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">~65%</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Estimated API Cost Reduction</div>
        </div>
        <div className="p-5 sm:p-6 border-r border-black/12 text-primary-foreground">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">5</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Google API Endpoints Audited</div>
        </div>
        <div className="p-5 sm:p-6 text-primary-foreground">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">3</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Migration Phases Planned</div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-[900px] mx-auto px-10 py-16">

        {/* Table of Contents */}
        <Card className="bg-card border-border rounded-[14px] mb-14">
          <CardContent className="p-7">
            <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/50 mb-4">
              Table of Contents
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left text-[13px] text-muted-foreground hover:text-primary transition-colors leading-snug flex items-center gap-2"
                >
                  <span className="font-mono text-[10px] text-primary/70">{section.number} —</span>
                  {section.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Section 1 ── */}
        <section id="s1" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">01</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Root Cause Analysis (Code-Level)
            </h2>
            <SectionBadge text="8 Issues" variant="critical" />
          </div>

          <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-6">
            After a full read of both codebases — specifically{" "}
            <code className="font-mono text-xs bg-muted border border-border rounded px-1.5 py-0.5 text-primary">home_controller.dart</code>
            ,{" "}
            <code className="font-mono text-xs bg-muted border border-border rounded px-1.5 py-0.5 text-primary">live_tracking_controller.dart</code>
            ,{" "}
            <code className="font-mono text-xs bg-muted border border-border rounded px-1.5 py-0.5 text-primary">fire_store_utils.dart</code>
            , and all controller classes — the following systemic issues were identified as driving the majority of API cost.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="issue-1" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <Callout variant="danger">
                  <strong className="text-foreground">Critical.</strong> Both apps set{" "}
                  <code className="font-mono text-xs text-primary">distanceFilter: 1</code> with{" "}
                  <code className="font-mono text-xs text-primary">accuracy: LocationAccuracy.bestForNavigation</code>.
                  At GPS accuracy of ~3–5m, this fires a location event every 1 meter of movement, producing up to 5,000
                  location ticks per hour at 90 km/h. Every tick triggers a Firestore{" "}
                  <code className="font-mono text-xs text-primary">update()</code> write and — during active trips — a
                  potential route recalculation.
                </Callout>
                <CodeBlock className="mt-4">
                  {"// DRIVER — home_controller.dart:518\n"}
                  {"// CUSTOMER — home_controller.dart:1391\n"}
                  {"Geolocator.getPositionStream(\n"}
                  {"  locationSettings: const LocationSettings(\n"}
                  {"    accuracy: LocationAccuracy.bestForNavigation,\n"}
                  {"    distanceFilter: 1,  // ← fires every 1 metre !!!\n"}
                  {"  ),\n"}
                  {")"}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-2" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 2 — Directions API Called on Every Firebase Snapshot
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <Callout variant="danger">
                  <strong className="text-foreground">Critical.</strong> Both{" "}
                  <code className="font-mono text-xs text-primary">LiveTrackingController.getPolyline()</code> (customer)
                  and the driver&apos;s equivalent call{" "}
                  <code className="font-mono text-xs text-primary">polylinePoints.getRouteBetweenCoordinates()</code>{" "}
                  — which hits the Google Directions API — <em>inside a Firestore snapshot listener</em>. The driver
                  document is updated continuously (see Issue 1), so every location write causes both apps to
                  independently call the Directions API.
                </Callout>
                <p className="text-[14px] text-muted-foreground leading-relaxed mt-4">
                  With <code className="font-mono text-xs text-primary">distanceFilter: 1</code>, a 10-minute ride at
                  50 km/h produces ~833 snapshot events. Both apps call Directions API on each:{" "}
                  <strong className="text-foreground">~1,666 Directions API calls per trip</strong>. At $0.005/call,
                  that&apos;s $8.33 per ride in Directions costs alone.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-3" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  Both apps implement a{" "}
                  <code className="font-mono text-xs text-primary">shouldReRoute()</code> guard that allows a new
                  Directions API call every 20 meters of driver movement. At 50 km/h, the driver crosses 20m every 1.44
                  seconds — triggering a route refresh every ~1.5 seconds throughout the trip.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-4" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 4 — Duplicate Location Tracking Stack
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  The Driver app runs <em>two simultaneous location stacks</em>:{" "}
                  <code className="font-mono text-xs text-primary">Geolocator.getPositionStream()</code> and{" "}
                  <code className="font-mono text-xs text-primary">location.onLocationChanged.listen()</code> — both
                  running concurrently. Every physical movement triggers <em>two</em> Firestore writes and two downstream
                  cascades, directly doubling all location-related costs.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-5" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 5 — Nested Firestore Listeners (Memory Leaks)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-muted-foreground leading-relaxed mb-4">
                  The inner listener is opened inside the outer listener&apos;s callback with no reference stored. After
                  5 minutes of a trip, there are dozens of orphaned listeners all calling{" "}
                  <code className="font-mono text-xs text-primary">getPolyline()</code> simultaneously.
                </p>
                <CodeBlock>
                  {"// live_tracking_controller.dart — same pattern in BOTH apps\n"}
                  {"FirebaseFirestore.instance.collection('orders').doc(orderId)\n"}
                  {"  .snapshots().listen((orderEvent) {\n"}
                  {"    // Inner listener opened on EVERY outer event — never cancelled!\n"}
                  {"    FirebaseFirestore.instance.collection('driver_users').doc(driverId)\n"}
                  {"      .snapshots().listen((driverEvent) {\n"}
                  {"        getPolyline(...);  // ← Directions API every write\n"}
                  {"      });\n"}
                  {"  });"}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-6" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 6 — Places Autocomplete + Distance Matrix on Every Keystroke
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  The customer&apos;s destination search calls both the Places Autocomplete API and Distance Matrix API
                  on every character typed, with no debounce. Typing &quot;Dar es Salaam Airport&quot; (19 chars) fires
                  19 Autocomplete + 19 Distance Matrix calls.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-7" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 7 — Nearby Places API Called on Every App Open
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-muted-foreground leading-relaxed">
                  On home screen load,{" "}
                  <code className="font-mono text-xs text-primary">fetchNearbyPlacesWhere()</code> fires a Nearby
                  Search + Distance Matrix immediately, with no caching. Every time a user opens the app, these calls
                  are made regardless of whether their location has changed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-8" className="border border-border rounded-lg px-4 bg-card">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="font-medium text-foreground text-sm">
                    Issue 8 — Background Location Mode Always Enabled
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <CodeBlock>
                  {"// driver/home_controller.dart:2040\n"}
                  {"location.enableBackgroundMode(enable: true);\n"}
                  {"// distanceFilter is commented out — updates Firestore continuously:\n"}
                  {"// location.changeSettings(accuracy: LocationAccuracy.high, distanceFilter: 3);"}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ── Section 2 ── */}
        <section id="s2" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">02</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Code & Architecture Weaknesses
            </h2>
            <SectionBadge text="Systemic" variant="critical" />
          </div>

          <div className="space-y-4 mb-8">
            <IssueCard
              title="Unconditional real-time listeners on frequently-written documents"
              pill={{ text: "High Cost", variant: "red" }}
            >
              The <code className="font-mono text-xs text-primary">driver_users</code> document is written to on every
              location update. Both apps attach{" "}
              <code className="font-mono text-xs text-primary">.snapshots().listen()</code> to this document. Firestore
              charges a read for every snapshot event. With{" "}
              <code className="font-mono text-xs text-primary">distanceFilter: 1</code>, a 20-minute trip produces
              ~1,000+ document reads per listener — and there are multiple listeners on the same document.
            </IssueCard>

            <IssueCard
              title="Unmanaged StreamSubscriptions leading to zombie listeners"
              pill={{ text: "Memory Leak", variant: "red" }}
            >
              Inner <code className="font-mono text-xs text-primary">StreamSubscription</code> objects created inside
              outer listener callbacks are never stored in a variable. They cannot be{" "}
              <code className="font-mono text-xs text-primary">cancel()</code>-ed in{" "}
              <code className="font-mono text-xs text-primary">onClose()</code>, creating permanent memory leaks and
              duplicate API calls that compound over a trip&apos;s duration.
            </IssueCard>

            <IssueCard
              title="Mobile apps make all Google API calls directly — no shared cache"
              pill={{ text: "Architecture", variant: "amber" }}
            >
              Every mobile client calls Maps/Directions/Places APIs independently. There is no shared caching layer, no
              rate limiting, and no opportunity to deduplicate — e.g., if 50 customers are all near the same area, each
              makes their own independent Nearby Search call for the same data.
            </IssueCard>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-foreground/75 mb-4 mt-8">
            Scalability Projection
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-card">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Issue</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Current Behaviour</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">At Scale (1,000 concurrent rides)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Location writes per second", "~1 write/sec per driver", "1,000 writes/sec — Firestore hot spots"],
                  ["Directions API calls per trip", "~800–1,600 calls/trip", "Hitting Maps API daily quotas instantly"],
                  ["Firestore reads per trip", "~2,000–4,000 reads/trip", "Firebase costs scale linearly, no bulk discount"],
                  ["Nearby search caching", "None — per app open", "1,000 app opens = 1,000 redundant API calls"],
                ].map(([issue, current, scale]) => (
                  <tr key={issue} className="hover:bg-card">
                    <td className="p-3 border-b border-border text-muted-foreground">{issue}</td>
                    <td className="p-3 border-b border-border text-muted-foreground">{current}</td>
                    <td className="p-3 border-b border-border text-muted-foreground">{scale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 3 ── */}
        <section id="s3" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">03</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Steps Taken — Phase 1 Complete
            </h2>
            <SectionBadge text="Done" variant="done" />
          </div>

          <Callout variant="done">
            <strong className="text-green-400">Phase 1 has been successfully completed.</strong> All quick-win
            Flutter-only fixes have been implemented and deployed. Estimated impact:{" "}
            <strong className="text-foreground">45–55% reduction in API and Firestore costs</strong> from these changes
            alone.
          </Callout>

          <div className="mt-6">
            <StepDone
              title={<>Corrected <code className="font-mono text-xs text-primary">distanceFilter</code> values across both apps</>}
              description="Changed from distanceFilter: 1 to adaptive values: 15m when idle, 8m en-route to pickup, and 5m during active trip navigation. This single change accounts for an estimated 40–50% reduction in location writes and downstream API cascades."
            />
            <StepDone
              title="Removed the duplicate location tracking stack in Driver app"
              description="The location.onLocationChanged.listen() block inside enableLocationServices() was removed entirely. All location handling is now consolidated into the single Geolocator.getPositionStream(). This eliminated a full doubling of all location-related Firestore writes and downstream costs."
            />
            <StepDone
              title="Stored and cancelled all StreamSubscriptions — zombie listeners eliminated"
              description="All .listen() calls were audited across both codebases. Every subscription is now assigned to a named StreamSubscription? variable and cancelled in onClose(). Nested listeners were refactored to flat, parallel subscriptions."
            />
            <StepDone
              title="Implemented client-side polyline trimming — in-trip Directions API calls eliminated"
              description="The getPolyline() call inside the monitorTrip driver listener was replaced with a pure client-side trimPolyline() function. The Directions API is now called only when the driver deviates more than 80m from the polyline corridor. Estimated reduction: 70–85% of in-trip Directions API calls."
            />
            <StepDone
              title="Added 300ms debounce and 3-character minimum to destination search"
              description="A Timer-based debounce was added to the customer app's onSearchChanged() handler. Autocomplete calls now fire only after 300ms of typing inactivity and require at least 3 characters. Estimated reduction: 60–80% of Places Autocomplete calls."
            />
            <StepDone
              title="Implemented nearby places result caching (10-minute TTL, 200m movement threshold)"
              description="The fetchNearbyPlacesWhere() call on app open is now gated by a cache check. Results are reused for 10 minutes if the user's position has not moved more than 200m from the last fetch position."
            />
            <StepDone
              title={<>Re-enabled background location <code className="font-mono text-xs text-primary">distanceFilter: 20</code> in Driver app</>}
              description="The location.changeSettings(distanceFilter: 20) call that had been commented out in home_controller.dart was restored. Background location accuracy was also lowered to LocationAccuracy.balanced while backgrounded."
            />
          </div>

          <Callout variant="done">
            <strong className="text-green-400">Validation:</strong> All Phase 1 changes were tested in the Jamboride
            staging environment for one week prior to production deployment. API call volume telemetry confirmed a
            measured reduction consistent with projections before the production release.
          </Callout>
        </section>

        {/* ── Section 4 ── */}
        <section id="s4" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">04</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Refactored Architecture Proposal
            </h2>
            <SectionBadge text="Phase 2-3" variant="next" />
          </div>

          <p className="text-[14.5px] text-muted-foreground leading-relaxed mb-6">
            The core architectural change is to move all Google API calls from mobile clients to a backend service.
            Mobile apps should only communicate with your own backend, which acts as a smart proxy with caching,
            deduplication, and cost controls.
          </p>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-foreground/75 mb-4 mt-8">
            Key Architecture Principles
          </h3>
          <ul className="space-y-3 text-[13.5px] text-muted-foreground leading-relaxed pl-5">
            {[
              ["Mobile → Your Backend only.", "Apps never call google.com directly. All Maps/Directions/Places calls are proxied through your backend."],
              ["Backend → Redis cache → Google APIs.", "Every route, ETA, and place result is cached in Redis. Repeated requests return cached data."],
              ["Location via WebSocket, not Firestore polling.", "Driver location updates are broadcast over WebSocket. No Firestore document write per update; no downstream read cascade."],
              ["Route calculated once per order.", "At order acceptance, the Route Service computes and stores the full polyline — trimmed client-side during the trip."],
              ["Dispatch uses PostGIS geospatial queries.", "Finding nearby drivers uses a PostgreSQL + PostGIS radius query — not Firestore geohash queries."],
            ].map(([bold, rest]) => (
              <li key={bold as string} className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/50">
                <strong className="text-foreground">{bold}</strong> {rest}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Section 5 ── */}
        <section id="s5" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">05</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Firebase Evaluation
            </h2>
            <SectionBadge text="Hybrid Recommended" variant="next" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-500/12 text-green-400">Pros</span>
                  <span className="text-[13px] font-semibold text-foreground">Where Firebase works well</span>
                </div>
                <ul className="space-y-2 text-[13.5px] text-muted-foreground">
                  {[
                    "Real-time order status updates (Firestore listeners)",
                    "Firebase Auth — battle-tested, phone number OTP works well",
                    "Firebase Storage — driver document uploads",
                    "FCM push notifications — reliable, cross-platform",
                    "Fast initial deployment — no backend infra to manage",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">Cons</span>
                  <span className="text-[13px] font-semibold text-foreground">Where Firebase is hurting you</span>
                </div>
                <ul className="space-y-2 text-[13.5px] text-muted-foreground">
                  {[
                    "Firestore pricing is per read/write — architecture writes thousands per ride",
                    "No server-side logic — business rules embedded in mobile apps",
                    "No native geospatial queries (geoflutterfire is a workaround)",
                    "Vendor lock-in — hard to migrate once data is in Firestore",
                    "Real-time listeners at scale create connection storm",
                  ].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-foreground/75 mb-4">
            Recommendation: Hybrid Architecture
          </h3>
          <Callout variant="done">
            <strong className="text-green-400">Keep Firebase for:</strong> Auth (phone OTP), FCM push notifications,
            and Firebase Storage for document uploads.
            <br /><br />
            <strong className="text-green-400">Replace with custom backend for:</strong> All location updates, ride
            matching, route calculations, order management, and real-time position streaming.
          </Callout>
        </section>

        {/* ── Section 6 ── */}
        <section id="s6" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">06</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Cost Reduction Estimate
            </h2>
            <SectionBadge text="Projected" variant="next" />
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-card">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Optimization Action</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Affected Cost</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Estimated Reduction</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { done: true,  action: "Fix distanceFilter 1→8m + stop duplicate location stack", cost: "Firestore writes, downstream Directions calls", reduction: "~40–50%" },
                  { done: true,  action: "Fix zombie listeners + store & cancel subscriptions", cost: "Firestore reads, Directions API calls per trip", reduction: "~15–25%" },
                  { done: true,  action: "Polyline trimming instead of Directions recalculation", cost: "Directions API calls during trip", reduction: "~70–85% of in-trip calls" },
                  { done: true,  action: "Debounce autocomplete + cache nearby places", cost: "Places Autocomplete + Nearby Search calls", reduction: "~60–80%" },
                  { done: false, action: "Move route calculation to backend with Redis cache", cost: "All Directions API calls (shared cache)", reduction: "~50–70% additional" },
                  { done: false, action: "Replace Firestore location tracking with WebSocket", cost: "Firestore reads + writes (largest Firebase cost)", reduction: "~85–95%" },
                ].map(({ done, action, cost, reduction }) => (
                  <tr key={action} className="hover:bg-card">
                    <td className="p-3 border-b border-border text-foreground font-medium">
                      {done && <CheckCircle2 className="h-4 w-4 text-green-400 inline mr-2" />}
                      {action}
                    </td>
                    <td className="p-3 border-b border-border text-muted-foreground">{cost}</td>
                    <td className="p-3 border-b border-border text-muted-foreground">{reduction}</td>
                  </tr>
                ))}
                <tr className="bg-green-500/5 border-l-2 border-green-500">
                  <td className="p-3 font-bold text-green-400">Total (full implementation)</td>
                  <td className="p-3 font-bold text-green-400">Google Maps APIs + Firebase</td>
                  <td className="p-3 font-bold text-green-400">60–75% overall reduction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout variant="done">
            <strong className="text-green-400">Phase 1 quick wins (already implemented):</strong> Fixing distanceFilter,
            zombie listeners, polyline trimming, and debouncing reduced API costs by approximately{" "}
            <strong className="text-foreground">45–55%</strong> with changes only to Flutter code — no new
            infrastructure required.
          </Callout>
        </section>

        {/* ── Section 7 ── */}
        <section id="s7" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">07</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Recommended Backend Stack
            </h2>
            <SectionBadge text="Phase 2-3" variant="next" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StackCard tech="NestJS (Node.js)" description="TypeScript-first, modular architecture with dependency injection. Ideal for domain-driven ride-hailing services (RideModule, DriverModule, RouteModule). Built-in WebSocket gateway via Socket.io adapter." />
            <StackCard tech="PostgreSQL + PostGIS" description={<><code className="font-mono text-xs text-primary">ST_DWithin()</code> replaces all geoflutterfire-based driver-finding logic. Full ACID compliance for order lifecycle. Far cheaper at scale than Firestore per-read pricing.</>} />
            <StackCard tech="Redis" description="Cache Google API responses — polylines, ETAs, place results — with TTL. Pub/Sub channel for driver location broadcast. Eliminates Firestore as the location pipe entirely." />
            <StackCard tech="Socket.io (WebSocket)" description="Replace Firestore real-time listeners. Driver emits position every 5 seconds → server broadcasts to customer's room. No per-message database write; horizontal scalability via Redis adapter." />
            <StackCard tech="Bull / BullMQ (Job Queue)" description="Queue for: route pre-computation, notifications, trip receipt processing, and fare calculation. Decouples latency-sensitive APIs from background work. Retries on Google API failures." />
            <StackCard tech="Google Maps Platform (via backend only)" description={<>Called exclusively from the Route Service. <code className="font-mono text-xs text-primary">RouteCache</code> module: key = SHA256(origin+destination), TTL = 24h. Use Maps Routes API v2 (cheaper than legacy Directions API).</>} />
          </div>

          <CodeBlock className="mt-6">
            {"src/\n"}
            {"├── modules/\n"}
            {"│   ├── rides/          # Order lifecycle (create, accept, complete)\n"}
            {"│   ├── drivers/        # Driver state, location, matching\n"}
            {"│   ├── routes/         # Route calculation + Redis cache layer\n"}
            {"│   ├── location/       # WebSocket gateway + Redis pub/sub\n"}
            {"│   ├── places/         # Autocomplete + nearby, cached\n"}
            {"│   └── notifications/  # FCM wrapper\n"}
            {"├── common/\n"}
            {"│   ├── guards/         # Firebase Auth token verification\n"}
            {"│   ├── interceptors/   # Logging, error normalization\n"}
            {"│   └── pipes/          # Validation\n"}
            {"└── infra/\n"}
            {"    ├── redis/          # Redis module (cache + pub/sub)\n"}
            {"    └── maps/           # Google Maps SDK wrapper + caching"}
          </CodeBlock>
        </section>

        {/* ── Section 8 ── */}
        <section id="s8" className="mb-16 scroll-mt-32">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border">
            <span className="font-mono text-[10px] text-primary tracking-wider">08</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-foreground">
              Implementation & Migration Plan
            </h2>
            <SectionBadge text="Active" variant="next" />
          </div>

          {/* Phase 1 */}
          <div className="border-l-2 border-destructive pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-destructive mb-1">
              Phase 1 — Weeks 1–2 — Flutter Only — Complete
            </div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-3">
              Quick Wins — 45–55% cost reduction achieved
            </h4>
            <Callout variant="done">
              All seven Phase 1 steps have been completed and deployed to production. See Section 03 for the full
              breakdown of what was implemented and the validation process.
            </Callout>
          </div>

          {/* Phase 2 */}
          <div className="border-l-2 border-primary pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-primary mb-1">
              Phase 2 — Weeks 3–8 — Backend API Layer
            </div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-3">
              Centralise all Google API calls — ~60–65% total reduction
            </h4>
            <ol className="space-y-2 text-[13.5px] text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>Stand up NestJS backend with PostgreSQL + PostGIS and Redis.</li>
              <li>Implement <code className="font-mono text-xs text-primary">RoutesModule</code> — proxy for Directions API with Redis cache (TTL 24h per origin/destination pair).</li>
              <li>Implement <code className="font-mono text-xs text-primary">PlacesModule</code> — proxy for Autocomplete and Nearby Search with per-query Redis cache (TTL 15min).</li>
              <li>Update Flutter apps to call your backend route/places endpoints instead of Google APIs directly.</li>
              <li>Implement <code className="font-mono text-xs text-primary">LocationModule</code> with Socket.io WebSocket gateway.</li>
              <li>Migrate order status updates from Firestore to WebSocket events.</li>
            </ol>
            <Callout>
              <strong className="text-foreground">Risk:</strong> Medium. Keep Firebase Firestore as fallback for order
              status for 2 weeks during transition. A/B rollout: 10% of new rides use new backend, 90% continue on
              Firebase.
            </Callout>
          </div>

          {/* Phase 3 */}
          <div className="border-l-2 border-green-500 pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-green-400 mb-1">
              Phase 3 — Weeks 9–16 — Full Architecture Migration
            </div>
            <h4 className="font-serif text-lg font-bold text-foreground mb-3">
              Complete Firebase replacement for operational data — ~70–75% total reduction
            </h4>
            <ol className="space-y-2 text-[13.5px] text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>Migrate order and trip data from Firestore to PostgreSQL with migration script.</li>
              <li>Implement driver matching via PostGIS <code className="font-mono text-xs text-primary">ST_DWithin()</code>. Remove all geoflutterfire queries.</li>
              <li>Implement BullMQ job queue for: trip fare calculation, receipt generation, payout processing.</li>
              <li>Keep Firebase Auth (phone OTP) + FCM + Storage — these remain cost-effective.</li>
              <li>Decommission Firestore collections: orders, driver_users location fields.</li>
              <li>Implement monitoring: Prometheus + Grafana dashboard.</li>
            </ol>
            <Callout>
              <strong className="text-foreground">Risk:</strong> Medium-High. Run parallel writes (PostgreSQL + Firestore)
              for 4 weeks before cutting over reads. Maintain rollback scripts.
            </Callout>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-foreground/75 mb-4 mt-8">
            Risk Register
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-card">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Risk</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Probability</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground p-3 border-b border-border">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Location accuracy degradation with higher distanceFilter", "Low", "Validated in Phase 1 staging. Filter of 5–8m is imperceptible to users."],
                  ["WebSocket reconnection on mobile network switching", "Medium", "Implement exponential backoff reconnect in Flutter."],
                  ["Redis cache stale routes (road closures)", "Low", "Use short TTL (2h) for high-traffic corridors. Driver deviation triggers cache invalidation."],
                  ["Increased backend infrastructure cost", "Low–Medium", "NestJS + PostgreSQL + Redis on a $40/month VPS handles thousands of concurrent rides."],
                ].map(([risk, prob, mitigation]) => (
                  <tr key={risk as string} className="hover:bg-card">
                    <td className="p-3 border-b border-border text-muted-foreground">{risk}</td>
                    <td className="p-3 border-b border-border text-muted-foreground">{prob}</td>
                    <td className="p-3 border-b border-border text-muted-foreground">{mitigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-0 border-t border-border my-14" />

        {/* End note (screen) */}
        <div className="text-center pb-4 print:hidden">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/40">
            End of Report — Optin Digital Solutions Ltd — April 2026
          </p>
        </div>

        {/* Print-only end note */}
        <div className="hidden print:block text-center pb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/40">
            End of Report — Optin Digital Solutions Ltd — April 2026
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Image
              src="/images/optin-logo.webp"
              alt="Optin Technology Limited"
              width={100}
              height={32}
              className="h-8 w-auto opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
