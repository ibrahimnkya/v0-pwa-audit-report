"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, LogOut, Printer } from "lucide-react"

interface AuditReportProps {
  userEmail: string
  onLogout: () => void
}

const sections = [
  { id: "s1", title: "Root Cause Analysis" },
  { id: "s2", title: "Code & Architecture Weaknesses" },
  { id: "s3", title: "Steps Taken (Phase 1 Complete)" },
  { id: "s4", title: "Refactored Architecture Proposal" },
  { id: "s5", title: "Firebase Evaluation" },
  { id: "s6", title: "Cost Reduction Estimate" },
  { id: "s7", title: "Recommended Backend Stack" },
  { id: "s8", title: "Implementation & Migration Plan" },
]

function Issue({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
      <h3 className="font-semibold text-amber-300">{title}</h3>
      <div className="text-sm text-zinc-300 leading-7">{children}</div>
    </div>
  )
}

export function AuditReport({ userEmail, onLogout }: AuditReportProps) {
  const [active, setActive] = useState("s1")

  const progress = useMemo(() => {
    const idx = sections.findIndex((s) => s.id === active)
    return ((idx + 1) / sections.length) * 100
  }, [active])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.2, 0.4, 0.6] }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f0d] text-[#f4f0e8]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060908]/95 backdrop-blur px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Confidential</p>
            <p className="text-sm text-zinc-300">Jamboride — Technical Audit Report · April 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 hidden sm:block">{userEmail}</span>
            <Button size="sm" variant="outline" onClick={() => window.print()} className="border-white/20 bg-transparent text-zinc-200">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button size="sm" variant="ghost" onClick={onLogout} className="text-zinc-300">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-6 px-4 py-6">
        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Progress</p>
            <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-amber-400 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-zinc-400 mt-2">{Math.round(progress)}% reviewed</p>
          </div>

          <nav className="space-y-1">
            {sections.map((s, i) => {
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                    active === s.id ? "bg-amber-400/15 text-amber-300" : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="mr-2 text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              )
            })}
          </nav>
        </aside>

        <main className="space-y-6">
          <Card className="border-white/10 bg-white/[0.03] text-[#f4f0e8]">
            <CardHeader>
              <Badge className="w-fit bg-amber-400/20 text-amber-300 border-amber-400/30">Technical Audit Report · April 2026</Badge>
              <CardTitle className="text-3xl sm:text-4xl font-bold">Jamboride Architecture & Cost Optimization Audit</CardTitle>
              <p className="text-zinc-300">Flutter · Firebase · Google Maps / Directions APIs · Audited by Optin Digital Solutions Ltd</p>
            </CardHeader>
          </Card>

          <section id="s1" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">01 — Root Cause Analysis (Code-Level)</h2>
            <p className="text-zinc-300">After direct analysis of <code>home_controller.dart</code>, <code>live_tracking_controller.dart</code>, <code>fire_store_utils.dart</code>, and related controllers, these 8 systemic issues were identified as the primary cost drivers.</p>
            <Issue title="Issue 1 — distanceFilter: 1 Meter (Most Expensive Single Line)">Both apps use <code>distanceFilter: 1</code> with <code>bestForNavigation</code>. This can create thousands of location ticks per hour and triggers constant Firestore writes plus route recalculation cascades.</Issue>
            <Issue title="Issue 2 — Directions API Called on Every Firebase Snapshot">Both apps call <code>getRouteBetweenCoordinates()</code> inside a Firestore snapshot listener. Driver document writes trigger repeated Directions calls from both client apps.</Issue>
            <Issue title="Issue 3 — shouldReRoute Threshold of 20 Meters is Too Aggressive">A 20m reroute threshold means near-continuous API calls during active trips.</Issue>
            <Issue title="Issue 4 — Duplicate Location Tracking Stack">Driver app ran both <code>Geolocator.getPositionStream()</code> and <code>location.onLocationChanged.listen()</code>, doubling writes/cost.</Issue>
            <Issue title="Issue 5 — Nested Firestore Listeners">Inner listeners were opened repeatedly inside outer listener callbacks without proper cancel lifecycle, causing zombie listeners and fan-out.</Issue>
            <Issue title="Issue 6 — Places + Distance Matrix on Every Keystroke">Destination search made API calls for nearly every typed character with no debounce.</Issue>
            <Issue title="Issue 7 — Nearby Places API Called on Every App Open">Nearby requests ran on each app open without cache reuse.</Issue>
            <Issue title="Issue 8 — Background Location Always Enabled Without Effective distanceFilter">Background tracking produced continuous updates while idle.</Issue>
          </section>

          <section id="s2" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">02 — Code & Architecture Weaknesses</h2>
            <Issue title="Unconditional listeners on frequently-written docs">Heavy use of <code>.snapshots().listen()</code> on high-churn docs creates high read amplification.</Issue>
            <Issue title="Unmanaged StreamSubscriptions">Subscriptions not cancelled in <code>onClose()</code> created memory leaks and duplicate downstream calls.</Issue>
            <Issue title="No server-side cache/proxy for Google APIs">Mobile clients called Maps APIs directly, preventing deduplication and shared caching.</Issue>
          </section>

          <section id="s3" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">03 — Steps Taken (Phase 1 Complete)</h2>
            <p className="text-zinc-300">Phase 1 completed with estimated 45–55% reduction from Flutter-side quick wins.</p>
            {[
              "Corrected distanceFilter values to adaptive thresholds (15m idle, 8m pickup, 5m active trip).",
              "Removed duplicate location stack in Driver app.",
              "Stored/cancelled all StreamSubscriptions and flattened nested listeners.",
              "Implemented client-side polyline trimming with deviation-only reroute logic.",
              "Added 300ms debounce + 3-character minimum for destination search.",
              "Implemented nearby places cache (10-minute TTL, 200m movement threshold).",
              "Re-enabled background distanceFilter: 20 and balanced accuracy while backgrounded.",
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                <p className="text-sm text-zinc-200">{item}</p>
              </div>
            ))}
          </section>

          <section id="s4" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">04 — Refactored Architecture Proposal</h2>
            <p className="text-zinc-300">Move all Google API calls behind backend services (NestJS + Redis cache + WebSocket location stream). Mobile apps should never call Google APIs directly.</p>
            <ul className="list-disc pl-6 text-zinc-300 space-y-1">
              <li>Mobile → Backend only, no direct google.com calls.</li>
              <li>Backend → Redis cache → Google APIs.</li>
              <li>Location tracking via WebSocket broadcast, not Firestore polling writes.</li>
              <li>Route computed once per order; reroute only on significant deviation.</li>
              <li>Dispatch matching via PostGIS radius queries.</li>
            </ul>
          </section>

          <section id="s5" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">05 — Firebase Evaluation</h2>
            <p className="text-zinc-300"><strong>Keep:</strong> Firebase Auth, FCM, Storage. <strong>Replace for ops:</strong> location, ride matching, route calculations, order management, real-time streams.</p>
          </section>

          <section id="s6" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">06 — Cost Reduction Estimate</h2>
            <p className="text-zinc-300">Projected total reduction with full implementation: <strong>60–75%</strong>. Phase 1 quick wins already delivered ~45–55%.</p>
          </section>

          <section id="s7" className="space-y-4 scroll-mt-24">
            <h2 className="text-2xl font-semibold">07 — Recommended Backend Stack</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                "NestJS (Node.js)",
                "PostgreSQL + PostGIS",
                "Redis",
                "Socket.io (WebSocket)",
                "Bull/BullMQ",
                "Google Maps via backend only",
              ].map((item) => (
                <li key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-zinc-200">{item}</li>
              ))}
            </ul>
          </section>

          <section id="s8" className="space-y-4 scroll-mt-24 pb-10">
            <h2 className="text-2xl font-semibold">08 — Implementation & Migration Plan</h2>
            <p className="text-zinc-300">Phase 1 complete. Phase 2 centralizes API calls and introduces backend services. Phase 3 completes data migration and operational cutover with monitored rollback paths.</p>
          </section>
        </main>
      </div>
    </div>
  )
}
