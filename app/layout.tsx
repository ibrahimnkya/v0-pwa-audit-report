import type { Metadata, Viewport } from 'next'
import { Inter, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const sourceSans = Source_Sans_3({ 
  subsets: ['latin'],
  variable: '--font-source-sans'
})

export const metadata: Metadata = {
  title: 'IT Infrastructure Audit Report | Optin Technology Limited',
  description: 'Confidential IT Infrastructure Security Audit Report for JamboRide prepared by Optin Technology Limited',
  generator: 'Optin Technology Limited',
  manifest: '/manifest.json',
  keywords: ['IT audit', 'security', 'infrastructure', 'JamboRide', 'Optin'],
  authors: [{ name: 'Optin Technology Limited', url: 'https://optin.co.tz' }],
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'JamboRide IT Audit',
  },
}

export const viewport: Viewport = {
  themeColor: '#1c9f82',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased bg-background">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
