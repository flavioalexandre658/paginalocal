'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { IconX, IconChevronLeft, IconChevronRight, IconPhoto } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

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
  category: string
}

export function GallerySection({ images, storeName, city, category }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = useCallback(() => setSelectedIndex(null), [])

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  }, [selectedIndex, images.length])

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
  }, [selectedIndex, images.length])

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

  if (images.length === 0) {
    return null
  }

  return (
    <>
      <section id="galeria" className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-amber-500/[0.03] to-slate-50 dark:from-slate-900 dark:via-amber-500/[0.02] dark:to-slate-950" />

        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-600 mb-4">
              <IconPhoto className="h-4 w-4" />
              Fotos reais
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
              Conheça a {storeName} em {city}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Fotos reais da {storeName}, localizada em {city}, com atendimento de qualidade e estrutura completa para {category.toLowerCase()}.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className={cn(
                  'group relative aspect-[4/3] overflow-hidden rounded-2xl animate-fade-in-up',
                  'bg-white/70 backdrop-blur-sm shadow-lg shadow-slate-200/20',
                  'ring-1 ring-slate-200/60 transition-all duration-300',
                  'hover:-translate-y-1 hover:ring-2 hover:ring-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10',
                  'dark:bg-slate-900/70 dark:ring-slate-700/40 dark:shadow-slate-900/30 dark:hover:ring-amber-500/50'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-xl bg-white/10 backdrop-blur-md px-3 py-2 border border-white/20">
                    <p className="truncate text-sm font-medium text-white">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl animate-fade-in"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Fechar (Esc)"
          >
            <IconX className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Anterior"
          >
            <IconChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[85vh] max-w-[90vw] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex].url}
              alt={images[selectedIndex].alt}
              width={images[selectedIndex].width || 1200}
              height={images[selectedIndex].height || 800}
              className="rounded-2xl object-contain shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 p-4">
                <p className="text-center text-white font-medium">
                  {images[selectedIndex].alt}
                </p>
                <p className="mt-1 text-center text-sm text-white/60">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Próxima"
          >
            <IconChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  )
}
