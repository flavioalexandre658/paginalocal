'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import {
    IconX,
    IconChevronLeft,
    IconChevronRight,
    IconZoomIn,
    IconZoomOut,
    IconZoomReset,
    IconMaximize,
    IconShoppingCart,
    IconTag,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '@/components/ui/carousel'

interface ProductImageItem {
    url: string
    alt: string
    order?: number
}

interface ProductImageGalleryProps {
    images: ProductImageItem[]
    productName: string
    hasPromotion?: boolean
    className?: string
}

export function ProductImageGallery({
    images,
    productName,
    hasPromotion = false,
    className,
}: ProductImageGalleryProps) {
    const sorted = [...images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    const [selectedIndex, setSelectedIndex] = useState(0)
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const panStart = useRef({ x: 0, y: 0 })
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

    useEffect(() => {
        if (!carouselApi) return
        const onSelect = () => setSelectedIndex(carouselApi.selectedScrollSnap())
        carouselApi.on('select', onSelect)
        return () => { carouselApi.off('select', onSelect) }
    }, [carouselApi])

    const goToSlide = (index: number) => {
        setSelectedIndex(index)
        carouselApi?.scrollTo(index)
    }

    const openLightbox = (index: number) => {
        setLightboxIndex(index)
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null)
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }, [])

    const goToPrevious = useCallback(() => {
        if (lightboxIndex === null) return
        setLightboxIndex(lightboxIndex === 0 ? sorted.length - 1 : lightboxIndex - 1)
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }, [lightboxIndex, sorted.length])

    const goToNext = useCallback(() => {
        if (lightboxIndex === null) return
        setLightboxIndex(lightboxIndex === sorted.length - 1 ? 0 : lightboxIndex + 1)
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }, [lightboxIndex, sorted.length])

    const handleZoomChange = useCallback((newZoom: number) => {
        setZoom(newZoom)
        if (newZoom <= 1) setPan({ x: 0, y: 0 })
    }, [])

    const resetZoom = useCallback(() => {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }, [])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (zoom <= 1) return
        setIsDragging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
        panStart.current = { ...pan }
            ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
    }, [zoom, pan])

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging || zoom <= 1) return
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        setPan({
            x: panStart.current.x + dx,
            y: panStart.current.y + dy,
        })
    }, [isDragging, zoom])

    const handlePointerUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    useEffect(() => {
        if (lightboxIndex === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    closeLightbox()
                    break
                case 'ArrowLeft':
                    goToPrevious()
                    break
                case 'ArrowRight':
                    goToNext()
                    break
            }
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [lightboxIndex, closeLightbox, goToPrevious, goToNext])

    if (sorted.length === 0) {
        return (
            <div className={cn('flex aspect-square items-center justify-center rounded-2xl border-2 border-slate-100 bg-slate-50', className)}>
                <IconShoppingCart className="h-32 w-32 text-slate-200" />
            </div>
        )
    }

    const promotionBadge = hasPromotion && (
        <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-xl">
                <IconTag className="h-4 w-4" />
                Promoção
            </span>
        </div>
    )

    return (
        <>
            <div className={cn('space-y-3', className)}>
                <div className="md:hidden">
                    <Carousel
                        setApi={setCarouselApi}
                        opts={{ loop: false }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-0">
                            {sorted.map((image, index) => (
                                <CarouselItem key={`${image.url}-${index}`} className="pl-0">
                                    <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-lg">
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            fill
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 600px"
                                            quality={60}
                                        />
                                        {index === 0 && promotionBadge}
                                        <button
                                            onClick={() => openLightbox(index)}
                                            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95"
                                            aria-label="Ver em tela cheia"
                                        >
                                            <IconMaximize className="h-5 w-5" />
                                        </button>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {sorted.length > 1 && (
                            <>
                                <button
                                    onClick={() => carouselApi?.scrollPrev()}
                                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95 disabled:opacity-30"
                                    disabled={selectedIndex === 0}
                                    aria-label="Foto anterior"
                                >
                                    <IconChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => carouselApi?.scrollNext()}
                                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95 disabled:opacity-30"
                                    disabled={selectedIndex === sorted.length - 1}
                                    aria-label="Próxima foto"
                                >
                                    <IconChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}
                    </Carousel>

                    {sorted.length > 1 && (
                        <div className="mt-3 overflow-hidden">
                            <Carousel
                                opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2">
                                    {sorted.map((image, index) => (
                                        <CarouselItem key={`thumb-${image.url}-${index}`} className="basis-1/4 pl-2">
                                            <button
                                                onClick={() => goToSlide(index)}
                                                className={cn(
                                                    'relative w-full aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200',
                                                    selectedIndex === index
                                                        ? 'border-primary opacity-100'
                                                        : 'border-transparent opacity-40'
                                                )}
                                            >
                                                <Image
                                                    src={image.url}
                                                    alt={image.alt}
                                                    fill
                                                    loading="lazy"
                                                    className="object-cover"
                                                    sizes="80px"
                                                    quality={40}
                                                />
                                            </button>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    )}
                </div>

                <div className="hidden md:block space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 shadow-lg">
                        <Image
                            src={sorted[selectedIndex].url}
                            alt={sorted[selectedIndex].alt}
                            fill
                            className="object-cover cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            onClick={() => openLightbox(selectedIndex)}
                        />
                        {selectedIndex === 0 && promotionBadge}
                        <button
                            onClick={() => openLightbox(selectedIndex)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-black/60 hover:scale-110"
                            aria-label="Ver em tela cheia"
                        >
                            <IconMaximize className="h-5 w-5" />
                        </button>
                    </div>

                    {sorted.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {sorted.slice(0, 8).map((image, index) => (
                                <button
                                    key={`desktop-thumb-${image.url}-${index}`}
                                    onClick={() => setSelectedIndex(index)}
                                    className={cn(
                                        'relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200',
                                        selectedIndex === index
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
                                    )}
                                >
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        loading="lazy"
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 25vw, 12vw"
                                        quality={40}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl animate-fade-in"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute right-3 top-3 z-20 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
                        aria-label="Fechar (Esc)"
                    >
                        <IconX className="h-5 w-5" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
                        aria-label="Anterior"
                    >
                        <IconChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); goToNext() }}
                        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
                        aria-label="Próxima"
                    >
                        <IconChevronRight className="h-5 w-5" />
                    </button>

                    <div
                        className="flex flex-1 items-center justify-center overflow-hidden px-12 pt-14 pb-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={cn(
                                'relative overflow-hidden rounded-xl',
                                zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                            )}
                            style={{ maxWidth: '90vw', maxHeight: '70vh' }}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <Image
                                src={sorted[lightboxIndex].url}
                                alt={sorted[lightboxIndex].alt}
                                width={1200}
                                height={800}
                                className="select-none rounded-xl"
                                style={{
                                    maxHeight: '70vh',
                                    width: 'auto',
                                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                                    transformOrigin: 'center center',
                                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                }}
                                draggable={false}
                                quality={75}
                            />
                        </div>
                    </div>

                    <div className="shrink-0 px-4 pb-4 pt-2" onClick={(e) => e.stopPropagation()}>
                        <p className="mb-3 text-center text-sm font-medium text-white/90">
                            {sorted[lightboxIndex].alt}
                            <span className="ml-2 text-white/40">
                                {lightboxIndex + 1} / {sorted.length}
                            </span>
                        </p>

                        <div className="mx-auto flex max-w-xs items-center gap-3">
                            <button
                                onClick={() => handleZoomChange(Math.max(1, zoom - 0.5))}
                                className="rounded-full bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                                aria-label="Diminuir zoom"
                            >
                                <IconZoomOut className="h-4 w-4" />
                            </button>

                            <input
                                type="range"
                                min={100}
                                max={300}
                                step={10}
                                value={zoom * 100}
                                onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
                                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
                            />

                            <button
                                onClick={() => handleZoomChange(Math.min(3, zoom + 0.5))}
                                className="rounded-full bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                                aria-label="Aumentar zoom"
                            >
                                <IconZoomIn className="h-4 w-4" />
                            </button>

                            {zoom > 1 && (
                                <button
                                    onClick={resetZoom}
                                    className="rounded-full bg-white/10 p-1.5 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                                    aria-label="Resetar zoom"
                                >
                                    <IconZoomReset className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}