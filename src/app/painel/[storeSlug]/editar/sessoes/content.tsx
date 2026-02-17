'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import {
  IconPhoto,
  IconChartBar,
  IconInfoCircle,
  IconListDetails,
  IconShoppingCart,
  IconCreditCard,
  IconCamera,
  IconMapPin,
  IconStar,
  IconHelpCircle,
  IconPhone,
  IconEye,
  IconEyeOff,
  IconChevronUp,
  IconChevronDown,
  IconFolders,
} from '@tabler/icons-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { EditPageWrapper } from '../_components/edit-page-wrapper'
import { GalleryTab } from '../_components/gallery-tab'
import { SectionsTab } from '../_components/sections-tab'
import { updateStoreSectionsAction } from '@/actions/sections/update-store-sections.action'
import { getStoreSections } from '@/lib/store-sections'
import type { StoreSection, SectionType } from '@/db/schema'

interface SessoesPageContentProps {
  storeSlug: string
}

const SECTION_META: Record<SectionType, { label: string; icon: typeof IconPhoto; iconBg: string }> = {
  HERO: { label: 'Hero / Capa', icon: IconPhoto, iconBg: 'bg-gradient-to-br from-primary/20 to-primary/5 shadow-primary/10' },
  STATS: { label: 'Estatísticas', icon: IconChartBar, iconBg: 'bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 shadow-cyan-500/10' },
  ABOUT: { label: 'Sobre', icon: IconInfoCircle, iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-blue-500/10' },
  SERVICES: { label: 'Serviços', icon: IconListDetails, iconBg: 'bg-gradient-to-br from-primary/20 to-primary/5 shadow-primary/10' },
  PRODUCTS: { label: 'Produtos', icon: IconShoppingCart, iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-blue-500/10' },
  PRICING_PLANS: { label: 'Planos de Preços', icon: IconCreditCard, iconBg: 'bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 shadow-indigo-500/10' },
  GALLERY: { label: 'Galeria de Fotos', icon: IconCamera, iconBg: 'bg-gradient-to-br from-pink-500/20 to-pink-500/5 shadow-pink-500/10' },
  AREAS: { label: 'Áreas Atendidas', icon: IconMapPin, iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-emerald-500/10' },
  TESTIMONIALS: { label: 'Depoimentos', icon: IconStar, iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-amber-500/10' },
  FAQ: { label: 'Perguntas Frequentes', icon: IconHelpCircle, iconBg: 'bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-amber-500/10' },
  CONTACT: { label: 'Contato', icon: IconPhone, iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-emerald-500/10' },
}

const REQUIRED_SECTIONS: SectionType[] = ['HERO', 'CONTACT']

export function SessoesPageContent({ storeSlug }: SessoesPageContentProps) {
  return (
    <EditPageWrapper storeSlug={storeSlug}>
      {(data) => (
        <SessoesPageInner
          storeSlug={storeSlug}
          store={data.store}
          services={data.services}
          images={data.images}
        />
      )}
    </EditPageWrapper>
  )
}

function SessoesPageInner({
  storeSlug,
  store,
  services,
  images,
}: {
  storeSlug: string
  store: any
  services: any[]
  images: any[]
}) {
  const sections = getStoreSections(store)
  const [localSections, setLocalSections] = useState<StoreSection[]>(sections)
  const [hasOrderChanges, setHasOrderChanges] = useState(false)

  const { executeAsync: updateSections, isExecuting: isSavingOrder } = useAction(updateStoreSectionsAction)

  function toggleSection(type: SectionType) {
    if (REQUIRED_SECTIONS.includes(type)) {
      toast.error('Esta seção é obrigatória')
      return
    }
    setLocalSections(prev =>
      prev.map(s => s.type === type ? { ...s, isActive: !s.isActive } : s)
    )
    setHasOrderChanges(true)
  }

  function moveSection(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= localSections.length) return

    const newSections = [...localSections]
    const temp = newSections[index]
    newSections[index] = newSections[newIndex]
    newSections[newIndex] = temp
    newSections.forEach((s, i) => { s.order = i })

    setLocalSections(newSections)
    setHasOrderChanges(true)
  }

  async function handleSaveOrder() {
    const result = await updateSections({ storeId: store.id, sections: localSections })

    if (result?.data) {
      toast.success('Ordem das seções salva!')
      setHasOrderChanges(false)
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Seções do Site
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie, reordene e ative/desative cada seção
          </p>
        </div>

        {hasOrderChanges && (
          <EnhancedButton onClick={handleSaveOrder} loading={isSavingOrder} size="sm">
            Salvar ordem
          </EnhancedButton>
        )}
      </div>

      <div className="space-y-3">
        {localSections.map((section, index) => {
          const meta = SECTION_META[section.type]
          if (!meta) return null

          const isRequired = REQUIRED_SECTIONS.includes(section.type)
          const Icon = meta.icon

          return (
            <div
              key={section.type}
              className={cn(
                'rounded-2xl border transition-all',
                section.isActive
                  ? 'border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900/50'
                  : 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
              )}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                  >
                    <IconChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === localSections.length - 1}
                    className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                  >
                    <IconChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-lg', meta.iconBg)}>
                  <Icon className={cn('h-5 w-5', section.isActive ? 'text-slate-700' : 'text-slate-400')} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn('font-semibold', section.isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400')}>
                      {meta.label}
                    </span>
                    {isRequired && (
                      <Badge variant="secondary" className="text-[10px]">Obrigatória</Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">Posição {index + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  {section.isActive ? (
                    <IconEye className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <IconEyeOff className="h-4 w-4 text-slate-300" />
                  )}
                  <Switch
                    checked={section.isActive}
                    onCheckedChange={() => toggleSection(section.type)}
                    disabled={isRequired}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t border-slate-200/60 pt-8 dark:border-slate-700/60">
        <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
          Conteúdos das Seções
        </h2>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/60 bg-white p-5 dark:border-slate-700/60 dark:bg-slate-900/50">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 shadow-lg shadow-pink-500/10">
                <IconCamera className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Imagens</h3>
                <p className="text-sm text-slate-500">Hero e galeria de fotos</p>
              </div>
            </div>
            <GalleryTab store={store} images={images} storeSlug={storeSlug} />
          </div>

          <SectionsTab
            store={{
              id: store.id,
              category: store.category,
              faq: store.faq,
              neighborhoods: store.neighborhoods,
              stats: store.stats,
              mode: store.mode,
            }}
            services={services}
            storeSlug={storeSlug}
          />
        </div>
      </div>
    </div>
  )
}
