'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconUser,
  IconCreditCard,
  IconWorld,
  IconPlugConnected,
  IconBell,
} from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ProfileTab } from './profile-tab'
import { BillingTab } from './billing-tab'
import { DomainTab } from './domain-tab'
import { IntegrationsTab } from './integrations-tab'
import { NotificationsTab } from './notifications-tab'

interface SettingsContentProps {
  storeSlug: string
  initialTab?: string
}

const TABS = [
  { id: 'perfil', label: 'Perfil', icon: IconUser },
  { id: 'assinatura', label: 'Assinatura', icon: IconCreditCard },
  { id: 'dominio', label: 'Domínio', icon: IconWorld },
  { id: 'integracoes', label: 'Integrações', icon: IconPlugConnected },
  { id: 'notificacoes', label: 'Notificações', icon: IconBell },
]

export function SettingsContent({ storeSlug, initialTab }: SettingsContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab || 'perfil')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.replace(`/painel/${storeSlug}/configuracoes?tab=${value}`, { scroll: false })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/painel/${storeSlug}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <IconArrowLeft className="h-4 w-4" />
          Voltar ao painel
        </Link>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
          Configurações
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Gerencie sua conta e preferências
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-2 bg-transparent p-0">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm backdrop-blur-sm transition-all data-[state=active]:border-primary/30 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-300"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          <TabsContent value="perfil" className="mt-0">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="assinatura" className="mt-0">
            <BillingTab storeSlug={storeSlug} />
          </TabsContent>

          <TabsContent value="dominio" className="mt-0">
            <DomainTab storeSlug={storeSlug} />
          </TabsContent>

          <TabsContent value="integracoes" className="mt-0">
            <IntegrationsTab storeSlug={storeSlug} />
          </TabsContent>

          <TabsContent value="notificacoes" className="mt-0">
            <NotificationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
