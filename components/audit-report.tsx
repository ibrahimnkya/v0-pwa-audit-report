"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  CheckCircle2,
  AlertTriangle,
  Menu,
  ChevronRight,
  X,
} from "lucide-react"

// ─── Data ───────────────────────────────────────────────────────────────────

const sections = [
  { id: "s1", num: "01", title: "Root Cause Analysis", badge: "8 Issues", badgeVariant: "destructive" },
  { id: "s2", num: "02", title: "Code & Architecture Weaknesses", badge: "Systemic", badgeVariant: "destructive" },
  { id: "s3", num: "03", title: "Steps Taken — Phase 1 Complete", badge: "✓ Done", badgeVariant: "success" },
  { id: "s4", num: "04", title: "Refactored Architecture", badge: "Phase 2–3", badgeVariant: "warning" },
  { id: "s5", num: "05", title: "Firebase Evaluation", badge: "Hybrid", badgeVariant: "warning" },
  { id: "s6", num: "06", title: "Cost Reduction Estimate", badge: "Projected", badgeVariant: "warning" },
  { id: "s7", num: "07", title: "Recommended Backend Stack", badge: "Phase 2–3", badgeVariant: "warning" },
  { id: "s8", num: "08", title: "Implementation Plan", badge: "Active", badgeVariant: "warning" },
]

// ─── Code Block ─────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "dart" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1510] border-b border-white/10">
        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">{lang}</span>
        <button
          onClick={copy}
          className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 hover:text-amber-400 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-[#0d1510] p-4 overflow-x-auto text-[12px] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  )
}

// ─── Callout ────────────────────────────────────────────────────────────────

function Callout({ variant = "gold", children }: { variant?: "gold" | "danger" | "success"; children: React.ReactNode }) {
  const styles = {
    gold: "border-amber-500/40 bg-amber-500/5 text-zinc-300",
    danger: "border-red-500/40 bg-red-500/5 text-zinc-300",
    success: "border-emerald-500/40 bg-emerald-500/5 text-zinc-300",
  }
  return (
    <div className={`border-l-2 rounded-r-lg px-4 py-3 text-sm leading-relaxed my-4 ${styles[variant]}`}>
      {children}
    </div>
  )
}

// ─── Issue Card ──────────────────────────────────────────────────────────────

function IssueCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4 space-y-2 my-3">
      <h4 className="text-sm font-semibold text-amber-300">{title}</h4>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Step Done ───────────────────────────────────────────────────────────────

