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
import { Button } from '@/components/ui/button'
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
        <div className="relative overflow-hidden rounded-xl border border-emerald-200/60 bg-emerald-50/30 dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <img
            src={preview.preview}
            alt="preview"
            className="h-28 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 to-transparent p-2.5">
            <span className="text-xs font-medium text-white/90 truncate max-w-[70%]">
              {preview.file.name}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/40"
            >
              <IconX className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-md">
            <IconCheck className="h-3.5 w-3.5 text-white" />
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
            'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center transition-all',
            isDragging
              ? 'border-primary/60 bg-primary/5'
              : 'border-slate-200/70 bg-slate-50/50 hover:border-primary/30 hover:bg-primary/5 dark:border-slate-700/60 dark:bg-slate-800/40'
          )}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700/60">
            <IconUpload className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
            <p className="mt-0.5 text-xs text-slate-400">{hint}</p>
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

function Toggle({
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
        'group flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
        checked
          ? 'border-primary/30 bg-primary/5 dark:border-primary/20 dark:bg-primary/10'
          : 'border-slate-200/60 bg-white/60 hover:border-slate-300/80 hover:bg-white dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:bg-slate-800/70'
      )}
    >
      <div className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
        checked
          ? 'bg-primary text-white'
          : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 dark:bg-slate-700/60 dark:text-slate-400'
      )}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium leading-snug',
          checked ? 'text-primary dark:text-primary' : 'text-slate-700 dark:text-slate-200'
        )}>
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-slate-400 dark:text-slate-500">
          {description}
        </p>
      </div>
      <div className={cn(
        'flex h-5 w-9 shrink-0 items-center rounded-full border-2 px-0.5 transition-all',
        checked
          ? 'border-primary bg-primary'
          : 'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700'
      )}>
        <div className={cn(
          'h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-3.5' : 'translate-x-0'
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
      className="w-full max-w-lg"
    >
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <IconPhoto className="h-8 w-8 text-primary" />
        </motion.div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Adicione imagens ao site
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Opcional — você pode adicionar depois no painel
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50 space-y-3">
        <Toggle
          checked={wantHero}
          onChange={setWantHero}
          label="Deseja adicionar uma imagem de destaque no site?"
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
              <div className="pt-1 pb-1">
                <DropZone
                  label="Clique ou arraste a imagem de destaque"
                  hint="JPG, PNG, WebP · Máx 10MB · Recomendado: 1920×1080"
                  preview={heroFile}
                  onSelect={(f) => setHeroFile(makePreview(f))}
                  onRemove={() => removePreview(heroFile, setHeroFile)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Toggle
          checked={wantLogoFavicon}
          onChange={setWantLogoFavicon}
          label="Deseja adicionar logo e ícone agora?"
          description="Logo para o cabeçalho e ícone que aparece na aba do navegador"
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
              <div className="grid grid-cols-2 gap-3 pt-1 pb-1">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Logo</p>
                  <DropZone
                    label="Logo da empresa"
                    hint="PNG com fundo transparente recomendado · Máx 10MB"
                    preview={logoFile}
                    onSelect={(f) => setLogoFile(makePreview(f))}
                    onRemove={() => removePreview(logoFile, setLogoFile)}
                  />
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">Favicon (ícone da aba)</p>
                  <DropZone
                    label="Ícone do site"
                    hint="Imagem quadrada recomendada · Máx 2MB"
                    preview={faviconFile}
                    onSelect={(f) => setFaviconFile(makePreview(f))}
                    onRemove={() => removePreview(faviconFile, setFaviconFile)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            className="flex-1 h-11 cursor-pointer border-slate-200 text-slate-500 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400"
            onClick={onComplete}
            disabled={isUploading}
          >
            Pular
          </Button>
          <Button
            className="flex-1 h-11 cursor-pointer gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            onClick={handleSave}
            disabled={isUploading}
          >
            {isUploading ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconArrowRight className="h-4 w-4" />
            )}
            {hasAnyFile ? 'Salvar e continuar' : 'Continuar'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
