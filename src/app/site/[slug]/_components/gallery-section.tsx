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
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'

// ✅ local-seo modular
import { getCopy } from '@/lib/local-copy'
import { renderTokens } from '@/lib/local-copy/render'
import type { StoreMode, LocalPageCtx } from '@/lib/local-copy/types'

interface GalleryImage {
  id: string
  url: string
  alt: string
  width: number | null
  height: number | null
}

interface GallerySectionProps {
  images: GalleryImage[]
  storeName: string
  city: string
  state?: string
  category: string

  // ✅ para variar por MODE:
  mode: StoreMode

  // ✅ para seed forte/estável:
  id?: string | number
  slug?: string
}

export function GallerySection({ images, storeName, city, state, category, mode, id, slug }: GallerySectionProps) {
  // Lightbox state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const ctx: LocalPageCtx = {
    id,
    slug,
    mode,
    name: storeName || "",
    category: category || "Serviços",
    city: city || "",
    state: state || "",
    servicesCount: images?.length ?? 0, // ✅ usa images.length
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    carouselApi?.scrollTo(index)
  }

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [selectedIndex, images.length])

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [selectedIndex, images.length])

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
    if (newZoom <= 1) setPan({ x: 0, y: 0 })
  }, [])

  const resetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return
      setIsDragging(true)
      dragStart.current = { x: e.clientX, y: e.clientY }
      panStart.current = { ...pan }
        ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [zoom, pan]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || zoom <= 1) return
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setPan({
        x: panStart.current.x + dx,
        y: panStart.current.y + dy,
      })
    },
    [isDragging, zoom]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (selectedIndex === null) return

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
  }, [selectedIndex, closeLightbox, goToPrevious, goToNext])

  if (!images || images.length === 0) return null

  return (
    <>
      <section id="galeria" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Section header */}
            <div className="mb-14 animate-fade-in-up">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                {renderTokens(getCopy(ctx, "gallery.kicker"))}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
                {renderTokens(getCopy(ctx, "gallery.heading"))}
              </h2>

              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                {renderTokens(getCopy(ctx, "gallery.intro"))}
              </p>
            </div>

            {/* ====== MOBILE: Embla Carousel + Thumbnails ====== */}
            <div className="md:hidden animate-fade-in-up">
              <Carousel setApi={setCarouselApi} opts={{ loop: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {images.map((image, index) => (
                    <CarouselItem key={image.id} className="pl-0">
                      <div className="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            loading={index === 0 ? 'eager' : 'lazy'}
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 600px"
                            quality={60}
                          />

                          <button
                            onClick={() => openLightbox(index)}
                            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95"
                            aria-label="Ver em tela cheia"
                          >
                            <IconMaximize className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => carouselApi?.scrollPrev()}
                      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95 disabled:opacity-30"
                      disabled={currentSlide === 0}
                      aria-label="Foto anterior"
                    >
                      <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => carouselApi?.scrollNext()}
                      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/20 transition-all active:scale-95 disabled:opacity-30"
                      disabled={currentSlide === images.length - 1}
                      aria-label="Próxima foto"
                    >
                      <IconChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </Carousel>

              {images.length > 1 && (
                <div className="mt-3 overflow-hidden">
                  <Carousel
                    opts={{
                      align: 'start',
                      dragFree: true,
                      containScroll: 'trimSnaps',
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2">
                      {images.map((image, index) => (
                        <CarouselItem key={image.id} className="basis-1/4 pl-2">
                          <button
                            onClick={() => goToSlide(index)}
                            className={cn(
                              'relative w-full aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200',
                              currentSlide === index ? 'border-primary opacity-100' : 'border-transparent opacity-40'
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

            {/* ====== DESKTOP: Mosaic grid ====== */}
            <div className="hidden md:grid gap-3 md:grid-cols-3 auto-rows-[180px] [grid-auto-flow:dense] stagger-children">
              {images.map((image, index) => {
                const groupIndex = Math.floor(index / 3)
                const posInGroup = index % 3
                const pattern = groupIndex % 3

                let spanClass = ''

                if (pattern === 0) {
                  if (posInGroup === 0) spanClass = 'md:col-span-2 md:row-span-2'
                } else if (pattern === 1) {
                  if (posInGroup === 2) spanClass = 'md:col-span-2 md:row-span-2'
                } else {
                  if (posInGroup === 0) spanClass = 'md:row-span-2'
                  else if (posInGroup === 1) spanClass = 'md:col-span-2'
                }

                return (
                  <button
                    key={image.id}
                    onClick={() => openLightbox(index)}
                    className={`group relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 animate-fade-in-up dark:border-slate-800 dark:bg-slate-900 ${spanClass}`}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      loading={index < 2 ? 'eager' : 'lazy'}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes={spanClass.includes('col-span-2') ? '600px' : '300px'}
                      quality={50}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <IconZoomIn className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox (inalterado) */}
      {selectedIndex !== null && (
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
              ref={imageContainerRef}
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
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt}
                width={images[selectedIndex].width || 1200}
                height={images[selectedIndex].height || 800}
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
              {images[selectedIndex].alt}
              <span className="ml-2 text-white/40">
                {selectedIndex + 1} / {images.length}
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