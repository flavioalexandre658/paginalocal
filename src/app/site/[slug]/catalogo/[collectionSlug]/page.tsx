import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { store, storeProductCollection, storeProduct, testimonial, storePage, service } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import {
  IconArrowLeft,
  IconMapPin,
  IconStar,
  IconShoppingCart,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import {
  getContrastTextClass,
  getContrastMutedClass,
  getContrastBadgeClasses,
  isLightColor,
} from '@/lib/color-contrast'
import { ProductCard } from '@/components/site/product-card'
import { TestimonialsSection } from '../../_components/testimonials-section'
import { FAQSection } from '../../_components/faq-section'
import { SiteFooter } from '../../_components/site-footer'
import { FloatingContact } from '../../_components/floating-contact'
import type { ProductImage } from '@/db/schema'
import { getStoreGrammar } from '@/lib/store-terms'
import { getCollectionPageUrl } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string; collectionSlug: string }>
}

async function getCollectionData(storeSlug: string, collectionSlug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData[0]) return null

  const collectionData = await db
    .select()
    .from(storeProductCollection)
    .where(and(
      eq(storeProductCollection.storeId, storeData[0].id),
      eq(storeProductCollection.slug, collectionSlug),
      eq(storeProductCollection.isActive, true)
    ))
    .limit(1)

  if (!collectionData[0]) return null

  // Fetch other collections for internal linking
  const [products, otherCollections, storeTestimonials, institutionalPages, services] = await Promise.all([
    db
      .select()
      .from(storeProduct)
      .where(and(
        eq(storeProduct.storeId, storeData[0].id),
        eq(storeProduct.collectionId, collectionData[0].id),
        eq(storeProduct.status, 'ACTIVE')
      ))
      .orderBy(asc(storeProduct.position)),

    db
      .select()
      .from(storeProductCollection)
      .where(and(
        eq(storeProductCollection.storeId, storeData[0].id),
        eq(storeProductCollection.isActive, true)
      ))
      .orderBy(asc(storeProductCollection.position)),

    db
      .select()
      .from(testimonial)
      .where(eq(testimonial.storeId, storeData[0].id))
      .orderBy(desc(testimonial.rating))
      .limit(6),

    db
      .select({ title: storePage.title, slug: storePage.slug })
      .from(storePage)
      .where(and(eq(storePage.storeId, storeData[0].id), eq(storePage.isActive, true))),

    db
      .select({ id: service.id, name: service.name, slug: service.slug, description: service.description, priceInCents: service.priceInCents })
      .from(service)
      .where(and(eq(service.storeId, storeData[0].id), eq(service.isActive, true)))
      .orderBy(asc(service.position)),
  ])

  return {
    store: storeData[0],
    collection: collectionData[0],
    products,
    otherCollections: otherCollections.filter(c => c.id !== collectionData[0].id),
    testimonials: storeTestimonials,
    institutionalPages,
    services,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, collectionSlug } = await params
  const data = await getCollectionData(slug, collectionSlug)

  if (!data) {
    return { title: 'Coleção não encontrada' }
  }

  const { store: storeData, collection, products } = data

  const title = collection.seoTitle
    || `${collection.name} | ${storeData.name} em ${storeData.city}`

  const description = collection.seoDescription
    || `${collection.description || collection.name} - ${storeData.name}, ${storeData.category.toLowerCase()} em ${storeData.city}, ${storeData.state}. ${products.length} ${products.length === 1 ? 'produto disponível' : 'produtos disponíveis'}. Confira!`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'
  const ogImage = collection.imageUrl || storeData.coverUrl || storeData.logoUrl

  return {
    title: { absolute: title },
    description,
    icons: { icon: faviconUrl, apple: faviconUrl },
    robots: {
      index: storeData.isActive,
      follow: storeData.isActive,
      googleBot: { index: storeData.isActive, follow: storeData.isActive, 'max-image-preview': 'large' as const },
    },
    alternates: { canonical: `${baseUrl}/catalogo/${collectionSlug}` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/catalogo/${collectionSlug}`,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${collection.name} - ${storeData.name}` }] : [],
    },
    twitter: {
      card: 'summary_large_image' as const,
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

export default async function CollectionPage({ params }: PageProps) {
  const { slug, collectionSlug } = await params
  const data = await getCollectionData(slug, collectionSlug)

  if (!data) {
    notFound()
  }

  const { store: storeData, collection, products, otherCollections, testimonials, institutionalPages, services } = data
  const g = getStoreGrammar(storeData.termGender, storeData.termNumber)

  const heroBg = storeData.heroBackgroundColor || '#1e293b'
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)
  const isLight = isLightColor(heroBg)

  const rating = storeData.googleRating ? parseFloat(storeData.googleRating) : 0
  const showRating = rating >= 4.0 && storeData.googleReviewsCount && storeData.googleReviewsCount > 0

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  function getProductCtaUrl(product: typeof products[0]): string {
    if (product.ctaMode === 'EXTERNAL_LINK' && product.ctaExternalUrl) {
      return product.ctaExternalUrl
    }
    const message = product.ctaWhatsappMessage
      || `Olá! Tenho interesse no produto *${product.name}* (R$ ${(product.priceInCents / 100).toFixed(2)})`
    return `https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(message)}`
  }

  // JSON-LD with products as ItemList
  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.seoTitle || collection.name,
    description: collection.seoDescription || collection.description || `${collection.name} - ${storeData.name}`,
    url: `${baseUrl}/catalogo/${collectionSlug}`,
    numberOfItems: products.length,
    ...(products.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description,
            url: `${baseUrl}/produto/${p.slug}`,
            brand: { '@type': 'Brand', name: storeData.name },
            offers: {
              '@type': 'Offer',
              price: (p.priceInCents / 100).toFixed(2),
              priceCurrency: 'BRL',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'LocalBusiness',
                '@id': `${baseUrl}/#business`,
                name: storeData.name,
              },
            },
            ...(p.images && (p.images as ProductImage[]).length > 0 && {
              image: (p.images as ProductImage[])[0].url,
            }),
          },
        })),
      },
    }),
    isPartOf: {
      '@type': 'WebSite',
      name: storeData.name,
      url: baseUrl,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: storeData.name, item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${baseUrl}/catalogo` },
      { '@type': 'ListItem', position: 3, name: collection.seoTitle || collection.name, item: `${baseUrl}/catalogo/${collectionSlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="w-full max-w-full overflow-x-clip">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Background: collection image or solid color */}
          {collection.imageUrl ? (
            <>
              <Image
                src={collection.imageUrl}
                alt={collection.seoTitle || collection.name}
                fill
                priority
                className="absolute inset-0 object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </>
          ) : (
            <>
              <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
              <div className="absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
            </>
          )}

          <div className={`container relative z-10 mx-auto px-4 ${collection.imageUrl ? 'text-white' : textClass}`}>
            <div className="mx-auto max-w-4xl">
              <Link
                href={getCollectionPageUrl(slug, 'catalogo')}
                className={`mb-8 mr-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all ${collection.imageUrl ? 'border-white/30 text-white hover:bg-white/20' : `${badgeClasses} ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}`}
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">Voltar para catálogo</span>
              </Link>

              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md ${collection.imageUrl ? 'border-white/30 text-white' : badgeClasses}`}>
                <IconMapPin className="h-4 w-4" />
                {storeData.city}, {storeData.state}
              </div>

              <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl drop-shadow-sm">
                {collection.seoTitle || collection.name}
              </h1>

              <p className={`mb-6 text-lg leading-relaxed ${collection.imageUrl ? 'text-white/80' : mutedClass}`}>
                {collection.seoDescription || collection.description || `${storeData.name} · ${storeData.category} em ${storeData.city}, ${storeData.state}`}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                {products.length > 0 && (
                  <span className={`rounded-full px-5 py-2 text-sm font-bold ${collection.imageUrl ? 'bg-white/15 text-white backdrop-blur-sm' : isLight ? 'bg-primary/10 text-primary' : 'bg-white/15 text-white'}`}>
                    {products.length} {products.length === 1 ? 'produto disponível' : 'produtos disponíveis'}
                  </span>
                )}

                {showRating && (
                  <div className={`flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md ${collection.imageUrl ? 'bg-white/10' : isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                    <IconStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{storeData.googleRating}</span>
                    <span className={collection.imageUrl ? 'text-white/70' : mutedClass}>({storeData.googleReviewsCount} avaliações)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="bg-[#f3f5f7] py-20 md:py-28 dark:bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {products.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      description={product.description}
                      priceInCents={product.priceInCents}
                      originalPriceInCents={product.originalPriceInCents}
                      images={product.images as ProductImage[] | null}
                      collectionName={collection.name}
                      storeSlug={slug}
                      variant="cta"
                      ctaMode={product.ctaMode as 'WHATSAPP' | 'EXTERNAL_LINK'}
                      ctaLabel={product.ctaLabel}
                      ctaUrl={getProductCtaUrl(product)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    <IconShoppingCart className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Nenhum produto nesta coleção</h3>
                  <p className="mt-2 text-sm text-slate-500">Em breve teremos produtos disponíveis</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO descriptive content + CTA */}
        <section className="bg-white py-16 md:py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 shadow-lg dark:border-slate-800 dark:border-l-primary dark:bg-slate-900">
                <h2 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                  {collection.name} em <span className="text-primary">{storeData.city}, {storeData.state}</span> — {storeData.name}
                </h2>
                <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {'longDescription' in collection && collection.longDescription ? (
                    (collection.longDescription as string).split('\n').map((paragraph, i) =>
                      paragraph.trim() ? <p key={i}>{paragraph}</p> : null
                    )
                  ) : collection.seoDescription ? (
                    <>
                      <p>{collection.seoDescription}</p>
                      {products.length > 0 && (
                        <p>
                          A {storeData.name} oferece {products.length} {products.length === 1 ? 'produto' : 'produtos'} de {collection.name.toLowerCase()} em {storeData.city}, {storeData.state}.
                          Todos os produtos contam com atendimento personalizado. Entre em contato pelo WhatsApp para mais informações.
                        </p>
                      )}
                    </>
                  ) : collection.description ? (
                    <>
                      <p>{collection.description}</p>
                      <p>
                        A <strong>{storeData.name}</strong>, {storeData.category.toLowerCase()} em {storeData.city}, {storeData.state}, oferece
                        {' '}{products.length} {products.length === 1 ? 'produto' : 'produtos'} de {collection.name.toLowerCase()} disponíveis.
                        Atendimento pelo WhatsApp para mais detalhes e condições.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        A <strong>{storeData.name}</strong>, {storeData.category.toLowerCase()} em {storeData.city}, {storeData.state}, oferece
                        uma seleção com {products.length} {products.length === 1 ? 'produto' : 'produtos'} de {collection.name.toLowerCase()}.
                      </p>
                      <p>
                        Procurando {collection.name.toLowerCase()} em {storeData.city} perto de mim? A {storeData.name} atende {storeData.city} e região
                        com atendimento pelo WhatsApp. Entre em contato para saber condições e disponibilidade.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* CTA card */}
              <div className="overflow-hidden rounded-2xl bg-primary p-8 shadow-lg md:p-10">
                <h3 className="mb-2 text-xl font-extrabold text-white">
                  Interessado em {collection.name}?
                </h3>
                <p className="mb-6 text-white/90">
                  Fale agora com a {storeData.name} e tire suas dúvidas sobre nossos produtos de {collection.name.toLowerCase()}.
                  Atendemos em {storeData.city} e região.
                </p>
                <a
                  href={`https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse nos produtos de ${collection.name} ${g.da} ${storeData.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <IconBrandWhatsapp className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Other collections - internal linking */}
        {otherCollections.length > 0 && (
          <section className="bg-[#f3f5f7] py-16 md:py-20 dark:bg-slate-950/50">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                  Outras categorias da {storeData.name}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {otherCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={getCollectionPageUrl(slug, col.slug)}
                      className="rounded-full border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                    >
                      {col.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
            mode={storeData.mode}
            id={storeData.id}
          />
        )}

        {Array.isArray(storeData.faq) && (storeData.faq as { question: string; answer: string }[]).length > 0 && (
          <FAQSection
            faq={storeData.faq as { question: string; answer: string }[]}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
            termGender={storeData.termGender}
            termNumber={storeData.termNumber}
            mode={storeData.mode}
            id={storeData.id}
          />
        )}
      </main>

      <SiteFooter
        storeName={storeData.name}
        city={storeData.city}
        state={storeData.state}
        category={storeData.category}
        instagramUrl={storeData.instagramUrl}
        facebookUrl={storeData.facebookUrl}
        googleBusinessUrl={storeData.googleBusinessUrl}
        highlightText={storeData.highlightText}
        storeSlug={storeData.slug}
        services={services.map(s => ({ name: s.name, slug: s.slug || '' }))}
        institutionalPages={institutionalPages}
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