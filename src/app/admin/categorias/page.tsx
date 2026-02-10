'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconCategory,
  IconPlus,
  IconWorldWww,
  IconFileText,
  IconHash,
  IconQuestionMark,
  IconTags,
  IconEdit,
  IconCheck,
  IconX,
} from '@tabler/icons-react'

import { getAdminCategoriesAction } from '@/actions/admin/get-admin-categories.action'
import { createAdminCategoryAction } from '@/actions/admin/create-admin-category.action'
import { updateAdminCategoryAction } from '@/actions/admin/update-admin-category.action'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalFooterActions,
  ModalClose,
} from '@/components/ui/modal-blocks'
import {
  DataTableRoot,
  DataTableToolbar,
  DataTableSearch,
  DataTableContent,
  DataTableTable,
  DataTableEmptyState,
  DataTableSkeleton,
  ServerPagination,
  MobileCardList,
  MobileCard,
  MobileCardHeader,
  MobileCardAvatar,
  MobileCardTitle,
  MobileCardContent,
  MobileCardRow,
  MobileCardEmptyState,
  type ColumnDef,
} from '@/components/ui/data-table-blocks'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface AdminCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  suggestedServices: string[] | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string[] | null
  heroTitle: string | null
  heroSubtitle: string | null
  longDescription: string | null
  faqs: { question: string; answer: string }[] | null
  typeGooglePlace: string[] | null
  createdAt: Date
}

function getCategoryInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function CategoryDetailModal({
  category: cat,
  open,
  onOpenChange,
  onUpdated,
}: {
  category: AdminCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}) {
  const { executeAsync: updateAsync, isExecuting: isUpdating } = useAction(updateAdminCategoryAction)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

  function startEditing() {
    if (!cat) return
    setEditName(cat.name)
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setEditName('')
  }

  async function handleSave() {
    if (!cat || !editName.trim()) return

    if (editName.trim() === cat.name) {
      cancelEditing()
      return
    }

    const res = await updateAsync({ id: cat.id, name: editName.trim() })

    if (res?.data) {
      toast.success(`Categoria renomeada para "${res.data.name}" e SEO regenerado!`)
      setIsEditing(false)
      onOpenChange(false)
      onUpdated()
    } else if (res?.serverError) {
      toast.error(res.serverError)
    }
  }

  if (!cat) return null

  return (
    <Modal open={open} onOpenChange={(v) => { if (!v) cancelEditing(); onOpenChange(v) }}>
      <ModalContent size="lg">
        <ModalHeader icon={<IconCategory className="h-5 w-5 text-primary" />}>
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isUpdating) handleSave()
                  if (e.key === 'Escape') cancelEditing()
                }}
                className="h-9 text-base font-semibold"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="rounded-lg p-2 text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
                aria-label="Salvar"
              >
                <IconCheck className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isUpdating}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Cancelar"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ModalTitle>{cat.name}</ModalTitle>
              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                aria-label="Editar nome"
              >
                <IconEdit className="h-4 w-4" />
              </button>
            </div>
          )}
          {!isEditing && <ModalDescription>Slug: {cat.slug}</ModalDescription>}
        </ModalHeader>

        {isUpdating && (
          <div className="mx-6 mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Regenerando nome, slug, SEO, FAQs e serviços sugeridos...
          </div>
        )}

        <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 pb-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">SEO Title</Label>
              <p className="text-sm text-slate-700 dark:text-slate-300">{cat.seoTitle || '—'}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Hero Title</Label>
              <p className="text-sm text-slate-700 dark:text-slate-300">{cat.heroTitle || '—'}</p>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-500">SEO Description</Label>
            <p className="text-sm text-slate-700 dark:text-slate-300">{cat.seoDescription || '—'}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Hero Subtitle</Label>
            <p className="text-sm text-slate-700 dark:text-slate-300">{cat.heroSubtitle || '—'}</p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-500">Descrição Longa</Label>
            <p className="text-sm text-slate-700 dark:text-slate-300">{cat.longDescription || '—'}</p>
          </div>

          {cat.seoKeywords && cat.seoKeywords.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Keywords</Label>
              <div className="flex flex-wrap gap-1.5">
                {cat.seoKeywords.map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {cat.typeGooglePlace && cat.typeGooglePlace.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Google Place Types</Label>
              <div className="flex flex-wrap gap-1.5">
                {cat.typeGooglePlace.map((tp, i) => (
                  <Badge key={i} variant="outline" className="text-xs font-mono">
                    {tp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {cat.suggestedServices && cat.suggestedServices.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Serviços Sugeridos</Label>
              <div className="flex flex-wrap gap-1.5">
                {cat.suggestedServices.map((s, i) => (
                  <Badge key={i} className="bg-primary/10 text-primary text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {cat.faqs && cat.faqs.length > 0 && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">FAQs ({cat.faqs.length})</Label>
              <Accordion type="single" collapsible className="w-full">
                {cat.faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        <ModalFooter>
          <ModalClose asChild>
            <EnhancedButton variant="outline">Fechar</EnhancedButton>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function CreateCategoryModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}) {
  const { executeAsync, isExecuting } = useAction(createAdminCategoryAction)
  const [name, setName] = useState('')

  async function handleCreate() {
    if (!name.trim()) {
      toast.error('Informe o nome da categoria')
      return
    }

    const res = await executeAsync({ name: name.trim() })

    if (res?.data) {
      toast.success(`Categoria "${res.data.name}" criada com sucesso!`)
      setName('')
      onOpenChange(false)
      onSuccess()
    } else if (res?.serverError) {
      toast.error(res.serverError)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="sm">
        <ModalHeader icon={<IconPlus className="h-5 w-5 text-primary" />}>
          <ModalTitle>Nova Categoria</ModalTitle>
          <ModalDescription>
            Informe o nome da categoria. O SEO, FAQ, keywords e serviços sugeridos serão gerados automaticamente.
          </ModalDescription>
        </ModalHeader>

        <div className="px-6 pb-2">
          <div className="space-y-2">
            <Label htmlFor="category-name">Nome da Categoria</Label>
            <Input
              id="category-name"
              placeholder="Ex: Açaí, Hamburgueria, Floricultura..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isExecuting) {
                  handleCreate()
                }
              }}
              autoFocus
            />
            <p className="text-xs text-slate-500">
              O slug, SEO title, description, keywords, FAQs e serviços sugeridos serão gerados com base neste nome.
            </p>
          </div>
        </div>

        <ModalFooter>
          <ModalClose asChild>
            <EnhancedButton variant="outline">Cancelar</EnhancedButton>
          </ModalClose>
          <ModalFooterActions>
            <EnhancedButton
              onClick={handleCreate}
              loading={isExecuting}
            >
              Criar Categoria
            </EnhancedButton>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default function AdminCategoriesPage() {
  const { executeAsync, result, isExecuting } = useAction(getAdminCategoriesAction)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [detailTarget, setDetailTarget] = useState<AdminCategory | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const loadCategories = useCallback(() => {
    executeAsync({
      search: debouncedSearch || undefined,
      page,
      limit: pageSize,
    })
  }, [executeAsync, debouncedSearch, page, pageSize])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (result?.serverError) {
      toast.error(result.serverError)
    }
  }, [result?.serverError])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(timeout)
  }, [search])

  const data = result?.data
  const categories = (data?.categories || []) as AdminCategory[]
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  const columns: ColumnDef<AdminCategory>[] = [
    {
      accessorKey: 'name',
      header: 'Categoria',
      cell: ({ row }) => (
        <button
          type="button"
          className="flex items-center gap-3 text-left transition-colors hover:text-primary"
          onClick={() => setDetailTarget(row.original)}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary">
            {getCategoryInitials(row.original.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-white">{row.original.name}</p>
            <p className="truncate text-xs text-slate-500">{row.original.slug}</p>
          </div>
        </button>
      ),
    },
    {
      accessorKey: 'seoTitle',
      header: 'SEO Title',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {row.original.seoTitle || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'typeGooglePlace',
      header: 'Google Types',
      cell: ({ row }) => {
        const types = row.original.typeGooglePlace || []
        if (types.length === 0) return <span className="text-xs text-slate-400">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {types.slice(0, 3).map((t, i) => (
              <Badge key={i} variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                {t}
              </Badge>
            ))}
            {types.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{types.length - 3}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: 'faqs',
      header: 'Dados',
      cell: ({ row }) => {
        const c = row.original
        const faqCount = c.faqs?.length || 0
        const kwCount = c.seoKeywords?.length || 0
        const svcCount = c.suggestedServices?.length || 0
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500" title="FAQs">
              <IconQuestionMark className="inline h-3.5 w-3.5 mr-0.5" />{faqCount}
            </span>
            <span className="text-xs text-slate-500" title="Keywords">
              <IconHash className="inline h-3.5 w-3.5 mr-0.5" />{kwCount}
            </span>
            <span className="text-xs text-slate-500" title="Serviços">
              <IconTags className="inline h-3.5 w-3.5 mr-0.5" />{svcCount}
            </span>
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={() => setDetailTarget(row.original)}
            className="text-xs"
          >
            Ver detalhes
          </EnhancedButton>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
            Categorias
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {total} categorias cadastradas
          </p>
        </div>
        <EnhancedButton onClick={() => setCreateOpen(true)}>
          <IconPlus className="h-4 w-4" />
          Nova Categoria
        </EnhancedButton>
      </motion.div>

      {isExecuting && categories.length === 0 ? (
        <DataTableSkeleton columns={5} rows={8} />
      ) : (
        <DataTableRoot>
          <DataTableToolbar>
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome..."
            />
          </DataTableToolbar>

          <div className="hidden lg:block">
            <DataTableContent>
              <DataTableTable
                columns={columns}
                data={categories}
                manualPagination
                emptyState={
                  <DataTableEmptyState
                    icon={<IconCategory className="h-8 w-8" />}
                    title="Nenhuma categoria encontrada"
                    description={search ? 'Tente ajustar sua busca' : 'Ainda não há categorias cadastradas'}
                    action={
                      <EnhancedButton size="sm" onClick={() => setCreateOpen(true)}>
                        <IconPlus className="h-4 w-4" />
                        Criar Categoria
                      </EnhancedButton>
                    }
                  />
                }
              />
            </DataTableContent>
          </div>

          {categories.length === 0 ? (
            <MobileCardEmptyState
              icon={<IconCategory className="h-8 w-8" />}
              title="Nenhuma categoria encontrada"
              description={search ? 'Tente ajustar sua busca' : 'Ainda não há categorias cadastradas'}
            />
          ) : (
            <MobileCardList>
              {categories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                >
                  <MobileCard onClick={() => setDetailTarget(cat)}>
                    <MobileCardHeader>
                      <MobileCardAvatar
                        initials={getCategoryInitials(cat.name)}
                        color="bg-primary"
                      />
                      <MobileCardTitle
                        title={cat.name}
                        subtitle={cat.slug}
                      />
                    </MobileCardHeader>

                    <MobileCardContent>
                      <MobileCardRow
                        icon={<IconFileText className="h-3.5 w-3.5" />}
                        label="SEO Title"
                        value={cat.seoTitle || '—'}
                      />
                      <MobileCardRow
                        icon={<IconWorldWww className="h-3.5 w-3.5" />}
                        label="Google Types"
                        value={cat.typeGooglePlace?.length ? cat.typeGooglePlace.slice(0, 3).join(', ') : '—'}
                      />
                      <MobileCardRow
                        icon={<IconQuestionMark className="h-3.5 w-3.5" />}
                        label="FAQs"
                        value={`${cat.faqs?.length || 0} perguntas`}
                      />
                    </MobileCardContent>
                  </MobileCard>
                </motion.div>
              ))}
            </MobileCardList>
          )}

          {totalPages > 1 && (
            <ServerPagination
              page={page}
              pageSize={pageSize}
              totalCount={total}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          )}
        </DataTableRoot>
      )}

      <CategoryDetailModal
        category={detailTarget}
        open={!!detailTarget}
        onOpenChange={() => setDetailTarget(null)}
        onUpdated={loadCategories}
      />

      <CreateCategoryModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={loadCategories}
      />
    </div>
  )
}
