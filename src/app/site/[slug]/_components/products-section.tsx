import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { ProductCard } from '@/components/site/product-card'
import type { ProductImage } from '@/db/schema'
import { getCollectionPageUrl } from '@/lib/utils'

// ✅ local-seo modular
import { getCopy } from '@/lib/local-copy'
import { renderTokens } from '@/lib/local-copy/render'
import type { StoreMode, LocalPageCtx } from '@/lib/local-copy/types'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  priceInCents: number
  originalPriceInCents: number | null
  images: ProductImage[] | null
  isFeatured: boolean
  collectionName?: string | null
}

interface ProductsSectionProps {
  products: Product[]
  storeName: string
  storeSlug: string
  category: string
  city: string
  state?: string

  // ✅ variar por MODE
  mode: StoreMode

  // ✅ seed forte/estável
  id?: string | number
  slug?: string
}

export function ProductsSection({
  products,
  storeName,
  storeSlug,
  category,
  city,
  state,
  mode,
  id,
  slug,
}: ProductsSectionProps) {
  if (!products || products.length === 0) return null

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6)
  const displayProducts = featuredProducts.length >= 3 ? featuredProducts : products.slice(0, 6)

  const ctx: LocalPageCtx = {
    id,
    slug,
    mode,
    name: storeName || "",
    category: category || "Produtos",
    city: city || "",
    state: state || "",
    servicesCount: displayProducts.length, // ✅ usado no intro
  }

  return (
    <section className="relative overflow-hidden bg-[#f3f5f7] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {renderTokens(getCopy(ctx, "products.kicker"))}
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              {renderTokens(getCopy(ctx, "products.heading"))}
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              {renderTokens(getCopy(ctx, "products.intro"))}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                description={product.description}
                priceInCents={product.priceInCents}
                originalPriceInCents={product.originalPriceInCents}
                images={product.images}
                collectionName={product.collectionName}
                storeSlug={storeSlug}
                variant="link"
              />
            ))}
          </div>

          {products.length > 6 && (
            <div className="mt-12 text-center">
              <Link href={getCollectionPageUrl(storeSlug, 'catalogo')}>
                <button className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30">
                  {renderTokens(getCopy(ctx, "products.catalogCta"))}
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
