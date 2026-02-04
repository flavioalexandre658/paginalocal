'use client'

import { motion } from 'framer-motion'
import {
  IconBrandGoogle,
  IconCheck,
  IconRefresh,
  IconBrandFacebook,
  IconBrandInstagram,
  IconClock,
} from '@tabler/icons-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'

interface IntegrationsTabProps {
  storeSlug: string
}

export function IntegrationsTab({ storeSlug }: IntegrationsTabProps) {
  const gmbIntegration = {
    id: 'google',
    name: 'Google Meu Negócio',
    description: 'Sincronize avaliações e dados da sua empresa',
    icon: IconBrandGoogle,
    connected: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
  }

  const comingSoonIntegrations = [
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Conecte sua página para sincronizar avaliações',
      icon: IconBrandFacebook,
      color: 'bg-blue-600/10 text-blue-700 dark:text-blue-500',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Importe fotos do seu perfil comercial',
      icon: IconBrandInstagram,
      color: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-pink-600 dark:text-pink-400',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Integrações
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Conecte serviços externos ao seu site
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <gmbIntegration.icon className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900 dark:text-white">
                  {gmbIntegration.name}
                </p>
                {gmbIntegration.connected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <IconCheck className="h-3 w-3" />
                    Conectado
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {gmbIntegration.description}
              </p>
              {gmbIntegration.connected && gmbIntegration.lastSync && (
                <p className="mt-1 text-xs text-slate-400">
                  Última sincronização: {formatRelativeTime(gmbIntegration.lastSync)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <EnhancedButton variant="outline" size="sm" className="gap-2">
              <IconRefresh className="h-4 w-4" />
              <span className="hidden sm:inline">Sincronizar</span>
            </EnhancedButton>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Em breve
        </p>

        {comingSoonIntegrations.map((integration, index) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-4 opacity-60 dark:border-slate-700/60 dark:bg-slate-800/30 sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${integration.color}`}>
                  <integration.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {integration.name}
                    </p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {integration.description}
                  </p>
                </div>
              </div>

              <Badge variant="secondary" className="w-fit gap-1.5 self-end sm:self-auto">
                <IconClock className="h-3 w-3" />
                Em breve
              </Badge>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <strong>Dica:</strong> Mantenha suas integrações sincronizadas para que as avaliações
          e informações do seu negócio estejam sempre atualizadas.
        </p>
      </div>
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))

  if (hours > 0) {
    return `há ${hours} hora${hours > 1 ? 's' : ''}`
  }
  if (minutes > 0) {
    return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`
  }
  return 'agora mesmo'
}
