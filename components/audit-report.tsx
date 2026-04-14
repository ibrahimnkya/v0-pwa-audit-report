"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Server, 
  Network, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
  LogOut,
  Printer,
  Globe,
  Database,
  Monitor,
  Wifi,
  HardDrive,
  Users,
  Key,
  Mail,
  ShieldCheck,
  AlertCircle,
  Info
} from "lucide-react"
import Image from "next/image"

interface AuditReportProps {
  userEmail: string
  onLogout: () => void
}

interface SectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <Card className="border border-border overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  )
}

function FindingCard({ 
  title, 
  severity, 
  status,
  description, 
  actionTaken,
  recommendation 
}: { 
  title: string
  severity: "critical" | "high" | "medium" | "low"
  status: "completed" | "pending"
  description: string
  actionTaken?: string
  recommendation?: string
}) {
  const severityColors = {
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-medium text-foreground">{title}</h4>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={severityColors[severity]}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
          {status === "completed" ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      {actionTaken && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-green-800 font-medium text-sm mb-1">
            <CheckCircle2 className="h-4 w-4" />
            Action Taken (Phase 1)
          </div>
          <p className="text-sm text-green-700">{actionTaken}</p>
        </div>
      )}
      {recommendation && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-amber-800 font-medium text-sm mb-1">
            <AlertCircle className="h-4 w-4" />
            Recommendation (Phase 2)
          </div>
          <p className="text-sm text-amber-700">{recommendation}</p>
        </div>
      )}
    </div>
  )
}

