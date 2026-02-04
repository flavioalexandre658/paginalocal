'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconLoader2,
  IconSettings,
  IconPhone,
  IconPhoto,
  IconListDetails,
  IconSearch,
} from '@tabler/icons-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { getStoreForEditAction } from '@/actions/stores/get-store-for-edit.action'
import { GeneralTab } from './general-tab'
import { ContactTab } from './contact-tab'
import { GalleryTab } from './gallery-tab'
import { SectionsTab } from './sections-tab'
import { SeoTab } from './seo-tab'

interface EditStoreContentProps {
  storeSlug: string
  initialTab?: string
}

const TABS = [
  { id: 'geral', label: 'Geral', icon: IconSettings },
  { id: 'contato', label: 'Contato', icon: IconPhone },
  { id: 'galeria', label: 'Galeria', icon: IconPhoto },
  { id: 'secoes', label: 'Seções', icon: IconListDetails },
  { id: 'seo', label: 'SEO', icon: IconSearch },
]

export function EditStoreContent({ storeSlug, initialTab }: EditStoreContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab || 'geral')
  const { executeAsync, result, isExecuting } = useAction(getStoreForEditAction)

  useEffect(() => {
    executeAsync({ storeSlug })
  }, [executeAsync, storeSlug])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.replace(`/painel/${storeSlug}/editar?tab=${value}`, { scroll: false })
  }

  if (isExecuting || !result?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const data = result.data

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
          Editar Site
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Personalize o conteúdo e aparência do seu site
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
          <TabsContent value="geral" className="mt-0">
            <GeneralTab store={data.store} storeSlug={storeSlug} />
          </TabsContent>

          <TabsContent value="contato" className="mt-0">
            <ContactTab store={data.store} storeSlug={storeSlug} />
          </TabsContent>

          <TabsContent value="galeria" className="mt-0">
            <GalleryTab
              store={data.store}
              images={data.images}
              storeSlug={storeSlug}
            />
          </TabsContent>

          <TabsContent value="secoes" className="mt-0">
            <SectionsTab
              store={data.store}
              services={data.services}
              storeSlug={storeSlug}
            />
          </TabsContent>

          <TabsContent value="seo" className="mt-0">
            <SeoTab store={data.store} storeSlug={storeSlug} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  )
}
