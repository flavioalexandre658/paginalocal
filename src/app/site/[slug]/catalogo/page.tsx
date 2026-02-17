import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/db'
import { store, storeProductCollection, storeProduct } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import { IconArrowRight, IconFolders, IconShoppingCart, IconTag } from '@tabler/icons-react'
import { getSectionConfig, getStoreSections } from '@/lib/store-sections'
import type { ProductImage } from '@/db/schema'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    return { title: 'Página não encontrada' }
  }

  const sections = getStoreSections(storeData[0])
  const productsConfig = getSectionConfig(sections, 'PRODUCTS')

  const title = productsConfig?.seoTitle as string | undefined || `Catálogo de Produtos | ${storeData[0].name}`
  const description = productsConfig?.seoDescription as string | undefined || `Confira nosso catálogo de produtos em ${storeData[0].city}. ${storeData[0].name} - ${storeData[0].category}.`

  const baseUrl = `https://${slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${baseUrl}/catalogo`,
      images: storeData[0].coverUrl ? [
        {
          url: storeData[0].coverUrl,
          width: 1200,
          height: 630,
        }
      ] : [],
    },
  }
}

export default async function CatalogoPage({ params }: PageProps) {
  const { slug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  const [collections, featuredProducts] = await Promise.all([
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
  ])

  const sections = getStoreSections(storeData[0])
  const productsConfig = getSectionConfig(sections, 'PRODUCTS')

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <Link
                href={`/site/${slug}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
                Voltar para home
              </Link>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                {(productsConfig?.pageTitle as string) || 'Catálogo de Produtos'}
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Produtos de qualidade em {storeData[0].city}
              </p>
            </div>

            {collections.length > 0 && (
              <div className="mb-16">
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
            )}

            {featuredProducts.length > 0 && (
              <div>
                <h2 className="mb-8 text-2xl font-bold text-slate-900">
                  <IconTag className="mr-2 inline-block h-6 w-6 text-primary" />
                  Produtos em Destaque
                </h2>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map((product) => {
                    const images = product.images as ProductImage[] | null
                    const firstImage = images && images.length > 0 ? images[0] : null

                    return (
                      <Link
                        key={product.id}
                        href={`/site/${slug}/produto/${product.slug}`}
                        className="group"
                      >
                        <div className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
                          {firstImage ? (
                            <div className="relative aspect-square overflow-hidden bg-slate-50">
                              <Image
                                src={firstImage.url}
                                alt={firstImage.alt}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                              {product.originalPriceInCents && (
                                <div className="absolute left-3 top-3">
                                  <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                    Promoção
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex aspect-square items-center justify-center bg-slate-100">
                              <IconShoppingCart className="h-12 w-12 text-slate-300" />
                            </div>
                          )}

                          <div className="p-4">
                            <h3 className="mb-2 font-bold text-slate-900 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="flex items-baseline gap-2">
                              {product.originalPriceInCents && (
                                <span className="text-xs text-slate-400 line-through">
                                  R$ {(product.originalPriceInCents / 100).toFixed(2)}
                                </span>
                              )}
                              <span className="text-lg font-black text-primary">
                                R$ {(product.priceInCents / 100).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {collections.length === 0 && featuredProducts.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <IconShoppingCart className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Catálogo em construção
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
  )
}
