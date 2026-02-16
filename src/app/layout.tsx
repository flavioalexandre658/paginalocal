import '@/app/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/components/providers/query-provider'
import { CookieConsent } from '@/components/shared/cookie-consent'
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/shared/google-tag-manager'

export const metadata: Metadata = {
  other: {
    'X-DNS-Prefetch-Control': 'on',
  },
  title: {
    default: 'Site para Negócio Local | Apareça no Topo do Google | Página Local',
    template: '%s | Página Local',
  },
  description: 'Tenha um site profissional para seu negócio local com SEO nativo para aparecer no topo do Google. Nós fazemos tudo por você. Receba clientes pelo WhatsApp em até 24 horas.',
  alternates: {
    canonical: 'https://paginalocal.com.br',
  },
  openGraph: {
    title: 'Site para Negócio Local | Apareça no Topo do Google | Página Local',
    description: 'Sites otimizados para SEO local. Coloque sua empresa no topo do Google e receba clientes pelo WhatsApp. Nós cuidamos de tudo.',
    url: 'https://paginalocal.com.br',
    siteName: 'Página Local',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://paginalocal.com.br/assets/images/seo/previa_social.jpg',
        width: 1200,
        height: 630,
        alt: 'Página Local - Seu negócio no topo do Google',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Site para Negócio Local | Apareça no Topo do Google | Página Local',
    description: 'Sites otimizados para SEO local. Coloque sua empresa no topo do Google e receba clientes pelo WhatsApp.',
    images: ['https://paginalocal.com.br/assets/images/seo/previa_social.jpg'],
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
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: false, // ← não faz preload automático
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
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
