'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
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

  if (images.length === 0) {
    return null
  }

  const openLightbox = (index: number) => setSelectedIndex(index)
  const closeLightbox = () => setSelectedIndex(null)

  const goToPrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)
  }

  const goToNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)
  }

  return (
    <>
      <section className="bg-gradient-to-b from-white to-slate-50 py-16 dark:from-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <IconPhoto className="h-4 w-4" />
              Fotos reais
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
              Conheça a {storeName} em {city}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              Fotos reais da {storeName}, localizada em {city}, com atendimento de qualidade e estrutura completa para {category.toLowerCase()}.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <motion.button
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => openLightbox(index)}
                className={cn(
                  'group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800',
                  'ring-1 ring-slate-200/60 transition-all duration-300',
                  'hover:-translate-y-1 hover:ring-2 hover:ring-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10',
                  'dark:ring-slate-700/60 dark:hover:ring-blue-500/50'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="truncate text-sm font-medium text-white drop-shadow-lg">
                    {image.alt}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Fechar"
            >
              <IconX className="h-6 w-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
              className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Anterior"
            >
              <IconChevronLeft className="h-6 w-6" />
            </button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt}
                width={images[selectedIndex].width || 1200}
                height={images[selectedIndex].height || 800}
                className="rounded-lg object-contain"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-center text-white">
                  {images[selectedIndex].alt}
                </p>
                <p className="mt-1 text-center text-sm text-white/60">
                  {selectedIndex + 1} / {images.length}
                </p>
              </div>
            </motion.div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
              aria-label="Próxima"
            >
              <IconChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
