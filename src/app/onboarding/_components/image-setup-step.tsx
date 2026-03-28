'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconCheck,
  IconLoader2,
  IconPhoto,
  IconBrandInstagram,
  IconArrowRight,
  IconUpload,
  IconX,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { useAction } from 'next-safe-action/hooks'

import { uploadStoreImageAction } from '@/actions/uploads/upload-store-image.action'
import { uploadFaviconAction } from '@/actions/uploads/upload-favicon.action'
import { PglButton } from '@/components/ui/pgl-button'
import { OnboardingCard, OnboardingHeader, OnboardingBody, OnboardingFooter } from '@/components/ui/pgl-onboarding'
import { cn } from '@/lib/utils'

interface ImageSetupStepProps {
  storeId: string
  onComplete: () => void
}

interface FilePreview {
  file: File
  preview: string
}

function DropZone({
  label,
  hint,
  preview,
  onSelect,
  onRemove,
  accept,
}: {
  label: string
  hint: string
  preview: FilePreview | null
  onSelect: (file: File) => void
  onRemove: () => void
  accept?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onSelect(file)
  }

  return (
    <div className="relative">
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview.preview}
            alt="preview"
            className="h-28 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-2.5">
            <span className="max-w-[70%] truncate text-xs font-medium text-white/90">
              {preview.file.name}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="flex size-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <IconX className="size-3.5 text-white" />
            </button>
          </div>
          <div className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-emerald-500">
            <IconCheck className="size-3 text-white" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-center',
            'transition-all duration-150',
            isDragging
              ? 'border-black/30 bg-black/[0.03]'
              : 'border-black/[0.12] hover:border-black/30 hover:bg-black/[0.02]'
          )}
        >
          <div className="flex size-9 items-center justify-center rounded-full bg-black/5">
            <IconUpload className="size-4 text-black/30" />
          </div>
          <div>
            <p className="text-sm font-medium text-black/55">{label}</p>
            <p className="mt-0.5 text-xs text-black/30">{hint}</p>
          </div>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? 'image/*'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onSelect(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function ToggleRow({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description: string
  icon: typeof IconPhoto
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left',
        'transition-all duration-150',
        checked
          ? 'border-black/80 bg-black/[0.02] ring-1 ring-black/80'
          : 'border-black/[0.08] hover:border-black/20'
      )}
    >
      <div className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
        checked ? 'bg-black/80 text-white' : 'bg-black/5 text-black/30'
      )}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          'text-sm font-medium leading-snug',
          checked ? 'text-black/80' : 'text-black/55'
        )}>
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-black/30">
          {description}
        </p>
      </div>
      <div className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors',
        checked ? 'bg-black/80' : 'bg-black/10'
      )}>
        <span className={cn(
          'block size-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )} />
      </div>
    </button>
  )
}

export function ImageSetupStep({ storeId, onComplete }: ImageSetupStepProps) {
  const [wantHero, setWantHero] = useState(false)
  const [wantLogoFavicon, setWantLogoFavicon] = useState(false)
  const [heroFile, setHeroFile] = useState<FilePreview | null>(null)
  const [logoFile, setLogoFile] = useState<FilePreview | null>(null)
  const [faviconFile, setFaviconFile] = useState<FilePreview | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { executeAsync: uploadImage } = useAction(uploadStoreImageAction)
  const { executeAsync: uploadFavicon } = useAction(uploadFaviconAction)

  function makePreview(file: File): FilePreview {
    return { file, preview: URL.createObjectURL(file) }
  }

  function removePreview(preview: FilePreview | null, setter: (v: null) => void) {
    if (preview) URL.revokeObjectURL(preview.preview)
    setter(null)
  }

  async function handleSave() {
    setIsUploading(true)

    try {
      if (wantHero && heroFile) {
        const fd = new FormData()
        fd.append('file', heroFile.file)
        const result = await uploadImage({ storeId, file: fd, role: 'hero' })
        if (result?.serverError) {
          toast.error(`Erro ao enviar imagem de destaque: ${result.serverError}`)
        }
      }

      if (wantLogoFavicon) {
        if (logoFile) {
          const fd = new FormData()
          fd.append('file', logoFile.file)
          const result = await uploadImage({ storeId, file: fd, role: 'logo' })
          if (result?.serverError) {
            toast.error(`Erro ao enviar logo: ${result.serverError}`)
          }
        }

        if (faviconFile) {
          const fd = new FormData()
          fd.append('file', faviconFile.file)
          const result = await uploadFavicon({ storeId, file: fd })
          if (result?.serverError) {
            toast.error(`Erro ao enviar favicon: ${result.serverError}`)
          }
        }
      }
    } finally {
      setIsUploading(false)
    }

    onComplete()
  }

  const hasAnyFile = (wantHero && heroFile) || (wantLogoFavicon && (logoFile || faviconFile))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <OnboardingCard>
        <OnboardingHeader
          title="Imagens do site"
          subtitle="Opcional — você pode adicionar depois no painel"
        />

        <OnboardingBody className="space-y-3">
          <ToggleRow
            checked={wantHero}
            onChange={setWantHero}
            label="Imagem de destaque"
            description="Aparece no topo da página, como capa do negócio"
            icon={IconPhoto}
          />

          <AnimatePresence>
            {wantHero && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pb-1 pt-1">
                  <DropZone
                    label="Clique ou arraste a imagem"
                    hint="JPG, PNG, WebP · Máx 10MB · 1920×1080"
                    preview={heroFile}
                    onSelect={(f) => setHeroFile(makePreview(f))}
                    onRemove={() => removePreview(heroFile, setHeroFile)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ToggleRow
            checked={wantLogoFavicon}
            onChange={setWantLogoFavicon}
            label="Logo e ícone"
            description="Logo para o cabeçalho e ícone na aba do navegador"
            icon={IconBrandInstagram}
          />

          <AnimatePresence>
            {wantLogoFavicon && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-3 pb-1 pt-1">
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-black/55">Logo</p>
                    <DropZone
                      label="Logo da empresa"
                      hint="PNG transparente · Máx 10MB"
                      preview={logoFile}
                      onSelect={(f) => setLogoFile(makePreview(f))}
                      onRemove={() => removePreview(logoFile, setLogoFile)}
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-black/55">Favicon</p>
                    <DropZone
                      label="Ícone do site"
                      hint="Quadrada · Máx 2MB"
                      preview={faviconFile}
                      onSelect={(f) => setFaviconFile(makePreview(f))}
                      onRemove={() => removePreview(faviconFile, setFaviconFile)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </OnboardingBody>

        <OnboardingFooter>
          <PglButton
            variant="ghost"
            size="sm"
            onClick={onComplete}
            disabled={isUploading}
          >
            Pular
          </PglButton>
          <PglButton
            variant="dark"
            size="sm"
            onClick={handleSave}
            disabled={isUploading}
            loading={isUploading}
          >
            {!isUploading && <IconArrowRight className="size-4" />}
            {hasAnyFile ? 'Salvar e continuar' : 'Continuar'}
          </PglButton>
        </OnboardingFooter>
      </OnboardingCard>
    </motion.div>
  )
}
