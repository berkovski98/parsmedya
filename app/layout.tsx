import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { headers } from 'next/headers'
import { SiteFrame } from '@/components/site-frame'
import { isAnalyticsEnabled } from '@/lib/analytics-config'
import { getSiteUrl } from '@/lib/site-url'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'ParsMedya | Web ve Yazılım Ajansı',
  description:
    'ParsMedya; web sitesi, mobil uygulama, e-ticaret ve dijital pazarlama çözümleriyle işinizi büyüten kurumsal yazılım ajansıdır.',
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-icon.png?v=2',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let pathname = '/'
  try {
    pathname = (await headers()).get('x-pathname') || '/'
  } catch (error) {
    console.error('[layout] pathname header unavailable', error)
  }
  const lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
  return (
    <html
      lang={lang}
      data-analytics={isAnalyticsEnabled() ? 'on' : 'off'}
      className={`light ${inter.variable} ${manrope.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SiteFrame>{children}</SiteFrame>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
