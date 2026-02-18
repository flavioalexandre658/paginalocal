import Image from 'next/image'
import Link from 'next/link'
import {
    IconShoppingCart,
    IconArrowRight,
    IconTag,
    IconBrandWhatsapp,
    IconExternalLink,
} from '@tabler/icons-react'
import { cn, getProductPageUrl } from '@/lib/utils'

interface ProductImageItem {
    url: string
    alt: string
    order?: number
}

interface ProductCardBaseProps {
    id: string
    name: string
    slug: string
    description: string | null
    priceInCents: number
    originalPriceInCents: number | null
    images: ProductImageItem[] | null
    collectionName?: string | null
    storeSlug: string
    className?: string
}

interface ProductCardLinkProps extends ProductCardBaseProps {
    variant?: 'link'
}

interface ProductCardCtaProps extends ProductCardBaseProps {
    variant: 'cta'
    ctaMode: 'WHATSAPP' | 'EXTERNAL_LINK'
    ctaLabel?: string | null
    ctaUrl: string
}

type ProductCardProps = ProductCardLinkProps | ProductCardCtaProps

export function ProductCard(props: ProductCardProps) {
    const {
        name,
        slug,
        description,
        priceInCents,
        originalPriceInCents,
        images,
        collectionName,
        storeSlug,
        className,
    } = props

    const variant = props.variant ?? 'link'

    const sorted = images
        ? [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : []
    const firstImage = sorted.length > 0 ? sorted[0] : null

    const card = (
        <div
            className={cn(
                'group flex flex-col overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl',
                className
            )}
        >
            {firstImage ? (
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <Image
                        src={firstImage.url}
                        alt={firstImage.alt || name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {originalPriceInCents && (
                        <div className="absolute left-3 top-3 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                <IconTag className="h-3 w-3" />
                                Promoção
                            </span>
                        </div>
                    )}
                    {sorted.length > 1 && (
                        <div className="absolute bottom-2 right-2 z-10">
                            <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                                +{sorted.length - 1} {sorted.length - 1 === 1 ? 'foto' : 'fotos'}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex aspect-square items-center justify-center bg-slate-100">
                    <IconShoppingCart className="h-16 w-16 text-slate-300" />
                </div>
            )}

            <div className="flex flex-1 flex-col p-5">
                {collectionName && (
                    <span className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-primary/70">
                        {collectionName}
                    </span>
                )}

                <h3 className="mb-1.5 text-lg font-bold leading-tight text-slate-900 line-clamp-2">
                    {name}
                </h3>

                {description && (
                    <p className="mb-3 text-sm leading-relaxed text-slate-500 line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="mt-auto">
                    <div className="mb-4">
                        {originalPriceInCents && (
                            <p className="text-xs text-slate-400 line-through">
                                R$ {(originalPriceInCents / 100).toFixed(2).replace('.', ',')}
                            </p>
                        )}
                        <p className="text-2xl font-black text-primary">
                            R$ {(priceInCents / 100).toFixed(2).replace('.', ',')}
                        </p>
                        {originalPriceInCents && (
                            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                                Economia de R$ {((originalPriceInCents - priceInCents) / 100).toFixed(2).replace('.', ',')}
                            </p>
                        )}
                    </div>

                    {variant === 'link' && (
                        <span className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary/20 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                            Ver detalhes
                            <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    )}

                    {variant === 'cta' && 'ctaUrl' in props && (
                        <a
                            href={props.ctaUrl}
                            target={props.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined}
                            rel={props.ctaMode === 'EXTERNAL_LINK' ? 'noopener noreferrer' : undefined}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
                        >
                            {props.ctaMode === 'WHATSAPP' ? (
                                <IconBrandWhatsapp className="h-4 w-4" />
                            ) : (
                                <IconExternalLink className="h-4 w-4" />
                            )}
                            {props.ctaLabel || 'Comprar'}
                        </a>
                    )}
                </div>
            </div>
        </div>
    )

    if (variant === 'link') {
        return (
            <Link href={getProductPageUrl(storeSlug, slug)} className="block">
                {card}
            </Link>
        )
    }

    return card
}