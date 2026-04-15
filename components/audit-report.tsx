"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Download,
  Lock,
  ExternalLink,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Section data types
interface Section {
  id: string
  number: string
  title: string
  badge: {
    text: string
    variant: "critical" | "done" | "next" | "future"
  }
}

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

const badgeVariants = {
  critical: "bg-ember/15 text-[#f4906e] border-ember/25",
  done: "bg-ok/15 text-[#4fd490] border-ok/25",
  next: "bg-gold-dim text-gold2 border-border-gold",
  future: "bg-info/10 text-[#79bfff] border-info/20",
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
    <pre className={cn(
      "bg-[#0d1510] border border-border-light rounded-lg p-5 overflow-x-auto font-mono text-xs leading-relaxed text-[#a8c4a0]",
      className
    )}>
      {children}
    </pre>
  )
}

function Callout({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "danger" | "done" }) {
  return (
    <div className={cn(
      "border-l-2 rounded-r-lg p-4 text-sm leading-relaxed",
      variant === "default" && "border-gold bg-gold-dim/60 text-surface/65",
      variant === "danger" && "border-ember bg-ember/7 text-surface/65",
      variant === "done" && "border-ok bg-ok/7 text-surface/65",
    )}>
      {children}
    </div>
  )
}

function StepDone({ title, description }: { title: React.ReactNode; description: string }) {
  return (
    <div className="flex gap-4 py-4 border-b border-border-light last:border-b-0">
      <div className="w-6 h-6 rounded-full bg-ok/20 border border-ok/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle2 className="h-3.5 w-3.5 text-[#4fd490]" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-surface/85 mb-1">{title}</div>
        <div className="text-[13px] text-surface/45 leading-relaxed">{description}</div>
      </div>
    </div>
  )
}

function IssueCard({ title, pill, children }: { title: string; pill: { text: string; variant: "red" | "amber" | "green" | "blue" }; children: React.ReactNode }) {
  const pillStyles = {
    red: "bg-ember/15 text-[#f4906e]",
    amber: "bg-gold-dim text-gold2",
    green: "bg-ok/12 text-[#4fd490]",
    blue: "bg-info/12 text-[#79bfff]",
  }
  
  return (
    <Card className="bg-surface/3 border-border-light">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className={cn("font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full", pillStyles[pill.variant])}>
            {pill.text}
          </span>
          <span className="text-[13px] font-semibold text-surface/80">{title}</span>
        </div>
        <div className="text-[13.5px] text-surface/55 leading-relaxed">{children}</div>
      </CardContent>
    </Card>
  )
}

function StackCard({ tech, description }: { tech: string; description: React.ReactNode }) {
  return (
    <Card className="bg-surface/3 border-border-light hover:border-border-gold transition-colors">
      <CardContent className="p-5">
        <div className="font-bold text-sm text-surface/85 mb-1.5">{tech}</div>
        <div className="text-[12.5px] text-surface/40 leading-relaxed">{description}</div>
      </CardContent>
    </Card>
  )
}

export function AuditReport() {
  const [activeSection, setActiveSection] = useState("s1")

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="w-full">
      {/* Print Strip */}
      <div className="bg-gold-dim/60 border-b border-border-gold px-8 py-2.5 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-gold/60">
        <span>Prepared by Optin Digital Solutions Ltd - optin.co.tz</span>
        <span className="text-gold">Client: Jamboride - April 2026</span>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-10 max-w-[900px] mx-auto">
        <div className="absolute top-0 right-[-20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,162,39,0.06)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-widest uppercase text-gold mb-6">
          <span>Technical Audit Report - April 2026</span>
          <div className="flex-1 h-px bg-border-gold max-w-[120px]" />
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-surface mb-3.5">
          Jamboride<br />
          Architecture & <em className="italic text-gold">Cost</em><br />
          Optimization Audit
        </h1>
        
        <p className="text-[15px] text-surface/40 font-mono tracking-wide mb-12">
          Flutter - Firebase - Google Maps / Directions APIs
        </p>
        
        {/* Meta Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-border-light rounded-[14px] overflow-hidden bg-surface/2">
          <div className="p-5 border-r border-border-light">
            <label className="font-mono text-[9px] tracking-widest uppercase text-surface/25 block mb-1.5">Scope</label>
            <span className="text-[13px] text-surface/70 font-medium">Customer App & Driver App (Flutter)</span>
          </div>
          <div className="p-5 border-r border-border-light">
            <label className="font-mono text-[9px] tracking-widest uppercase text-surface/25 block mb-1.5">Backend</label>
            <span className="text-[13px] text-surface/70 font-medium">Firebase (Firestore + Auth + Storage)</span>
          </div>
          <div className="p-5 border-r border-border-light">
            <label className="font-mono text-[9px] tracking-widest uppercase text-surface/25 block mb-1.5">Maps Stack</label>
            <span className="text-[13px] text-surface/70 font-medium">Google Maps, Directions, Distance Matrix, Places</span>
          </div>
          <div className="p-5">
            <label className="font-mono text-[9px] tracking-widest uppercase text-surface/25 block mb-1.5">Audited By</label>
            <span className="text-[13px] text-surface/70 font-medium">Optin Digital Solutions Ltd</span>
          </div>
        </div>
      </section>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-gold">
        <div className="p-5 sm:p-6 border-r border-black/12 text-void">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">8</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Critical Issues Found</div>
        </div>
        <div className="p-5 sm:p-6 border-r border-black/12 text-void">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">~65%</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Estimated API Cost Reduction</div>
        </div>
        <div className="p-5 sm:p-6 border-r border-black/12 text-void">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">5</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Google API Endpoints Audited</div>
        </div>
        <div className="p-5 sm:p-6 text-void">
          <div className="font-serif text-3xl sm:text-4xl font-black leading-none tracking-tight">3</div>
          <div className="font-mono text-[9px] tracking-wider uppercase opacity-65 mt-1.5">Migration Phases Planned</div>
        </div>
      </div>

      {/* Body Content */}
      <div className="max-w-[900px] mx-auto px-10 py-16">
        {/* Table of Contents */}
        <Card className="bg-surface/2 border-border-light rounded-[14px] mb-14">
          <CardContent className="p-7">
            <div className="font-mono text-[9px] tracking-widest uppercase text-surface/25 mb-4">Table of Contents</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left text-[13px] text-surface/55 hover:text-gold transition-colors leading-snug flex items-center gap-2"
                >
                  <span className="font-mono text-[10px] text-gold/70">{section.number} —</span>
                  {section.title}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Root Cause Analysis */}
        <section id="s1" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">01</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Root Cause Analysis (Code-Level)</h2>
            <SectionBadge text="8 Issues" variant="critical" />
          </div>

          <p className="text-[14.5px] text-surface/60 leading-relaxed mb-6">
            After a full read of both codebases — specifically <code className="font-mono text-xs bg-surface/6 border border-surface/8 rounded px-1.5 py-0.5 text-gold2">home_controller.dart</code>, <code className="font-mono text-xs bg-surface/6 border border-surface/8 rounded px-1.5 py-0.5 text-gold2">live_tracking_controller.dart</code>, <code className="font-mono text-xs bg-surface/6 border border-surface/8 rounded px-1.5 py-0.5 text-gold2">fire_store_utils.dart</code>, and all controller classes — the following systemic issues were identified as driving the majority of API cost.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="issue-1" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-ember flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <Callout variant="danger">
                  <strong className="text-surface/85">Critical.</strong> Both apps set <code className="font-mono text-xs text-gold2">distanceFilter: 1</code> with <code className="font-mono text-xs text-gold2">accuracy: LocationAccuracy.bestForNavigation</code>. At GPS accuracy of ~3–5m, this fires a location event every 1 meter of movement, producing up to 5,000 location ticks per hour at 90 km/h. Every tick triggers a Firestore <code className="font-mono text-xs text-gold2">update()</code> write and — during active trips — a potential route recalculation.
                </Callout>
                <CodeBlock className="mt-4">
                  <span className="text-[#4a5e48]">{"// DRIVER — home_controller.dart:518"}</span>{"\n"}
                  <span className="text-[#4a5e48]">{"// CUSTOMER — home_controller.dart:1391"}</span>{"\n"}
                  {"Geolocator.getPositionStream(\n"}
                  {"  locationSettings: "}<span className="text-[#e8a030]">const</span>{" LocationSettings(\n"}
                  {"    accuracy: LocationAccuracy.bestForNavigation,\n"}
                  {"    distanceFilter: "}<span className="text-[#d98877]">1</span>{",  "}<span className="text-[#4a5e48]">{"// ← fires every 1 metre !!!"}</span>{"\n"}
                  {"  ),\n"}
                  {")"}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-2" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-ember flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 2 — Directions API Called on Every Firebase Snapshot</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <Callout variant="danger">
                  <strong className="text-surface/85">Critical.</strong> Both <code className="font-mono text-xs text-gold2">LiveTrackingController.getPolyline()</code> (customer) and the driver&apos;s equivalent call <code className="font-mono text-xs text-gold2">polylinePoints.getRouteBetweenCoordinates()</code> — which hits the Google Directions API — <em>inside a Firestore snapshot listener</em>. The driver document is updated continuously (see Issue 1), so every location write causes both apps to independently call the Directions API.
                </Callout>
                <p className="text-[14px] text-surface/60 leading-relaxed mt-4">
                  With <code className="font-mono text-xs text-gold2">distanceFilter: 1</code>, a 10-minute ride at 50 km/h produces ~833 snapshot events. Both apps call Directions API on each: <strong className="text-surface/85">~1,666 Directions API calls per trip</strong>. At $0.005/call, that&apos;s $8.33 per ride in Directions costs alone.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-3" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-surface/60 leading-relaxed">
                  Both apps implement a <code className="font-mono text-xs text-gold2">shouldReRoute()</code> guard that allows a new Directions API call every 20 meters of driver movement. At 50 km/h, the driver crosses 20m every 1.44 seconds — triggering a route refresh every ~1.5 seconds throughout the trip.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-4" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-ember flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 4 — Duplicate Location Tracking Stack</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-surface/60 leading-relaxed">
                  The Driver app runs <em>two simultaneous location stacks</em>: <code className="font-mono text-xs text-gold2">Geolocator.getPositionStream()</code> and <code className="font-mono text-xs text-gold2">location.onLocationChanged.listen()</code> — both running concurrently. Every physical movement triggers <em>two</em> Firestore writes and two downstream cascades, directly doubling all location-related costs.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-5" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-ember flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 5 — Nested Firestore Listeners (Memory Leaks)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-surface/60 leading-relaxed mb-4">
                  The inner listener is opened inside the outer listener&apos;s callback with no reference stored. After 5 minutes of a trip, there are dozens of orphaned listeners all calling <code className="font-mono text-xs text-gold2">getPolyline()</code> simultaneously.
                </p>
                <CodeBlock>
                  <span className="text-[#4a5e48]">{"// live_tracking_controller.dart — same pattern in BOTH apps"}</span>{"\n"}
                  {"FirebaseFirestore.instance.collection("}<span className="text-[#6aaa7a]">{`'orders'`}</span>{").doc(orderId)\n"}
                  {"  ."}<span className="text-[#78b8dc]">snapshots</span>{"()."}<span className="text-[#78b8dc]">listen</span>{"((orderEvent) {\n"}
                  {"    "}<span className="text-[#4a5e48]">{"// Inner listener opened on EVERY outer event — never cancelled!"}</span>{"\n"}
                  {"    FirebaseFirestore.instance.collection("}<span className="text-[#6aaa7a]">{`'driver_users'`}</span>{").doc(driverId)\n"}
                  {"      ."}<span className="text-[#78b8dc]">snapshots</span>{"()."}<span className="text-[#78b8dc]">listen</span>{"((driverEvent) {\n"}
                  {"        "}<span className="text-[#78b8dc]">getPolyline</span>{"(...);  "}<span className="text-[#4a5e48]">{"// ← Directions API every write"}</span>{"\n"}
                  {"      });\n"}
                  {"  });"}
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-6" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 6 — Places Autocomplete + Distance Matrix on Every Keystroke</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-surface/60 leading-relaxed">
                  The customer&apos;s destination search calls both the Places Autocomplete API and Distance Matrix API on every character typed, with no debounce. Typing &quot;Dar es Salaam Airport&quot; (19 chars) fires 19 Autocomplete + 19 Distance Matrix calls.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-7" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 7 — Nearby Places API Called on Every App Open</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-[14px] text-surface/60 leading-relaxed">
                  On home screen load, <code className="font-mono text-xs text-gold2">fetchNearbyPlacesWhere()</code> fires a Nearby Search + Distance Matrix immediately, with no caching. Every time a user opens the app, these calls are made regardless of whether their location has changed.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="issue-8" className="border border-border-light rounded-lg px-4 bg-surface/2">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
                  <span className="font-medium text-surface text-sm">Issue 8 — Background Location Mode Always Enabled</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <CodeBlock>
                  <span className="text-[#4a5e48]">{"// driver/home_controller.dart:2040"}</span>{"\n"}
                  {"location."}<span className="text-[#78b8dc]">enableBackgroundMode</span>{"(enable: "}<span className="text-[#e8a030]">true</span>{");\n"}
                  <span className="text-[#4a5e48]">{"// distanceFilter is commented out — updates Firestore continuously:"}</span>{"\n"}
                  <span className="text-[#4a5e48]">{"// location.changeSettings(accuracy: LocationAccuracy.high, distanceFilter: 3);"}</span>
                </CodeBlock>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Section 2: Code & Architecture Weaknesses */}
        <section id="s2" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">02</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Code & Architecture Weaknesses</h2>
            <SectionBadge text="Systemic" variant="critical" />
          </div>

          <div className="space-y-4 mb-8">
            <IssueCard title="Unconditional real-time listeners on frequently-written documents" pill={{ text: "High Cost", variant: "red" }}>
              The <code className="font-mono text-xs text-gold2">driver_users</code> document is written to on every location update. Both apps attach <code className="font-mono text-xs text-gold2">.snapshots().listen()</code> to this document. Firestore charges a read for every snapshot event. With <code className="font-mono text-xs text-gold2">distanceFilter: 1</code>, a 20-minute trip produces ~1,000+ document reads per listener — and there are multiple listeners on the same document.
            </IssueCard>

            <IssueCard title="Unmanaged StreamSubscriptions leading to zombie listeners" pill={{ text: "Memory Leak", variant: "red" }}>
              Inner <code className="font-mono text-xs text-gold2">StreamSubscription</code> objects created inside outer listener callbacks are never stored in a variable. They cannot be <code className="font-mono text-xs text-gold2">cancel()</code>-ed in <code className="font-mono text-xs text-gold2">onClose()</code>, creating permanent memory leaks and duplicate API calls that compound over a trip&apos;s duration.
            </IssueCard>

            <IssueCard title="Mobile apps make all Google API calls directly — no shared cache" pill={{ text: "Architecture", variant: "amber" }}>
              Every mobile client calls Maps/Directions/Places APIs independently. There is no shared caching layer, no rate limiting, and no opportunity to deduplicate — e.g., if 50 customers are all near the same area, each makes their own independent Nearby Search call for the same data.
            </IssueCard>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-surface/75 mb-4 mt-8">Scalability Projection</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-surface/2">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Issue</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Current Behaviour</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">At Scale (1,000 concurrent rides)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Location writes per second</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~1 write/sec per driver</td>
                  <td className="p-3 border-b border-border-light text-surface/55">1,000 writes/sec - Firestore hot spots</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Directions API calls per trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~800–1,600 calls/trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Hitting Maps API daily quotas instantly</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Firestore reads per trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~2,000–4,000 reads/trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Firebase costs scale linearly, no bulk discount</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 text-surface/55">Nearby search caching</td>
                  <td className="p-3 text-surface/55">None — per app open</td>
                  <td className="p-3 text-surface/55">1,000 app opens = 1,000 redundant API calls</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Steps Taken — Phase 1 Complete */}
        <section id="s3" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">03</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Steps Taken — Phase 1 Complete</h2>
            <SectionBadge text="Done" variant="done" />
          </div>

          <Callout variant="done">
            <strong className="text-[#7dd4a8]">Phase 1 has been successfully completed.</strong> All quick-win Flutter-only fixes have been implemented and deployed. The changes below were made directly to the customer and driver codebases with no infrastructure changes required. Estimated impact: <strong className="text-surface/85">45–55% reduction in API and Firestore costs</strong> from these changes alone.
          </Callout>

          <div className="mt-6">
            <StepDone 
              title={<>Corrected <code className="font-mono text-xs text-gold2">distanceFilter</code> values across both apps</>}
              description="Changed from distanceFilter: 1 to adaptive values: 15m when idle, 8m en-route to pickup, and 5m during active trip navigation. Both customer and driver apps updated. This single change accounts for an estimated 40–50% reduction in location writes and downstream API cascades."
            />
            <StepDone 
              title="Removed the duplicate location tracking stack in Driver app"
              description="The location.onLocationChanged.listen() block inside enableLocationServices() was removed entirely. All location handling is now consolidated into the single Geolocator.getPositionStream() in startTrackingDriver(). This eliminated a full doubling of all location-related Firestore writes and downstream costs."
            />
            <StepDone 
              title="Stored and cancelled all StreamSubscriptions — zombie listeners eliminated"
              description="All .listen() calls were audited across both codebases. Every subscription is now assigned to a named StreamSubscription? variable and cancelled in onClose(). Nested listeners were refactored to flat, parallel subscriptions. The inner subscription leak in live_tracking_controller.dart was fixed in both apps."
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
              title={<>Re-enabled background location <code className="font-mono text-xs text-gold2">distanceFilter: 20</code> in Driver app</>}
              description="The location.changeSettings(distanceFilter: 20) call that had been commented out in home_controller.dart was restored. Background location accuracy was also lowered to LocationAccuracy.balanced while backgrounded."
            />
          </div>

          <Callout variant="done" >
            <strong className="text-[#7dd4a8]">Validation:</strong> All Phase 1 changes were tested in the Jamboride staging environment for one week prior to production deployment. API call volume telemetry confirmed a measured reduction consistent with projections before the production release.
          </Callout>
        </section>

        {/* Section 4: Refactored Architecture Proposal */}
        <section id="s4" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">04</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Refactored Architecture Proposal</h2>
            <SectionBadge text="Phase 2-3" variant="next" />
          </div>

          <p className="text-[14.5px] text-surface/60 leading-relaxed mb-6">
            The core architectural change is to move all Google API calls from mobile clients to a backend service. Mobile apps should only communicate with your own backend, which acts as a smart proxy with caching, deduplication, and cost controls.
          </p>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-surface/75 mb-4 mt-8">Key Architecture Principles</h3>
          <ul className="space-y-3 text-[13.5px] text-surface/55 leading-relaxed pl-5">
            <li className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold/50">
              <strong className="text-surface/80">Mobile → Your Backend only.</strong> Apps never call google.com directly. All Maps/Directions/Places calls are proxied through your backend.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold/50">
              <strong className="text-surface/80">Backend → Redis cache → Google APIs.</strong> Every route, ETA, and place result is cached in Redis. Repeated requests return cached data.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold/50">
              <strong className="text-surface/80">Location via WebSocket, not Firestore polling.</strong> Driver location updates are broadcast over WebSocket. No Firestore document write per update; no downstream read cascade.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold/50">
              <strong className="text-surface/80">Route calculated once per order.</strong> At order acceptance, the Route Service computes and stores the full polyline — trimmed client-side during the trip.
            </li>
            <li className="relative before:content-[''] before:absolute before:left-[-15px] before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-gold/50">
              <strong className="text-surface/80">Dispatch uses PostGIS geospatial queries.</strong> Finding nearby drivers uses a PostgreSQL + PostGIS radius query — not Firestore geohash queries.
            </li>
          </ul>
        </section>

        {/* Section 5: Firebase Evaluation */}
        <section id="s5" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">05</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Firebase Evaluation</h2>
            <SectionBadge text="Hybrid Recommended" variant="next" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-surface/3 border-border-light">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-ok/12 text-[#4fd490]">Pros</span>
                  <span className="text-[13px] font-semibold text-surface/80">Where Firebase works well</span>
                </div>
                <ul className="space-y-2 text-[13.5px] text-surface/55">
                  <li>Real-time order status updates (Firestore listeners)</li>
                  <li>Firebase Auth — battle-tested, phone number OTP works well</li>
                  <li>Firebase Storage — driver document uploads</li>
                  <li>FCM push notifications — reliable, cross-platform</li>
                  <li>Fast initial deployment — no backend infra to manage</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-surface/3 border-border-light">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[9.5px] tracking-wider uppercase px-2 py-0.5 rounded-full bg-ember/15 text-[#f4906e]">Cons</span>
                  <span className="text-[13px] font-semibold text-surface/80">Where Firebase is hurting you</span>
                </div>
                <ul className="space-y-2 text-[13.5px] text-surface/55">
                  <li>Firestore pricing is per read/write — architecture writes thousands per ride</li>
                  <li>No server-side logic — business rules embedded in mobile apps</li>
                  <li>No native geospatial queries (geoflutterfire is a workaround)</li>
                  <li>Vendor lock-in — hard to migrate once data is in Firestore</li>
                  <li>Real-time listeners at scale create connection storm</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-surface/75 mb-4">Recommendation: Hybrid Architecture</h3>
          <Callout variant="done">
            <strong className="text-[#7dd4a8]">Keep Firebase for:</strong> Auth (phone OTP), FCM push notifications, and Firebase Storage for document uploads.<br /><br />
            <strong className="text-[#7dd4a8]">Replace with custom backend for:</strong> All location updates, ride matching, route calculations, order management, and real-time position streaming.
          </Callout>
        </section>

        {/* Section 6: Cost Reduction Estimate */}
        <section id="s6" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">06</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Cost Reduction Estimate</h2>
            <SectionBadge text="Projected" variant="next" />
          </div>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-surface/2">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Optimization Action</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Affected Cost</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Estimated Reduction</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/80 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#4fd490] inline mr-2" />
                    Fix distanceFilter 1→8m + stop duplicate location stack
                  </td>
                  <td className="p-3 border-b border-border-light text-surface/55">Firestore writes, downstream Directions calls</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~40–50%</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/80 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#4fd490] inline mr-2" />
                    Fix zombie listeners + store & cancel subscriptions
                  </td>
                  <td className="p-3 border-b border-border-light text-surface/55">Firestore reads, Directions API calls per trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~15–25%</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/80 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#4fd490] inline mr-2" />
                    Polyline trimming instead of Directions recalculation
                  </td>
                  <td className="p-3 border-b border-border-light text-surface/55">Directions API calls during trip</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~70–85% of in-trip calls</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/80 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-[#4fd490] inline mr-2" />
                    Debounce autocomplete + cache nearby places
                  </td>
                  <td className="p-3 border-b border-border-light text-surface/55">Places Autocomplete + Nearby Search calls</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~60–80%</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Move route calculation to backend with Redis cache</td>
                  <td className="p-3 border-b border-border-light text-surface/55">All Directions API calls (shared cache)</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~50–70% additional</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Replace Firestore location tracking with WebSocket</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Firestore reads + writes (largest Firebase cost)</td>
                  <td className="p-3 border-b border-border-light text-surface/55">~85–95%</td>
                </tr>
                <tr className="bg-ok/6 border-l-2 border-ok">
                  <td className="p-3 font-bold text-[#4fd490]">Total (full implementation)</td>
                  <td className="p-3 font-bold text-[#4fd490]">Google Maps APIs + Firebase</td>
                  <td className="p-3 font-bold text-[#4fd490]">60–75% overall reduction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout variant="done">
            <strong className="text-[#7dd4a8]">Phase 1 quick wins (already implemented):</strong> Fixing distanceFilter, zombie listeners, polyline trimming, and debouncing reduced API costs by approximately <strong className="text-surface/85">45–55%</strong> with changes only to Flutter code — no new infrastructure required.
          </Callout>
        </section>

        {/* Section 7: Recommended Backend Stack */}
        <section id="s7" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">07</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Recommended Backend Stack</h2>
            <SectionBadge text="Phase 2-3" variant="next" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StackCard 
              tech="NestJS (Node.js)"
              description={<>TypeScript-first, modular architecture with dependency injection. Ideal for domain-driven ride-hailing services (RideModule, DriverModule, RouteModule). Built-in WebSocket gateway via Socket.io adapter.</>}
            />
            <StackCard 
              tech="PostgreSQL + PostGIS"
              description={<><code className="font-mono text-xs text-gold2">ST_DWithin()</code> replaces all geoflutterfire-based driver-finding logic. Full ACID compliance for order lifecycle. Far cheaper at scale than Firestore per-read pricing.</>}
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
              description={<>Called exclusively from the Route Service. <code className="font-mono text-xs text-gold2">RouteCache</code> module: key = SHA256(origin+destination), TTL = 24h. Use Maps Routes API v2 (cheaper than legacy Directions API).</>}
            />
          </div>

          <CodeBlock className="mt-6">
            {"src/\n"}
            {"├── "}<span className="text-[#78b8dc]">modules</span>{"/ \n"}
            {"│   ├── "}<span className="text-[#e8a030]">rides</span>{"/          "}<span className="text-[#4a5e48]"># Order lifecycle (create, accept, complete)</span>{"\n"}
            {"│   ├── "}<span className="text-[#e8a030]">drivers</span>{"/        "}<span className="text-[#4a5e48]"># Driver state, location, matching</span>{"\n"}
            {"│   ├── "}<span className="text-[#e8a030]">routes</span>{"/         "}<span className="text-[#4a5e48]"># Route calculation + Redis cache layer</span>{"\n"}
            {"│   ├── "}<span className="text-[#e8a030]">location</span>{"/       "}<span className="text-[#4a5e48]"># WebSocket gateway + Redis pub/sub</span>{"\n"}
            {"│   ├── "}<span className="text-[#e8a030]">places</span>{"/         "}<span className="text-[#4a5e48]"># Autocomplete + nearby, cached</span>{"\n"}
            {"│   └── "}<span className="text-[#e8a030]">notifications</span>{"/ "}<span className="text-[#4a5e48]"># FCM wrapper</span>{"\n"}
            {"├── "}<span className="text-[#78b8dc]">common</span>{"/ \n"}
            {"│   ├── "}<span className="text-[#e8a030]">guards</span>{"/         "}<span className="text-[#4a5e48]"># Firebase Auth token verification</span>{"\n"}
            {"│   ├── "}<span className="text-[#e8a030]">interceptors</span>{"/   "}<span className="text-[#4a5e48]"># Logging, error normalization</span>{"\n"}
            {"│   └── "}<span className="text-[#e8a030]">pipes</span>{"/          "}<span className="text-[#4a5e48]"># Validation</span>{"\n"}
            {"└── "}<span className="text-[#78b8dc]">infra</span>{"/ \n"}
            {"    ├── "}<span className="text-[#e8a030]">redis</span>{"/          "}<span className="text-[#4a5e48]"># Redis module (cache + pub/sub)</span>{"\n"}
            {"    └── "}<span className="text-[#e8a030]">maps</span>{"/           "}<span className="text-[#4a5e48]"># Google Maps SDK wrapper + caching</span>
          </CodeBlock>
        </section>

        {/* Section 8: Implementation & Migration Plan */}
        <section id="s8" className="mb-16">
          <div className="flex items-center gap-4 mb-7 pb-4 border-b border-border-light">
            <span className="font-mono text-[10px] text-gold tracking-wider">08</span>
            <h2 className="font-serif text-xl sm:text-[22px] font-bold tracking-tight text-surface">Implementation & Migration Plan</h2>
            <SectionBadge text="Active" variant="next" />
          </div>

          {/* Phase 1 */}
          <div className="border-l-2 border-ember pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-ember mb-1">Phase 1 - Weeks 1–2 - Flutter Only - Complete</div>
            <h4 className="font-serif text-lg font-bold text-surface/85 mb-3">Quick Wins — 45–55% cost reduction achieved</h4>
            <Callout variant="done">
              All seven Phase 1 steps have been completed and deployed to production. See Section 03 for the full breakdown of what was implemented and the validation process.
            </Callout>
          </div>

          {/* Phase 2 */}
          <div className="border-l-2 border-gold pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-gold mb-1">Phase 2 - Weeks 3–8 - Backend API Layer</div>
            <h4 className="font-serif text-lg font-bold text-surface/85 mb-3">Centralise all Google API calls — ~60–65% total reduction</h4>
            <ol className="space-y-2 text-[13.5px] text-surface/55 list-decimal list-inside leading-relaxed">
              <li>Stand up NestJS backend with PostgreSQL + PostGIS and Redis.</li>
              <li>Implement <code className="font-mono text-xs text-gold2">RoutesModule</code> — proxy for Directions API with Redis cache (TTL 24h per origin/destination pair).</li>
              <li>Implement <code className="font-mono text-xs text-gold2">PlacesModule</code> — proxy for Autocomplete and Nearby Search with per-query Redis cache (TTL 15min).</li>
              <li>Update Flutter apps to call your backend route/places endpoints instead of Google APIs directly.</li>
              <li>Implement <code className="font-mono text-xs text-gold2">LocationModule</code> with Socket.io WebSocket gateway.</li>
              <li>Migrate order status updates from Firestore to WebSocket events.</li>
            </ol>
            <Callout>
              <strong className="text-surface/85">Risk:</strong> Medium. Keep Firebase Firestore as fallback for order status for 2 weeks during transition. A/B rollout: 10% of new rides use new backend, 90% continue on Firebase.
            </Callout>
          </div>

          {/* Phase 3 */}
          <div className="border-l-2 border-ok pl-6 mb-8">
            <div className="font-mono text-[9px] tracking-widest uppercase text-[#4fd490] mb-1">Phase 3 - Weeks 9–16 - Full Architecture Migration</div>
            <h4 className="font-serif text-lg font-bold text-surface/85 mb-3">Complete Firebase replacement for operational data — ~70–75% total reduction</h4>
            <ol className="space-y-2 text-[13.5px] text-surface/55 list-decimal list-inside leading-relaxed">
              <li>Migrate order and trip data from Firestore to PostgreSQL with migration script.</li>
              <li>Implement driver matching via PostGIS <code className="font-mono text-xs text-gold2">ST_DWithin()</code>. Remove all geoflutterfire queries.</li>
              <li>Implement BullMQ job queue for: trip fare calculation, receipt generation, payout processing.</li>
              <li>Keep Firebase Auth (phone OTP) + FCM + Storage — these remain cost-effective.</li>
              <li>Decommission Firestore collections: orders, driver_users location fields.</li>
              <li>Implement monitoring: Prometheus + Grafana dashboard.</li>
            </ol>
            <Callout>
              <strong className="text-surface/85">Risk:</strong> Medium-High. Run parallel writes (PostgreSQL + Firestore) for 4 weeks before cutting over reads. Maintain rollback scripts.
            </Callout>
          </div>

          <h3 className="font-mono text-[11px] tracking-wider uppercase text-surface/75 mb-4 mt-8">Risk Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="bg-surface/2">
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Risk</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Probability</th>
                  <th className="text-left font-mono text-[9.5px] uppercase tracking-wider text-surface/30 p-3 border-b border-border-light">Mitigation</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Location accuracy degradation with higher distanceFilter</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Low</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Validated in Phase 1 staging. Filter of 5–8m is imperceptible to users.</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">WebSocket reconnection on mobile network switching</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Medium</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Implement exponential backoff reconnect in Flutter.</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 border-b border-border-light text-surface/55">Redis cache stale routes (road closures)</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Low</td>
                  <td className="p-3 border-b border-border-light text-surface/55">Use short TTL (2h) for high-traffic corridors. Driver deviation triggers cache invalidation.</td>
                </tr>
                <tr className="hover:bg-surface/2">
                  <td className="p-3 text-surface/55">Increased backend infrastructure cost</td>
                  <td className="p-3 text-surface/55">Low-Medium</td>
                  <td className="p-3 text-surface/55">NestJS + PostgreSQL + Redis on a $40/month VPS handles thousands of concurrent rides.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-0 border-t border-border-light my-14" />

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gold rounded-md flex items-center justify-center font-serif text-xs font-black text-void">O</div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-surface/20">
              <strong className="text-gold">Optin</strong>.co.tz
            </span>
          </div>
          <p className="text-[11.5px] text-surface/18 leading-relaxed max-w-md mx-auto">
            Optin Digital Solutions Ltd - Dar es Salaam, Tanzania - optin.co.tz<br />
            This report is confidential and prepared exclusively for Jamboride. Any reproduction or distribution without written consent is prohibited.<br /><br />
            Technical Audit - April 2026 - Based on direct analysis of driver and customer Flutter source code.
          </p>
        </footer>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12 px-4">
        <Button className="bg-gold hover:bg-gold2 text-void font-semibold">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" className="border-border-gold text-gold hover:bg-gold-dim">
          <ExternalLink className="h-4 w-4 mr-2" />
          Share Report Link
        </Button>
      </div>
    </div>
  )
}
