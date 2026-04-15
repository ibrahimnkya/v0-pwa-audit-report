"use client"

import { useState, useCallback } from "react"
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
  Copy,
  CheckCheck,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditReportProps {
  userEmail?: string
  onLogout?: () => void
}

// ─── Copy hook ────────────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = useCallback(async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // fallback
    }
  }, [])
  return { copied, copy }
}

// ─── Code Block with copy ─────────────────────────────────────────────────────

function CodeBlock({
  children,
  copyKey,
  className,
}: {
  children: string
  copyKey: string
  className?: string
}) {
  const { copied, copy } = useCopy()

  return (
    <div className={cn("relative group rounded-xl overflow-hidden border border-border/60 my-4", className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border/60">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <button
          onClick={() => copy(children, copyKey)}
          className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
        >
          {copied === copyKey ? (
            <><CheckCheck className="h-3 w-3 text-green-500" /><span className="text-green-500">Copied!</span></>
          ) : (
            <><Copy className="h-3 w-3" /><span>Copy</span></>
          )}
        </button>
      </div>
      <pre className="bg-[hsl(var(--muted)/0.3)] px-5 py-4 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-muted-foreground">
        <code>{children}</code>
      </pre>
    </div>
  )
}

// ─── Callout ─────────────────────────────────────────────────────────────────

function Callout({
  children,
  variant = "default",
  icon,
}: {
  children: React.ReactNode
  variant?: "default" | "danger" | "done"
  icon?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl px-4 py-3.5 text-[13.5px] leading-relaxed my-4",
        variant === "default" && "bg-primary/5 border border-primary/15 text-muted-foreground",
        variant === "danger" && "bg-destructive/5 border border-destructive/20 text-muted-foreground",
        variant === "done" && "bg-green-500/5 border border-green-500/20 text-muted-foreground"
      )}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  badge,
  badgeVariant,
}: {
  number: string
  title: string
  badge: string
  badgeVariant: "critical" | "done" | "next"
}) {
  const badgeStyles = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    done: "bg-green-500/10 text-green-500 border-green-500/20",
    next: "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 pb-5 border-b border-border">
      <span className="font-mono text-[11px] text-primary/70 tracking-widest tabular-nums">{number}</span>
      <div className="h-3 w-px bg-border" />
      <h2 className="font-semibold text-[20px] tracking-tight text-foreground flex-1">{title}</h2>
      <span
        className={cn(
          "text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border",
          badgeStyles[badgeVariant]
        )}
      >
        {badgeVariant === "done" && <Check className="h-3 w-3 inline mr-1 -mt-0.5" />}
        {badge}
      </span>
    </div>
  )
}

// ─── Issue Accordion Item ─────────────────────────────────────────────────────

function IssueItem({
  value,
  severity,
  title,
  children,
}: {
  value: string
  severity: "critical" | "high" | "medium"
  title: string
  children: React.ReactNode
}) {
  const severityConfig = {
    critical: { label: "Critical", color: "text-destructive", dot: "bg-destructive", bg: "bg-destructive/8" },
    high: { label: "High", color: "text-orange-500", dot: "bg-orange-500", bg: "bg-orange-500/8" },
    medium: { label: "Medium", color: "text-yellow-500", dot: "bg-yellow-500", bg: "bg-yellow-500/8" },
  }
  const cfg = severityConfig[severity]

  return (
    <AccordionItem value={value} className="border border-border/60 rounded-xl mb-2.5 overflow-hidden px-0">
      <AccordionTrigger className="hover:no-underline px-4 py-3.5 hover:bg-muted/30 transition-colors [&>svg]:hidden">
        <div className="flex items-center gap-3 text-left w-full">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
          <span
            className={cn(
              "font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0",
              cfg.color,
              cfg.bg
            )}
          >
            {cfg.label}
          </span>
          <span className="text-[13.5px] font-medium text-foreground flex-1">{title}</span>
          <ChevronRight className={cn("h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform duration-200", "group-data-[state=open]:rotate-90")} />
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 pt-1">
        <div className="pl-7 space-y-3">{children}</div>
      </AccordionContent>
    </AccordionItem>
  )
}

