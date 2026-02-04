import Image from 'next/image'
import { IconStar, IconMapPin } from '@tabler/icons-react'
import { HeroContactButtons } from './hero-contact-buttons'

interface HeroSectionProps {
  store: {
    id: string
    name: string
    slug: string
    category: string
    city: string
    state: string
    description?: string | null
    coverUrl?: string | null
    googleRating?: string | null
    googleReviewsCount?: number | null
    whatsapp: string
    phone?: string | null
    heroTitle?: string | null
    heroSubtitle?: string | null
    isActive: boolean
  }
  heroImageAlt?: string | null
  isOwner?: boolean
}

export function HeroSection({ store, heroImageAlt, isOwner = false }: HeroSectionProps) {
  const h1Title = store.heroTitle || `${store.category} em ${store.city} – ${store.name}`
  const subtitle = store.heroSubtitle || store.description

  const rating = store.googleRating ? parseFloat(store.googleRating) : 0
  const showRating = rating >= 4.5 && store.googleReviewsCount && store.googleReviewsCount > 0

  return (
    <section className="relative overflow-hidden">
      {store.coverUrl ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={store.coverUrl}
            alt={heroImageAlt || `Fachada da ${store.name} em ${store.city}`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/95" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10 py-20 text-white md:py-36">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium shadow-lg backdrop-blur-md">
              <IconMapPin className="h-4 w-4" />
              <span>{store.city}, {store.state}</span>
            </div>

            <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {h1Title}
            </h1>

            {showRating && (
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-400/50'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{store.googleRating}</span>
                <span className="text-white/70">
                  ({store.googleReviewsCount} avaliações)
                </span>
              </div>
            )}

            {subtitle && (
              <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
                {subtitle}
              </p>
            )}

            <HeroContactButtons store={store} isOwner={isOwner} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-950" />
    </section>
  )
}
