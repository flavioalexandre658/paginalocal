import Image from 'next/image'
import Link from 'next/link'
import { IconStar, IconMapPin, IconSparkles, IconArrowLeft } from '@tabler/icons-react'
import { HeroContactButtons } from './hero-contact-buttons'
import { getStoreHomeUrl } from '@/lib/utils'
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
    highlightBadge?: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
  }
  heroImageAlt?: string | null
  isOwner?: boolean
  pageTitle?: string
  pageSubtitle?: string
  compact?: boolean
  showBackLink?: boolean
}

export function HeroSection({ store, heroImageAlt, isOwner = false, pageTitle, pageSubtitle, compact = false, showBackLink = false }: HeroSectionProps) {
  const h1Title = pageTitle || store.heroTitle || `${store.category} em ${store.city}, ${store.state} – ${store.name}`
  const subtitle = pageSubtitle || store.heroSubtitle || store.description

  const rating = store.googleRating ? parseFloat(store.googleRating) : 0
  const showRating = rating >= 4.5 && store.googleReviewsCount && store.googleReviewsCount > 0

  const hasCover = !!store.coverUrl
  const heroBg = store.heroBackgroundColor || '#1e293b'
  const isLight = isLightColor(heroBg)
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)

  return (
    <section className="relative overflow-hidden" aria-label={`${store.name} - ${store.category} em ${store.city}, ${store.state}`}>
      {/* ===== CONTEÚDO PRIMEIRO NO DOM (renderiza antes da imagem) ===== */}
      <div className={`relative z-10 ${compact ? 'py-16 md:py-24' : 'py-20 md:py-36'} ${textClass}`}>
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            {showBackLink && (
              <Link
                href={getStoreHomeUrl(store.slug)}
                className={`mb-8 mr-2 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all ${badgeClasses} ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">Voltar para {store.name}</span>
              </Link>
            )}

            <div className={`mb-6 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium shadow-lg backdrop-blur-md ${badgeClasses}`}>
              <IconMapPin className="h-4 w-4" />
              <span>{store.category} em {store.city}, {store.state}</span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {h1Title}
            </h1>

            {!compact && showRating && (
              <div className={`mb-4 inline-flex items-center gap-3 rounded-full px-4 py-2 backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
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

            {!compact && store.highlightBadge && (
              <div className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                <IconSparkles className="h-4 w-4 text-amber-400" />
                <span>{store.highlightBadge}</span>
              </div>
            )}

            {subtitle && (
              <p className={`mx-auto ${compact ? 'mb-0' : 'mb-10'} max-w-2xl text-lg leading-relaxed ${mutedClass}`}>
                {subtitle}
              </p>
            )}

            {!compact && <HeroContactButtons store={store} isOwner={isOwner} />}
          </div>
        </div>
      </div>

      {/* ===== BACKGROUND DEPOIS NO DOM (carrega após o conteúdo) ===== */}
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
              background: `linear-gradient(160deg, ${heroBg}cc, ${heroBg}90, ${heroBg}f0)`,
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0" style={{ backgroundColor: heroBg }} />
      )}

      {/* Decorative blur elements */}
      <div className="absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
    </section>
  )
}
