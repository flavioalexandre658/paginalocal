'use client'

import { useEffect, useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import {
  IconBrandGoogle,
  IconChartLine,
  IconAd,
  IconBrandMeta,
  IconBrandTiktok,
  IconLoader2,
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getTrackingAction } from '@/actions/tracking/get-tracking.action'
import { upsertTrackingAction } from '@/actions/tracking/upsert-tracking.action'
import { deleteTrackingAction } from '@/actions/tracking/delete-tracking.action'
import { toggleTrackingAction } from '@/actions/tracking/toggle-tracking.action'
import type { TrackingPlatform } from '@/db/schema'

interface TrackingTabProps {
  storeSlug: string
}

interface TrackingConfig {
  id: string
  platform: TrackingPlatform
  trackingId: string
  isActive: boolean
}

interface PlatformInfo {
  id: TrackingPlatform
  name: string
  icon: React.ReactNode
  placeholder: string
  description: string
  helpUrl: string
}

const PLATFORMS: PlatformInfo[] = [
  {
    id: 'GTM',
    name: 'Google Tag Manager',
    icon: <IconBrandGoogle className="h-5 w-5" />,
    placeholder: 'GTM-XXXXXXX',
    description: 'Gerencie todas as suas tags em um só lugar',
    helpUrl: 'https://tagmanager.google.com',
  },
  {
    id: 'GOOGLE_ANALYTICS',
    name: 'Google Analytics',
    icon: <IconChartLine className="h-5 w-5" />,
    placeholder: 'G-XXXXXXXXXX',
    description: 'Análise completa do seu tráfego',
    helpUrl: 'https://analytics.google.com',
  },
  {
    id: 'GOOGLE_ADS',
    name: 'Google Ads',
    icon: <IconAd className="h-5 w-5" />,
    placeholder: 'AW-XXXXXXXXX',
    description: 'Rastreie conversões de anúncios',
    helpUrl: 'https://ads.google.com',
  },
  {
    id: 'META_PIXEL',
    name: 'Meta Pixel',
    icon: <IconBrandMeta className="h-5 w-5" />,
    placeholder: 'XXXXXXXXXXXXXXX',
    description: 'Rastreie eventos do Facebook e Instagram',
    helpUrl: 'https://business.facebook.com/events_manager',
  },
  {
    id: 'KWAI',
    name: 'Kwai Pixel',
    icon: <KwaiIcon />,
    placeholder: 'ID do Pixel',
    description: 'Rastreie conversões do Kwai Ads',
    helpUrl: 'https://ads.kwai.com',
  },
  {
    id: 'TIKTOK',
    name: 'TikTok Pixel',
    icon: <IconBrandTiktok className="h-5 w-5" />,
    placeholder: 'XXXXXXXX',
    description: 'Rastreie conversões do TikTok Ads',
    helpUrl: 'https://ads.tiktok.com',
  },
]

function KwaiIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5v9z" />
    </svg>
  )
}

