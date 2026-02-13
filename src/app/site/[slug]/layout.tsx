import { ReactNode } from 'react'
import { TrackingScripts } from '@/components/site/tracking-scripts'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { SiteHeader } from './_components/site-header'
import {
  Inter,
  Poppins,
  Open_Sans,
  Roboto,
  Montserrat,
  Nunito,
  Raleway,
  DM_Sans,
  Plus_Jakarta_Sans,
  Work_Sans,
  Outfit,
  Playfair_Display,
  Lora,
  Merriweather,
  Crimson_Text,
  Bebas_Neue,
  Oswald,
} from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-site', display: 'swap' })
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700', '900'], variable: '--font-site', display: 'swap' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const raleway = Raleway({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const lora = Lora({ subsets: ['latin'], variable: '--font-site', display: 'swap' })
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-site', display: 'swap' })
const crimsonText = Crimson_Text({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-site', display: 'swap' })
const bebasNeue = Bebas_Neue({ subsets: ['latin'], weight: ['400'], variable: '--font-site', display: 'swap' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-site', display: 'swap' })

const FONT_MAP: Record<string, { variable: string }> = {
  'inter': inter,
  'poppins': poppins,
  'open-sans': openSans,
  'roboto': roboto,
  'montserrat': montserrat,
  'nunito': nunito,
  'raleway': raleway,
  'dm-sans': dmSans,
  'plus-jakarta-sans': plusJakartaSans,
  'work-sans': workSans,
  'outfit': outfit,
  'playfair-display': playfairDisplay,
  'lora': lora,
  'merriweather': merriweather,
  'crimson-text': crimsonText,
  'bebas-neue': bebasNeue,
  'oswald': oswald,
}

interface LayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

async function getStoreLayoutData(slug: string) {
  const [storeData] = await db
    .select({
      name: store.name,
      slug: store.slug,
      primaryColor: store.primaryColor,
      heroBackgroundColor: store.heroBackgroundColor,
      buttonColor: store.buttonColor,
      logoUrl: store.logoUrl,
      whatsapp: store.whatsapp,
      whatsappDefaultMessage: store.whatsappDefaultMessage,
      showWhatsappButton: store.showWhatsappButton,
      fontFamily: store.fontFamily,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  return storeData || null
}

export default async function SiteLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const data = await getStoreLayoutData(slug)

  const cssVars: Record<string, string> = {}
  if (data?.primaryColor) {
    cssVars['--primary'] = data.primaryColor
  }
  if (data?.heroBackgroundColor) {
    cssVars['--store-hero-bg'] = data.heroBackgroundColor
  }
  if (data?.buttonColor) {
    cssVars['--store-button-color'] = data.buttonColor
  }

  const fontSlug = data?.fontFamily || 'inter'
  const selectedFont = FONT_MAP[fontSlug] || inter
  const fontClass = selectedFont.variable

  const showHeader = !!data?.logoUrl

  return (
    <div
      className={`relative w-full max-w-full min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${fontClass}`}
      style={{
        ...cssVars as React.CSSProperties,
        fontFamily: 'var(--font-site)',
      }}
    >
      <TrackingScripts storeSlug={slug} />
      <div className="relative z-10 flex min-h-screen flex-col">
        {showHeader && data && (
          <SiteHeader
            storeName={data.name}
            slug={data.slug}
            logoUrl={data.logoUrl!}
            whatsapp={data.whatsapp}
            whatsappDefaultMessage={data.whatsappDefaultMessage}
            buttonColor={data.buttonColor}
            showWhatsappButton={data.showWhatsappButton}
          />
        )}
        {children}
      </div>
    </div>
  )
}
