import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { store, storeProductCollection, storeProduct } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { IconArrowRight, IconShoppingCart, IconTag, IconBrandWhatsapp, IconExternalLink } from '@tabler/icons-react'
import type { ProductImage, ProductCtaMode } from '@/db/schema'

interface PageProps {
  params: Promise<{ slug: string; collectionSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, collectionSlug } = await params

  const storeData = await db
    .select({
      storeName: store.name,
      storeCity: store.city,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    return { title: 'Página não encontrada' }
  }

  const collection = await db
    .select()
    .from(storeProductCollection)
    .innerJoin(store, eq(storeProductCollection.storeId, store.id))
    .where(and(
      eq(store.slug, slug),
      eq(storeProductCollection.slug, collectionSlug)
    ))
    .limit(1)

  if (!collection[0]) {
    return { title: 'Coleção não encontrada' }
  }

  const collectionData = collection[0].store_product_collection

  const title = collectionData.seoTitle || `${collectionData.name} | ${storeData[0].storeName}`
  const description = collectionData.seoDescription || `${collectionData.description || collectionData.name} - ${storeData[0].storeName} em ${storeData[0].storeCity}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: collectionData.imageUrl ? [collectionData.imageUrl] : [],
    },
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug, collectionSlug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  const collection = await db
    .select()
    .from(storeProductCollection)
    .where(and(
      eq(storeProductCollection.storeId, storeData[0].id),
      eq(storeProductCollection.slug, collectionSlug),
      eq(storeProductCollection.isActive, true)
    ))
    .limit(1)

  if (!collection[0]) {
    notFound()
  }

  const products = await db
    .select()
    .from(storeProduct)
    .where(and(
      eq(storeProduct.storeId, storeData[0].id),
      eq(storeProduct.collectionId, collection[0].id),
      eq(storeProduct.status, 'ACTIVE')
    ))
    .orderBy(asc(storeProduct.position))

  function getProductCtaUrl(product: typeof products[0]): string {
    if (product.ctaMode === 'EXTERNAL_LINK' && product.ctaExternalUrl) {
      return product.ctaExternalUrl
    }

    const message = product.ctaWhatsappMessage
      || `Olá! Tenho interesse no produto *${product.name}* (R$ ${(product.priceInCents / 100).toFixed(2)})`

    return `https://wa.me/55${storeData[0].whatsapp}?text=${encodeURIComponent(message)}`
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection[0].name,
    description: collection[0].description,
    url: `https://${slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/catalogo/${collectionSlug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <Link
                href={`/site/${slug}/catalogo`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
                Voltar para catálogo
              </Link>

              <div className="mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                  {collection[0].name}
                </h1>
                {collection[0].description && (
                  <p className="mt-4 text-lg text-slate-600">
                    {collection[0].description}
                  </p>
                )}
              </div>

              {products.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => {
                    const images = product.images as ProductImage[] | null
                    const firstImage = images && images.length > 0 ? images[0] : null

                    return (
                      <div
                        key={product.id}
                        className="group overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl"
                      >
                        {firstImage ? (
                          <div className="relative aspect-square overflow-hidden bg-slate-50">
                            <Image
                              src={firstImage.url}
                              alt={firstImage.alt}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            {product.originalPriceInCents && (
                              <div className="absolute left-3 top-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                  <IconTag className="h-3 w-3" />
                                  Promoção
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex aspect-square items-center justify-center bg-slate-100">
                            <IconShoppingCart className="h-16 w-16 text-slate-300" />
                          </div>
                        )}

                        <div className="p-6">
                          <h3 className="mb-2 text-xl font-bold text-slate-900 line-clamp-2">
                            {product.name}
                          </h3>

                          {product.description && (
                            <p className="mb-4 text-sm text-slate-500 line-clamp-2">
                              {product.description}
                            </p>
                          )}

                          <div className="mb-4 flex items-end justify-between gap-3">
                            <div>
                              {product.originalPriceInCents && (
                                <p className="text-xs text-slate-400 line-through">
                                  R$ {(product.originalPriceInCents / 100).toFixed(2)}
                                </p>
                              )}
                              <p className="text-2xl font-black text-primary">
                                R$ {(product.priceInCents / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <a
                            href={getProductCtaUrl(product)}
                            target={product.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined}
                            rel={product.ctaMode === 'EXTERNAL_LINK' ? 'noopener noreferrer' : undefined}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
                          >
                            {product.ctaMode === 'WHATSAPP' ? (
                              <IconBrandWhatsapp className="h-5 w-5" />
                            ) : (
                              <IconExternalLink className="h-5 w-5" />
                            )}
                            {product.ctaLabel || 'Comprar'}
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <IconShoppingCart className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Nenhum produto nesta coleção
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Em breve teremos produtos disponíveis
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