// ─── Step Done ────────────────────────────────────────────────────────────────

function StepDone({ title, description }: { title: React.ReactNode; description: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-4 border-b border-border/50 last:border-b-0">
      <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0 mt-0.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold text-foreground mb-1 leading-snug">{title}</div>
        <div className="text-[13px] text-muted-foreground leading-relaxed">{description}</div>
      </div>
    </div>
  )
}

// ─── Info Card ────────────────────────────────────────────────────────────────

function InfoCard({
  pill,
  pillVariant,
  title,
  children,
}: {
  pill: string
  pillVariant: "red" | "amber" | "blue"
  title: string
  children: React.ReactNode
}) {
  const pillStyles = {
    red: "bg-destructive/10 text-destructive",
    amber: "bg-amber-500/10 text-amber-500",
    blue: "bg-blue-500/10 text-blue-400",
  }
  return (
    <div className="rounded-xl border border-border/60 p-5 bg-card/50 hover:border-border transition-colors">
      <div className="flex items-start gap-2.5 mb-2">
        <span className={cn("text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full shrink-0 mt-0.5", pillStyles[pillVariant])}>
          {pill}
        </span>
        <span className="text-[13.5px] font-semibold text-foreground leading-snug">{title}</span>
      </div>
      <div className="text-[13px] text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Stack Card ───────────────────────────────────────────────────────────────

function StackCard({ tech, description }: { tech: string; description: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 p-5 bg-card/40 hover:border-primary/30 hover:bg-card/70 transition-all duration-200">
      <div className="font-semibold text-[13.5px] text-foreground mb-2">{tech}</div>
      <div className="text-[12.5px] text-muted-foreground leading-relaxed">{description}</div>
    </div>
  )
}

// ─── Inline code ─────────────────────────────────────────────────────────────

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11.5px] bg-muted/60 border border-border/60 rounded px-1.5 py-0.5 text-primary">
      {children}
    </code>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────

function Table({ headers, rows, highlightLast }: {
  headers: string[]
  rows: (string | React.ReactNode)[][]
  highlightLast?: boolean
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/60 my-5">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            {headers.map((h) => (
              <th key={h} className="text-left font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground/60 px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isLast = i === rows.length - 1 && highlightLast
            return (
              <tr
                key={i}
                className={cn(
                  "border-b border-border/40 last:border-b-0 transition-colors",
                  isLast ? "bg-green-500/5 text-green-500 font-semibold" : "hover:bg-muted/20"
                )}
              >
                {row.map((cell, j) => (
                  <td key={j} className={cn("px-4 py-3 align-top", isLast ? "text-green-500" : "text-muted-foreground")}>
                    {cell}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Print styles ─────────────────────────────────────────────────────────────

const PrintStyles = () => (
  <style>{`
    @media print {
      header, aside, .print\\:hidden { display: none !important; }
      body, html { background: white !important; }
      main, [data-sidebar-inset] { margin: 0 !important; padding: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; }
      @page { margin: 20mm 16mm 24mm; }
    }
  `}</style>
)

// ─── Main Component ───────────────────────────────────────────────────────────

export function AuditReport({ userEmail }: AuditReportProps) {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const tocSections = [
    { id: "s1", n: "01", title: "Root Cause Analysis" },
    { id: "s2", n: "02", title: "Code & Architecture Weaknesses" },
    { id: "s3", n: "03", title: "Steps Taken (Phase 1 Complete)" },
    { id: "s4", n: "04", title: "Refactored Architecture Proposal" },
    { id: "s5", n: "05", title: "Firebase Evaluation" },
    { id: "s6", n: "06", title: "Cost Reduction Estimate" },
    { id: "s7", n: "07", title: "Recommended Backend Stack" },
    { id: "s8", n: "08", title: "Implementation & Migration Plan" },
  ]

  return (
    <div className="w-full">
      <PrintStyles />

      {/* Print-only header */}
      <div className="hidden print:flex items-center justify-between px-10 py-6 border-b">
        <Image src="/images/optin-logo.webp" alt="Optin" width={120} height={36} className="h-8 w-auto" />
        <div className="text-right font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          <div>Confidential</div>
          <div>April 2026</div>
        </div>
      </div>

      {/* ── Stat strip — full bleed ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-destructive print:hidden">
        {[
          { num: "8",    label: "Critical Issues Found" },
          { num: "~65%", label: "Estimated API Cost Reduction" },
          { num: "5",    label: "Google API Endpoints Audited" },
          { num: "3",    label: "Migration Phases Planned" },
        ].map((stat, i) => (
          <div key={i} className="p-5 lg:p-6 border-r border-primary-foreground/10 last:border-r-0 text-primary-foreground">
            <div className="text-3xl lg:text-4xl font-bold tracking-tight leading-none">{stat.num}</div>
            <div className="font-mono text-[9px] tracking-wider uppercase opacity-60 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="w-full max-w-[1100px] mx-auto px-6 lg:px-10 xl:px-14 py-12 space-y-20">

        {/* TOC */}
        <div className="rounded-2xl border border-border/60 p-6 bg-card/30">
          <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground/40 mb-4">
            Table of Contents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
            {tocSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="flex items-center gap-2 text-left text-[13px] text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="font-mono text-[10px] text-primary/60 tabular-nums">{s.n}</span>
                <span className="flex-1 leading-snug group-hover:underline underline-offset-2">{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Section 1 ── */}
        <section id="s1" className="scroll-mt-24">
          <SectionHeader number="01" title="Root Cause Analysis (Code-Level)" badge="8 Issues" badgeVariant="critical" />

          <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
            After a full read of both codebases — specifically{" "}
            <Code>home_controller.dart</Code>, <Code>live_tracking_controller.dart</Code>,{" "}
            <Code>fire_store_utils.dart</Code>, and all controller classes — the following systemic issues were
            identified as driving the majority of API cost.
          </p>

          <Accordion type="single" collapsible className="space-y-0">
            <IssueItem value="i1" severity="critical" title="Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)">
              <Callout variant="danger">
                <strong className="text-foreground">Critical.</strong> Both apps set <Code>distanceFilter: 1</Code>{" "}
                with <Code>accuracy: LocationAccuracy.bestForNavigation</Code>. At GPS accuracy of ~3–5m, this fires a
                location event every 1 meter of movement, producing up to 5,000 location ticks per hour at 90 km/h.
                Every tick triggers a Firestore <Code>update()</Code> write and — during active trips — a potential
                route recalculation.
              </Callout>
              <CodeBlock copyKey="i1-code">{`// DRIVER — home_controller.dart:518
// CUSTOMER — home_controller.dart:1391
Geolocator.getPositionStream(
  locationSettings: const LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: 1,  // ← fires every 1 metre !!!
  ),
)`}</CodeBlock>
            </IssueItem>

            <IssueItem value="i2" severity="critical" title="Issue 2 — Directions API Called on Every Firebase Snapshot">
              <Callout variant="danger">
                <strong className="text-foreground">Critical.</strong> Both{" "}
                <Code>LiveTrackingController.getPolyline()</Code> (customer) and the driver's equivalent call{" "}
                <Code>polylinePoints.getRouteBetweenCoordinates()</Code> — which hits the Google Directions API —{" "}
                <em>inside a Firestore snapshot listener</em>. The driver document is updated continuously (see Issue 1),
                so every location write causes both apps to independently call the Directions API.
              </Callout>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                With <Code>distanceFilter: 1</Code>, a 10-minute ride at 50 km/h produces ~833 snapshot events. Both
                apps call Directions API on each:{" "}
                <strong className="text-foreground">~1,666 Directions API calls per trip</strong>. At $0.005/call,
                that's $8.33 per ride in Directions costs alone.
              </p>
            </IssueItem>

            <IssueItem value="i3" severity="high" title="Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive">
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                Both apps implement a <Code>shouldReRoute()</Code> guard that allows a new Directions API call every 20
                meters of driver movement. At 50 km/h, the driver crosses 20m every 1.44 seconds — triggering a route
                refresh every ~1.5 seconds throughout the trip.
              </p>
              <CodeBlock copyKey="i3-code">{`if (moved >= 20) {  // "20 meters magic number" (comment in source)
  _lastRoutedDriverPos = current;
  return true;       // triggers Directions API call
}`}</CodeBlock>
            </IssueItem>

            <IssueItem value="i4" severity="critical" title="Issue 4 — Duplicate Location Tracking Stack">
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                The Driver app runs <em>two simultaneous location stacks</em>:{" "}
                <Code>Geolocator.getPositionStream()</Code> and{" "}
                <Code>location.onLocationChanged.listen()</Code> — both running concurrently. Every physical movement
                triggers <em>two</em> Firestore writes and two downstream cascades, directly doubling all
                location-related costs.
              </p>
            </IssueItem>

            <IssueItem value="i5" severity="critical" title="Issue 5 — Nested Firestore Listeners (Memory Leaks)">
              <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-3">
                The inner listener is opened inside the outer listener's callback with no reference stored. After 5
                minutes of a trip, there are dozens of orphaned listeners all calling <Code>getPolyline()</Code>{" "}
                simultaneously.
              </p>
              <CodeBlock copyKey="i5-code">{`// live_tracking_controller.dart — same pattern in BOTH apps
FirebaseFirestore.instance.collection('orders').doc(orderId)
  .snapshots().listen((orderEvent) {
    // Inner listener opened on EVERY outer event — never cancelled!
    FirebaseFirestore.instance.collection('driver_users').doc(driverId)
      .snapshots().listen((driverEvent) {
        getPolyline(...);  // ← Directions API every write
      });
  });`}</CodeBlock>
            </IssueItem>

            <IssueItem value="i6" severity="high" title="Issue 6 — Places Autocomplete + Distance Matrix on Every Keystroke">
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                The customer's destination search calls both the Places Autocomplete API and Distance Matrix API on
                every character typed, with no debounce. Typing "Dar es Salaam Airport" (19 chars) fires 19
                Autocomplete + 19 Distance Matrix calls.
              </p>
            </IssueItem>

            <IssueItem value="i7" severity="high" title="Issue 7 — Nearby Places API Called on Every App Open">
              <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                On home screen load, <Code>fetchNearbyPlacesWhere()</Code> fires a Nearby Search + Distance Matrix
                immediately, with no caching. Every time a user opens the app, these calls are made regardless of
                whether their location has changed.
              </p>
            </IssueItem>

            <IssueItem value="i8" severity="high" title="Issue 8 — Background Location Mode Always Enabled">
              <CodeBlock copyKey="i8-code">{`// driver/home_controller.dart:2040
location.enableBackgroundMode(enable: true);
// distanceFilter is commented out — updates Firestore continuously:
// location.changeSettings(accuracy: LocationAccuracy.high, distanceFilter: 3);`}</CodeBlock>
            </IssueItem>
          </Accordion>
        </section>

        {/* ── Section 2 ── */}
        <section id="s2" className="scroll-mt-24">
          <SectionHeader number="02" title="Code & Architecture Weaknesses" badge="Systemic" badgeVariant="critical" />

          <div className="space-y-3 mb-8">
            <InfoCard pill="High Cost" pillVariant="red" title="Unconditional real-time listeners on frequently-written documents">
              The <Code>driver_users</Code> document is written to on every location update. Both apps attach{" "}
              <Code>.snapshots().listen()</Code> to this document. Firestore charges a read for every snapshot event.
              With <Code>distanceFilter: 1</Code>, a 20-minute trip produces ~1,000+ document reads per listener — and
              there are multiple listeners on the same document.
            </InfoCard>

            <InfoCard pill="Memory Leak" pillVariant="red" title="Unmanaged StreamSubscriptions leading to zombie listeners">
              Inner <Code>StreamSubscription</Code> objects created inside outer listener callbacks are never stored in
              a variable. They cannot be <Code>cancel()</Code>-ed in <Code>onClose()</Code>, creating permanent memory
              leaks and duplicate API calls that compound over a trip's duration.
            </InfoCard>

            <InfoCard pill="Architecture" pillVariant="amber" title="Mobile apps make all Google API calls directly — no shared cache">
              Every mobile client calls Maps/Directions/Places APIs independently. There is no shared caching layer, no
              rate limiting, and no opportunity to deduplicate — e.g., if 50 customers are all near the same area, each
              makes their own independent Nearby Search call for the same data.
            </InfoCard>
          </div>

          <h3 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-3 mt-8">
            Scalability Projection
          </h3>
          <Table
            headers={["Issue", "Current Behaviour", "At Scale (1,000 concurrent rides)"]}
            rows={[
              ["Location writes per second", "~1 write/sec per driver", "1,000 writes/sec — Firestore hot spots"],
              ["Directions API calls per trip", "~800–1,600 calls/trip", "Hitting Maps API daily quotas instantly"],
              ["Firestore reads per trip", "~2,000–4,000 reads/trip", "Firebase costs scale linearly, no bulk discount"],
              ["Nearby search caching", "None — per app open", "1,000 app opens = 1,000 redundant API calls"],
            ]}
          />
        </section>

        {/* ── Section 3 ── */}
        <section id="s3" className="scroll-mt-24">
          <SectionHeader number="03" title="Steps Taken — Phase 1 Complete" badge="Done" badgeVariant="done" />

          <Callout variant="done" icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}>
            <strong className="text-green-500">Phase 1 has been successfully completed.</strong> All quick-win
            Flutter-only fixes have been implemented and deployed. Estimated impact:{" "}
            <strong className="text-foreground">45–55% reduction in API and Firestore costs</strong> from these changes
            alone.
          </Callout>

          <div className="mt-6 rounded-xl border border-border/50 divide-y divide-border/40 overflow-hidden">
            <StepDone
              title={<>Corrected <Code>distanceFilter</Code> values across both apps</>}
              description="Changed from distanceFilter: 1 to adaptive values: 15m when idle, 8m en-route to pickup, and 5m during active trip navigation. This single change accounts for an estimated 40–50% reduction in location writes and downstream API cascades."
            />
            <StepDone
              title="Removed the duplicate location tracking stack in Driver app"
              description={<>The <Code>location.onLocationChanged.listen()</Code> block inside <Code>enableLocationServices()</Code> was removed entirely. All location handling is now consolidated into the single <Code>Geolocator.getPositionStream()</Code>. This eliminated a full doubling of all location-related Firestore writes.</>}
            />
            <StepDone
              title="Stored and cancelled all StreamSubscriptions — zombie listeners eliminated"
              description={<>All <Code>.listen()</Code> calls were audited across both codebases. Every subscription is now assigned to a named <Code>StreamSubscription?</Code> variable and cancelled in <Code>onClose()</Code>. Nested listeners were refactored to flat, parallel subscriptions.</>}
            />
            <StepDone
              title="Implemented client-side polyline trimming — in-trip Directions API calls eliminated"
              description={<>The <Code>getPolyline()</Code> call inside the <Code>monitorTrip</Code> driver listener was replaced with a pure client-side <Code>trimPolyline()</Code> function. The Directions API is now called only when the driver deviates more than 80m from the polyline corridor. Estimated reduction: 70–85% of in-trip Directions API calls.</>}
            />
            <StepDone
              title="Added 300ms debounce and 3-character minimum to destination search"
              description={<>A <Code>Timer</Code>-based debounce was added to the customer app's <Code>onSearchChanged()</Code> handler. Autocomplete calls now fire only after 300ms of typing inactivity and require at least 3 characters. Estimated reduction: 60–80% of Places Autocomplete calls.</>}
            />
            <StepDone
              title="Implemented nearby places result caching (10-minute TTL, 200m movement threshold)"
              description={<>The <Code>fetchNearbyPlacesWhere()</Code> call on app open is now gated by a cache check. Results are reused for 10 minutes if the user's position has not moved more than 200m from the last fetch position.</>}
            />
            <StepDone
              title={<>Re-enabled background location <Code>distanceFilter: 20</Code> in Driver app</>}
              description={<>The <Code>location.changeSettings(distanceFilter: 20)</Code> call that had been commented out in <Code>home_controller.dart</Code> was restored. Background location accuracy was also lowered to <Code>LocationAccuracy.balanced</Code> while backgrounded.</>}
            />
          </div>

          <Callout variant="done" icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}>
            <strong className="text-green-500">Validation:</strong> All Phase 1 changes were tested in the Jamboride
            staging environment for one week prior to production deployment. API call volume telemetry confirmed a
            measured reduction consistent with projections before the production release.
          </Callout>
        </section>

        {/* ── Section 4 ── */}
        <section id="s4" className="scroll-mt-24">
          <SectionHeader number="04" title="Refactored Architecture Proposal" badge="Phase 2–3" badgeVariant="next" />

          <p className="text-[14px] text-muted-foreground leading-relaxed mb-6">
            The core architectural change is to move all Google API calls from mobile clients to a backend service.
            Mobile apps should only communicate with your own backend, which acts as a smart proxy with caching,
            deduplication, and cost controls.
          </p>

          <h3 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-4 mt-8">
            Key Architecture Principles
          </h3>
          <div className="space-y-2.5">
            {[
              {
                bold: "Mobile → Your Backend only.",
                text: "Apps never call google.com directly. All Maps/Directions/Places calls are proxied through your backend.",
              },
              {
                bold: "Backend → Redis cache → Google APIs.",
                text: "Every route, ETA, and place result is cached in Redis. Repeated requests return cached data.",
              },
              {
                bold: "Location via WebSocket, not Firestore polling.",
                text: "Driver location updates are broadcast over WebSocket. No Firestore document write per update; no downstream read cascade.",
              },
              {
                bold: "Route calculated once per order.",
                text: "At order acceptance, the Route Service computes and stores the full polyline — trimmed client-side during the trip. API only called again on deviation.",
              },
              {
                bold: "Dispatch uses PostGIS geospatial queries.",
                text: "Finding nearby drivers uses a PostgreSQL + PostGIS radius query — not Firestore geohash queries.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 rounded-xl border border-border/50 px-4 py-3.5 bg-card/30 hover:border-border/80 transition-colors">
                <ChevronRight className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
                <p className="text-[13.5px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{item.bold}</strong> {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5 ── */}
        <section id="s5" className="scroll-mt-24">
          <SectionHeader number="05" title="Firebase Evaluation" badge="Hybrid Recommended" badgeVariant="next" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            <div className="rounded-xl border border-green-500/20 p-5 bg-green-500/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-500/15 text-green-500">
                  Pros
                </span>
                <span className="text-[13px] font-semibold text-foreground">Where Firebase works well</span>
              </div>
              <ul className="space-y-2 text-[13px] text-muted-foreground">
                {[
                  "Real-time order status updates (Firestore listeners)",
                  "Firebase Auth — battle-tested, phone number OTP",
                  "Firebase Storage — driver document uploads",
                  "FCM push notifications — reliable, cross-platform",
                  "Fast initial deployment — no backend infra to manage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-destructive/20 p-5 bg-destructive/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                  Cons
                </span>
                <span className="text-[13px] font-semibold text-foreground">Where Firebase is hurting you</span>
              </div>
              <ul className="space-y-2 text-[13px] text-muted-foreground">
                {[
                  "Firestore pricing is per read/write — architecture writes thousands per ride",
                  "No server-side logic — business rules embedded in mobile apps",
                  "No native geospatial queries (geoflutterfire is a workaround)",
                  "Vendor lock-in — hard to migrate once data is in Firestore",
                  "Real-time listeners at scale create connection storm",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-3">
            Recommendation: Hybrid Architecture
          </h3>
          <Callout variant="done" icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}>
            <strong className="text-green-500">Keep Firebase for:</strong> Auth (phone OTP), FCM push notifications,
            and Firebase Storage for document uploads.
            <br /><br />
            <strong className="text-green-500">Replace with custom backend for:</strong> All location updates, ride
            matching, route calculations, order management, and real-time position streaming.
          </Callout>
        </section>

        {/* ── Section 6 ── */}
        <section id="s6" className="scroll-mt-24">
          <SectionHeader number="06" title="Cost Reduction Estimate" badge="Projected" badgeVariant="next" />

          <Table
            headers={["Optimization Action", "Affected Cost", "Estimated Reduction"]}
            rows={[
              [<span key="r1"><span className="text-green-500 mr-1.5">✓</span><strong>Fix distanceFilter 1→8m + stop duplicate location stack</strong></span>, "Firestore writes, downstream Directions calls", "~40–50%"],
              [<span key="r2"><span className="text-green-500 mr-1.5">✓</span><strong>Fix zombie listeners + store & cancel subscriptions</strong></span>, "Firestore reads, Directions API calls per trip", "~15–25%"],
              [<span key="r3"><span className="text-green-500 mr-1.5">✓</span><strong>Polyline trimming instead of Directions recalculation</strong></span>, "Directions API calls during trip", "~70–85% of in-trip calls"],
              [<span key="r4"><span className="text-green-500 mr-1.5">✓</span><strong>Debounce autocomplete + cache nearby places</strong></span>, "Places Autocomplete + Nearby Search calls", "~60–80%"],
              ["Move route calculation to backend with Redis cache", "All Directions API calls (shared cache)", "~50–70% additional"],
              ["Replace Firestore location tracking with WebSocket", "Firestore reads + writes (largest Firebase cost)", "~85–95%"],
              [<strong key="total">Total (full implementation)</strong>, "Google Maps APIs + Firebase", <strong key="pct" className="text-green-500">60–75% overall reduction</strong>],
            ]}
            highlightLast
          />

          <Callout variant="done" icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}>
            <strong className="text-green-500">Phase 1 quick wins (already implemented):</strong> Fixing distanceFilter,
            zombie listeners, polyline trimming, and debouncing reduced API costs by approximately{" "}
            <strong className="text-foreground">45–55%</strong> with changes only to Flutter code — no new
            infrastructure required.
          </Callout>
        </section>

        {/* ── Section 7 ── */}
        <section id="s7" className="scroll-mt-24">
          <SectionHeader number="07" title="Recommended Backend Stack" badge="Phase 2–3" badgeVariant="next" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
            <StackCard
              tech="NestJS (Node.js)"
              description="TypeScript-first, modular architecture with dependency injection. Ideal for domain-driven ride-hailing services (RideModule, DriverModule, RouteModule). Built-in WebSocket gateway via Socket.io adapter."
            />
            <StackCard
              tech="PostgreSQL + PostGIS"
              description={<><Code>ST_DWithin()</Code> replaces all geoflutterfire-based driver-finding logic. Full ACID compliance for order lifecycle. Far cheaper at scale than Firestore per-read pricing.</>}
            />
            <StackCard
              tech="Redis"
              description="Cache Google API responses — polylines, ETAs, place results — with TTL. Pub/Sub channel for driver location broadcast. Eliminates Firestore as the location pipe entirely."
            />
            <StackCard
              tech="Socket.io (WebSocket)"
              description="Replace Firestore real-time listeners. Driver emits position every 5 seconds → server broadcasts to customer's room. No per-message database write; horizontal scalability via Redis adapter."
            />
            <StackCard
              tech="Bull / BullMQ (Job Queue)"
              description="Queue for: route pre-computation, notifications, trip receipt processing, and fare calculation. Decouples latency-sensitive APIs from background work. Retries on Google API failures."
            />
            <StackCard
              tech="Google Maps Platform (via backend only)"
              description={<>Called exclusively from the Route Service. <Code>RouteCache</Code> module: key = SHA256(origin+destination), TTL = 24h. Use Maps Routes API v2 (cheaper than legacy Directions API).</>}
            />
          </div>

          <CodeBlock copyKey="s7-structure">{`src/
├── modules/
│   ├── rides/          # Order lifecycle (create, accept, complete)
│   ├── drivers/        # Driver state, location, matching
│   ├── routes/         # Route calculation + Redis cache layer
│   ├── location/       # WebSocket gateway + Redis pub/sub
│   ├── places/         # Autocomplete + nearby, cached
│   └── notifications/  # FCM wrapper
├── common/
│   ├── guards/         # Firebase Auth token verification
│   ├── interceptors/   # Logging, error normalization
│   └── pipes/          # Validation
└── infra/
    ├── redis/          # Redis module (cache + pub/sub)
    └── maps/           # Google Maps SDK wrapper + caching`}</CodeBlock>
        </section>

        {/* ── Section 8 ── */}
        <section id="s8" className="scroll-mt-24">
          <SectionHeader number="08" title="Implementation & Migration Plan" badge="Active" badgeVariant="next" />

          {/* Phase 1 */}
          <div className="border-l-2 border-destructive pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-destructive mb-1">
              Phase 1 · Weeks 1–2 · Flutter Only · Complete
            </div>
            <h4 className="text-[17px] font-semibold text-foreground mb-3">Quick Wins — 45–55% cost reduction achieved</h4>
            <Callout variant="done" icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}>
              All seven Phase 1 steps have been completed and deployed to production. See Section 03 for the full
              breakdown of what was implemented and the validation process.
            </Callout>
          </div>

          {/* Phase 2 */}
          <div className="border-l-2 border-primary pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-primary mb-1">
              Phase 2 · Weeks 3–8 · Backend API Layer
            </div>
            <h4 className="text-[17px] font-semibold text-foreground mb-3">
              Centralise all Google API calls — ~60–65% total reduction
            </h4>
            <ol className="space-y-2 text-[13.5px] text-muted-foreground list-decimal list-inside leading-relaxed mb-3">
              <li>Stand up NestJS backend with PostgreSQL + PostGIS and Redis.</li>
              <li>Implement <Code>RoutesModule</Code> — proxy for Directions API with Redis cache (TTL 24h per origin/destination pair).</li>
              <li>Implement <Code>PlacesModule</Code> — proxy for Autocomplete and Nearby Search with per-query Redis cache (TTL 15min).</li>
              <li>Update Flutter apps to call your backend route/places endpoints instead of Google APIs directly.</li>
              <li>Implement <Code>LocationModule</Code> with Socket.io WebSocket gateway.</li>
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
            <div className="font-mono text-[9px] tracking-widest uppercase text-green-500 mb-1">
              Phase 3 · Weeks 9–16 · Full Architecture Migration
            </div>
            <h4 className="text-[17px] font-semibold text-foreground mb-3">
              Complete Firebase replacement for operational data — ~70–75% total reduction
            </h4>
            <ol className="space-y-2 text-[13.5px] text-muted-foreground list-decimal list-inside leading-relaxed mb-3">
              <li>Migrate order and trip data from Firestore to PostgreSQL with migration script.</li>
              <li>Implement driver matching via PostGIS <Code>ST_DWithin()</Code>. Remove all geoflutterfire queries.</li>
              <li>Implement BullMQ job queue for: trip fare calculation, receipt generation, payout processing.</li>
              <li>Keep Firebase Auth (phone OTP) + FCM + Storage — these remain cost-effective.</li>
              <li>Decommission Firestore collections: orders, driver_users location fields.</li>
              <li>Implement monitoring: Prometheus + Grafana dashboard.</li>
            </ol>
            <Callout>
              <strong className="text-foreground">Risk:</strong> Medium-High. Run parallel writes (PostgreSQL +
              Firestore) for 4 weeks before cutting over reads. Maintain rollback scripts.
            </Callout>
          </div>

          <h3 className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-3 mt-8">
            Risk Register
          </h3>
          <Table
            headers={["Risk", "Probability", "Mitigation"]}
            rows={[
              ["Location accuracy degradation with higher distanceFilter", "Low", "Validated in Phase 1 staging. Filter of 5–8m is imperceptible to users."],
              ["WebSocket reconnection on mobile network switching", "Medium", "Implement exponential backoff reconnect in Flutter."],
              ["Redis cache stale routes (road closures)", "Low", "Use short TTL (2h) for high-traffic corridors. Driver deviation triggers cache invalidation."],
              ["Increased backend infrastructure cost", "Low–Medium", "NestJS + PostgreSQL + Redis on a $40/month VPS handles thousands of concurrent rides."],
            ]}
          />
        </section>

        {/* End note */}
        <div className="border-t border-border/40 pt-10 flex flex-col items-center gap-3 print:hidden">
          <Image
            src="/images/optin-logo.webp"
            alt="Optin Technology Limited"
            width={100}
            height={30}
            className="h-6 w-auto opacity-30"
          />
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/30">
            End of Report · Optin Digital Solutions Ltd · April 2026
          </p>
        </div>
      </div>
    </div>
  )
}
