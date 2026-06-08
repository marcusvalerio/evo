import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EVO',
  description: 'Evolua seu corpo',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'EVO' },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: '#000000', minHeight: '100dvh' }}>
        {children}
      </body>
    </html>
  )
}
