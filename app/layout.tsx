import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EVO',
  description: 'Performance Telemetry System',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'EVO' },
}

export const viewport: Viewport = {
  themeColor: '#003447',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: '#003447', minHeight: '100dvh', fontFamily: "'Sora', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
