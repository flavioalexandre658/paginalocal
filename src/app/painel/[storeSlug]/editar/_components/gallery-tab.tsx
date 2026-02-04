'use client'

import { IconPhoto, IconUpload, IconTrash, IconStar } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface Image {
  id: string
  url: string
  alt: string | null
  role: string | null
  order: number
}

interface GalleryTabProps {
  store: {
    id: string
    coverUrl: string | null
  }
  images: Image[]
  storeSlug: string
}

export function GalleryTab({ store, images, storeSlug }: GalleryTabProps) {
  const heroImage = images.find((img) => img.role === 'hero')
  const galleryImages = images.filter((img) => img.role !== 'hero')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Galeria de Fotos
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie as imagens que aparecem no seu site
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <IconStar className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium text-slate-900 dark:text-white">
              Imagem de Destaque (Hero)
            </h3>
          </div>

          {heroImage || store.coverUrl ? (
            <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={heroImage?.url || store.coverUrl || ''}
                alt="Imagem de destaque"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition-transform hover:scale-105">
                  <IconUpload className="h-4 w-4" />
                  Trocar imagem
                </button>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video max-w-xl flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
              <IconPhoto className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Nenhuma imagem de destaque
              </p>
              <button className="mt-3 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
                <IconUpload className="h-4 w-4" />
                Fazer upload
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconPhoto className="h-4 w-4 text-slate-500" />
              <h3 className="font-medium text-slate-900 dark:text-white">
                Galeria ({galleryImages.length} fotos)
              </h3>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
              <IconUpload className="h-4 w-4" />
              Adicionar fotos
            </button>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                >
                  <img
                    src={image.url}
                    alt={image.alt || 'Foto da galeria'}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="rounded-lg bg-white p-2 text-slate-900 shadow-lg transition-transform hover:scale-110">
                      <IconStar className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110">
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800/50">
              <IconPhoto className="h-12 w-12 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                Nenhuma foto na galeria
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Adicione fotos para mostrar seu trabalho
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Dica:</strong> Perfis com 5+ fotos recebem em média 2x mais contatos.
          Adicione fotos do ambiente, equipe e trabalhos realizados.
        </p>
      </div>
    </div>
  )
}