export function AuditReport({ userEmail, onLogout }: AuditReportProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="/images/optin-logo.webp"
            alt="Optin Technology Limited"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 print:py-4">
        {/* Title Section */}
        <div className="text-center space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            CONFIDENTIAL
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
            IT Infrastructure Security Audit Report
          </h1>
          <p className="text-xl text-muted-foreground">
            Tanzania Agricultural Development Bank (TADB)
          </p>
        </div>

        {/* Meta Information */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prepared For</p>
                    <p className="font-medium text-foreground">Tanzania Agricultural Development Bank</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prepared By</p>
                    <p className="font-medium text-foreground">Optin Technology Limited</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Report Version</p>
                    <p className="font-medium text-foreground">1.0 - Final</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Access Date</p>
                    <p className="font-medium text-foreground">{currentDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Status Overview */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Project Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Phase 1: Completed</span>
                </div>
                <p className="text-sm text-green-700">
                  Initial security assessment, critical vulnerability remediation, 
                  and foundational security controls have been implemented.
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800">Phase 2: Planned</span>
                </div>
                <p className="text-sm text-amber-700">
                  Advanced security measures, comprehensive monitoring, 
                  and long-term security enhancements are scheduled for implementation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <CollapsibleSection 
          title="Executive Summary" 
          icon={<FileText className="h-5 w-5" />}
          defaultOpen={true}
        >
          <div className="prose prose-sm max-w-none text-foreground">
            <p className="text-muted-foreground leading-relaxed">
              This report presents the findings from a comprehensive IT infrastructure security 
              audit conducted for Tanzania Agricultural Development Bank (TADB). The assessment 
              was performed by Optin Technology Limited and covers network infrastructure, 
              server systems, security controls, and operational procedures.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-red-600">3</p>
                <p className="text-sm text-red-700">Critical Issues</p>
                <p className="text-xs text-red-600 mt-1">All Resolved</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-orange-600">7</p>
                <p className="text-sm text-orange-700">High Priority</p>
                <p className="text-xs text-orange-600 mt-1">5 Resolved</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-yellow-700">Medium Priority</p>
                <p className="text-xs text-yellow-600 mt-1">8 Resolved</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">8</p>
                <p className="text-sm text-blue-700">Low Priority</p>
                <p className="text-xs text-blue-600 mt-1">4 Resolved</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Phase 1 remediation has been successfully completed, addressing all critical 
              vulnerabilities and implementing foundational security controls. This report 
              documents both the actions taken during Phase 1 and the recommendations for 
              Phase 2 implementation.
            </p>
          </div>
        </CollapsibleSection>

        {/* Network Infrastructure */}
        <CollapsibleSection 
          title="Network Infrastructure Assessment" 
          icon={<Network className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Firewall Configuration Hardening"
              severity="critical"
              status="completed"
              description="The perimeter firewall had overly permissive rules allowing unnecessary inbound traffic from external networks."
              actionTaken="Implemented strict firewall policies with deny-by-default rules. Configured zone-based security with DMZ isolation. Enabled deep packet inspection for HTTP/HTTPS traffic. Removed all legacy allow-any rules."
            />
            <FindingCard
              title="Network Segmentation Implementation"
              severity="high"
              status="completed"
              description="Flat network architecture allowed lateral movement between different departments and critical systems."
              actionTaken="Deployed VLAN segmentation separating core banking systems, general office network, and guest access. Implemented inter-VLAN routing with access control lists (ACLs). Isolated ATM and POS networks."
            />
            <FindingCard
              title="Wireless Network Security"
              severity="high"
              status="completed"
              description="Wireless networks were using outdated WPA2-PSK with a weak, shared password across all access points."
              actionTaken="Upgraded to WPA3-Enterprise with RADIUS authentication. Implemented certificate-based authentication for corporate devices. Deployed separate guest network with captive portal and bandwidth limitations."
            />
            <FindingCard
              title="Network Monitoring Enhancement"
              severity="medium"
              status="pending"
              description="Limited visibility into network traffic patterns and potential security incidents."
              recommendation="Deploy Network Detection and Response (NDR) solution with AI-powered threat detection. Implement NetFlow analysis for traffic baseline establishment and anomaly detection."
            />
            <FindingCard
              title="Redundant Network Links"
              severity="medium"
              status="pending"
              description="Single points of failure exist in the network backbone connecting headquarters to branch offices."
              recommendation="Establish secondary ISP connections with automatic failover. Implement SD-WAN solution for optimal traffic routing and link aggregation across all sites."
            />
          </div>
        </CollapsibleSection>

        {/* Server Infrastructure */}
        <CollapsibleSection 
          title="Server & Systems Security" 
          icon={<Server className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Operating System Patching"
              severity="critical"
              status="completed"
              description="Multiple servers were running outdated operating systems with known critical vulnerabilities (CVE-2024-21410, CVE-2024-21413)."
              actionTaken="Deployed all critical security patches across Windows Server and Linux infrastructure. Established monthly patching schedule with staged rollout. Implemented WSUS for centralized Windows Update management."
            />
            <FindingCard
              title="End-of-Life Systems Migration"
              severity="critical"
              status="completed"
              description="Three production servers were running Windows Server 2012 R2, which is no longer supported with security updates."
              actionTaken="Successfully migrated all workloads to Windows Server 2022. Decommissioned legacy systems following secure data destruction procedures. Updated all dependent applications for compatibility."
            />
            <FindingCard
              title="Database Security Hardening"
              severity="high"
              status="completed"
              description="Database servers had default configurations with unnecessary services enabled and weak authentication."
              actionTaken="Disabled unnecessary database features and services. Implemented strong password policies and removed default accounts. Enabled Transparent Data Encryption (TDE) for data at rest. Configured audit logging for all database access."
            />
            <FindingCard
              title="Server Hardening Standards"
              severity="medium"
              status="completed"
              description="Inconsistent security configurations across server infrastructure."
              actionTaken="Developed and deployed CIS benchmark-based hardening templates for all server operating systems. Implemented Group Policy Objects (GPOs) for consistent Windows configuration. Created Ansible playbooks for Linux server standardization."
            />
            <FindingCard
              title="Virtualization Security"
              severity="medium"
              status="pending"
              description="VMware vSphere environment requires additional security controls and isolation."
              recommendation="Implement vSphere Trust Authority for host attestation. Deploy NSX-T for micro-segmentation within virtual environment. Enable vSphere Encryption for virtual machine protection."
            />
          </div>
        </CollapsibleSection>

        {/* Access Control */}
        <CollapsibleSection 
          title="Identity & Access Management" 
          icon={<Users className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Privileged Access Management"
              severity="high"
              status="completed"
              description="Administrative accounts were shared among IT staff with no accountability or session recording."
              actionTaken="Deployed Privileged Access Management (PAM) solution. Implemented individual admin accounts with full audit logging. Enabled session recording for all privileged access. Established just-in-time access provisioning for sensitive systems."
            />
            <FindingCard
              title="Multi-Factor Authentication"
              severity="high"
              status="completed"
              description="Single-factor authentication was used for accessing critical banking systems and VPN."
              actionTaken="Rolled out Microsoft Authenticator app for all staff. Enabled MFA for VPN access, email, and core banking applications. Implemented hardware tokens for high-security administrative access."
            />
            <FindingCard
              title="Password Policy Enhancement"
              severity="medium"
              status="completed"
              description="Weak password policies allowed short passwords without complexity requirements."
              actionTaken="Implemented 14-character minimum password length with complexity requirements. Enabled password history (24 passwords) and maximum age (90 days). Deployed password blacklist to prevent common passwords."
            />
            <FindingCard
              title="Service Account Management"
              severity="medium"
              status="completed"
              description="Service accounts had static passwords with excessive privileges."
              actionTaken="Audited all service accounts and removed unnecessary privileges. Implemented managed service accounts (gMSAs) where possible. Established quarterly review process for service account access."
            />
            <FindingCard
              title="Zero Trust Architecture"
              severity="low"
              status="pending"
              description="Traditional perimeter-based security model does not protect against insider threats."
              recommendation="Implement Zero Trust Network Access (ZTNA) replacing traditional VPN. Deploy continuous identity verification with risk-based access controls. Integrate user behavior analytics for anomaly detection."
            />
          </div>
        </CollapsibleSection>

        {/* Data Protection */}
        <CollapsibleSection 
          title="Data Protection & Encryption" 
          icon={<Lock className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Data-at-Rest Encryption"
              severity="high"
              status="completed"
              description="Sensitive customer data was stored without encryption on file servers and databases."
              actionTaken="Enabled BitLocker encryption on all Windows servers with TPM protection. Implemented LUKS encryption for Linux systems. Deployed Transparent Data Encryption for all production databases. Encrypted backup storage with AES-256."
            />
            <FindingCard
              title="Data-in-Transit Security"
              severity="high"
              status="completed"
              description="Internal traffic was transmitted without encryption between application tiers."
              actionTaken="Deployed TLS 1.3 for all internal communications. Implemented certificate-based mutual authentication for service-to-service communication. Disabled legacy SSL/TLS protocols (SSLv3, TLS 1.0, TLS 1.1)."
            />
            <FindingCard
              title="Backup Encryption & Testing"
              severity="medium"
              status="completed"
              description="Backup data was not encrypted and restoration procedures were not regularly tested."
              actionTaken="Implemented AES-256 encryption for all backup data. Established monthly backup restoration testing. Documented and validated recovery procedures for all critical systems."
            />
            <FindingCard
              title="Data Loss Prevention"
              severity="medium"
              status="pending"
              description="No controls to prevent unauthorized data exfiltration via email or removable media."
              recommendation="Deploy enterprise DLP solution with content inspection. Implement USB port controls and removable media encryption. Configure email DLP policies for sensitive data patterns."
            />
            <FindingCard
              title="Data Classification Program"
              severity="low"
              status="pending"
              description="No formal data classification scheme to identify and protect sensitive information."
              recommendation="Develop and implement data classification policy with clear categories. Deploy automatic classification tools with sensitivity labels. Train staff on data handling procedures for each classification level."
            />
          </div>
        </CollapsibleSection>

        {/* Endpoint Security */}
        <CollapsibleSection 
          title="Endpoint Security" 
          icon={<Monitor className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Endpoint Protection Platform"
              severity="high"
              status="completed"
              description="Legacy antivirus solution lacked modern threat detection capabilities."
              actionTaken="Deployed Microsoft Defender for Endpoint across all workstations and servers. Enabled real-time protection, behavioral analysis, and EDR capabilities. Configured automatic remediation for detected threats."
            />
            <FindingCard
              title="Endpoint Hardening"
              severity="medium"
              status="completed"
              description="Workstations had inconsistent security configurations and unnecessary software."
              actionTaken="Deployed standardized Windows 11 image with CIS hardening. Removed administrative rights from standard users. Implemented application control policies with whitelisting for critical systems."
            />
            <FindingCard
              title="Mobile Device Management"
              severity="medium"
              status="completed"
              description="Mobile devices accessing corporate email lacked security controls."
              actionTaken="Deployed Microsoft Intune for mobile device management. Enforced device encryption, PIN requirements, and remote wipe capability. Implemented conditional access policies for mobile email access."
            />
            <FindingCard
              title="USB and Removable Media Control"
              severity="low"
              status="pending"
              description="Uncontrolled use of USB devices poses data exfiltration and malware risks."
              recommendation="Implement USB device control with allowed device whitelist. Deploy read-only mode for unauthorized devices. Enable automatic scanning of removable media on insertion."
            />
          </div>
        </CollapsibleSection>

        {/* Email Security */}
        <CollapsibleSection 
          title="Email & Communication Security" 
          icon={<Mail className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Email Authentication"
              severity="high"
              status="completed"
              description="Missing or misconfigured SPF, DKIM, and DMARC records allowed email spoofing."
              actionTaken="Implemented SPF records with strict -all policy. Deployed DKIM signing for all outbound email. Configured DMARC with p=reject policy and aggregate reporting. Enabled real-time DMARC reporting dashboard."
            />
            <FindingCard
              title="Advanced Threat Protection"
              severity="high"
              status="completed"
              description="Email gateway lacked advanced protection against phishing and malware attachments."
              actionTaken="Deployed Microsoft Defender for Office 365 with Safe Links and Safe Attachments. Implemented zero-hour auto purge (ZAP) for post-delivery threat remediation. Configured impersonation protection for executives."
            />
            <FindingCard
              title="Email Encryption"
              severity="medium"
              status="completed"
              description="Sensitive communications were not encrypted in transit or storage."
              actionTaken="Implemented Office 365 Message Encryption for sensitive emails. Deployed S/MIME certificates for executive communications. Configured transport rules for automatic encryption of sensitive content."
            />
            <FindingCard
              title="Security Awareness Training"
              severity="medium"
              status="pending"
              description="Staff lack training to identify and report phishing attempts."
              recommendation="Deploy security awareness training platform with regular phishing simulations. Implement gamified training modules with completion tracking. Establish reward program for reporting suspicious emails."
            />
          </div>
        </CollapsibleSection>

        {/* Security Monitoring */}
        <CollapsibleSection 
          title="Security Monitoring & Incident Response" 
          icon={<ShieldCheck className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="SIEM Implementation"
              severity="high"
              status="completed"
              description="No centralized security monitoring or log correlation capabilities."
              actionTaken="Deployed Microsoft Sentinel as cloud-native SIEM. Integrated logs from Active Directory, firewalls, servers, and endpoints. Created detection rules for common attack patterns. Established 24/7 monitoring with automated alerting."
            />
            <FindingCard
              title="Log Management"
              severity="medium"
              status="completed"
              description="Security logs were stored locally with limited retention and no protection."
              actionTaken="Implemented centralized log collection with 12-month retention. Enabled log integrity protection with cryptographic verification. Configured automatic backup of security logs to immutable storage."
            />
            <FindingCard
              title="Incident Response Plan"
              severity="medium"
              status="completed"
              description="No formal incident response procedures or escalation paths."
              actionTaken="Developed comprehensive incident response plan with defined roles and procedures. Established communication templates and escalation matrix. Conducted tabletop exercise to validate procedures."
            />
            <FindingCard
              title="Threat Intelligence Integration"
              severity="low"
              status="pending"
              description="Security tools operate without threat intelligence context."
              recommendation="Subscribe to financial sector threat intelligence feeds. Integrate threat intelligence with SIEM for automated indicator matching. Establish information sharing with banking sector ISAC."
            />
            <FindingCard
              title="Security Operations Center"
              severity="low"
              status="pending"
              description="Incident response is reactive with limited proactive threat hunting."
              recommendation="Establish or contract Security Operations Center (SOC) for 24/7 coverage. Implement threat hunting program with regular hypothesis-driven investigations. Deploy deception technology (honeypots) for early threat detection."
            />
          </div>
        </CollapsibleSection>

        {/* Business Continuity */}
        <CollapsibleSection 
          title="Business Continuity & Disaster Recovery" 
          icon={<Database className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Backup Infrastructure Upgrade"
              severity="high"
              status="completed"
              description="Backup systems had insufficient capacity and no offsite replication."
              actionTaken="Deployed enterprise backup solution with deduplication. Implemented 3-2-1 backup strategy (3 copies, 2 media types, 1 offsite). Established automated replication to geographically separate disaster recovery site."
            />
            <FindingCard
              title="Recovery Time Objectives"
              severity="medium"
              status="completed"
              description="No defined recovery time objectives (RTO) or recovery point objectives (RPO)."
              actionTaken="Established RTO and RPO for all critical systems based on business impact analysis. Configured backup schedules to meet defined RPO targets. Documented recovery procedures with validated time estimates."
            />
            <FindingCard
              title="DR Site Enhancement"
              severity="medium"
              status="pending"
              description="Disaster recovery site has limited capacity for full production failover."
              recommendation="Upgrade DR site infrastructure to support 100% production capacity. Implement automated failover for critical applications. Conduct semi-annual DR testing with full failover exercises."
            />
            <FindingCard
              title="Ransomware Resilience"
              severity="medium"
              status="pending"
              description="Backup systems may be vulnerable to ransomware encryption."
              recommendation="Implement immutable backup storage with air-gapped copies. Deploy backup verification with automated integrity testing. Establish isolated recovery environment for clean system restoration."
            />
          </div>
        </CollapsibleSection>

        {/* Compliance */}
        <CollapsibleSection 
          title="Compliance & Governance" 
          icon={<Globe className="h-5 w-5" />}
        >
          <div className="space-y-4">
            <FindingCard
              title="Security Policy Framework"
              severity="medium"
              status="completed"
              description="Security policies were outdated and lacked coverage for modern threats."
              actionTaken="Developed comprehensive security policy framework aligned with ISO 27001. Created policies for acceptable use, access control, incident response, and data protection. Established annual policy review process."
            />
            <FindingCard
              title="Regulatory Compliance Assessment"
              severity="medium"
              status="completed"
              description="Gap analysis required for Bank of Tanzania cybersecurity guidelines."
              actionTaken="Completed compliance assessment against BOT cybersecurity requirements. Documented compliance status and remediation roadmap. Established compliance monitoring dashboard with automated reporting."
            />
            <FindingCard
              title="Third-Party Risk Management"
              severity="medium"
              status="pending"
              description="Limited visibility into security posture of critical vendors and partners."
              recommendation="Implement vendor risk assessment program with security questionnaires. Establish minimum security requirements for third-party access. Conduct annual security reviews of critical vendors."
            />
            <FindingCard
              title="Security Awareness Program"
              severity="low"
              status="pending"
              description="No ongoing security awareness program for all staff."
              recommendation="Deploy comprehensive security awareness platform with role-based training. Conduct regular phishing simulations with targeted training for failures. Implement new hire security orientation program."
            />
          </div>
        </CollapsibleSection>

        {/* Recommendations Summary */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Phase 2 Recommendations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The following items are recommended for Phase 2 implementation to further 
              strengthen TADB&apos;s security posture:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">High Priority</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Network Detection and Response (NDR)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Data Loss Prevention (DLP)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Security Awareness Training Platform
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    DR Site Capacity Enhancement
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Medium/Low Priority</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    Zero Trust Architecture Implementation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    Virtualization Security Enhancement
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Threat Intelligence Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Third-Party Risk Management Program
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Separator />
        <footer className="text-center space-y-4 py-8 print:py-4">
          <Image
            src="/images/optin-logo.webp"
            alt="Optin Technology Limited"
            width={120}
            height={40}
            className="h-10 w-auto mx-auto"
          />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Optin Technology Limited</p>
            <p>Dar es Salaam, Tanzania</p>
            <p>
              <a href="mailto:info@optin.co.tz" className="text-primary hover:underline">
                info@optin.co.tz
              </a>
              {" | "}
              <a href="https://optin.co.tz" className="text-primary hover:underline">
                www.optin.co.tz
              </a>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            This document is confidential and intended solely for the use of Tanzania 
            Agricultural Development Bank. Unauthorized distribution is prohibited.
          </p>
        </footer>
      </main>
    </div>
  )
}
