import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { store, storePage, service } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { IconBrandWhatsapp, IconPhone, IconMapPin } from '@tabler/icons-react'
import { buildStoreUrl } from '@/lib/google-indexing'
import { getWhatsAppUrl } from '@/lib/utils'
import { HeroSection } from '../_components/hero-section'
import { SiteFooter } from '../_components/site-footer'

const FloatingContact = dynamic(() => import('../_components/floating-contact').then(m => m.FloatingContact))

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return phone
}

async function getContactPageData(slug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(and(eq(store.slug, slug), eq(store.isActive, true)))
    .limit(1)

  if (!storeData[0]) return null

  const [pageData, services, activePages] = await Promise.all([
    db
      .select()
      .from(storePage)
      .where(
        and(
          eq(storePage.storeId, storeData[0].id),
          eq(storePage.type, 'CONTACT'),
          eq(storePage.isActive, true)
        )
      )
      .limit(1),
    db
      .select()
      .from(service)
      .where(eq(service.storeId, storeData[0].id))
      .orderBy(asc(service.position)),
    db
      .select()
      .from(storePage)
      .where(
        and(
          eq(storePage.storeId, storeData[0].id),
          eq(storePage.isActive, true)
        )
      ),
  ])

  if (!pageData[0]) return null

  return {
    store: storeData[0],
    page: pageData[0],
    services: services.filter(s => s.isActive),
    institutionalPages: activePages,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getContactPageData(slug)

  if (!data) {
    return { title: 'Página não encontrada' }
  }

  const { store: storeData, page } = data

  const title = page.seoTitle || `Contato | ${storeData.name}`
  const description = page.seoDescription || `Entre em contato com a ${storeData.name} - ${storeData.category} em ${storeData.city}, ${storeData.state}.`
  const pageUrl = buildStoreUrl(storeData.slug, storeData.customDomain) + '/contato'
  const ogImage = storeData.coverUrl || storeData.logoUrl
  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'

  return {
    title: { absolute: title },
    description,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    authors: [{ name: storeData.name }],
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
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: pageUrl,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${storeData.name} - ${storeData.category} em ${storeData.city}`,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    other: {
      'geo.region': `BR-${storeData.state}`,
      'geo.placename': storeData.city,
      ...(storeData.latitude && storeData.longitude && {
        'geo.position': `${storeData.latitude};${storeData.longitude}`,
        'ICBM': `${storeData.latitude}, ${storeData.longitude}`,
      }),
    },
  }
}

export default async function ContatoPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getContactPageData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, page, services, institutionalPages: activePages } = data

  const baseUrl = buildStoreUrl(storeData.slug, storeData.customDomain)
  const pageUrl = `${baseUrl}/contato`
  const whatsappUrl = getWhatsAppUrl(storeData.whatsapp)

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: page.title,
    description: page.seoDescription || page.content?.substring(0, 200),
    url: pageUrl,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
      telephone: storeData.phone ? `+55${storeData.phone.replace(/\D/g, '')}` : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: storeData.address,
        addressLocality: storeData.city,
        addressRegion: storeData.state,
        addressCountry: 'BR',
      },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: storeData.name,
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HeroSection
        store={storeData}
        pageTitle={page.title}
        pageSubtitle={`${storeData.category} em ${storeData.city}, ${storeData.state}`}
        compact
        showBackLink
      />

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {page.content?.split('\n').filter(Boolean).map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <IconBrandWhatsapp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">WhatsApp</p>
                <p className="text-sm text-slate-500">{formatPhone(storeData.whatsapp)}</p>
              </div>
            </a>

            {storeData.phone && (
              <a
                href={`tel:+55${storeData.phone.replace(/\D/g, '')}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <IconPhone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Telefone</p>
                  <p className="text-sm text-slate-500">{formatPhone(storeData.phone)}</p>
                </div>
              </a>
            )}

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeData.address + ', ' + storeData.city + ' - ' + storeData.state)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/50 md:col-span-2"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30">
                <IconMapPin className="h-6 w-6 text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Endereço</p>
                <p className="text-sm text-slate-500">{storeData.address}, {storeData.city} - {storeData.state}</p>
              </div>
            </a>
          </div>
        </div>
      </main>

      <SiteFooter
        storeName={storeData.name}
        city={storeData.city}
        state={storeData.state}
        category={storeData.category}
        categorySlug={storeData.category.toLowerCase().replace(/\s+/g, '-')}
        storeSlug={storeData.slug}
        highlightText={storeData.highlightText}
        instagramUrl={storeData.instagramUrl}
        facebookUrl={storeData.facebookUrl}
        googleBusinessUrl={storeData.googleBusinessUrl}
        services={services.map(s => ({ name: s.name, slug: s.slug || '' }))}
        institutionalPages={activePages.map(p => ({ title: p.title, slug: p.slug }))}
      />

      <FloatingContact
        store={{
          id: storeData.id,
          name: storeData.name,
          slug: storeData.slug,
          whatsapp: storeData.whatsapp,
          phone: storeData.phone,
          whatsappDefaultMessage: storeData.whatsappDefaultMessage,
          isActive: storeData.isActive,
          showWhatsappButton: storeData.showWhatsappButton,
          showCallButton: storeData.showCallButton,
          buttonColor: storeData.buttonColor,
        }}
      />
    </>
  )
}
