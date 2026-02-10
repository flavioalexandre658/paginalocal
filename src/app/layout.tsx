import '@/app/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/components/providers/query-provider'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/shared/google-tag-manager'

export const metadata: Metadata = {
  title: {
    default: 'Presença Digital para Negócios Locais | Página Local',
    template: '%s | Página Local',
  },
  description: 'Crie a landing page do seu negócio local em minutos. SEO otimizado para aparecer no Google e converter visitantes em clientes via WhatsApp.',
  alternates: {
    canonical: 'https://paginalocal.com.br',
  },
  openGraph: {
    title: 'Presença Digital para Negócios Locais | Página Local',
    description: 'Landing pages de alta conversão para negócios locais. Apareça no Google e receba contatos via WhatsApp.',
    url: 'https://paginalocal.com.br',
    siteName: 'Página Local',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://paginalocal.com.br/assets/images/seo/previa_social.png',
        width: 1200,
        height: 630,
        alt: 'Página Local - Sua empresa no Google nas primeiras posições',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presença Digital para Negócios Locais | Página Local',
    description: 'Landing pages de alta conversão para negócios locais.',
    images: ['https://paginalocal.com.br/assets/images/seo/previa_social.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/assets/images/icon/favicon.ico',
    shortcut: '/assets/images/icon/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b82f6',
}

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <GoogleTagManagerNoScript />
      </head>
      <body className={`bg-background antialiased ${inter.variable}`} suppressHydrationWarning>
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
