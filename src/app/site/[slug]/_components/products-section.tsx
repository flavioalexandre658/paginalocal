import Link from 'next/link'
import Image from 'next/image'
import { IconShoppingCart, IconArrowRight, IconTag } from '@tabler/icons-react'
import type { ProductImage } from '@/db/schema'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  priceInCents: number
  originalPriceInCents: number | null
  images: ProductImage[] | null
  isFeatured: boolean
}

interface ProductsSectionProps {
  products: Product[]
  storeName: string
  storeSlug: string
  category: string
  city: string
}

export function ProductsSection({
  products,
  storeName,
  storeSlug,
  category,
  city,
}: ProductsSectionProps) {
  if (products.length === 0) return null

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6)
  const displayProducts = featuredProducts.length >= 3 ? featuredProducts : products.slice(0, 6)

  return (
    <section className="relative overflow-hidden bg-[#f3f5f7] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Nossos Produtos
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Conheça nosso <span className="text-primary">catálogo</span>
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Produtos de qualidade em {city}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/site/${storeSlug}/produto/${product.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
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

                    <div className="flex items-end justify-between gap-3">
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

                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                        Ver detalhes
                        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {products.length > 6 && (
            <div className="mt-12 text-center">
              <Link href={`/site/${storeSlug}/catalogo`}>
                <button className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30">
                  Ver catálogo completo
                  <IconArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
