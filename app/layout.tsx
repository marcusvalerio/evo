import type { Metadata, Viewport } from 'next'
import { Goldman, Tenor_Sans, Sora } from 'next/font/google'
import './globals.css'

const goldman = Goldman({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
})

const tenorSans = Tenor_Sans({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-title',
  display: 'swap',
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EVO | Evolua seu corpo',
  description: 'App premium de acompanhamento de dieta e evolucao fitness',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'EVO' },
}

export const viewport: Viewport = {
  themeColor: '#000022',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${goldman.variable} ${tenorSans.variable} ${sora.variable}`}>
      <body className="antialiased min-h-dvh" style={{ background: '#000022', fontFamily: 'var(--font-body)' }}>
        {children}
      </body>
    </html>
  )
}
