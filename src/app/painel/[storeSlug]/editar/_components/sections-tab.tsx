'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconPlus,
  IconTrash,
  IconGripVertical,
  IconListDetails,
  IconHelpCircle,
  IconMapPin,
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
  IconEdit,
  IconChartBar,
  IconRefresh,
  IconShoppingCart,
  IconFolders,
  IconCreditCard,
} from '@tabler/icons-react'
import type { StoreStat } from '@/db/schema/stores.schema'

import { updateStoreAction } from '@/actions/stores/update-store.action'
import { deleteServiceAction } from '@/actions/services/delete-service.action'
import { reorderServicesAction } from '@/actions/services/reorder-services.action'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import { ServiceFormModal } from './service-form-modal'
import { ProductsManager } from './products-manager'
import { CollectionsManager } from './collections-manager'
import { PricingPlansManager } from './pricing-plans-manager'

const sectionsFormSchema = z.object({
  faq: z.array(
    z.object({
      question: z.string().min(1, 'Pergunta é obrigatória'),
      answer: z.string().min(1, 'Resposta é obrigatória'),
    })
  ),
  neighborhoods: z.array(
    z.object({
      name: z.string().min(1, 'Nome é obrigatório'),
    })
  ),
})

type SectionsFormData = z.infer<typeof sectionsFormSchema>

interface Service {
  id: string
  name: string
  description: string | null
  priceInCents: number | null
  position: number
  heroImageUrl?: string | null
}

interface SectionsTabProps {
  store: {
    id: string
    category: string
    faq: Array<{ question: string; answer: string }> | null
    neighborhoods: string[] | null
    stats: StoreStat[] | null
    mode: string | null
  }
  services: Service[]
  storeSlug: string
}

