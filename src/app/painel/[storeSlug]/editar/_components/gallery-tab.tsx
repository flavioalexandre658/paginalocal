'use client'

import { useState, useRef } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconPhoto,
  IconUpload,
  IconTrash,
  IconStar,
  IconLoader2,
  IconCheck,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { uploadStoreImageAction } from '@/actions/uploads/upload-store-image.action'
import { deleteStoreImageAction } from '@/actions/uploads/delete-store-image.action'
import { setImageAsHeroAction } from '@/actions/uploads/set-image-as-hero.action'

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

export function GalleryTab({ store, images: initialImages }: GalleryTabProps) {
  const [images, setImages] = useState<Image[]>(initialImages)
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const { executeAsync: uploadImage, isExecuting: isUploading } = useAction(uploadStoreImageAction)
  const { executeAsync: deleteImage, isExecuting: isDeleting } = useAction(deleteStoreImageAction)
  const { executeAsync: setAsHero, isExecuting: isSettingHero } = useAction(setImageAsHeroAction)

  const [uploadingRole, setUploadingRole] = useState<'hero' | 'gallery' | null>(null)
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [settingAsHeroId, setSettingAsHeroId] = useState<string | null>(null)

  const heroImage = images.find((img) => img.role === 'hero')
  const galleryImages = images.filter((img) => img.role !== 'hero')

  async function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    role: 'hero' | 'gallery'
  ) {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingRole(role)

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida`)
        continue
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} deve ter no máximo 10MB`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadImage({
        storeId: store.id,
        file: formData,
        role,
      })

      if (result?.data?.image) {
        setImages((prev) => {
          if (role === 'hero') {
            return [
              result.data!.image as Image,
              ...prev.filter((img) => img.role !== 'hero'),
            ]
          }
          return [...prev, result.data!.image as Image]
        })
        toast.success('Imagem enviada com sucesso!')
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    }

    setUploadingRole(null)
    event.target.value = ''
  }

  async function handleDeleteImage(imageId: string) {
    setDeletingImageId(imageId)

    const result = await deleteImage({
      imageId,
      storeId: store.id,
    })

    if (result?.data?.success) {
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Imagem removida!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    setDeletingImageId(null)
  }

  async function handleSetAsHero(imageId: string) {
    setSettingAsHeroId(imageId)

    const result = await setAsHero({
      imageId,
      storeId: store.id,
    })

    if (result?.data?.success) {
      // Atualizar estado local: imagem selecionada vira hero, hero atual vira gallery
      setImages((prev) => {
        const selectedImage = prev.find((img) => img.id === imageId)
        const currentHero = prev.find((img) => img.role === 'hero')
        
        return prev.map((img) => {
          if (img.id === imageId) {
            // Imagem selecionada vira hero
            return { ...img, role: 'hero', order: 0 }
          }
          if (currentHero && img.id === currentHero.id) {
            // Hero atual vira gallery
            return { ...img, role: 'gallery', order: prev.length }
          }
          return img
        })
      })
      setSelectedImageId(null)
      toast.success('Imagem definida como destaque!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    setSettingAsHeroId(null)
  }

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

          <input
            ref={heroInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'hero')}
            className="hidden"
          />

          {heroImage || store.coverUrl ? (
            <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={heroImage?.url || store.coverUrl || ''}
                alt="Imagem de destaque"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                <button
                  onClick={() => heroInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {uploadingRole === 'hero' ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconUpload className="h-4 w-4" />
                  )}
                  Trocar imagem
                </button>
                {heroImage && (
                  <button
                    onClick={() => handleDeleteImage(heroImage.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    {deletingImageId === heroImage.id ? (
                      <IconLoader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <IconTrash className="h-4 w-4" />
                    )}
                    Remover
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isUploading && heroInputRef.current?.click()}
              className={cn(
                "flex aspect-video max-w-xl cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/50",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              {uploadingRole === 'hero' ? (
                <>
                  <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-2 text-sm font-medium text-primary">
                    Enviando imagem...
                  </p>
                </>
              ) : (
                <>
                  <IconPhoto className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Clique para adicionar imagem de destaque
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Recomendado: 1200x675 pixels
                  </p>
                </>
              )}
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
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, 'gallery')}
              className="hidden"
            />
            <button
              onClick={() => galleryInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              {uploadingRole === 'gallery' ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconUpload className="h-4 w-4" />
              )}
              Adicionar fotos
            </button>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              <AnimatePresence>
                {galleryImages.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60"
                    onClick={() => setSelectedImageId(selectedImageId === image.id ? null : image.id)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || 'Foto da galeria'}
                      className={cn(
                        "h-full w-full object-cover transition-transform group-hover:scale-105",
                        selectedImageId === image.id && "scale-105"
                      )}
                    />
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center gap-2 bg-black/50 transition-opacity",
                        "opacity-0 group-hover:opacity-100",
                        selectedImageId === image.id && "opacity-100"
                      )}
                    >
                      {/* Botão Destacar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSetAsHero(image.id)
                        }}
                        disabled={isSettingHero || isDeleting}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                        title="Definir como imagem de destaque"
                      >
                        {settingAsHeroId === image.id ? (
                          <IconLoader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <IconStar className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Destacar</span>
                      </button>
                      {/* Botão Excluir */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteImage(image.id)
                        }}
                        disabled={isDeleting || isSettingHero}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                        title="Excluir imagem"
                      >
                        {deletingImageId === image.id ? (
                          <IconLoader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <IconTrash className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </div>
                    {selectedImageId === image.id && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary p-1">
                        <IconCheck className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div
              onClick={() => !isUploading && galleryInputRef.current?.click()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 transition-colors hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/50",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              {uploadingRole === 'gallery' ? (
                <>
                  <IconLoader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-2 text-sm font-medium text-primary">
                    Enviando imagens...
                  </p>
                </>
              ) : (
                <>
                  <IconPhoto className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Clique para adicionar fotos
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Você pode selecionar múltiplas fotos
                  </p>
                </>
              )}
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
