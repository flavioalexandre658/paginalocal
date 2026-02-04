import '@/app/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from '@/components/providers/query-provider'

export const metadata: Metadata = {
  title: {
    default: 'Página Local | Presença Digital para Negócios Locais',
    template: '%s | Página Local',
  },
  description: 'Crie a landing page do seu negócio local em minutos. SEO otimizado para aparecer no Google e converter visitantes em clientes via WhatsApp.',
  keywords: [
    'site para negócio local',
    'landing page para empresas',
    'presença digital',
    'seo local',
    'site para pequenos negócios',
    'página de vendas',
    'site para borracharia',
    'site para salão de beleza',
    'site para oficina',
    'pagina local',
  ],
  alternates: {
    canonical: 'https://www.paginalocal.com.br',
  },
  openGraph: {
    title: 'Página Local | Presença Digital para Negócios Locais',
    description: 'Landing pages de alta conversão para negócios locais. Apareça no Google e receba contatos via WhatsApp.',
    url: 'https://www.paginalocal.com.br',
    siteName: 'Página Local',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Página Local | Presença Digital para Negócios Locais',
    description: 'Landing pages de alta conversão para negócios locais.',
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
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
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
      </head>
      <body className={`bg-background antialiased ${inter.variable}`} suppressHydrationWarning>
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
        </QueryProvider>
      </body>
    </html>
  )
}