interface SectionCardProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  count: number
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SectionCard({
  title,
  subtitle,
  icon,
  iconBg,
  count,
  isOpen,
  onToggle,
  children,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900/50"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5"
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl shadow-lg',
              iconBg
            )}
          >
            {icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {title}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>
        </div>
        <IconChevronDown
          className={cn(
            'h-5 w-5 text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-200/60 p-5 dark:border-slate-700/60">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const DEFAULT_STATS: StoreStat[] = [
  { label: 'Clientes Atendidos', value: '500', prefix: '+' },
  { label: 'Anos de Experiência', value: '5', prefix: '+' },
  { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
  { label: 'Atendimentos Realizados', value: '1000', prefix: '+' },
]

interface StatsEditorProps {
  storeId: string
  category: string
  initialStats: StoreStat[] | null
  isOpen: boolean
  onToggle: () => void
}

function StatsEditor({ storeId, initialStats, isOpen, onToggle }: StatsEditorProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)
  const [stats, setStats] = useState<StoreStat[]>(
    initialStats && initialStats.length > 0 ? initialStats : DEFAULT_STATS
  )

  function updateStat(index: number, field: keyof StoreStat, value: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)))
  }

  function resetToDefaults() {
    setStats(DEFAULT_STATS)
  }

  async function handleSave() {
    const result = await executeAsync({
      storeId,
      stats,
    })

    if (result?.data) {
      toast.success('Contadores atualizados!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <SectionCard
      title="Contadores"
      subtitle="Números em destaque no site"
      icon={<IconChartBar className="h-6 w-6 text-cyan-500" />}
      iconBg="bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 shadow-cyan-500/10"
      count={stats.length}
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Os contadores aparecem logo abaixo da capa do seu site. Personalize os números e textos.
        </p>

        <div className="space-y-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-600">
                    {index + 1}
                  </span>
                  Contador {index + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Prefixo</label>
                  <Input
                    value={stat.prefix || ''}
                    onChange={(e) => updateStat(index, 'prefix', e.target.value)}
                    placeholder="+"
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Valor</label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Sufixo</label>
                  <Input
                    value={stat.suffix || ''}
                    onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                    placeholder="%"
                    className="text-center"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Label</label>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="Clientes"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700"
          >
            <IconRefresh className="h-4 w-4" />
            Restaurar padrão
          </button>

          <EnhancedButton
            type="button"
            onClick={handleSave}
            loading={isExecuting}
            size="sm"
          >
            Salvar Contadores
          </EnhancedButton>
        </div>
      </div>
    </SectionCard>
  )
}

export function SectionsTab({ store, services: initialServices, storeSlug }: SectionsTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)
  const { executeAsync: deleteAsync } = useAction(deleteServiceAction)
  const { executeAsync: reorderAsync } = useAction(reorderServicesAction)

  const [openSections, setOpenSections] = useState<string[]>(['services'])
  const [services, setServices] = useState<Service[]>(initialServices)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null)

  function handleAddService() {
    setEditingService(null)
    setServiceModalOpen(true)
  }

  function handleEditService(svc: Service) {
    setEditingService(svc)
    setServiceModalOpen(true)
  }

  function handleServiceCreated(newService: { id: string; name: string; description: string | null; priceInCents: number | null; position: number }) {
    setServices((prev) => [...prev, newService])
  }

  function handleServiceUpdated(updated: { id: string; name: string; description: string | null; priceInCents: number | null }) {
    setServices((prev) =>
      prev.map((s) =>
        s.id === updated.id
          ? { ...s, name: updated.name, description: updated.description, priceInCents: updated.priceInCents }
          : s
      )
    )
  }

  async function handleDeleteService(serviceId: string) {
    setDeletingServiceId(serviceId)

    const result = await deleteAsync({
      id: serviceId,
      storeId: store.id,
    })

    if (result?.data) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId))
      toast.success('Serviço excluído!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    setDeletingServiceId(null)
  }

  async function moveServiceUp(index: number) {
    if (index === 0) return

    const previousServices = [...services]
    const newServices = [...services]
    const temp = newServices[index - 1]
    newServices[index - 1] = newServices[index]
    newServices[index] = temp
    setServices(newServices)

    const items = newServices.map((s, i) => ({
      id: s.id,
      position: i + 1,
    }))

    const result = await reorderAsync({ storeId: store.id, items })
    if (result?.serverError) {
      setServices(previousServices)
      toast.error('Erro ao reordenar serviços')
    }
  }

  async function moveServiceDown(index: number) {
    if (index === services.length - 1) return

    const previousServices = [...services]
    const newServices = [...services]
    const temp = newServices[index + 1]
    newServices[index + 1] = newServices[index]
    newServices[index] = temp
    setServices(newServices)

    const items = newServices.map((s, i) => ({
      id: s.id,
      position: i + 1,
    }))

    const result = await reorderAsync({ storeId: store.id, items })
    if (result?.serverError) {
      setServices(previousServices)
      toast.error('Erro ao reordenar serviços')
    }
  }

  function formatPrice(priceInCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100)
  }

  const form = useForm<SectionsFormData>({
    resolver: zodResolver(sectionsFormSchema),
    defaultValues: {
      faq: store.faq || [{ question: '', answer: '' }],
      neighborhoods: (store.neighborhoods || []).map((n) => ({ name: n })),
    },
  })

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: 'faq',
  })

  const {
    fields: neighborhoodFields,
    append: appendNeighborhood,
    remove: removeNeighborhood,
  } = useFieldArray({
    control: form.control,
    name: 'neighborhoods',
  })

  function toggleSection(section: string) {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  async function onSubmit(data: SectionsFormData) {
    const result = await executeAsync({
      storeId: store.id,
      faq: data.faq,
      neighborhoods: data.neighborhoods.map((n) => n.name),
    })

    if (result?.data) {
      toast.success('Seções atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Seções Dinâmicas
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalize os conteúdos que aparecem no seu site
        </p>
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Serviços"
          subtitle="Lista de serviços oferecidos"
          icon={<IconListDetails className="h-6 w-6 text-primary" />}
          iconBg="bg-gradient-to-br from-primary/20 to-primary/5 shadow-primary/10"
          count={services.length}
          isOpen={openSections.includes('services')}
          onToggle={() => toggleSection('services')}
        >
          <div className="space-y-3">
            {services.length > 0 ? (
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-start gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-1">
                      <IconGripVertical className="mt-0.5 hidden h-5 w-5 cursor-grab text-slate-300 transition-colors group-hover:text-slate-400 sm:block" />
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => moveServiceUp(index)}
                          disabled={index === 0}
                          className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                        >
                          <IconChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveServiceDown(index)}
                          disabled={index === services.length - 1}
                          className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:opacity-30"
                        >
                          <IconChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEditService(service)}
                      className="flex flex-1 cursor-pointer text-left"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {service.name}
                        </p>
                        {service.description && (
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {service.description}
                          </p>
                        )}
                        {service.priceInCents != null && service.priceInCents > 0 && (
                          <p className="mt-1 text-sm font-medium text-primary">
                            {formatPrice(service.priceInCents)}
                          </p>
                        )}
                      </div>
                      <span className="ml-2 mt-1 text-slate-400 transition-colors group-hover:text-primary">
                        <IconEdit className="h-4 w-4" />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(service.id)}
                      disabled={deletingServiceId === service.id}
                      className="rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-950"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <IconListDetails className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                  Nenhum serviço cadastrado
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Adicione serviços para exibir no seu site
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddService}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700"
            >
              <IconPlus className="h-4 w-4" />
              Adicionar serviço
            </button>
          </div>
        </SectionCard>

        <StatsEditor
          storeId={store.id}
          category={store.category}
          initialStats={store.stats}
          isOpen={openSections.includes('stats')}
          onToggle={() => toggleSection('stats')}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <SectionCard
                title="Perguntas Frequentes"
                subtitle="FAQ para SEO e clientes"
                icon={<IconHelpCircle className="h-6 w-6 text-amber-500" />}
                iconBg="bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-amber-500/10"
                count={faqFields.length}
                isOpen={openSections.includes('faq')}
                onToggle={() => toggleSection('faq')}
              >
                <div className="space-y-4">
                  <AnimatePresence>
                    {faqFields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
                              {index + 1}
                            </span>
                            Pergunta {index + 1}
                          </span>
                          {faqFields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name={`faq.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Ex: Qual o horário de funcionamento?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`faq.${index}.answer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  placeholder="Digite a resposta..."
                                  className="min-h-[80px] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => appendFaq({ question: '', answer: '' })}
                      className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-3 text-sm font-medium text-slate-500 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700"
                    >
                      <IconPlus className="h-4 w-4" />
                      Adicionar pergunta
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <IconSparkles className="h-4 w-4" />
                      Gerar com IA
                    </button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <EnhancedButton type="submit" loading={isExecuting} size="sm">
                      Salvar FAQ
                    </EnhancedButton>
                  </div>
                </div>
              </SectionCard>

              <SectionCard
                title="Áreas Atendidas"
                subtitle="Bairros e regiões que você atende"
                icon={<IconMapPin className="h-6 w-6 text-emerald-500" />}
                iconBg="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-emerald-500/10"
                count={neighborhoodFields.length}
                isOpen={openSections.includes('neighborhoods')}
                onToggle={() => toggleSection('neighborhoods')}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {neighborhoodFields.map((field, index) => (
                        <motion.div
                          key={field.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                        >
                          <FormField
                            control={form.control}
                            name={`neighborhoods.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <input
                                    {...field}
                                    className="w-24 bg-transparent text-[16px] font-medium text-slate-700 focus:outline-none dark:text-slate-200 md:text-sm"
                                    placeholder="Bairro"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => removeNeighborhood(index)}
                            className="rounded-full p-1 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-950"
                          >
                            <IconTrash className="h-3.5 w-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={() => appendNeighborhood({ name: '' })}
                      className="flex items-center gap-1.5 rounded-full border-2 border-dashed border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:hover:bg-emerald-950"
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                      Adicionar
                    </button>
                  </div>

                  <div className="flex justify-end pt-2">
                    <EnhancedButton type="submit" loading={isExecuting} size="sm">
                      Salvar Áreas
                    </EnhancedButton>
                  </div>
                </div>
              </SectionCard>
            </div>
          </form>
        </Form>

        <SectionCard
          title="Coleções de Produtos"
          subtitle="Organize produtos em coleções"
          icon={<IconFolders className="h-6 w-6 text-violet-500" />}
          iconBg="bg-gradient-to-br from-violet-500/20 to-violet-500/5 shadow-violet-500/10"
          count={0}
          isOpen={openSections.includes('collections')}
          onToggle={() => toggleSection('collections')}
        >
          <CollectionsManager storeId={store.id} />
        </SectionCard>

        <SectionCard
          title="Produtos"
          subtitle="Catálogo de produtos para venda"
          icon={<IconShoppingCart className="h-6 w-6 text-blue-500" />}
          iconBg="bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-blue-500/10"
          count={0}
          isOpen={openSections.includes('products')}
          onToggle={() => toggleSection('products')}
        >
          <ProductsManager 
            storeId={store.id}
            onNeedCollection={() => {
              setOpenSections((prev) =>
                prev.includes('collections') ? prev : [...prev, 'collections']
              )
              toast('Abra a seção "Coleções" acima para criar uma coleção primeiro', { icon: '👆' })
            }}
          />
        </SectionCard>

        <SectionCard
          title="Planos de Preços"
          subtitle="Tabela de preços e assinaturas"
          icon={<IconCreditCard className="h-6 w-6 text-indigo-500" />}
          iconBg="bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 shadow-indigo-500/10"
          count={0}
          isOpen={openSections.includes('pricing')}
          onToggle={() => toggleSection('pricing')}
        >
          <PricingPlansManager storeId={store.id} />
        </SectionCard>
      </div>

      <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Dica:</strong> Sites com FAQ e áreas atendidas têm melhor
          posicionamento no Google para buscas locais.
        </p>
      </div>

      <ServiceFormModal
        open={serviceModalOpen}
        onOpenChange={setServiceModalOpen}
        storeId={store.id}
        service={editingService}
        onCreated={handleServiceCreated}
        onUpdated={handleServiceUpdated}
      />
    </div>
  )
}
