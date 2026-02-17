import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { store, storeProductCollection, storeProduct, testimonial, storePage, service } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import {
  IconArrowLeft,
  IconArrowRight,
  IconMapPin,
  IconStar,
  IconFolders,
  IconTag,
  IconShoppingCart,
} from '@tabler/icons-react'
import {
  getContrastTextClass,
  getContrastMutedClass,
  getContrastBadgeClasses,
  isLightColor,
} from '@/lib/color-contrast'
import { getStoreHomeUrl } from '@/lib/utils'
import { getSectionConfig, getStoreSections } from '@/lib/store-sections'
import { ProductCard } from '@/components/site/product-card'
import { TestimonialsSection } from '../_components/testimonials-section'
import { FAQSection } from '../_components/faq-section'
import { SiteFooter } from '../_components/site-footer'
import { FloatingContact } from '../_components/floating-contact'
import type { ProductImage } from '@/db/schema'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCatalogoData(storeSlug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData[0]) return null

  const [collections, featuredProducts, storeTestimonials, institutionalPages, services] = await Promise.all([
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
      .from(storeProduct)
      .where(and(
        eq(storeProduct.storeId, storeData[0].id),
        eq(storeProduct.status, 'ACTIVE'),
        eq(storeProduct.isFeatured, true)
      ))
      .orderBy(desc(storeProduct.position))
      .limit(8),

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
    collections,
    featuredProducts,
    testimonials: storeTestimonials,
    institutionalPages,
    services,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getCatalogoData(slug)

  if (!data) {
    return { title: 'Página não encontrada' }
  }

  const { store: storeData } = data
  const sections = getStoreSections(storeData)
  const productsConfig = getSectionConfig(sections, 'PRODUCTS')

  const title = productsConfig?.seoTitle as string | undefined || `Catálogo de Produtos | ${storeData.name}`
  const description = productsConfig?.seoDescription as string | undefined || `Confira nosso catálogo de produtos em ${storeData.city}. ${storeData.name} - ${storeData.category}.`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

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
    alternates: { canonical: `${baseUrl}/catalogo` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/catalogo`,
      siteName: storeData.name,
      title,
      description,
      images: storeData.coverUrl ? [{ url: storeData.coverUrl, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function CatalogoPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getCatalogoData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, collections, featuredProducts, testimonials, institutionalPages, services } = data

  const sections = getStoreSections(storeData)
  const productsConfig = getSectionConfig(sections, 'PRODUCTS')

  const heroBg = storeData.heroBackgroundColor || '#1e293b'
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)
  const isLight = isLightColor(heroBg)

  const rating = storeData.googleRating ? parseFloat(storeData.googleRating) : 0
  const showRating = rating >= 4.0 && storeData.googleReviewsCount && storeData.googleReviewsCount > 0

  return (
    <>
      <main className="w-full max-w-full overflow-x-clip">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
          <div className="absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

          <div className={`container relative z-10 mx-auto px-4 ${textClass}`}>
            <div className="mx-auto max-w-4xl">
              <Link
                href={getStoreHomeUrl(storeData.slug)}
                className={`mb-8 mr-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all ${badgeClasses} ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">Voltar para {storeData.name}</span>
              </Link>

              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md ${badgeClasses}`}>
                <IconMapPin className="h-4 w-4" />
                {storeData.city}, {storeData.state}
              </div>

              <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {(productsConfig?.pageTitle as string) || 'Catálogo de Produtos'}
              </h1>

              <p className={`mb-6 text-lg leading-relaxed ${mutedClass}`}>
                {storeData.name} · Produtos de qualidade em {storeData.city}, {storeData.state}
              </p>

              {showRating && (
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                  <IconStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{storeData.googleRating}</span>
                  <span className={mutedClass}>({storeData.googleReviewsCount} avaliações)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Collections */}
        {collections.length > 0 && (
          <section className="bg-[#f3f5f7] py-20 md:py-28 dark:bg-slate-950/50">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-8 text-2xl font-bold text-slate-900">
                  <IconFolders className="mr-2 inline-block h-6 w-6 text-primary" />
                  Categorias
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      href={`/site/${slug}/catalogo/${collection.slug}`}
                      className="group"
                    >
                      <div className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
                        {collection.imageUrl ? (
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                            <Image
                              src={collection.imageUrl}
                              alt={collection.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                            <IconFolders className="h-20 w-20 text-primary/30" />
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-slate-900">
                            {collection.name}
                          </h3>
                          {collection.description && (
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {collection.description}
                            </p>
                          )}
                          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                            Ver produtos
                            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="bg-white py-20 md:py-28 dark:bg-slate-900">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                  <IconTag className="mr-2 inline-block h-6 w-6 text-primary" />
                  Produtos em Destaque
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      description={product.description}
                      priceInCents={product.priceInCents}
                      originalPriceInCents={product.originalPriceInCents}
                      images={product.images as ProductImage[] | null}
                      storeSlug={slug}
                      variant="link"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {collections.length === 0 && featuredProducts.length === 0 && (
          <section className="bg-[#f3f5f7] py-20 dark:bg-slate-950/50">
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                <IconShoppingCart className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Catálogo em construção</h3>
              <p className="mt-2 text-sm text-slate-500">Em breve teremos produtos disponíveis</p>
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