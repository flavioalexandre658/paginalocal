import '@/app/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter, Fraunces, Playfair_Display } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/components/providers/query-provider'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/shared/google-tag-manager'
import {
  buildPlatformMetadata,
  PLATFORM,
  PLATFORM_DEFAULT_DESCRIPTION,
} from '@/lib/platform-seo'

const baseMetadata = buildPlatformMetadata({
  title: `${PLATFORM.name} — Construtor de sites e negócios com IA`,
  description: PLATFORM_DEFAULT_DESCRIPTION,
  keywords: [
    'construtor de sites com IA',
    'criar site com IA em 30 segundos',
    'plataforma all-in-one de IA para negócios',
    'site profissional sem código',
    'lançar negócio online com IA',
    'expandir negócio com IA',
    'IA para empreendedores',
    'site com SEO nativo',
  ],
})

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: `${PLATFORM.name} — Construtor de sites e negócios com IA`,
    template: `%s | ${PLATFORM.name}`,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f172a',
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
  preload: false,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable} ${playfair.variable} ${GeistSans.variable}`} suppressHydrationWarning>
      <head>
        <GoogleTagManagerNoScript />
      </head>
      <body className="bg-background antialiased" suppressHydrationWarning>
        <GoogleTagManager />
        <QueryProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              success: {
                duration: 3000,
                iconTheme: {
                  primary: 'green',
                  secondary: 'white',
                },
              },
            }}
          />
          {children}
          <CookieConsent />
        </QueryProvider>
      </body>
    </html>
  )
}
