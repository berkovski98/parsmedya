import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { headers } from 'next/headers'
import { SiteFrame } from '@/components/site-frame'
import { isAnalyticsEnabled } from '@/lib/analytics-config'
import { getSiteUrl } from '@/lib/site-url'
import { MOTION_BOOT_SCRIPT } from '@/lib/motion'
import { siteGraph } from '@/lib/schema/organization'
import { safeJsonLd } from '@/lib/seo'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: 'Pars Medya | Web ve Yazılım Ajansı',
  description:
    'Pars Medya; web sitesi, mobil uygulama, e-ticaret ve dijital pazarlama çözümleriyle işinizi büyüten kurumsal yazılım ajansıdır.',
  applicationName: 'Pars Medya',
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
    apple: '/apple-icon.png?v=2',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#101b33',
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
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')
  return (
    <html
      lang={lang}
      data-analytics={isAnalyticsEnabled() ? 'on' : 'off'}
      className={`light ${inter.variable} ${manrope.variable} bg-background`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        {!isAdmin && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(siteGraph(lang)) }} />}
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  )
}
