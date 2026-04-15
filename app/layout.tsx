import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Mono, Instrument_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700', '900'],
  style: ['normal', 'italic'],
})

const dmMono = DM_Mono({ 
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
})

const instrumentSans = Instrument_Sans({ 
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Jamboride Technical Audit Report | Optin',
  description: 'Confidential technical audit report by Optin.co.tz for Jamboride - Architecture & Cost Optimization Audit',
  generator: 'Optin Digital Solutions Ltd',
  manifest: '/manifest.json',
  keywords: ['technical audit', 'Flutter', 'Firebase', 'Google Maps', 'Jamboride', 'Optin', 'cost optimization'],
  authors: [{ name: 'Optin Digital Solutions Ltd', url: 'https://optin.co.tz' }],
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
    title: 'Jamboride Audit',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f0d',
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
    <html lang="en" className={`${playfair.variable} ${dmMono.variable} ${instrumentSans.variable} bg-ink`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
