import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { ProductCard } from '@/components/site/product-card'
import type { ProductImage } from '@/db/schema'
import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

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
  termGender?: TermGender
  termNumber?: TermNumber
}

export function ProductsSection({
  products,
  storeName,
  storeSlug,
  category,
  city,
  termGender,
  termNumber,
}: ProductsSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  if (products.length === 0) return null

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 6)
  const displayProducts = featuredProducts.length >= 3 ? featuredProducts : products.slice(0, 6)

  return (
    <section className="relative overflow-hidden bg-[#f3f5f7] py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Produtos
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Produtos de <span className="text-primary">{category}</span> em {city} — {storeName}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              {displayProducts.length} {displayProducts.length === 1 ? 'produto disponível' : 'produtos disponíveis'} {g.da} {storeName} · Peça pelo WhatsApp
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