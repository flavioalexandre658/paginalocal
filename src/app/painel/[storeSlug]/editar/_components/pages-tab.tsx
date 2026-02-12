'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconFileText,
  IconListDetails,
  IconSparkles,
  IconChevronDown,
} from '@tabler/icons-react'

import { generateStorePagesAction } from '@/actions/store-pages/generate-store-pages.action'
import { updateStorePageAction } from '@/actions/store-pages/update-store-page.action'
import { updateServiceAction } from '@/actions/services/update-service.action'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StorePageForEdit {
  id: string
  type: string
  slug: string
  title: string
  content: string | null
  seoTitle: string | null
  seoDescription: string | null
  isActive: boolean
}

interface ServiceForEdit {
  id: string
  name: string
  slug: string | null
  description: string | null
  seoTitle: string | null
  seoDescription: string | null
  longDescription: string | null
}

interface PagesTabProps {
  store: {
    id: string
  }
  pages: StorePageForEdit[]
  services: ServiceForEdit[]
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

const pageFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255),
  content: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
})

type PageFormData = z.infer<typeof pageFormSchema>

const serviceFormSchema = z.object({
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  longDescription: z.string().optional(),
})

type ServiceFormData = z.infer<typeof serviceFormSchema>

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

function PageCard({
  page,
  storeId,
  isOpen,
  onToggle,
  onUpdate,
}: {
  page: StorePageForEdit
  storeId: string
  isOpen: boolean
  onToggle: () => void
  onUpdate: (updated: StorePageForEdit) => void
}) {
  const { executeAsync, isExecuting } = useAction(updateStorePageAction)

  const form = useForm<PageFormData>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: page.title,
      content: page.content || '',
      seoTitle: page.seoTitle || '',
      seoDescription: page.seoDescription || '',
    },
  })

  async function onSubmit(data: PageFormData) {
    const result = await executeAsync({
      id: page.id,
      storeId,
      title: data.title,
      content: data.content || undefined,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
    })

    if (result?.data) {
      onUpdate({
        ...page,
        title: data.title,
        content: data.content || null,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
      })
      toast.success('Página atualizada!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  async function handleToggleActive(checked: boolean) {
    const result = await executeAsync({
      id: page.id,
      storeId,
      isActive: checked,
    })

    if (result?.data) {
      onUpdate({ ...page, isActive: checked })
      toast.success(checked ? 'Página ativada!' : 'Página desativada!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  const pageLabel = page.type === 'ABOUT' ? 'Sobre Nós' : 'Contato'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/40 dark:bg-slate-800/30"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <IconFileText className="h-5 w-5 text-primary" />
          <span className="font-medium text-slate-900 dark:text-white">
            {pageLabel}
          </span>
          <Badge
            variant={page.isActive ? 'default' : 'secondary'}
            className="text-xs"
          >
            {page.isActive ? 'Ativa' : 'Inativa'}
          </Badge>
        </div>
        <IconChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform',
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
            <div className="border-t border-slate-200/60 p-4 dark:border-slate-700/40">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Página ativa
                  </p>
                  <p className="text-xs text-slate-500">
                    Exibir esta página no site
                  </p>
                </div>
                <Switch
                  checked={page.isActive}
                  onCheckedChange={handleToggleActive}
                  disabled={isExecuting}
                />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título da página" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conteúdo</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none"
                            placeholder="Conteúdo da página"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título SEO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título para mecanismos de busca"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Máximo 70 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição SEO</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] resize-none"
                            placeholder="Descrição para mecanismos de busca"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 160 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-2">
                    <EnhancedButton
                      type="submit"
                      loading={isExecuting}
                      size="sm"
                    >
                      Salvar Página
                    </EnhancedButton>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ServiceSeoCard({
  service,
  storeId,
  isOpen,
  onToggle,
}: {
  service: ServiceForEdit
  storeId: string
  isOpen: boolean
  onToggle: () => void
}) {
  const { executeAsync, isExecuting } = useAction(updateServiceAction)

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      longDescription: service.longDescription || '',
    },
  })

  async function onSubmit(data: ServiceFormData) {
    const result = await executeAsync({
      id: service.id,
      storeId,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      longDescription: data.longDescription || undefined,
    })

    if (result?.data) {
      toast.success('SEO do serviço atualizado!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200/60 bg-slate-50/50 dark:border-slate-700/40 dark:bg-slate-800/30"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-900 dark:text-white">
            {service.name}
          </span>
          <Badge variant="outline" className="text-xs">
            SEO
          </Badge>
        </div>
        <IconChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 transition-transform',
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
            <div className="border-t border-slate-200/60 p-4 dark:border-slate-700/40">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título SEO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Título para mecanismos de busca"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Máximo 70 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição SEO</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[80px] resize-none"
                            placeholder="Descrição para mecanismos de busca"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo 160 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Longa</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] resize-none"
                            placeholder="Descrição detalhada do serviço para SEO"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end pt-2">
                    <EnhancedButton
                      type="submit"
                      loading={isExecuting}
                      size="sm"
                    >
                      Salvar SEO
                    </EnhancedButton>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function PagesTab({
  store,
  pages: initialPages,
  services,
  storeSlug,
}: PagesTabProps) {
  const [pages, setPages] = useState<StorePageForEdit[]>(initialPages)
  const [openSections, setOpenSections] = useState<string[]>(['pages'])

  const { executeAsync: generateAsync, isExecuting: isGenerating } =
    useAction(generateStorePagesAction)

  function toggleSection(section: string) {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  async function handleGenerate() {
    const result = await generateAsync({ storeId: store.id })

    if (result?.data) {
      setPages(
        result.data.map((p) => ({
          id: p.id,
          type: p.type,
          slug: p.slug,
          title: p.title,
          content: p.content,
          seoTitle: p.seoTitle,
          seoDescription: p.seoDescription,
          isActive: p.isActive,
        }))
      )
      toast.success('Páginas institucionais geradas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  function handlePageUpdate(updated: StorePageForEdit) {
    setPages((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Páginas e SEO
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie as páginas institucionais e o SEO dos serviços
        </p>
      </div>

      <div className="space-y-4">
        <SectionCard
          title="Páginas Institucionais"
          subtitle="Sobre Nós, Contato e outras páginas"
          icon={<IconFileText className="h-6 w-6 text-primary" />}
          iconBg="bg-gradient-to-br from-primary/20 to-primary/5 shadow-primary/10"
          count={pages.length}
          isOpen={openSections.includes('pages')}
          onToggle={() => toggleSection('pages')}
        >
          {pages.length > 0 ? (
            <div className="space-y-3">
              {pages.map((page) => (
                <PageCard
                  key={page.id}
                  page={page}
                  storeId={store.id}
                  isOpen={openSections.includes(`page-${page.id}`)}
                  onToggle={() => toggleSection(`page-${page.id}`)}
                  onUpdate={handlePageUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <IconFileText className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                Nenhuma página institucional
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Gere automaticamente as páginas Sobre Nós e Contato
              </p>
              <EnhancedButton
                type="button"
                onClick={handleGenerate}
                loading={isGenerating}
                className="mt-4"
                size="sm"
              >
                <IconSparkles className="mr-2 h-4 w-4" />
                Gerar Páginas Institucionais
              </EnhancedButton>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="SEO dos Serviços"
          subtitle="Otimize o conteúdo de cada serviço"
          icon={<IconListDetails className="h-6 w-6 text-emerald-500" />}
          iconBg="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-emerald-500/10"
          count={services.length}
          isOpen={openSections.includes('services')}
          onToggle={() => toggleSection('services')}
        >
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.map((service) => (
                <ServiceSeoCard
                  key={service.id}
                  service={service}
                  storeId={store.id}
                  isOpen={openSections.includes(`service-${service.id}`)}
                  onToggle={() => toggleSection(`service-${service.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <IconListDetails className="h-6 w-6 text-slate-400" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                Nenhum serviço cadastrado
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Adicione serviços na aba Seções para gerenciar o SEO
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
