import Image from 'next/image'
import { IconStar, IconMapPin } from '@tabler/icons-react'
import { HeroContactButtons } from './hero-contact-buttons'
import {
  getContrastColor,
  getContrastTextClass,
  getContrastMutedClass,
  getContrastBorderClass,
  getContrastBadgeClasses,
  isLightColor,
} from '@/lib/color-contrast'

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
    heroBackgroundColor?: string | null
    googleRating?: string | null
    googleReviewsCount?: number | null
    whatsapp: string
    phone?: string | null
    whatsappDefaultMessage?: string | null
    heroTitle?: string | null
    heroSubtitle?: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
  }
  heroImageAlt?: string | null
  isOwner?: boolean
}

export function HeroSection({ store, heroImageAlt, isOwner = false }: HeroSectionProps) {
  const h1Title = store.heroTitle || `${store.category} em ${store.city} – ${store.name}`
  const subtitle = store.heroSubtitle || store.description

  const rating = store.googleRating ? parseFloat(store.googleRating) : 0
  const showRating = rating >= 4.5 && store.googleReviewsCount && store.googleReviewsCount > 0

  const hasCover = !!store.coverUrl
  const heroBg = store.heroBackgroundColor || '#1e293b'
  const isLight = isLightColor(heroBg)
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)

  return (
    <section className="relative overflow-hidden">
      {hasCover ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={store.coverUrl!}
            alt={heroImageAlt || `Fachada da ${store.name} em ${store.city}`}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${heroBg}b3, ${heroBg}80, ${heroBg}f2)`,
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
      )}

      <div className={`relative z-10 py-20 md:py-36 ${textClass}`}>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium shadow-lg backdrop-blur-md ${badgeClasses}`}>
              <IconMapPin className="h-4 w-4" />
              <span>{store.city}, {store.state}</span>
            </div>

            <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {h1Title}
            </h1>

            {showRating && (
              <div className={`mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <IconStar
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : isLight ? 'text-slate-300' : 'text-slate-400/50'
                        }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{store.googleRating}</span>
                <span className={mutedClass}>
                  ({store.googleReviewsCount} avaliações)
                </span>
              </div>
            )}

            {subtitle && (
              <p className={`mx-auto mb-10 max-w-2xl text-lg font-medium ${mutedClass}`}>
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
