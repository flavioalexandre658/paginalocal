import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { store, storeProduct, storeProductCollection, testimonial, storePage, service } from '@/db/schema'
import { eq, and, asc, desc, ne } from 'drizzle-orm'
import { IconArrowRight, IconBrandWhatsapp, IconExternalLink, IconMapPin } from '@tabler/icons-react'
import { ProductImageGallery } from '@/components/site/product-image-gallery'
import { ProductCard } from '@/components/site/product-card'
import { TestimonialsSection } from '../../_components/testimonials-section'
import { FAQSection } from '../../_components/faq-section'
import { SiteFooter } from '../../_components/site-footer'
import { FloatingContact } from '../../_components/floating-contact'
import type { ProductImage } from '@/db/schema'
import { getStoreGrammar } from '@/lib/store-terms'

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>
}

async function getProductData(storeSlug: string, productSlug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData[0]) return null

  const productData = await db
    .select()
    .from(storeProduct)
    .where(and(
      eq(storeProduct.storeId, storeData[0].id),
      eq(storeProduct.slug, productSlug),
      eq(storeProduct.status, 'ACTIVE')
    ))
    .limit(1)

  if (!productData[0]) return null

  // Fetch collection name if product belongs to one
  let collectionName: string | null = null
  let collectionSlug: string | null = null
  if (productData[0].collectionId) {
    const col = await db
      .select({ name: storeProductCollection.name, slug: storeProductCollection.slug })
      .from(storeProductCollection)
      .where(eq(storeProductCollection.id, productData[0].collectionId))
      .limit(1)
    collectionName = col[0]?.name || null
    collectionSlug = col[0]?.slug || null
  }

  // Related products: same collection first, fallback to same store
  const relatedQuery = productData[0].collectionId
    ? db
      .select({
        product: storeProduct,
        collectionName: storeProductCollection.name,
      })
      .from(storeProduct)
      .leftJoin(storeProductCollection, eq(storeProduct.collectionId, storeProductCollection.id))
      .where(and(
        eq(storeProduct.storeId, storeData[0].id),
        eq(storeProduct.collectionId, productData[0].collectionId),
        eq(storeProduct.status, 'ACTIVE'),
        ne(storeProduct.id, productData[0].id)
      ))
      .orderBy(asc(storeProduct.position))
      .limit(6)
    : db
      .select({
        product: storeProduct,
        collectionName: storeProductCollection.name,
      })
      .from(storeProduct)
      .leftJoin(storeProductCollection, eq(storeProduct.collectionId, storeProductCollection.id))
      .where(and(
        eq(storeProduct.storeId, storeData[0].id),
        eq(storeProduct.status, 'ACTIVE'),
        ne(storeProduct.id, productData[0].id)
      ))
      .orderBy(asc(storeProduct.position))
      .limit(6)

  const [relatedProducts, storeTestimonials, institutionalPages, services] = await Promise.all([
    relatedQuery,

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
    product: productData[0],
    collectionName,
    collectionSlug,
    relatedProducts,
    testimonials: storeTestimonials,
    institutionalPages,
    services,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params
  const data = await getProductData(slug, productSlug)

  if (!data) {
    return { title: 'Produto não encontrado' }
  }

  const { store: storeData, product } = data
  const images = product.images as ProductImage[] | null
  const firstImage = images && images.length > 0 ? images[0] : null

  const title = product.seoTitle || `${product.name} em ${storeData.city} | ${storeData.name}`

  const priceFormatted = `R$ ${(product.priceInCents / 100).toFixed(2).replace('.', ',')}`
  const description = product.seoDescription
    || `${product.name} em ${storeData.city} — ${storeData.name}. ${priceFormatted}. ${storeData.category} em ${storeData.state}. Peça pelo WhatsApp!`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const pageUrl = `${baseUrl}/produto/${productSlug}`
  const ogImage = firstImage?.url || storeData.coverUrl || storeData.logoUrl
  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'

  return {
    title: { absolute: title },
    description,
    icons: { icon: faviconUrl, apple: faviconUrl },
    robots: {
      index: storeData.isActive,
      follow: storeData.isActive,
      googleBot: { index: storeData.isActive, follow: storeData.isActive, 'max-image-preview': 'large' as const },
    },
    alternates: { canonical: pageUrl },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: pageUrl,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${product.name} - ${storeData.name} em ${storeData.city}` }] : [],
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

export default async function ProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params
  const data = await getProductData(slug, productSlug)

  if (!data) {
    notFound()
  }

  const { store: storeData, product, collectionName, collectionSlug, relatedProducts, testimonials, institutionalPages, services } = data
  const g = getStoreGrammar(storeData.termGender, storeData.termNumber)
  const images = (product.images as ProductImage[] | null) || []

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  function getProductCtaUrl(): string {
    if (product.ctaMode === 'EXTERNAL_LINK' && product.ctaExternalUrl) {
      return product.ctaExternalUrl
    }
    const message = product.ctaWhatsappMessage
      || `Olá! Tenho interesse no produto *${product.name}* (R$ ${(product.priceInCents / 100).toFixed(2)})`
    return `https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(message)}`
  }

  const priceFormatted = (product.priceInCents / 100).toFixed(2)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription || product.description,
    image: images.map(img => img.url),
    brand: {
      '@type': 'Brand',
      name: storeData.name,
    },
    seller: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: storeData.city,
        addressRegion: storeData.state,
        addressCountry: 'BR',
      },
    },
    offers: {
      '@type': 'Offer',
      price: priceFormatted,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/produto/${productSlug}`,
      seller: {
        '@type': 'LocalBusiness',
        name: storeData.name,
      },
    },
    ...(storeData.googleRating && storeData.googleReviewsCount && parseFloat(storeData.googleRating) >= 4.0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: storeData.googleRating,
        reviewCount: storeData.googleReviewsCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }

  // Breadcrumb: Loja > Catálogo > [Coleção >] Produto
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: storeData.name, item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${baseUrl}/catalogo` },
  ]
  if (collectionName && collectionSlug) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: 3,
      name: collectionName,
      item: `${baseUrl}/catalogo/${collectionSlug}`,
    })
  }
  breadcrumbItems.push({
    '@type': 'ListItem',
    position: breadcrumbItems.length + 1,
    name: product.name,
    item: `${baseUrl}/produto/${productSlug}`,
  })

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />


      <main>
        {/* Breadcrumb nav */}
        <nav aria-label="Navegação" className="border-b border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <ol className="flex items-center gap-2 py-3 text-sm text-slate-500">
              <li>
                <Link href={baseUrl} className="hover:text-primary transition-colors">{storeData.name}</Link>
              </li>
              <li className="text-slate-300">/</li>
              <li>
                <Link href={`/site/${slug}/catalogo`} className="hover:text-primary transition-colors">Catálogo</Link>
              </li>
              {collectionName && collectionSlug && (
                <>
                  <li className="text-slate-300">/</li>
                  <li>
                    <Link href={`/site/${slug}/catalogo/${collectionSlug}`} className="hover:text-primary transition-colors">{collectionName}</Link>
                  </li>
                </>
              )}
              <li className="text-slate-300">/</li>
              <li className="text-slate-700 font-medium truncate max-w-[160px] dark:text-slate-300">{product.name}</li>
            </ol>
          </div>
        </nav>

        {/* Product content */}
        <section className="relative overflow-hidden bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <Link
                href={`/site/${slug}/catalogo`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
                Voltar para catálogo
              </Link>

              <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                <ProductImageGallery
                  images={images}
                  productName={product.name}
                  hasPromotion={!!product.originalPriceInCents}
                />

                <div className="flex flex-col justify-center">
                  {/* Location badge */}
                  <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <IconMapPin className="h-3.5 w-3.5" />
                    {storeData.city}, {storeData.state}
                  </div>

                  <div className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                      {product.name}
                    </h1>

                    {product.description && (
                      <p className="mt-4 text-lg text-slate-600">
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="mb-8">
                    {product.originalPriceInCents && (
                      <p className="text-base text-slate-400 line-through">
                        De: R$ {(product.originalPriceInCents / 100).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">
                        R$ {(product.priceInCents / 100).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    {product.originalPriceInCents && (
                      <p className="mt-2 text-sm font-semibold text-emerald-600">
                        Economize R$ {((product.originalPriceInCents - product.priceInCents) / 100).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>

                  <a
                    href={getProductCtaUrl()}
                    target={product.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined}
                    rel={product.ctaMode === 'EXTERNAL_LINK' ? 'noopener noreferrer' : undefined}
                    className="mb-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-10 py-5 text-lg font-bold text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40"
                  >
                    {product.ctaMode === 'WHATSAPP' ? (
                      <IconBrandWhatsapp className="h-6 w-6" />
                    ) : (
                      <IconExternalLink className="h-6 w-6" />
                    )}
                    {product.ctaLabel || 'Comprar agora'}
                  </a>

                  {product.ctaMode === 'WHATSAPP' && (
                    <p className="text-center text-sm text-slate-500">
                      Atendimento via WhatsApp · {storeData.city}
                    </p>
                  )}

                  {product.longDescription && (
                    <div className="mt-8 space-y-4 border-t border-slate-200 pt-8">
                      <h2 className="text-xl font-bold text-slate-900">
                        Sobre este produto
                      </h2>
                      <div className="prose prose-slate max-w-none">
                        {product.longDescription.split('\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="text-slate-600">
                              {paragraph}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO content section */}
        <section className="bg-white py-10 md:py-14 border-t border-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-slate-50 p-8 dark:border-slate-800 dark:border-l-primary dark:bg-slate-900/50">
                <h2 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">
                  {product.name} em <span className="text-primary">{storeData.city}</span> — {storeData.name}
                </h2>
                <div className="space-y-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  <p>
                    {product.name} disponível na <strong>{storeData.name}</strong>, {storeData.category.toLowerCase()} em {storeData.city}, {storeData.state}.
                    {product.description ? ` ${product.description}` : ''}
                  </p>
                  <p>
                    Para comprar {product.name.toLowerCase()} perto de mim em {storeData.city}, entre em contato com a {storeData.name} pelo WhatsApp.
                    Atendemos {storeData.city} e região com agilidade.
                  </p>
                </div>

                {/* Internal links */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/site/${slug}/catalogo`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Ver catálogo completo
                    <IconArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {collectionName && collectionSlug && (
                    <Link
                      href={`/site/${slug}/catalogo/${collectionSlug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      Ver {collectionName}
                      <IconArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#f3f5f7] py-20 md:py-28">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-5xl">
                <div className="mb-10 text-center">
                  <span className="text-sm font-bold uppercase tracking-widest text-primary">
                    {collectionName || storeData.category}
                  </span>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                    Produtos relacionados em {storeData.city}
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedProducts.map(({ product: related, collectionName: relColName }) => (
                    <ProductCard
                      key={related.id}
                      id={related.id}
                      name={related.name}
                      slug={related.slug}
                      description={related.description}
                      priceInCents={related.priceInCents}
                      originalPriceInCents={related.originalPriceInCents}
                      images={related.images as ProductImage[] | null}
                      collectionName={relColName}
                      storeSlug={slug}
                      variant="link"
                    />
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <Link
                    href={`/site/${slug}/catalogo`}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30"
                  >
                    Ver catálogo completo
                    <IconArrowRight className="h-5 w-5" />
                  </Link>
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
            termGender={storeData.termGender}
            termNumber={storeData.termNumber}
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
