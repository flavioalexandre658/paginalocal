import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { store, storeProduct } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { IconArrowRight, IconBrandWhatsapp, IconExternalLink, IconTag, IconShoppingCart } from '@tabler/icons-react'
import type { ProductImage } from '@/db/schema'

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params

  const productData = await db
    .select({
      product: storeProduct,
      storeName: store.name,
      storeCity: store.city,
    })
    .from(storeProduct)
    .innerJoin(store, eq(storeProduct.storeId, store.id))
    .where(and(
      eq(store.slug, slug),
      eq(storeProduct.slug, productSlug)
    ))
    .limit(1)

  if (!productData[0]) {
    return { title: 'Produto não encontrado' }
  }

  const product = productData[0].product
  const images = product.images as ProductImage[] | null
  const firstImage = images && images.length > 0 ? images[0] : null

  const title = product.seoTitle || `${product.name} | ${productData[0].storeName}`
  const description = product.seoDescription || product.description || `${product.name} - R$ ${(product.priceInCents / 100).toFixed(2)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: firstImage ? [firstImage.url] : [],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  const productData = await db
    .select()
    .from(storeProduct)
    .where(and(
      eq(storeProduct.storeId, storeData[0].id),
      eq(storeProduct.slug, productSlug),
      eq(storeProduct.status, 'ACTIVE')
    ))
    .limit(1)

  if (!productData[0]) {
    notFound()
  }

  const product = productData[0]
  const images = (product.images as ProductImage[] | null) || []

  function getProductCtaUrl(): string {
    if (product.ctaMode === 'EXTERNAL_LINK' && product.ctaExternalUrl) {
      return product.ctaExternalUrl
    }

    const message = product.ctaWhatsappMessage
      || `Olá! Tenho interesse no produto *${product.name}* (R$ ${(product.priceInCents / 100).toFixed(2)})`

    return `https://wa.me/55${storeData[0].whatsapp}?text=${encodeURIComponent(message)}`
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
      url: `https://${slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}/produto/${productSlug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

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
                <div className="space-y-4">
                  {images.length > 0 ? (
                    <>
                      <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-lg">
                        <Image
                          src={images[0].url}
                          alt={images[0].alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                        {product.originalPriceInCents && (
                          <div className="absolute left-4 top-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-xl">
                              <IconTag className="h-4 w-4" />
                              Promoção
                            </span>
                          </div>
                        )}
                      </div>

                      {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                          {images.slice(1, 5).map((img, index) => (
                            <div
                              key={index}
                              className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                            >
                              <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 25vw, 12vw"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50">
                      <IconShoppingCart className="h-32 w-32 text-slate-200" />
                    </div>
                  )}
                </div>

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
      </main>
    </>
  )
}
