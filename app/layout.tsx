import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { SiteFrame } from '@/components/site-frame'
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
  metadataBase: new URL('https://parsmedya.net'),
  title: 'ParsMedya | Web ve Yazılım Ajansı',
  description:
    'ParsMedya; web sitesi, mobil uygulama, e-ticaret ve dijital pazarlama çözümleriyle işinizi büyüten kurumsal yazılım ajansıdır.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="tr"
      className={`light ${inter.variable} ${manrope.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <SiteFrame>{children}</SiteFrame>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
