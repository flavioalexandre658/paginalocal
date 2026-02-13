import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { store, storePage, service } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { buildStoreUrl } from '@/lib/google-indexing'
import { HeroSection } from '../_components/hero-section'
import { SiteFooter } from '../_components/site-footer'

const FloatingContact = dynamic(() => import('../_components/floating-contact').then(m => m.FloatingContact))
const FAQSection = dynamic(() => import('../_components/faq-section').then(m => m.FAQSection))

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getAboutPageData(slug: string) {
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
          eq(storePage.type, 'ABOUT'),
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
  const data = await getAboutPageData(slug)

  if (!data) {
    return { title: 'Página não encontrada' }
  }

  const { store: storeData, page } = data

  const title = page.seoTitle || `Sobre | ${storeData.name}`
  const description = page.seoDescription || `Conheça a ${storeData.name} - ${storeData.category} em ${storeData.city}, ${storeData.state}.`
  const pageUrl = buildStoreUrl(storeData.slug, storeData.customDomain) + '/sobre-nos'
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

export default async function SobreNosPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getAboutPageData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, page, services, institutionalPages: activePages } = data

  const baseUrl = buildStoreUrl(storeData.slug, storeData.customDomain)
  const pageUrl = `${baseUrl}/sobre-nos`

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    description: page.seoDescription || page.content?.substring(0, 200),
    url: pageUrl,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
      description: storeData.description,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
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

      <main className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7] dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Section header */}
            <div className="mb-14 animate-fade-in-up">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Sobre nós
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
                Conheça a <span className="text-primary">{storeData.name}</span>
              </h2>
              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                {storeData.category} em {storeData.city}, {storeData.state}
              </p>
            </div>

            {page.content && (
              <div className="animate-fade-in-up animation-delay-200 rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 md:p-10 shadow-lg dark:border-slate-800 dark:border-l-primary dark:bg-slate-900">
                <div className="space-y-4">
                  {page.content.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* CTA block */}
            <div className="mt-8 animate-fade-in-up animation-delay-300 overflow-hidden rounded-2xl bg-primary p-8 shadow-lg md:p-10">
              <h3 className="mb-2 text-xl font-extrabold text-white">
                Gostou? Entre em contato!
              </h3>
              <p className="text-white/70">
                Fale conosco pelo WhatsApp ou visite a {storeData.name} em {storeData.city}.
              </p>
            </div>
          </div>
        </div>
      </main>

      {Array.isArray(storeData.faq) && (storeData.faq as { question: string; answer: string }[]).length > 0 && (
        <FAQSection faq={storeData.faq as { question: string; answer: string }[]} storeName={storeData.name} />
      )}

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
        logoUrl={storeData.logoUrl}
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
