'use client'

import { useState } from 'react'
import {
  IconMail,
  IconBrandWhatsapp,
  IconBell,
  IconMessageCircle,
  IconStar,
  IconTrendingUp,
} from '@tabler/icons-react'
import { Switch } from '@/components/ui/switch'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import toast from 'react-hot-toast'

export function NotificationsTab() {
  const [settings, setSettings] = useState({
    emailNewContact: true,
    emailWeeklyReport: true,
    emailNewReview: false,
    whatsappNewContact: false,
    whatsappUrgent: true,
  })

  const updateSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = () => {
    toast.success('Preferências salvas!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Notificações
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure como deseja receber alertas
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <IconMail className="h-5 w-5 text-slate-400" />
            <h3 className="font-medium text-slate-900 dark:text-white">
              Notificações por E-mail
            </h3>
          </div>

          <div className="space-y-4">
            <NotificationItem
              icon={IconMessageCircle}
              title="Novos contatos"
              description="Receba um e-mail sempre que um cliente entrar em contato"
              enabled={settings.emailNewContact}
              onToggle={() => updateSetting('emailNewContact')}
            />
            <NotificationItem
              icon={IconTrendingUp}
              title="Relatório semanal"
              description="Resumo de desempenho do seu site toda segunda-feira"
              enabled={settings.emailWeeklyReport}
              onToggle={() => updateSetting('emailWeeklyReport')}
            />
            <NotificationItem
              icon={IconStar}
              title="Novas avaliações"
              description="Seja notificado quando receber uma avaliação no Google"
              enabled={settings.emailNewReview}
              onToggle={() => updateSetting('emailNewReview')}
            />
          </div>
        </div>

        <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
          <div className="mb-4 flex items-center gap-2">
            <IconBrandWhatsapp className="h-5 w-5 text-emerald-500" />
            <h3 className="font-medium text-slate-900 dark:text-white">
              Notificações por WhatsApp
            </h3>
          </div>

          <div className="space-y-4">
            <NotificationItem
              icon={IconMessageCircle}
              title="Novos contatos"
              description="Receba uma mensagem no WhatsApp para cada novo contato"
              enabled={settings.whatsappNewContact}
              onToggle={() => updateSetting('whatsappNewContact')}
            />
            <NotificationItem
              icon={IconBell}
              title="Alertas urgentes"
              description="Problemas críticos com seu site ou pagamento"
              enabled={settings.whatsappUrgent}
              onToggle={() => updateSetting('whatsappUrgent')}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
        <EnhancedButton onClick={handleSave}>
          Salvar Preferências
        </EnhancedButton>
      </div>
    </div>
  )
}

function NotificationItem({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  )
}