function StepDone({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-4 border-b border-white/8 last:border-0">
      <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ num, title, badge, badgeVariant }: { num: string; title: string; badge: string; badgeVariant: string }) {
  const badgeStyles: Record<string, string> = {
    destructive: "bg-red-500/15 text-red-400 border border-red-500/25",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  }
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
      <span className="font-mono text-[10px] tracking-widest text-amber-500 flex-shrink-0">{num}</span>
      <h2 className="font-serif text-xl font-bold tracking-tight text-zinc-100 flex-1">{title}</h2>
      <span className={`flex-shrink-0 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${badgeStyles[badgeVariant]}`}>
        {badge}
      </span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface AuditReportProps {
  userEmail?: string
  onLogout?: () => void
}

export function AuditReport({ userEmail, onLogout }: AuditReportProps) {
  const [activeSection, setActiveSection] = useState("s1")
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: [0.1, 0.3, 0.5] }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const progress = ((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100

  const NavLinks = ({ onSelect }: { onSelect?: () => void }) => (
    <div className="space-y-0.5">
      {sections.map((s) => {
        const active = activeSection === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => onSelect?.()}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              active
                ? "bg-amber-400/15 text-amber-300 font-medium"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <span className={`font-mono text-[9px] tracking-widest flex-shrink-0 ${active ? "text-amber-400" : "text-zinc-600"}`}>
              {s.num}
            </span>
            <span className="leading-tight">{s.title}</span>
          </a>
        )
      })}
    </div>
  )

  return (
    <div
      className="min-h-screen text-zinc-200"
      style={{ background: "#0a0f0d", fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        code { font-family: 'DM Mono', monospace; font-size: 12px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1px 5px; color: #e8bc3a; }
        .cm { color: #3d5c3a; }
        .kw { color: #e8a030; }
        .str { color: #6aaa7a; }
        .fn { color: #78b8dc; }
        .val { color: #d98877; }
        pre code { background: none; border: none; padding: 0; font-size: 12px; color: #a8c4a0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.25); border-radius: 2px; }
      `}</style>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
        <div
          className="h-full bg-amber-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#060908]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile nav trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-white/10 p-0"
                style={{ background: "#0a0f0d" }}
              >
                <div className="p-4 border-b border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
                    <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 overflow-y-auto h-full pb-20">
                  <NavLinks onSelect={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
              <div>
                <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
                <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">.co.tz</span>
              </div>
            </div>
            <span className="hidden sm:block text-zinc-700 text-xs font-mono tracking-wider">/ Jamboride Audit · April 2026</span>
          </div>
          <div className="flex items-center gap-2">
            {userEmail && onLogout && (
              <button
                onClick={onLogout}
                className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors mr-2"
              >
                Sign Out
              </button>
            )}
            <span className="font-mono text-[10px] tracking-widest uppercase text-red-400 border border-red-500/30 rounded-full px-2.5 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Confidential
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
          <div className="flex-1 overflow-y-auto p-3">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-3 pt-3 pb-2">Contents</p>
            <NavLinks />
            <div className="mt-6 px-3 pb-4">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-1">Phase 1</p>
                <p className="text-xs text-zinc-400 leading-relaxed">Complete — 45–55% cost reduction achieved</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main ref={mainRef} className="flex-1 min-w-0 px-4 lg:px-8 py-8 space-y-0">

          {/* Hero */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent rounded-2xl pointer-events-none" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-amber-500 mb-4 flex items-center gap-2">
              <span>Technical Audit Report · April 2026</span>
              <span className="flex-1 h-px bg-amber-500/20 max-w-[80px]" />
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
              Jamboride Architecture &amp; <em className="italic text-amber-400">Cost</em> Optimization Audit
            </h1>
            <p className="font-mono text-sm text-zinc-500 tracking-wider mb-6">Flutter · Firebase · Google Maps / Directions APIs</p>
            <div className="grid grid-cols-2 md:grid-cols-4 border border-white/8 rounded-xl overflow-hidden">
              {[
                { label: "Scope", val: "Customer & Driver Apps" },
                { label: "Backend", val: "Firebase" },
                { label: "Maps Stack", val: "Google Maps Platform" },
                { label: "Audited By", val: "Optin Digital Solutions" },
              ].map((m, i) => (
                <div key={i} className="p-4 border-r border-white/8 last:border-0 even:border-r-0 md:even:border-r border-b md:border-b-0 border-white/8">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-1">{m.label}</p>
                  <p className="text-sm text-zinc-300 font-medium">{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-amber-500 rounded-xl overflow-hidden mb-12">
            {[
              { num: "8", lbl: "Critical Issues Found" },
              { num: "~65%", lbl: "Estimated API Cost Reduction" },
              { num: "5", lbl: "Google API Endpoints Audited" },
              { num: "3", lbl: "Migration Phases Planned" },
            ].map((s, i) => (
              <div key={i} className="p-5 border-r border-black/10 last:border-0">
                <p className="font-serif text-3xl font-black text-black leading-none mb-1">{s.num}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-black/60">{s.lbl}</p>
              </div>
            ))}
          </div>

          {/* ── S1: Root Cause ── */}
          <section id="s1" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[0]} />
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              After a full read of both codebases — specifically{" "}
              <code>home_controller.dart</code>, <code>live_tracking_controller.dart</code>,{" "}
              <code>fire_store_utils.dart</code>, and all controller classes — the following systemic issues were identified as driving the majority of API cost.
            </p>

            <IssueCard title="Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)">
              <Callout variant="danger">
                <strong className="text-red-400">Critical.</strong> Both apps set <code>distanceFilter: 1</code> with <code>accuracy: LocationAccuracy.bestForNavigation</code>. At GPS accuracy of ~3–5m, this fires a location event every 1 meter of movement, producing up to 5,000 location ticks per hour at 90 km/h.
              </Callout>
              <CodeBlock lang="dart" code={`<span class="cm">// DRIVER — home_controller.dart:518</span>
<span class="cm">// CUSTOMER — home_controller.dart:1391</span>
<span class="fn">Geolocator</span>.getPositionStream(
  locationSettings: <span class="kw">const</span> LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: <span class="val">1</span>,  <span class="cm">// ← fires every 1 metre !!!</span>
  ),
)`} />
            </IssueCard>

            <IssueCard title="Issue 2 — Directions API Called on Every Firebase Snapshot (Cascading Fan-Out)">
              <Callout variant="danger">
                <strong className="text-red-400">Critical.</strong> Both <code>LiveTrackingController.getPolyline()</code> call <code>polylinePoints.getRouteBetweenCoordinates()</code> — which hits the Google Directions API — inside a Firestore snapshot listener. Every location write causes both apps to independently call the Directions API.
              </Callout>
              <CodeBlock lang="dart" code={`<span class="cm">// live_tracking_controller.dart (BOTH apps — identical code)</span>
<span class="fn">FirebaseFirestore</span>.instance
  .collection(<span class="str">'driver_users'</span>)
  .doc(driverId)
  .<span class="fn">snapshots</span>()
  .<span class="fn">listen</span>((event) {
    <span class="fn">getPolyline</span>(
      sourceLatitude: driverUserModel.location.latitude,
      ...
    );  <span class="cm">// ← Directions API hit HERE, no throttle, no cache</span>
  });`} />
              <p className="text-xs text-zinc-500 mt-2">
                With <code>distanceFilter: 1</code>, a 10-minute ride at 50 km/h produces ~833 snapshot events. Both apps call Directions API on each:{" "}
                <strong className="text-zinc-300">~1,666 Directions API calls per trip.</strong> At $0.005/call, that&apos;s $8.33 per ride in Directions costs alone.
              </p>
            </IssueCard>

            <IssueCard title="Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive">
              <p>Both apps implement a <code>shouldReRoute()</code> guard that allows a new Directions API call every 20 meters of driver movement. At 50 km/h, the driver crosses 20m every 1.44 seconds — triggering a route refresh every ~1.5 seconds.</p>
              <CodeBlock lang="dart" code={`<span class="kw">if</span> (moved >= <span class="val">20</span>) {  <span class="cm">// 🔑 "20 meters magic number" (comment in source)</span>
  _lastRoutedDriverPos = current;
  <span class="kw">return true</span>;       <span class="cm">// triggers Directions API call</span>
}`} />
            </IssueCard>

            <IssueCard title="Issue 4 — Duplicate Location Tracking Stack">
              <p>The Driver app runs <em>two simultaneous location stacks</em>: <code>Geolocator.getPositionStream()</code> and <code>location.onLocationChanged.listen()</code> — both running concurrently. Every physical movement triggers <em>two</em> Firestore writes and two downstream cascades, directly doubling all location-related costs.</p>
            </IssueCard>

            <IssueCard title="Issue 5 — Nested Firestore Listeners (Memory Leaks + Redundant API Calls)">
              <CodeBlock lang="dart" code={`<span class="cm">// live_tracking_controller.dart — same pattern in BOTH apps</span>
<span class="fn">FirebaseFirestore</span>.instance.collection(<span class="str">'orders'</span>).doc(orderId)
  .<span class="fn">snapshots</span>().<span class="fn">listen</span>((orderEvent) {
    <span class="cm">// Inner listener opened on EVERY outer event — never cancelled!</span>
    <span class="fn">FirebaseFirestore</span>.instance.collection(<span class="str">'driver_users'</span>).doc(driverId)
      .<span class="fn">snapshots</span>().<span class="fn">listen</span>((driverEvent) {
        <span class="fn">getPolyline</span>(...);  <span class="cm">// ← Directions API every write</span>
      });
  });`} />
              <p className="text-xs text-zinc-500 mt-2">After 5 minutes of a trip, there are dozens of orphaned listeners all calling <code>getPolyline()</code> simultaneously.</p>
            </IssueCard>

            <IssueCard title="Issue 6 — Places Autocomplete + Distance Matrix on Every Keystroke">
              <p>The customer&apos;s destination search calls both the Places Autocomplete API and Distance Matrix API on every character typed, with no debounce. Typing &quot;Dar es Salaam Airport&quot; (19 chars) fires 19 Autocomplete + 19 Distance Matrix calls.</p>
            </IssueCard>

            <IssueCard title="Issue 7 — Nearby Places API Called on Every App Open">
              <p>On home screen load, <code>fetchNearbyPlacesWhere()</code> fires a Nearby Search + Distance Matrix immediately, with no caching. Every time a user opens the app, these calls are made regardless of whether their location has changed.</p>
            </IssueCard>

            <IssueCard title="Issue 8 — Background Location Always Enabled Without distanceFilter">
              <CodeBlock lang="dart" code={`<span class="cm">// driver/home_controller.dart:2040</span>
location.<span class="fn">enableBackgroundMode</span>(enable: <span class="kw">true</span>);
<span class="cm">// distanceFilter is commented out — updates Firestore continuously:</span>
<span class="cm">// location.changeSettings(accuracy: LocationAccuracy.high, distanceFilter: 3);</span>`} />
            </IssueCard>
          </section>

          {/* ── S2: Architecture Weaknesses ── */}
          <section id="s2" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[1]} />

            <div className="space-y-3">
              {[
                {
                  pill: "High Cost",
                  title: "Unconditional real-time listeners on frequently-written documents",
                  body: <>The <code>driver_users</code> document is written to on every location update. Both apps attach <code>.snapshots().listen()</code> to this document. Firestore charges a read for every snapshot event. With <code>distanceFilter: 1</code>, a 20-minute trip produces ~1,000+ document reads per listener — and there are multiple listeners on the same document.</>,
                  pillColor: "bg-red-500/15 text-red-400",
                },
                {
                  pill: "Memory Leak",
                  title: "Unmanaged StreamSubscriptions leading to zombie listeners",
                  body: <>Inner <code>StreamSubscription</code> objects created inside outer listener callbacks are never stored in a variable. They cannot be <code>cancel()</code>-ed in <code>onClose()</code>, creating permanent memory leaks and duplicate API calls that compound over a trip&apos;s duration.</>,
                  pillColor: "bg-red-500/15 text-red-400",
                },
                {
                  pill: "Architecture",
                  title: "Mobile apps make all Google API calls directly — no shared cache",
                  body: "Every mobile client calls Maps/Directions/Places APIs independently. There is no shared caching layer, no rate limiting, and no opportunity to deduplicate — e.g., if 50 customers are all near the same area, each makes their own independent Nearby Search call for the same data.",
                  pillColor: "bg-amber-500/15 text-amber-400",
                },
              ].map((c) => (
                <Card key={c.title} className="border-white/8 bg-white/[0.025]">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${c.pillColor}`}>{c.pill}</span>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{c.title}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed">{c.body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mt-8 mb-3">Scalability Projection</h3>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Issue", "Current Behaviour", "At Scale (1,000 concurrent rides)"].map((h) => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Location writes per second", "~1 write/sec per driver", "1,000 writes/sec → Firestore hot spots"],
                    ["Directions API calls per trip", "~800–1,600 calls/trip", "Hitting Maps API daily quotas instantly"],
                    ["Firestore reads per trip (listeners)", "~2,000–4,000 reads/trip", "Firebase costs scale linearly, no bulk discount"],
                    ["Nearby search caching", "None — per app open", "1,000 app opens = 1,000 redundant API calls"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300 font-medium">{row[0]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── S3: Phase 1 Done ── */}
          <section id="s3" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[2]} />
            <Callout variant="success">
              <strong className="text-emerald-400">Phase 1 has been successfully completed.</strong> All quick-win Flutter-only fixes have been implemented and deployed. Estimated impact:{" "}
              <strong className="text-emerald-400">45–55% reduction in API and Firestore costs</strong> from these changes alone.
            </Callout>

            <div className="mt-4">
              <StepDone title={<>Corrected <code>distanceFilter</code> values across both apps</>}>
                Changed from <code>distanceFilter: 1</code> to adaptive values: <code>15m</code> when idle, <code>8m</code> en-route to pickup, and <code>5m</code> during active trip navigation. This single change accounts for an estimated 40–50% reduction in location writes and downstream API cascades.
              </StepDone>
              <StepDone title="Removed the duplicate location tracking stack in Driver app">
                The <code>location.onLocationChanged.listen()</code> block was removed entirely. All location handling is now consolidated into the single <code>Geolocator.getPositionStream()</code>. This eliminated a full doubling of all location-related Firestore writes.
              </StepDone>
              <StepDone title="Stored and cancelled all StreamSubscriptions — zombie listeners eliminated">
                All <code>.listen()</code> calls were audited across both codebases. Every subscription is now assigned to a named <code>StreamSubscription?</code> variable and cancelled in <code>onClose()</code>. Nested listeners were refactored to flat, parallel subscriptions.
              </StepDone>
              <StepDone title="Implemented client-side polyline trimming — in-trip Directions API calls eliminated">
                The <code>getPolyline()</code> call inside the <code>monitorTrip</code> driver listener was replaced with a pure client-side <code>trimPolyline()</code> function. The Directions API is now called only when the driver deviates more than 80m from the polyline corridor. Estimated reduction: <strong className="text-zinc-200">70–85% of in-trip Directions API calls.</strong>
              </StepDone>
              <StepDone title="Added 300ms debounce and 3-character minimum to destination search">
                A <code>Timer</code>-based debounce was added to the customer app&apos;s <code>onSearchChanged()</code> handler. Autocomplete calls now fire only after 300ms of typing inactivity and require at least 3 characters. Estimated reduction: <strong className="text-zinc-200">60–80% of Places Autocomplete calls.</strong>
              </StepDone>
              <StepDone title="Implemented nearby places result caching (10-minute TTL, 200m movement threshold)">
                The <code>fetchNearbyPlacesWhere()</code> call on app open is now gated by a cache check. Results are reused for 10 minutes if the user&apos;s position has not moved more than 200m from the last fetch position.
              </StepDone>
              <StepDone title={<>Re-enabled background location <code>distanceFilter: 20</code> in Driver app</>}>
                The <code>location.changeSettings(distanceFilter: 20)</code> call that had been commented out was restored. Background location accuracy was also lowered to <code>LocationAccuracy.balanced</code> while backgrounded. Drivers waiting for rides no longer send continuous location updates to Firestore.
              </StepDone>
            </div>

            <Callout variant="success">
              <strong className="text-emerald-400">Validation:</strong> All Phase 1 changes were tested in the Jamboride staging environment for one week prior to production deployment. API call volume telemetry confirmed a measured reduction consistent with projections.
            </Callout>
          </section>

          {/* ── S4: Architecture ── */}
          <section id="s4" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[3]} />
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              The core architectural change is to move all Google API calls from mobile clients to a backend service. Mobile apps should only communicate with your own backend, which acts as a smart proxy with caching, deduplication, and cost controls.
            </p>

            {/* Architecture SVG diagram */}
            <div className="rounded-xl border border-white/8 bg-[#060908] p-4 overflow-x-auto mb-6">
              <svg width="100%" viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 500 }}>
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                  <marker id="arb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#2977c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                  <marker id="arp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#7864c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                {/* Labels */}
                {[["MOBILE CLIENTS", 20, 60], ["API GATEWAY", 20, 188], ["BACKEND SERVICES", 20, 318], ["EXTERNAL APIs", 20, 448]].map(([t, x, y]) => (
                  <text key={String(t)} fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="2" x={Number(x)} y={Number(y)} fill="#3d5c3a">{t}</text>
                ))}
                {/* Mobile clients */}
                <rect x="140" y="30" width="150" height="52" rx="8" fill="rgba(201,162,39,0.07)" stroke="rgba(201,162,39,0.3)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.75)" x="215" y="52" textAnchor="middle">Customer App</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(201,162,39,0.5)" x="215" y="70" textAnchor="middle">Flutter · GetX</text>
                <rect x="310" y="30" width="150" height="52" rx="8" fill="rgba(201,162,39,0.07)" stroke="rgba(201,162,39,0.3)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.75)" x="385" y="52" textAnchor="middle">Driver App</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(201,162,39,0.5)" x="385" y="70" textAnchor="middle">Flutter · GetX</text>
                {/* Arrows to gateway */}
                <line x1="215" y1="82" x2="265" y2="158" stroke="rgba(201,162,39,0.4)" strokeWidth="1" markerEnd="url(#arr)"/>
                <line x1="385" y1="82" x2="325" y2="158" stroke="rgba(201,162,39,0.4)" strokeWidth="1" markerEnd="url(#arr)"/>
                {/* Gateway */}
                <rect x="160" y="158" width="265" height="52" rx="8" fill="rgba(42,157,92,0.07)" stroke="rgba(42,157,92,0.3)" strokeWidth="1.5"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.8)" x="292" y="179" textAnchor="middle">API Gateway / NestJS</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(42,157,92,0.5)" x="292" y="197" textAnchor="middle">Auth · Rate Limiting · REST + WebSocket</text>
                {/* Arrows to services */}
                <line x1="240" y1="210" x2="195" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                <line x1="292" y1="210" x2="355" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                <line x1="344" y1="210" x2="520" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                {/* Services */}
                {[
                  [130, 278, "Route Service", "Polyline · ETA cache", 195],
                  [300, 278, "Dispatch Service", "Driver matching · Geo", 365],
                  [470, 278, "Location Service", "WebSocket · broadcast", 535],
                ].map(([x, y, title, sub, tx]) => (
                  <g key={String(title)}>
                    <rect x={Number(x)} y={Number(y)} width="145" height="52" rx="7" fill="rgba(41,119,192,0.07)" stroke="rgba(41,119,192,0.25)" strokeWidth="1"/>
                    <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.7)" x={Number(tx)} y={Number(y) + 22} textAnchor="middle">{title}</text>
                    <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(41,119,192,0.5)" x={Number(tx)} y={Number(y) + 38} textAnchor="middle">{sub}</text>
                  </g>
                ))}
                {/* Redis */}
                <rect x="640" y="278" width="130" height="52" rx="7" fill="rgba(217,79,43,0.07)" stroke="rgba(217,79,43,0.25)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.7)" x="705" y="300" textAnchor="middle">Redis Cache</text>
                <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(217,79,43,0.5)" x="705" y="316" textAnchor="middle">Routes · Places · ETAs</text>
                <line x1="280" y1="304" x2="638" y2="304" stroke="rgba(217,79,43,0.25)" strokeWidth="0.8" strokeDasharray="4 3"/>
                {/* Arrows to external */}
                <line x1="195" y1="330" x2="195" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                <line x1="365" y1="330" x2="365" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                <line x1="535" y1="330" x2="535" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                {/* External APIs */}
                {[
                  [120, 398, "Directions API", "Backend calls only", 195],
                  [290, 398, "Places API", "Cached in Redis", 362],
                  [460, 398, "Distance Matrix", "Batch requests only", 533],
                ].map(([x, y, title, sub, tx]) => (
                  <g key={String(title)}>
                    <rect x={Number(x)} y={Number(y)} width="147" height="52" rx="7" fill="rgba(120,90,200,0.06)" stroke="rgba(120,90,200,0.2)" strokeWidth="1"/>
                    <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.6)" x={Number(tx)} y={Number(y) + 22} textAnchor="middle">{title}</text>
                    <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(120,90,200,0.5)" x={Number(tx)} y={Number(y) + 38} textAnchor="middle">{sub}</text>
                  </g>
                ))}
                {/* Notice */}
                <rect x="648" y="110" width="132" height="36" rx="6" fill="none" stroke="rgba(217,79,43,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(217,79,43,0.8)" x="714" y="126" textAnchor="middle">Mobile apps NEVER</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(217,79,43,0.8)" x="714" y="140" textAnchor="middle">call Google APIs directly</text>
              </svg>
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">Key Architecture Principles</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {[
                ["Mobile → Your Backend only.", "Apps never call google.com directly. All Maps/Directions/Places calls are proxied through your backend."],
                ["Backend → Redis cache → Google APIs.", "Every route, ETA, and place result is cached in Redis. Repeated requests return cached data."],
                ["Location via WebSocket, not Firestore polling.", "Driver location updates are broadcast over WebSocket. No Firestore document write per update; no downstream read cascade."],
                ["Route calculated once per order.", "At order acceptance, the Route Service computes and stores the full polyline — trimmed client-side during the trip. API only called again on deviation."],
                ["Dispatch uses PostGIS geospatial queries.", "Finding nearby drivers uses a PostgreSQL + PostGIS radius query — not Firestore geohash queries and not a Google API call."],
              ].map(([bold, rest]) => (
                <li key={bold} className="flex gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-zinc-200">{bold}</strong> {rest}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── S5: Firebase Evaluation ── */}
          <section id="s5" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[4]} />
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="pt-4">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-3">Keep — works well</p>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    {["Real-time order status updates (Firestore listeners)", "Firebase Auth — phone number OTP works well", "Firebase Storage — driver document uploads", "FCM push notifications — reliable, cross-platform", "Fast initial deployment — no backend infra to manage"].map(i => (
                      <li key={i} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-4">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-red-400 mb-3">Replace — hurting you</p>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    {["Firestore pricing is per read/write — architecture writes thousands per ride", "No server-side logic — business rules embedded in mobile apps", "No native geospatial queries (geoflutterfire is a workaround)", "Vendor lock-in — hard to migrate once data is in Firestore", "Real-time listeners at scale create connection storm"].map(i => (
                      <li key={i} className="flex gap-2"><AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Component", "Current", "Recommended", "Cost Impact"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Auth", "Firebase Auth", "Keep Firebase Auth", "Neutral"],
                    ["Push notifications", "FCM", "Keep FCM", "Neutral"],
                    ["Order data", "Firestore", "PostgreSQL", "−70% reads cost"],
                    ["Driver location", "Firestore doc updates", "WebSocket → Redis", "−95% write cost"],
                    ["Live tracking", "Firestore listener", "WebSocket broadcast", "−80% read cost"],
                    ["File storage", "Firebase Storage", "Keep Firebase Storage", "Neutral"],
                    ["Nearby drivers", "Geoflutterfire", "PostGIS radius query", "−100% Maps API"],
                  ].map(row => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300 font-medium">{row[0]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${row[3].startsWith("−") ? "text-emerald-400" : "text-zinc-500"}`}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── S6: Cost Reduction ── */}
          <section id="s6" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[5]} />
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Optimization Action", "Affected Cost", "Estimated Reduction"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { action: "✓ Fix distanceFilter 1→8m + stop duplicate location stack", cost: "Firestore writes, downstream Directions calls", reduction: "~40–50%", done: true, highlight: false },
                    { action: "✓ Fix zombie listeners + store & cancel subscriptions", cost: "Firestore reads, Directions API calls per trip", reduction: "~15–25%", done: true, highlight: false },
                    { action: "✓ Polyline trimming instead of Directions recalculation", cost: "Directions API calls during trip", reduction: "~70–85% of in-trip calls", done: true, highlight: false },
                    { action: "✓ Debounce autocomplete + cache nearby places", cost: "Places Autocomplete + Nearby Search calls", reduction: "~60–80%", done: true, highlight: false },
                    { action: "Move route calculation to backend with Redis cache", cost: "All Directions API calls (shared cache)", reduction: "~50–70% additional", done: false, highlight: false },
                    { action: "Replace Firestore location tracking with WebSocket", cost: "Firestore reads + writes (largest Firebase cost)", reduction: "~85–95%", done: false, highlight: false },
                    { action: "Total (full implementation)", cost: "Google Maps APIs + Firebase", reduction: "60–75% overall reduction", done: false, highlight: true },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-white/8 last:border-0 transition-colors ${row.highlight ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-4 py-3 text-zinc-300">{row.action}</td>
                      <td className="px-4 py-3 text-zinc-400">{row.cost}</td>
                      <td className={`px-4 py-3 font-mono text-xs font-semibold ${row.highlight ? "text-emerald-400" : row.done ? "text-emerald-400" : "text-amber-400"}`}>{row.reduction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout variant="success">
              <strong className="text-emerald-400">Phase 1 quick wins (✓ already implemented):</strong> Fixing distanceFilter, zombie listeners, polyline trimming, and debouncing reduced API costs by approximately <strong className="text-emerald-400">45–55%</strong> with changes only to Flutter code — no new infrastructure required.
            </Callout>
          </section>

          {/* ── S7: Backend Stack ── */}
          <section id="s7" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[6]} />
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { tech: "NestJS (Node.js)", why: "TypeScript-first, modular architecture with dependency injection. Ideal for domain-driven ride-hailing services. Built-in WebSocket gateway via Socket.io adapter." },
                { tech: "PostgreSQL + PostGIS", why: "ST_DWithin() replaces all geoflutterfire-based driver-finding logic. Full ACID compliance for order lifecycle. Far cheaper at scale than Firestore per-read pricing." },
                { tech: "Redis", why: "Cache Google API responses — polylines, ETAs, place results — with TTL. Pub/Sub channel for driver location broadcast. Eliminates Firestore as the location pipe entirely." },
                { tech: "Socket.io (WebSocket)", why: "Replace Firestore real-time listeners. Driver emits position every 5 seconds → server broadcasts to customer's room. No per-message database write." },
                { tech: "Bull / BullMQ (Job Queue)", why: "Queue for: route pre-computation, notifications, trip receipt processing, and fare calculation. Decouples latency-sensitive APIs from background work." },
                { tech: "Google Maps Platform (backend only)", why: "Called exclusively from the Route Service. RouteCache module: key = SHA256(origin+destination), TTL = 24h. Use Maps Routes API v2 (cheaper than legacy Directions API)." },
              ].map((s) => (
                <Card key={s.tech} className="border-white/8 bg-white/[0.025] hover:border-amber-500/25 transition-colors">
                  <CardContent className="pt-4">
                    <p className="text-sm font-bold text-zinc-100 mb-1.5">{s.tech}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{s.why}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CodeBlock lang="structure" code={`src/
├── <span class="fn">modules</span>/
│   ├── <span class="kw">rides</span>/          <span class="cm"># Order lifecycle (create, accept, complete)</span>
│   ├── <span class="kw">drivers</span>/        <span class="cm"># Driver state, location, matching</span>
│   ├── <span class="kw">routes</span>/         <span class="cm"># Route calculation + Redis cache layer</span>
│   ├── <span class="kw">location</span>/       <span class="cm"># WebSocket gateway + Redis pub/sub</span>
│   ├── <span class="kw">places</span>/         <span class="cm"># Autocomplete + nearby, cached</span>
│   └── <span class="kw">notifications</span>/ <span class="cm"># FCM wrapper</span>
├── <span class="fn">common</span>/
│   ├── <span class="kw">guards</span>/         <span class="cm"># Firebase Auth token verification</span>
│   ├── <span class="kw">interceptors</span>/   <span class="cm"># Logging, error normalization</span>
│   └── <span class="kw">pipes</span>/          <span class="cm"># Validation</span>
└── <span class="fn">infra</span>/
    ├── <span class="kw">redis</span>/          <span class="cm"># Redis module (cache + pub/sub)</span>
    └── <span class="kw">maps</span>/           <span class="cm"># Google Maps SDK wrapper + caching</span>`} />
          </section>

          {/* ── S8: Migration Plan ── */}
          <section id="s8" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[7]} />

            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="border-l-2 border-emerald-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-1">Phase 1 · Weeks 1–2 · Flutter Only · ✓ Complete</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Quick Wins — 45–55% cost reduction achieved</p>
                <Callout variant="success">All seven Phase 1 steps have been completed and deployed to production. See Section 03 for the full breakdown of what was implemented and the validation process.</Callout>
              </div>

              {/* Phase 2 */}
              <div className="border-l-2 border-amber-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-amber-400 mb-1">Phase 2 · Weeks 3–8 · Backend API Layer</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Centralise all Google API calls — ~60–65% total reduction</p>
                <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside">
                  <li>Stand up NestJS backend with PostgreSQL + PostGIS and Redis.</li>
                  <li>Implement <code>RoutesModule</code> — proxy for Directions API with Redis cache (TTL 24h per origin/destination pair).</li>
                  <li>Implement <code>PlacesModule</code> — proxy for Autocomplete and Nearby Search with per-query Redis cache (TTL 15min).</li>
                  <li>Update Flutter apps to call your backend route/places endpoints instead of Google APIs directly. Remove the Google Maps API key from mobile apps.</li>
                  <li>Implement <code>LocationModule</code> with Socket.io WebSocket gateway. Driver app connects via WebSocket; broadcasts location every 5 seconds only when moving (&gt;5m).</li>
                  <li>Migrate order status updates from Firestore to WebSocket events.</li>
                </ol>
                <Callout variant="gold"><strong className="text-amber-400">Risk:</strong> Medium. Keep Firebase Firestore as a fallback for order status for 2 weeks during transition. A/B rollout: 10% of new rides use new backend, 90% continue on Firebase.</Callout>
              </div>

              {/* Phase 3 */}
              <div className="border-l-2 border-blue-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-blue-400 mb-1">Phase 3 · Weeks 9–16 · Full Architecture Migration</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Complete Firebase replacement for operational data — ~70–75% total reduction</p>
                <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside">
                  <li>Migrate order and trip data from Firestore to PostgreSQL with a migration script for historical orders.</li>
                  <li>Implement driver matching via PostGIS <code>ST_DWithin()</code>. Remove all geoflutterfire queries.</li>
                  <li>Implement BullMQ job queue for: trip fare calculation, receipt generation, payout processing, and notification dispatching.</li>
                  <li>Keep Firebase Auth (phone OTP) + FCM + Storage — these remain cost-effective.</li>
                  <li>Decommission Firestore collections: <code>orders</code>, <code>driver_users</code> location fields, and order status fields.</li>
                  <li>Implement monitoring: Prometheus + Grafana dashboard for API call counts, cache hit rates, and WebSocket connection counts.</li>
                </ol>
                <Callout variant="gold"><strong className="text-amber-400">Risk:</strong> Medium-High. Run parallel writes (PostgreSQL + Firestore) for 4 weeks before cutting over reads. Maintain rollback scripts.</Callout>
              </div>
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mt-8 mb-3">Risk Register</h3>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Risk", "Probability", "Mitigation"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Location accuracy degradation with higher distanceFilter", "Low", "Validated in Phase 1 staging. Filter of 5–8m is imperceptible to users; GPS jitter at 1m provides zero UX benefit."],
                    ["WebSocket reconnection on mobile network switching", "Medium", "Implement exponential backoff reconnect in Flutter. Cache last known position in SharedPreferences as fallback."],
                    ["Redis cache stale routes (road closures)", "Low", "Use short TTL (2h) for high-traffic corridors. Driver deviation triggers cache invalidation for that route key."],
                    ["PostgreSQL migration data loss", "Low", "Run parallel writes for 4 weeks. Automated reconciliation script comparing Firestore vs PostgreSQL order counts daily."],
                    ["Increased backend infrastructure cost", "Low-Medium", "NestJS + PostgreSQL + Redis on a $40/month VPS handles thousands of concurrent rides. Savings far exceed infrastructure cost."],
                  ].map(row => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300">{row[0]}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${row[1] === "Low" ? "text-emerald-400" : "text-amber-400"}`}>{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Separator className="bg-white/8" />

          {/* Footer */}
          <footer className="text-center py-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
              <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
              <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">.co.tz</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-md mx-auto">
              Optin Digital Solutions Ltd · Dar es Salaam, Tanzania · optin.co.tz<br />
              This report is confidential and prepared exclusively for Jamboride.<br />
              Technical Audit · April 2026
            </p>
          </footer>

        </main>
      </div>
    </div>
  )
}

// ─── Data ───────────────────────────────────────────────────────────────────

const sections = [
  { id: "s1", num: "01", title: "Root Cause Analysis", badge: "8 Issues", badgeVariant: "destructive" },
  { id: "s2", num: "02", title: "Code & Architecture Weaknesses", badge: "Systemic", badgeVariant: "destructive" },
  { id: "s3", num: "03", title: "Steps Taken — Phase 1 Complete", badge: "✓ Done", badgeVariant: "success" },
  { id: "s4", num: "04", title: "Refactored Architecture", badge: "Phase 2–3", badgeVariant: "warning" },
  { id: "s5", num: "05", title: "Firebase Evaluation", badge: "Hybrid", badgeVariant: "warning" },
  { id: "s6", num: "06", title: "Cost Reduction Estimate", badge: "Projected", badgeVariant: "warning" },
  { id: "s7", num: "07", title: "Recommended Backend Stack", badge: "Phase 2–3", badgeVariant: "warning" },
  { id: "s8", num: "08", title: "Implementation Plan", badge: "Active", badgeVariant: "warning" },
]

// ─── Code Block ─────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "dart" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1510] border-b border-white/10">
        <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">{lang}</span>
        <button
          onClick={copy}
          className="font-mono text-[10px] tracking-wider uppercase text-zinc-500 hover:text-amber-400 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="bg-[#0d1510] p-4 overflow-x-auto text-[12px] leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  )
}

// ─── Callout ────────────────────────────────────────────────────────────────

function Callout({ variant = "gold", children }: { variant?: "gold" | "danger" | "success"; children: React.ReactNode }) {
  const styles = {
    gold: "border-amber-500/40 bg-amber-500/5 text-zinc-300",
    danger: "border-red-500/40 bg-red-500/5 text-zinc-300",
    success: "border-emerald-500/40 bg-emerald-500/5 text-zinc-300",
  }
  return (
    <div className={`border-l-2 rounded-r-lg px-4 py-3 text-sm leading-relaxed my-4 ${styles[variant]}`}>
      {children}
    </div>
  )
}

// ─── Issue Card ──────────────────────────────────────────────────────────────

function IssueCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4 space-y-2 my-3">
      <h4 className="text-sm font-semibold text-amber-300">{title}</h4>
      <div className="text-sm text-zinc-400 leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Step Done ───────────────────────────────────────────────────────────────

function StepDone({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-4 border-b border-white/8 last:border-0">
      <div className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>
        <p className="text-sm text-zinc-400 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────────

function SectionHeader({ num, title, badge, badgeVariant }: { num: string; title: string; badge: string; badgeVariant: string }) {
  const badgeStyles: Record<string, string> = {
    destructive: "bg-red-500/15 text-red-400 border border-red-500/25",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
  }
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
      <span className="font-mono text-[10px] tracking-widest text-amber-500 flex-shrink-0">{num}</span>
      <h2 className="font-serif text-xl font-bold tracking-tight text-zinc-100 flex-1">{title}</h2>
      <span className={`flex-shrink-0 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full ${badgeStyles[badgeVariant]}`}>
        {badge}
      </span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface AuditReportProps {
  userEmail?: string
  onLogout?: () => void
}

export function AuditReport({ userEmail, onLogout }: AuditReportProps) {
  const [activeSection, setActiveSection] = useState("s1")
  const [mobileOpen, setMobileOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: [0.1, 0.3, 0.5] }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const progress = ((sections.findIndex((s) => s.id === activeSection) + 1) / sections.length) * 100

  const NavLinks = ({ onSelect }: { onSelect?: () => void }) => (
    <div className="space-y-0.5">
      {sections.map((s) => {
        const active = activeSection === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => onSelect?.()}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
              active
                ? "bg-amber-400/15 text-amber-300 font-medium"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <span className={`font-mono text-[9px] tracking-widest flex-shrink-0 ${active ? "text-amber-400" : "text-zinc-600"}`}>
              {s.num}
            </span>
            <span className="leading-tight">{s.title}</span>
          </a>
        )
      })}
    </div>
  )

  return (
    <div
      className="min-h-screen text-zinc-200"
      style={{ background: "#0a0f0d", fontFamily: "'Instrument Sans', system-ui, sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        code { font-family: 'DM Mono', monospace; font-size: 12px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 1px 5px; color: #e8bc3a; }
        .cm { color: #3d5c3a; }
        .kw { color: #e8a030; }
        .str { color: #6aaa7a; }
        .fn { color: #78b8dc; }
        .val { color: #d98877; }
        pre code { background: none; border: none; padding: 0; font-size: 12px; color: #a8c4a0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,162,39,0.25); border-radius: 2px; }
      `}</style>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/5">
        <div
          className="h-full bg-amber-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#060908]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile nav trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-72 border-white/10 p-0"
                style={{ background: "#0a0f0d" }}
              >
                <div className="p-4 border-b border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
                    <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="text-zinc-500 hover:text-zinc-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 overflow-y-auto h-full pb-20">
                  <NavLinks onSelect={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
              <div>
                <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
                <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">.co.tz</span>
              </div>
            </div>
            <span className="hidden sm:block text-zinc-700 text-xs font-mono tracking-wider">/ Jamboride Audit · April 2026</span>
          </div>
          <div className="flex items-center gap-2">
            {userEmail && onLogout && (
              <button
                onClick={onLogout}
                className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 hover:text-zinc-200 transition-colors mr-2"
              >
                Sign Out
              </button>
            )}
            <span className="font-mono text-[10px] tracking-widest uppercase text-red-400 border border-red-500/30 rounded-full px-2.5 py-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              Confidential
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]">
          <div className="flex-1 overflow-y-auto p-3">
            <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-3 pt-3 pb-2">Contents</p>
            <NavLinks />
            <div className="mt-6 px-3 pb-4">
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-1">Phase 1</p>
                <p className="text-xs text-zinc-400 leading-relaxed">Complete — 45–55% cost reduction achieved</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main ref={mainRef} className="flex-1 min-w-0 px-4 lg:px-8 py-8 space-y-0">

          {/* Hero */}
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent rounded-2xl pointer-events-none" />
            <p className="font-mono text-[10px] tracking-widest uppercase text-amber-500 mb-4 flex items-center gap-2">
              <span>Technical Audit Report · April 2026</span>
              <span className="flex-1 h-px bg-amber-500/20 max-w-[80px]" />
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3">
              Jamboride Architecture &amp; <em className="italic text-amber-400">Cost</em> Optimization Audit
            </h1>
            <p className="font-mono text-sm text-zinc-500 tracking-wider mb-6">Flutter · Firebase · Google Maps / Directions APIs</p>
            <div className="grid grid-cols-2 md:grid-cols-4 border border-white/8 rounded-xl overflow-hidden">
              {[
                { label: "Scope", val: "Customer & Driver Apps" },
                { label: "Backend", val: "Firebase" },
                { label: "Maps Stack", val: "Google Maps Platform" },
                { label: "Audited By", val: "Optin Digital Solutions" },
              ].map((m, i) => (
                <div key={i} className="p-4 border-r border-white/8 last:border-0 even:border-r-0 md:even:border-r border-b md:border-b-0 border-white/8">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-zinc-600 mb-1">{m.label}</p>
                  <p className="text-sm text-zinc-300 font-medium">{m.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-amber-500 rounded-xl overflow-hidden mb-12">
            {[
              { num: "8", lbl: "Critical Issues Found" },
              { num: "~65%", lbl: "Estimated API Cost Reduction" },
              { num: "5", lbl: "Google API Endpoints Audited" },
              { num: "3", lbl: "Migration Phases Planned" },
            ].map((s, i) => (
              <div key={i} className="p-5 border-r border-black/10 last:border-0">
                <p className="font-serif text-3xl font-black text-black leading-none mb-1">{s.num}</p>
                <p className="font-mono text-[10px] tracking-widest uppercase text-black/60">{s.lbl}</p>
              </div>
            ))}
          </div>

          {/* ── S1: Root Cause ── */}
          <section id="s1" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[0]} />
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              After a full read of both codebases — specifically{" "}
              <code>home_controller.dart</code>, <code>live_tracking_controller.dart</code>,{" "}
              <code>fire_store_utils.dart</code>, and all controller classes — the following systemic issues were identified as driving the majority of API cost.
            </p>

            <IssueCard title="Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)">
              <Callout variant="danger">
                <strong className="text-red-400">Critical.</strong> Both apps set <code>distanceFilter: 1</code> with <code>accuracy: LocationAccuracy.bestForNavigation</code>. At GPS accuracy of ~3–5m, this fires a location event every 1 meter of movement, producing up to 5,000 location ticks per hour at 90 km/h.
              </Callout>
              <CodeBlock lang="dart" code={`<span class="cm">// DRIVER — home_controller.dart:518</span>
<span class="cm">// CUSTOMER — home_controller.dart:1391</span>
<span class="fn">Geolocator</span>.getPositionStream(
  locationSettings: <span class="kw">const</span> LocationSettings(
    accuracy: LocationAccuracy.bestForNavigation,
    distanceFilter: <span class="val">1</span>,  <span class="cm">// ← fires every 1 metre !!!</span>
  ),
)`} />
            </IssueCard>

            <IssueCard title="Issue 2 — Directions API Called on Every Firebase Snapshot (Cascading Fan-Out)">
              <Callout variant="danger">
                <strong className="text-red-400">Critical.</strong> Both <code>LiveTrackingController.getPolyline()</code> call <code>polylinePoints.getRouteBetweenCoordinates()</code> — which hits the Google Directions API — inside a Firestore snapshot listener. Every location write causes both apps to independently call the Directions API.
              </Callout>
              <CodeBlock lang="dart" code={`<span class="cm">// live_tracking_controller.dart (BOTH apps — identical code)</span>
<span class="fn">FirebaseFirestore</span>.instance
  .collection(<span class="str">'driver_users'</span>)
  .doc(driverId)
  .<span class="fn">snapshots</span>()
  .<span class="fn">listen</span>((event) {
    <span class="fn">getPolyline</span>(
      sourceLatitude: driverUserModel.location.latitude,
      ...
    );  <span class="cm">// ← Directions API hit HERE, no throttle, no cache</span>
  });`} />
              <p className="text-xs text-zinc-500 mt-2">
                With <code>distanceFilter: 1</code>, a 10-minute ride at 50 km/h produces ~833 snapshot events. Both apps call Directions API on each:{" "}
                <strong className="text-zinc-300">~1,666 Directions API calls per trip.</strong> At $0.005/call, that&apos;s $8.33 per ride in Directions costs alone.
              </p>
            </IssueCard>

            <IssueCard title="Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive">
              <p>Both apps implement a <code>shouldReRoute()</code> guard that allows a new Directions API call every 20 meters of driver movement. At 50 km/h, the driver crosses 20m every 1.44 seconds — triggering a route refresh every ~1.5 seconds.</p>
              <CodeBlock lang="dart" code={`<span class="kw">if</span> (moved >= <span class="val">20</span>) {  <span class="cm">// 🔑 "20 meters magic number" (comment in source)</span>
  _lastRoutedDriverPos = current;
  <span class="kw">return true</span>;       <span class="cm">// triggers Directions API call</span>
}`} />
            </IssueCard>

            <IssueCard title="Issue 4 — Duplicate Location Tracking Stack">
              <p>The Driver app runs <em>two simultaneous location stacks</em>: <code>Geolocator.getPositionStream()</code> and <code>location.onLocationChanged.listen()</code> — both running concurrently. Every physical movement triggers <em>two</em> Firestore writes and two downstream cascades, directly doubling all location-related costs.</p>
            </IssueCard>

            <IssueCard title="Issue 5 — Nested Firestore Listeners (Memory Leaks + Redundant API Calls)">
              <CodeBlock lang="dart" code={`<span class="cm">// live_tracking_controller.dart — same pattern in BOTH apps</span>
<span class="fn">FirebaseFirestore</span>.instance.collection(<span class="str">'orders'</span>).doc(orderId)
  .<span class="fn">snapshots</span>().<span class="fn">listen</span>((orderEvent) {
    <span class="cm">// Inner listener opened on EVERY outer event — never cancelled!</span>
    <span class="fn">FirebaseFirestore</span>.instance.collection(<span class="str">'driver_users'</span>).doc(driverId)
      .<span class="fn">snapshots</span>().<span class="fn">listen</span>((driverEvent) {
        <span class="fn">getPolyline</span>(...);  <span class="cm">// ← Directions API every write</span>
      });
  });`} />
              <p className="text-xs text-zinc-500 mt-2">After 5 minutes of a trip, there are dozens of orphaned listeners all calling <code>getPolyline()</code> simultaneously.</p>
            </IssueCard>

            <IssueCard title="Issue 6 — Places Autocomplete + Distance Matrix on Every Keystroke">
              <p>The customer&apos;s destination search calls both the Places Autocomplete API and Distance Matrix API on every character typed, with no debounce. Typing &quot;Dar es Salaam Airport&quot; (19 chars) fires 19 Autocomplete + 19 Distance Matrix calls.</p>
            </IssueCard>

            <IssueCard title="Issue 7 — Nearby Places API Called on Every App Open">
              <p>On home screen load, <code>fetchNearbyPlacesWhere()</code> fires a Nearby Search + Distance Matrix immediately, with no caching. Every time a user opens the app, these calls are made regardless of whether their location has changed.</p>
            </IssueCard>

            <IssueCard title="Issue 8 — Background Location Always Enabled Without distanceFilter">
              <CodeBlock lang="dart" code={`<span class="cm">// driver/home_controller.dart:2040</span>
location.<span class="fn">enableBackgroundMode</span>(enable: <span class="kw">true</span>);
<span class="cm">// distanceFilter is commented out — updates Firestore continuously:</span>
<span class="cm">// location.changeSettings(accuracy: LocationAccuracy.high, distanceFilter: 3);</span>`} />
            </IssueCard>
          </section>

          {/* ── S2: Architecture Weaknesses ── */}
          <section id="s2" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[1]} />

            <div className="space-y-3">
              {[
                {
                  pill: "High Cost",
                  title: "Unconditional real-time listeners on frequently-written documents",
                  body: <>The <code>driver_users</code> document is written to on every location update. Both apps attach <code>.snapshots().listen()</code> to this document. Firestore charges a read for every snapshot event. With <code>distanceFilter: 1</code>, a 20-minute trip produces ~1,000+ document reads per listener — and there are multiple listeners on the same document.</>,
                  pillColor: "bg-red-500/15 text-red-400",
                },
                {
                  pill: "Memory Leak",
                  title: "Unmanaged StreamSubscriptions leading to zombie listeners",
                  body: <>Inner <code>StreamSubscription</code> objects created inside outer listener callbacks are never stored in a variable. They cannot be <code>cancel()</code>-ed in <code>onClose()</code>, creating permanent memory leaks and duplicate API calls that compound over a trip&apos;s duration.</>,
                  pillColor: "bg-red-500/15 text-red-400",
                },
                {
                  pill: "Architecture",
                  title: "Mobile apps make all Google API calls directly — no shared cache",
                  body: "Every mobile client calls Maps/Directions/Places APIs independently. There is no shared caching layer, no rate limiting, and no opportunity to deduplicate — e.g., if 50 customers are all near the same area, each makes their own independent Nearby Search call for the same data.",
                  pillColor: "bg-amber-500/15 text-amber-400",
                },
              ].map((c) => (
                <Card key={c.title} className="border-white/8 bg-white/[0.025]">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 rounded-full flex-shrink-0 mt-0.5 ${c.pillColor}`}>{c.pill}</span>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{c.title}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed">{c.body}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mt-8 mb-3">Scalability Projection</h3>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Issue", "Current Behaviour", "At Scale (1,000 concurrent rides)"].map((h) => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Location writes per second", "~1 write/sec per driver", "1,000 writes/sec → Firestore hot spots"],
                    ["Directions API calls per trip", "~800–1,600 calls/trip", "Hitting Maps API daily quotas instantly"],
                    ["Firestore reads per trip (listeners)", "~2,000–4,000 reads/trip", "Firebase costs scale linearly, no bulk discount"],
                    ["Nearby search caching", "None — per app open", "1,000 app opens = 1,000 redundant API calls"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300 font-medium">{row[0]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── S3: Phase 1 Done ── */}
          <section id="s3" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[2]} />
            <Callout variant="success">
              <strong className="text-emerald-400">Phase 1 has been successfully completed.</strong> All quick-win Flutter-only fixes have been implemented and deployed. Estimated impact:{" "}
              <strong className="text-emerald-400">45–55% reduction in API and Firestore costs</strong> from these changes alone.
            </Callout>

            <div className="mt-4">
              <StepDone title={<>Corrected <code>distanceFilter</code> values across both apps</>}>
                Changed from <code>distanceFilter: 1</code> to adaptive values: <code>15m</code> when idle, <code>8m</code> en-route to pickup, and <code>5m</code> during active trip navigation. This single change accounts for an estimated 40–50% reduction in location writes and downstream API cascades.
              </StepDone>
              <StepDone title="Removed the duplicate location tracking stack in Driver app">
                The <code>location.onLocationChanged.listen()</code> block was removed entirely. All location handling is now consolidated into the single <code>Geolocator.getPositionStream()</code>. This eliminated a full doubling of all location-related Firestore writes.
              </StepDone>
              <StepDone title="Stored and cancelled all StreamSubscriptions — zombie listeners eliminated">
                All <code>.listen()</code> calls were audited across both codebases. Every subscription is now assigned to a named <code>StreamSubscription?</code> variable and cancelled in <code>onClose()</code>. Nested listeners were refactored to flat, parallel subscriptions.
              </StepDone>
              <StepDone title="Implemented client-side polyline trimming — in-trip Directions API calls eliminated">
                The <code>getPolyline()</code> call inside the <code>monitorTrip</code> driver listener was replaced with a pure client-side <code>trimPolyline()</code> function. The Directions API is now called only when the driver deviates more than 80m from the polyline corridor. Estimated reduction: <strong className="text-zinc-200">70–85% of in-trip Directions API calls.</strong>
              </StepDone>
              <StepDone title="Added 300ms debounce and 3-character minimum to destination search">
                A <code>Timer</code>-based debounce was added to the customer app&apos;s <code>onSearchChanged()</code> handler. Autocomplete calls now fire only after 300ms of typing inactivity and require at least 3 characters. Estimated reduction: <strong className="text-zinc-200">60–80% of Places Autocomplete calls.</strong>
              </StepDone>
              <StepDone title="Implemented nearby places result caching (10-minute TTL, 200m movement threshold)">
                The <code>fetchNearbyPlacesWhere()</code> call on app open is now gated by a cache check. Results are reused for 10 minutes if the user&apos;s position has not moved more than 200m from the last fetch position.
              </StepDone>
              <StepDone title={<>Re-enabled background location <code>distanceFilter: 20</code> in Driver app</>}>
                The <code>location.changeSettings(distanceFilter: 20)</code> call that had been commented out was restored. Background location accuracy was also lowered to <code>LocationAccuracy.balanced</code> while backgrounded. Drivers waiting for rides no longer send continuous location updates to Firestore.
              </StepDone>
            </div>

            <Callout variant="success">
              <strong className="text-emerald-400">Validation:</strong> All Phase 1 changes were tested in the Jamboride staging environment for one week prior to production deployment. API call volume telemetry confirmed a measured reduction consistent with projections.
            </Callout>
          </section>

          {/* ── S4: Architecture ── */}
          <section id="s4" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[3]} />
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
              The core architectural change is to move all Google API calls from mobile clients to a backend service. Mobile apps should only communicate with your own backend, which acts as a smart proxy with caching, deduplication, and cost controls.
            </p>

            {/* Architecture SVG diagram */}
            <div className="rounded-xl border border-white/8 bg-[#060908] p-4 overflow-x-auto mb-6">
              <svg width="100%" viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 500 }}>
                <defs>
                  <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                  <marker id="arb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#2977c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                  <marker id="arp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke="#7864c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </marker>
                </defs>
                {/* Labels */}
                {[["MOBILE CLIENTS", 20, 60], ["API GATEWAY", 20, 188], ["BACKEND SERVICES", 20, 318], ["EXTERNAL APIs", 20, 448]].map(([t, x, y]) => (
                  <text key={String(t)} fontFamily="'DM Mono',monospace" fontSize="9" letterSpacing="2" x={Number(x)} y={Number(y)} fill="#3d5c3a">{t}</text>
                ))}
                {/* Mobile clients */}
                <rect x="140" y="30" width="150" height="52" rx="8" fill="rgba(201,162,39,0.07)" stroke="rgba(201,162,39,0.3)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.75)" x="215" y="52" textAnchor="middle">Customer App</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(201,162,39,0.5)" x="215" y="70" textAnchor="middle">Flutter · GetX</text>
                <rect x="310" y="30" width="150" height="52" rx="8" fill="rgba(201,162,39,0.07)" stroke="rgba(201,162,39,0.3)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.75)" x="385" y="52" textAnchor="middle">Driver App</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(201,162,39,0.5)" x="385" y="70" textAnchor="middle">Flutter · GetX</text>
                {/* Arrows to gateway */}
                <line x1="215" y1="82" x2="265" y2="158" stroke="rgba(201,162,39,0.4)" strokeWidth="1" markerEnd="url(#arr)"/>
                <line x1="385" y1="82" x2="325" y2="158" stroke="rgba(201,162,39,0.4)" strokeWidth="1" markerEnd="url(#arr)"/>
                {/* Gateway */}
                <rect x="160" y="158" width="265" height="52" rx="8" fill="rgba(42,157,92,0.07)" stroke="rgba(42,157,92,0.3)" strokeWidth="1.5"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="12" fontWeight="600" fill="rgba(244,240,232,0.8)" x="292" y="179" textAnchor="middle">API Gateway / NestJS</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(42,157,92,0.5)" x="292" y="197" textAnchor="middle">Auth · Rate Limiting · REST + WebSocket</text>
                {/* Arrows to services */}
                <line x1="240" y1="210" x2="195" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                <line x1="292" y1="210" x2="355" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                <line x1="344" y1="210" x2="520" y2="278" stroke="rgba(41,119,192,0.4)" strokeWidth="0.8" strokeDasharray="4 3" markerEnd="url(#arb)"/>
                {/* Services */}
                {[
                  [130, 278, "Route Service", "Polyline · ETA cache", 195],
                  [300, 278, "Dispatch Service", "Driver matching · Geo", 365],
                  [470, 278, "Location Service", "WebSocket · broadcast", 535],
                ].map(([x, y, title, sub, tx]) => (
                  <g key={String(title)}>
                    <rect x={Number(x)} y={Number(y)} width="145" height="52" rx="7" fill="rgba(41,119,192,0.07)" stroke="rgba(41,119,192,0.25)" strokeWidth="1"/>
                    <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.7)" x={Number(tx)} y={Number(y) + 22} textAnchor="middle">{title}</text>
                    <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(41,119,192,0.5)" x={Number(tx)} y={Number(y) + 38} textAnchor="middle">{sub}</text>
                  </g>
                ))}
                {/* Redis */}
                <rect x="640" y="278" width="130" height="52" rx="7" fill="rgba(217,79,43,0.07)" stroke="rgba(217,79,43,0.25)" strokeWidth="1"/>
                <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.7)" x="705" y="300" textAnchor="middle">Redis Cache</text>
                <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(217,79,43,0.5)" x="705" y="316" textAnchor="middle">Routes · Places · ETAs</text>
                <line x1="280" y1="304" x2="638" y2="304" stroke="rgba(217,79,43,0.25)" strokeWidth="0.8" strokeDasharray="4 3"/>
                {/* Arrows to external */}
                <line x1="195" y1="330" x2="195" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                <line x1="365" y1="330" x2="365" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                <line x1="535" y1="330" x2="535" y2="398" stroke="rgba(120,90,200,0.35)" strokeWidth="0.8" markerEnd="url(#arp)"/>
                {/* External APIs */}
                {[
                  [120, 398, "Directions API", "Backend calls only", 195],
                  [290, 398, "Places API", "Cached in Redis", 362],
                  [460, 398, "Distance Matrix", "Batch requests only", 533],
                ].map(([x, y, title, sub, tx]) => (
                  <g key={String(title)}>
                    <rect x={Number(x)} y={Number(y)} width="147" height="52" rx="7" fill="rgba(120,90,200,0.06)" stroke="rgba(120,90,200,0.2)" strokeWidth="1"/>
                    <text fontFamily="'Instrument Sans',sans-serif" fontSize="11" fontWeight="600" fill="rgba(244,240,232,0.6)" x={Number(tx)} y={Number(y) + 22} textAnchor="middle">{title}</text>
                    <text fontFamily="'DM Mono',monospace" fontSize="8" fill="rgba(120,90,200,0.5)" x={Number(tx)} y={Number(y) + 38} textAnchor="middle">{sub}</text>
                  </g>
                ))}
                {/* Notice */}
                <rect x="648" y="110" width="132" height="36" rx="6" fill="none" stroke="rgba(217,79,43,0.3)" strokeWidth="1" strokeDasharray="3 3"/>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(217,79,43,0.8)" x="714" y="126" textAnchor="middle">Mobile apps NEVER</text>
                <text fontFamily="'DM Mono',monospace" fontSize="9" fill="rgba(217,79,43,0.8)" x="714" y="140" textAnchor="middle">call Google APIs directly</text>
              </svg>
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-3">Key Architecture Principles</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              {[
                ["Mobile → Your Backend only.", "Apps never call google.com directly. All Maps/Directions/Places calls are proxied through your backend."],
                ["Backend → Redis cache → Google APIs.", "Every route, ETA, and place result is cached in Redis. Repeated requests return cached data."],
                ["Location via WebSocket, not Firestore polling.", "Driver location updates are broadcast over WebSocket. No Firestore document write per update; no downstream read cascade."],
                ["Route calculated once per order.", "At order acceptance, the Route Service computes and stores the full polyline — trimmed client-side during the trip. API only called again on deviation."],
                ["Dispatch uses PostGIS geospatial queries.", "Finding nearby drivers uses a PostgreSQL + PostGIS radius query — not Firestore geohash queries and not a Google API call."],
              ].map(([bold, rest]) => (
                <li key={bold} className="flex gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span><strong className="text-zinc-200">{bold}</strong> {rest}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── S5: Firebase Evaluation ── */}
          <section id="s5" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[4]} />
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="pt-4">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-3">Keep — works well</p>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    {["Real-time order status updates (Firestore listeners)", "Firebase Auth — phone number OTP works well", "Firebase Storage — driver document uploads", "FCM push notifications — reliable, cross-platform", "Fast initial deployment — no backend infra to manage"].map(i => (
                      <li key={i} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-4">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-red-400 mb-3">Replace — hurting you</p>
                  <ul className="space-y-2 text-sm text-zinc-400">
                    {["Firestore pricing is per read/write — architecture writes thousands per ride", "No server-side logic — business rules embedded in mobile apps", "No native geospatial queries (geoflutterfire is a workaround)", "Vendor lock-in — hard to migrate once data is in Firestore", "Real-time listeners at scale create connection storm"].map(i => (
                      <li key={i} className="flex gap-2"><AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />{i}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Component", "Current", "Recommended", "Cost Impact"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Auth", "Firebase Auth", "Keep Firebase Auth", "Neutral"],
                    ["Push notifications", "FCM", "Keep FCM", "Neutral"],
                    ["Order data", "Firestore", "PostgreSQL", "−70% reads cost"],
                    ["Driver location", "Firestore doc updates", "WebSocket → Redis", "−95% write cost"],
                    ["Live tracking", "Firestore listener", "WebSocket broadcast", "−80% read cost"],
                    ["File storage", "Firebase Storage", "Keep Firebase Storage", "Neutral"],
                    ["Nearby drivers", "Geoflutterfire", "PostGIS radius query", "−100% Maps API"],
                  ].map(row => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300 font-medium">{row[0]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${row[3].startsWith("−") ? "text-emerald-400" : "text-zinc-500"}`}>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── S6: Cost Reduction ── */}
          <section id="s6" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[5]} />
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Optimization Action", "Affected Cost", "Estimated Reduction"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { action: "✓ Fix distanceFilter 1→8m + stop duplicate location stack", cost: "Firestore writes, downstream Directions calls", reduction: "~40–50%", done: true, highlight: false },
                    { action: "✓ Fix zombie listeners + store & cancel subscriptions", cost: "Firestore reads, Directions API calls per trip", reduction: "~15–25%", done: true, highlight: false },
                    { action: "✓ Polyline trimming instead of Directions recalculation", cost: "Directions API calls during trip", reduction: "~70–85% of in-trip calls", done: true, highlight: false },
                    { action: "✓ Debounce autocomplete + cache nearby places", cost: "Places Autocomplete + Nearby Search calls", reduction: "~60–80%", done: true, highlight: false },
                    { action: "Move route calculation to backend with Redis cache", cost: "All Directions API calls (shared cache)", reduction: "~50–70% additional", done: false, highlight: false },
                    { action: "Replace Firestore location tracking with WebSocket", cost: "Firestore reads + writes (largest Firebase cost)", reduction: "~85–95%", done: false, highlight: false },
                    { action: "Total (full implementation)", cost: "Google Maps APIs + Firebase", reduction: "60–75% overall reduction", done: false, highlight: true },
                  ].map((row, i) => (
                    <tr key={i} className={`border-b border-white/8 last:border-0 transition-colors ${row.highlight ? "bg-emerald-500/5 border-l-2 border-l-emerald-500" : "hover:bg-white/[0.02]"}`}>
                      <td className="px-4 py-3 text-zinc-300">{row.action}</td>
                      <td className="px-4 py-3 text-zinc-400">{row.cost}</td>
                      <td className={`px-4 py-3 font-mono text-xs font-semibold ${row.highlight ? "text-emerald-400" : row.done ? "text-emerald-400" : "text-amber-400"}`}>{row.reduction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Callout variant="success">
              <strong className="text-emerald-400">Phase 1 quick wins (✓ already implemented):</strong> Fixing distanceFilter, zombie listeners, polyline trimming, and debouncing reduced API costs by approximately <strong className="text-emerald-400">45–55%</strong> with changes only to Flutter code — no new infrastructure required.
            </Callout>
          </section>

          {/* ── S7: Backend Stack ── */}
          <section id="s7" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[6]} />
            <div className="grid md:grid-cols-2 gap-3 mb-6">
              {[
                { tech: "NestJS (Node.js)", why: "TypeScript-first, modular architecture with dependency injection. Ideal for domain-driven ride-hailing services. Built-in WebSocket gateway via Socket.io adapter." },
                { tech: "PostgreSQL + PostGIS", why: "ST_DWithin() replaces all geoflutterfire-based driver-finding logic. Full ACID compliance for order lifecycle. Far cheaper at scale than Firestore per-read pricing." },
                { tech: "Redis", why: "Cache Google API responses — polylines, ETAs, place results — with TTL. Pub/Sub channel for driver location broadcast. Eliminates Firestore as the location pipe entirely." },
                { tech: "Socket.io (WebSocket)", why: "Replace Firestore real-time listeners. Driver emits position every 5 seconds → server broadcasts to customer's room. No per-message database write." },
                { tech: "Bull / BullMQ (Job Queue)", why: "Queue for: route pre-computation, notifications, trip receipt processing, and fare calculation. Decouples latency-sensitive APIs from background work." },
                { tech: "Google Maps Platform (backend only)", why: "Called exclusively from the Route Service. RouteCache module: key = SHA256(origin+destination), TTL = 24h. Use Maps Routes API v2 (cheaper than legacy Directions API)." },
              ].map((s) => (
                <Card key={s.tech} className="border-white/8 bg-white/[0.025] hover:border-amber-500/25 transition-colors">
                  <CardContent className="pt-4">
                    <p className="text-sm font-bold text-zinc-100 mb-1.5">{s.tech}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">{s.why}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CodeBlock lang="structure" code={`src/
├── <span class="fn">modules</span>/
│   ├── <span class="kw">rides</span>/          <span class="cm"># Order lifecycle (create, accept, complete)</span>
│   ├── <span class="kw">drivers</span>/        <span class="cm"># Driver state, location, matching</span>
│   ├── <span class="kw">routes</span>/         <span class="cm"># Route calculation + Redis cache layer</span>
│   ├── <span class="kw">location</span>/       <span class="cm"># WebSocket gateway + Redis pub/sub</span>
│   ├── <span class="kw">places</span>/         <span class="cm"># Autocomplete + nearby, cached</span>
│   └── <span class="kw">notifications</span>/ <span class="cm"># FCM wrapper</span>
├── <span class="fn">common</span>/
│   ├── <span class="kw">guards</span>/         <span class="cm"># Firebase Auth token verification</span>
│   ├── <span class="kw">interceptors</span>/   <span class="cm"># Logging, error normalization</span>
│   └── <span class="kw">pipes</span>/          <span class="cm"># Validation</span>
└── <span class="fn">infra</span>/
    ├── <span class="kw">redis</span>/          <span class="cm"># Redis module (cache + pub/sub)</span>
    └── <span class="kw">maps</span>/           <span class="cm"># Google Maps SDK wrapper + caching</span>`} />
          </section>

          {/* ── S8: Migration Plan ── */}
          <section id="s8" className="scroll-mt-20 mb-16">
            <SectionHeader {...sections[7]} />

            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="border-l-2 border-emerald-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-emerald-500 mb-1">Phase 1 · Weeks 1–2 · Flutter Only · ✓ Complete</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Quick Wins — 45–55% cost reduction achieved</p>
                <Callout variant="success">All seven Phase 1 steps have been completed and deployed to production. See Section 03 for the full breakdown of what was implemented and the validation process.</Callout>
              </div>

              {/* Phase 2 */}
              <div className="border-l-2 border-amber-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-amber-400 mb-1">Phase 2 · Weeks 3–8 · Backend API Layer</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Centralise all Google API calls — ~60–65% total reduction</p>
                <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside">
                  <li>Stand up NestJS backend with PostgreSQL + PostGIS and Redis.</li>
                  <li>Implement <code>RoutesModule</code> — proxy for Directions API with Redis cache (TTL 24h per origin/destination pair).</li>
                  <li>Implement <code>PlacesModule</code> — proxy for Autocomplete and Nearby Search with per-query Redis cache (TTL 15min).</li>
                  <li>Update Flutter apps to call your backend route/places endpoints instead of Google APIs directly. Remove the Google Maps API key from mobile apps.</li>
                  <li>Implement <code>LocationModule</code> with Socket.io WebSocket gateway. Driver app connects via WebSocket; broadcasts location every 5 seconds only when moving (&gt;5m).</li>
                  <li>Migrate order status updates from Firestore to WebSocket events.</li>
                </ol>
                <Callout variant="gold"><strong className="text-amber-400">Risk:</strong> Medium. Keep Firebase Firestore as fallback for order status for 2 weeks during transition. A/B rollout: 10% of new rides use new backend, 90% continue on Firebase.</Callout>
              </div>

              {/* Phase 3 */}
              <div className="border-l-2 border-blue-500/50 pl-5">
                <p className="font-mono text-[9px] tracking-widest uppercase text-blue-400 mb-1">Phase 3 · Weeks 9–16 · Full Architecture Migration</p>
                <p className="font-serif text-lg font-bold text-zinc-100 mb-3">Complete Firebase replacement for operational data — ~70–75% total reduction</p>
                <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside">
                  <li>Migrate order and trip data from Firestore to PostgreSQL with migration script for historical orders.</li>
                  <li>Implement driver matching via PostGIS <code>ST_DWithin()</code>. Remove all geoflutterfire queries.</li>
                  <li>Implement BullMQ job queue for: trip fare calculation, receipt generation, payout processing, and notification dispatching.</li>
                  <li>Keep Firebase Auth (phone OTP) + FCM + Storage — these remain cost-effective.</li>
                  <li>Decommission Firestore collections: <code>orders</code>, <code>driver_users</code> location fields, and order status fields.</li>
                  <li>Implement monitoring: Prometheus + Grafana dashboard for API call counts, cache hit rates, and WebSocket connection counts.</li>
                </ol>
                <Callout variant="gold"><strong className="text-amber-400">Risk:</strong> Medium-High. Run parallel writes (PostgreSQL + Firestore) for 4 weeks before cutting over reads. Maintain rollback scripts.</Callout>
              </div>
            </div>

            <h3 className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mt-8 mb-3">Risk Register</h3>
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02]">
                    {["Risk", "Probability", "Mitigation"].map(h => (
                      <th key={h} className="text-left font-mono text-[9px] tracking-widest uppercase text-zinc-600 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Location accuracy degradation with higher distanceFilter", "Low", "Validated in Phase 1 staging. Filter of 5–8m is imperceptible to users; GPS jitter at 1m provides zero UX benefit."],
                    ["WebSocket reconnection on mobile network switching", "Medium", "Implement exponential backoff reconnect in Flutter. Cache last known position in SharedPreferences as fallback."],
                    ["Redis cache stale routes (road closures)", "Low", "Use short TTL (2h) for high-traffic corridors. Driver deviation triggers cache invalidation for that route key."],
                    ["PostgreSQL migration data loss", "Low", "Run parallel writes for 4 weeks. Automated reconciliation script comparing Firestore vs PostgreSQL order counts daily."],
                    ["Increased backend infrastructure cost", "Low-Medium", "NestJS + PostgreSQL + Redis on a $40/month VPS handles thousands of concurrent rides. Savings far exceed infrastructure cost."],
                  ].map(row => (
                    <tr key={row[0]} className="border-b border-white/8 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-300">{row[0]}</td>
                      <td className={`px-4 py-3 font-mono text-xs ${row[1] === "Low" ? "text-emerald-400" : "text-amber-400"}`}>{row[1]}</td>
                      <td className="px-4 py-3 text-zinc-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Separator className="bg-white/8" />

          {/* Footer */}
          <footer className="text-center py-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-serif font-black text-sm text-black">O</div>
              <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Optin</span>
              <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">.co.tz</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed max-w-md mx-auto">
              Optin Digital Solutions Ltd · Dar es Salaam, Tanzania · optin.co.tz<br />
              This report is confidential and prepared exclusively for Jamboride.<br />
              Technical Audit · April 2026
            </p>
          </footer>

        </main>
      </div>
    </div>
  )
}
