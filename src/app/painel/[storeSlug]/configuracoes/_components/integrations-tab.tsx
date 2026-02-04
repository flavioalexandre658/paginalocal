'use client'

import {
  IconBrandGoogle,
  IconCheck,
  IconRefresh,
  IconPlugConnected,
  IconBrandFacebook,
  IconBrandInstagram,
} from '@tabler/icons-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'

interface IntegrationsTabProps {
  storeSlug: string
}

export function IntegrationsTab({ storeSlug }: IntegrationsTabProps) {
  const integrations = [
    {
      id: 'google',
      name: 'Google Meu Negócio',
      description: 'Sincronize avaliações e dados da sua empresa',
      icon: IconBrandGoogle,
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Conecte sua página para sincronizar avaliações',
      icon: IconBrandFacebook,
      connected: false,
      color: 'bg-blue-600/10 text-blue-700 dark:text-blue-500',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Importe fotos do seu perfil comercial',
      icon: IconBrandInstagram,
      connected: false,
      color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
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

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${integration.color}`}>
                <integration.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {integration.name}
                  </p>
                  {integration.connected && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <IconCheck className="h-3 w-3" />
                      Conectado
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {integration.description}
                </p>
                {integration.connected && integration.lastSync && (
                  <p className="mt-1 text-xs text-slate-400">
                    Última sincronização: {formatRelativeTime(integration.lastSync)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {integration.connected ? (
                <>
                  <EnhancedButton variant="outline" size="sm">
                    <IconRefresh className="mr-2 h-4 w-4" />
                    Sincronizar
                  </EnhancedButton>
                  <button className="text-sm text-slate-500 hover:text-red-500">
                    Desconectar
                  </button>
                </>
              ) : (
                <EnhancedButton variant="outline" size="sm">
                  <IconPlugConnected className="mr-2 h-4 w-4" />
                  Conectar
                </EnhancedButton>
              )}
            </div>
          </div>
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
