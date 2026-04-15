"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  FileText,
  Zap,
  Shield,
  Smartphone,
  Globe,
  Clock,
  TrendingUp,
  Info,
  ChevronRight,
} from "lucide-react"

interface AuditCategory {
  name: string
  score: number
  icon: React.ReactNode
  items: AuditItem[]
}

interface AuditItem {
  title: string
  status: "passed" | "warning" | "failed"
  description: string
  impact?: string
  recommendation?: string
}

interface AuditReportProps {
  appName?: string
  appUrl?: string
  auditDate?: string
  overallScore?: number
  categories?: AuditCategory[]
}

const defaultCategories: AuditCategory[] = [
  {
    name: "Performance",
    score: 87,
    icon: <Zap className="h-4 w-4" />,
    items: [
      {
        title: "First Contentful Paint",
        status: "passed",
        description: "First content painted in 1.2 seconds",
        impact: "Users perceive the page as loading quickly",
      },
      {
        title: "Largest Contentful Paint",
        status: "warning",
        description: "Largest content painted in 2.8 seconds",
        impact: "May feel slow on slower connections",
        recommendation: "Optimize images and lazy load below-the-fold content",
      },
      {
        title: "Cumulative Layout Shift",
        status: "passed",
        description: "CLS score of 0.05",
        impact: "Page elements are stable during loading",
      },
      {
        title: "Time to Interactive",
        status: "passed",
        description: "Page interactive in 1.8 seconds",
        impact: "Users can interact with the page quickly",
      },
    ],
  },
  {
    name: "PWA Compliance",
    score: 92,
    icon: <Smartphone className="h-4 w-4" />,
    items: [
      {
        title: "Web App Manifest",
        status: "passed",
        description: "Valid manifest.json with all required fields",
        impact: "App can be installed on devices",
      },
      {
        title: "Service Worker",
        status: "passed",
        description: "Active service worker with caching strategy",
        impact: "App works offline and loads instantly",
      },
      {
        title: "HTTPS",
        status: "passed",
        description: "Site served over secure HTTPS connection",
        impact: "Data is encrypted and secure",
      },
      {
        title: "Splash Screen",
        status: "warning",
        description: "Splash screen configuration incomplete",
        impact: "App launch experience may be inconsistent",
        recommendation: "Add apple-touch-startup-image meta tags for iOS",
      },
    ],
  },
  {
    name: "Security",
    score: 95,
    icon: <Shield className="h-4 w-4" />,
    items: [
      {
        title: "HTTPS Enabled",
        status: "passed",
        description: "All resources loaded over HTTPS",
        impact: "Connection is secure and encrypted",
      },
      {
        title: "Content Security Policy",
        status: "passed",
        description: "CSP headers properly configured",
        impact: "Protected against XSS attacks",
      },
      {
        title: "Mixed Content",
        status: "passed",
        description: "No mixed content detected",
        impact: "All resources are securely loaded",
      },
      {
        title: "Vulnerable Libraries",
        status: "passed",
        description: "No known vulnerabilities in dependencies",
        impact: "Application is protected from known exploits",
      },
    ],
  },
  {
    name: "Accessibility",
    score: 78,
    icon: <Globe className="h-4 w-4" />,
    items: [
      {
        title: "Color Contrast",
        status: "warning",
        description: "Some text elements have insufficient contrast",
        impact: "May be difficult to read for some users",
        recommendation: "Increase contrast ratio to at least 4.5:1 for normal text",
      },
      {
        title: "Alt Text",
        status: "passed",
        description: "All images have appropriate alt text",
        impact: "Screen readers can describe images",
      },
      {
        title: "Keyboard Navigation",
        status: "passed",
        description: "All interactive elements are keyboard accessible",
        impact: "Users can navigate without a mouse",
      },
      {
        title: "ARIA Labels",
        status: "failed",
        description: "Missing ARIA labels on interactive elements",
        impact: "Screen readers may not properly describe elements",
        recommendation: "Add aria-label or aria-labelledby to all buttons and links",
      },
    ],
  },
]

export function AuditReport({
  appName = "My PWA Application",
  appUrl = "https://myapp.example.com",
  auditDate = new Date().toLocaleDateString(),
  overallScore = 88,
  categories = defaultCategories,
}: AuditReportProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-primary"
    if (score >= 70) return "text-secondary"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-primary/10"
    if (score >= 70) return "bg-secondary/10"
    return "bg-destructive/10"
  }

  const getStatusIcon = (status: AuditItem["status"]) => {
    switch (status) {
      case "passed":
        return <CheckCircle2 className="h-5 w-5 text-primary" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-secondary" />
      case "failed":
        return <XCircle className="h-5 w-5 text-destructive" />
    }
  }

  const getStatusBadge = (status: AuditItem["status"]) => {
    switch (status) {
      case "passed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Passed
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
            Warning
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            Failed
          </Badge>
        )
    }
  }

  const totalPassed = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.status === "passed").length,
    0
  )
  const totalWarnings = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.status === "warning").length,
    0
  )
  const totalFailed = categories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => item.status === "failed").length,
    0
  )

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="border-border/50 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-optin-dark p-6 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-balance">{appName}</h1>
              <p className="text-primary-foreground/80 text-sm mt-1">{appUrl}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-foreground/70" />
              <span className="text-sm text-primary-foreground/80">Audited on {auditDate}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Overall Score */}
            <div className="flex flex-col items-center">
              <div
                className={`relative flex items-center justify-center w-28 h-28 rounded-full ${getScoreBg(overallScore)}`}
              >
                <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </span>
                </div>
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray={`${overallScore * 2.83} 283`}
                    strokeLinecap="round"
                    className={getScoreColor(overallScore)}
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Overall Score</p>
            </div>

            {/* Summary Stats */}
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold text-primary">{totalPassed}</span>
                </div>
                <p className="text-xs text-muted-foreground">Passed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <AlertTriangle className="h-4 w-4 text-secondary" />
                  <span className="text-2xl font-bold text-secondary">{totalWarnings}</span>
                </div>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-destructive/5 border border-destructive/10">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span className="text-2xl font-bold text-destructive">{totalFailed}</span>
                </div>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer"
            onClick={() => setActiveTab(category.name.toLowerCase())}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                    {category.score}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <Progress
                  value={category.score}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Results */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Detailed Audit Results
          </CardTitle>
          <CardDescription>
            Review each category for specific findings and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                </div>
              ))}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category.name} value={category.name.toLowerCase()}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <span className="font-semibold text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}
                      </span>
                      <span className="text-muted-foreground text-sm">/100</span>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="space-y-2">
                    {category.items.map((item, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-border/50 rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 flex-1">
                            {getStatusIcon(item.status)}
                            <span className="font-medium text-foreground text-left">
                              {item.title}
                            </span>
                          </div>
                          {getStatusBadge(item.status)}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-3 pl-8">
                            <p className="text-muted-foreground">{item.description}</p>
                            {item.impact && (
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                                <Info className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                  <span className="text-xs font-medium text-foreground">
                                    Impact:
                                  </span>
                                  <p className="text-sm text-muted-foreground">{item.impact}</p>
                                </div>
                              </div>
                            )}
                            {item.recommendation && (
                              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                                <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                  <span className="text-xs font-medium text-foreground">
                                    Recommendation:
                                  </span>
                                  <p className="text-sm text-muted-foreground">
                                    {item.recommendation}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
          <FileText className="h-4 w-4 mr-2" />
          Export JSON Data
        </Button>
      </div>
    </div>
  )
}