export function TrackingTab({ storeSlug }: TrackingTabProps) {
  const [configs, setConfigs] = useState<TrackingConfig[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformInfo | null>(null)
  const [trackingIdInput, setTrackingIdInput] = useState('')
  const [configToDelete, setConfigToDelete] = useState<TrackingConfig | null>(null)

  const { executeAsync: fetchTracking, isExecuting: isLoading } = useAction(getTrackingAction)
  const { executeAsync: upsertTracking, isExecuting: isSaving } = useAction(upsertTrackingAction)
  const { executeAsync: deleteTracking, isExecuting: isDeleting } = useAction(deleteTrackingAction)
  const { executeAsync: toggleTracking } = useAction(toggleTrackingAction)

  useEffect(() => {
    loadConfigs()
  }, [storeSlug])

  const loadConfigs = async () => {
    const result = await fetchTracking({ storeSlug })
    if (result?.data) {
      setConfigs(result.data as TrackingConfig[])
    }
  }

  const handleOpenModal = (platform: PlatformInfo) => {
    const existingConfig = configs.find((c) => c.platform === platform.id)
    setSelectedPlatform(platform)
    setTrackingIdInput(existingConfig?.trackingId || '')
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedPlatform || !trackingIdInput.trim()) return

    const result = await upsertTracking({
      storeSlug,
      platform: selectedPlatform.id,
      trackingId: trackingIdInput.trim(),
    })

    if (result?.data) {
      toast.success('Configuração salva com sucesso!')
      setIsModalOpen(false)
      setTrackingIdInput('')
      setSelectedPlatform(null)
      loadConfigs()
    } else {
      toast.error('Erro ao salvar configuração')
    }
  }

  const handleDelete = async () => {
    if (!configToDelete) return

    const result = await deleteTracking({
      storeSlug,
      trackingId: configToDelete.id,
    })

    if (result?.data?.success) {
      toast.success('Configuração removida com sucesso!')
      setIsDeleteDialogOpen(false)
      setConfigToDelete(null)
      loadConfigs()
    } else {
      toast.error('Erro ao remover configuração')
    }
  }

  const handleToggle = async (config: TrackingConfig) => {
    const result = await toggleTracking({
      storeSlug,
      trackingId: config.id,
      isActive: !config.isActive,
    })

    if (result?.data) {
      setConfigs((prev) =>
        prev.map((c) => (c.id === config.id ? { ...c, isActive: !c.isActive } : c))
      )
      toast.success(config.isActive ? 'Rastreamento desativado' : 'Rastreamento ativado')
    }
  }

  const openDeleteDialog = (config: TrackingConfig) => {
    setConfigToDelete(config)
    setIsDeleteDialogOpen(true)
  }

  const getConfigForPlatform = (platformId: TrackingPlatform) => {
    return configs.find((c) => c.platform === platformId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Rastreamento e Conversões
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure os pixels e tags para rastrear conversões de suas campanhas de marketing.
        </p>
      </div>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex gap-3">
          <IconAlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Dica importante</p>
            <p className="mt-1 text-amber-700 dark:text-amber-300">
              Se você usar o Google Tag Manager, configure os outros pixels (GA, Ads, Meta) diretamente nele
              para evitar duplicação de scripts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((platform, index) => {
          const config = getConfigForPlatform(platform.id)
          const isConfigured = !!config

          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'group relative rounded-xl border p-4 transition-all',
                isConfigured
                  ? config.isActive
                    ? 'border-green-200/60 bg-green-50/30 dark:border-green-900/40 dark:bg-green-950/20'
                    : 'border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-800/30'
                  : 'border-slate-200/60 bg-white/70 hover:border-primary/30 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      isConfigured && config.isActive
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    )}
                  >
                    {platform.icon}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{platform.name}</p>
                    {isConfigured ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {config.trackingId}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500">Não configurado</p>
                    )}
                  </div>
                </div>

                {isConfigured && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.isActive}
                      onCheckedChange={() => handleToggle(config)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                )}
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {platform.description}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {isConfigured ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenModal(platform)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() => openDeleteDialog(config)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenModal(platform)}
                  >
                    <IconPlus className="mr-2 h-4 w-4" />
                    Configurar
                  </Button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedPlatform && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {selectedPlatform.icon}
                </div>
              )}
              {selectedPlatform?.name}
            </DialogTitle>
            <DialogDescription>
              Insira o ID de rastreamento da plataforma para começar a rastrear conversões.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trackingId">ID de Rastreamento</Label>
              <Input
                id="trackingId"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder={selectedPlatform?.placeholder}
              />
              <p className="text-xs text-slate-500">
                Formato esperado: {selectedPlatform?.placeholder}
              </p>
            </div>

            {selectedPlatform && (
              <a
                href={selectedPlatform.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Onde encontro meu ID?
              </a>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !trackingIdInput.trim()}>
              {isSaving ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <IconCheck className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover configuração?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover a configuração do{' '}
              {configToDelete && PLATFORMS.find((p) => p.id === configToDelete.platform)?.name}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo...
                </>
              ) : (
                <>
                  <IconTrash className="mr-2 h-4 w-4" />
                  Remover
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
