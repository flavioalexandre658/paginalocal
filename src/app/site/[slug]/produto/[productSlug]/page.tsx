import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { store, storeProduct, testimonial, storePage, service } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import { IconArrowRight, IconBrandWhatsapp, IconExternalLink } from '@tabler/icons-react'
import { ProductImageGallery } from '@/components/site/product-image-gallery'
import { TestimonialsSection } from '../../_components/testimonials-section'
import { FAQSection } from '../../_components/faq-section'
import { ProductsSection } from '../../_components/products-section'
import { SiteHeader } from '../../_components/site-header'
import { SiteFooter } from '../../_components/site-footer'
import type { ProductImage } from '@/db/schema'

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

  const [otherProducts, storeTestimonials, institutionalPages, services] = await Promise.all([
    db
      .select()
      .from(storeProduct)
      .where(and(
        eq(storeProduct.storeId, storeData[0].id),
        eq(storeProduct.status, 'ACTIVE')
      ))
      .orderBy(asc(storeProduct.position))
      .limit(7),

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
    otherProducts: otherProducts.filter(p => p.id !== productData[0].id).slice(0, 6),
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

  const title = product.seoTitle || `${product.name} | ${storeData.name}`
  const description = product.seoDescription || product.description || `${product.name} - R$ ${(product.priceInCents / 100).toFixed(2)}`

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
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `${product.name} - ${storeData.name}` }] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params
  const data = await getProductData(slug, productSlug)

  if (!data) {
    notFound()
  }

  const { store: storeData, product, otherProducts, testimonials, institutionalPages, services } = data
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

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images.map(img => img.url),
    offers: {
      '@type': 'Offer',
      price: (product.priceInCents / 100).toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/produto/${productSlug}`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: storeData.name, item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${baseUrl}/catalogo` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `${baseUrl}/produto/${productSlug}` },
    ],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main>
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
                        De: R$ {(product.originalPriceInCents / 100).toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary">
                        R$ {(product.priceInCents / 100).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    {product.originalPriceInCents && (
                      <p className="mt-2 text-sm font-semibold text-emerald-600">
                        Economize R$ {((product.originalPriceInCents - product.priceInCents) / 100).toFixed(2)}
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
                      Atendimento via WhatsApp • Resposta rápida
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

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
          />
        )}

        {/* Other products */}
        {otherProducts.length > 0 && (
          <ProductsSection
            products={otherProducts}
            storeName={storeData.name}
            storeSlug={storeData.slug}
            category={storeData.category}
            city={storeData.city}
          />
        )}

        {/* FAQ */}
        {Array.isArray(storeData.faq) && (storeData.faq as { question: string; answer: string }[]).length > 0 && (
          <FAQSection
            faq={storeData.faq as { question: string; answer: string }[]}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
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

    </>
  )
}