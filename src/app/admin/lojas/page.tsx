'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  IconBuildingStore,
  IconExternalLink,
  IconEdit,
  IconTrash,
  IconArrowsExchange,
  IconToggleLeft,
  IconToggleRight,
  IconChartBar,
  IconMapPin,
  IconCategory,
  IconUser,
  IconSparkles,
} from '@tabler/icons-react'

import { getAdminStoresAction } from '@/actions/admin/get-admin-stores.action'
import { toggleStoreStatusAction } from '@/actions/admin/toggle-store-status.action'
import { deleteStoreAdminAction } from '@/actions/admin/delete-store-admin.action'
import { regenerateStoreContentAction } from '@/actions/admin/regenerate-store-content.action'
import { getStoreUrl } from '@/lib/utils'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
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
  DataTableActions,
  DataTableContent,
  DataTableTable,
  DataTableEmptyState,
  DataTableRowActions,
  DataTableSkeleton,
  ServerPagination,
  MobileCardList,
  MobileCard,
  MobileCardHeader,
  MobileCardAvatar,
  MobileCardTitle,
  MobileCardContent,
  MobileCardRow,
  MobileCardFooter,
  MobileCardEmptyState,
  type ColumnDef,
} from '@/components/ui/data-table-blocks'
import {
  FilterChipGroup,
  FilterChip,
} from '@/components/ui/filter-blocks'
import { TransferStoreModal } from '../_components/transfer-store-modal'

type StoreStatus = 'all' | 'active' | 'inactive'

interface AdminStore {
  id: string
  name: string
  slug: string
  category: string
  city: string
  state: string
  isActive: boolean
  coverUrl: string | null
  createdAt: Date
  userId: string
  ownerName: string
  ownerEmail: string
  ownerPhone: string | null
  ownerPlan: string | null
}

function getStoreInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function AdminStoresPage() {
  const searchParams = useSearchParams()
  const userIdFilter = searchParams.get('userId')

  const { executeAsync, result, isExecuting } = useAction(getAdminStoresAction)
  const { executeAsync: toggleAsync } = useAction(toggleStoreStatusAction)
  const { executeAsync: deleteAsync, isExecuting: isDeleting } = useAction(deleteStoreAdminAction)
  const { executeAsync: regenerateAsync } = useAction(regenerateStoreContentAction)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<StoreStatus>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [transferTarget, setTransferTarget] = useState<{
    id: string
    name: string
    ownerName: string
    ownerEmail: string
  } | null>(null)

  const loadStores = useCallback(() => {
    executeAsync({
      search: debouncedSearch || undefined,
      userId: userIdFilter || undefined,
      status,
      page,
      limit: pageSize,
    })
  }, [executeAsync, debouncedSearch, userIdFilter, status, page, pageSize])

  useEffect(() => {
    loadStores()
  }, [loadStores])

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

  async function handleToggle(storeId: string, currentActive: boolean) {
    const res = await toggleAsync({ storeId, isActive: !currentActive })
    if (res?.data) {
      toast.success(res.data.isActive ? 'Loja ativada!' : 'Loja desativada!')
      loadStores()
    } else if (res?.serverError) {
      toast.error(res.serverError)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const res = await deleteAsync({ storeId: deleteTarget.id })
    if (res?.data) {
      toast.success('Loja excluída!')
      setDeleteTarget(null)
      loadStores()
    } else if (res?.serverError) {
      toast.error(res.serverError)
    }
  }

  async function handleRegenerate(storeId: string, storeName: string) {
    setRegeneratingId(storeId)
    try {
      const res = await regenerateAsync({ storeId })
      if (res?.data) {
        toast.success(`Conteúdo de "${storeName}" regenerado! ${res.data.servicesCreated} serviços criados.`)
        loadStores()
      } else if (res?.serverError) {
        toast.error(res.serverError)
      }
    } finally {
      setRegeneratingId(null)
    }
  }

  const data = result?.data
  const stores = (data?.stores || []) as AdminStore[]
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  const columns: ColumnDef<AdminStore>[] = [
    {
      accessorKey: 'name',
      header: 'Loja',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{row.original.name}</p>
          <p className="text-xs text-slate-500">{row.original.slug}</p>
        </div>
      ),
    },
    {
      accessorKey: 'ownerName',
      header: 'Proprietário',
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{row.original.ownerName}</p>
          <p className="text-xs text-slate-500">{row.original.ownerEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Categoria',
      cell: ({ row }) => (
        <span className="text-slate-600 dark:text-slate-400">{row.original.category}</span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'Cidade',
      cell: ({ row }) => (
        <span className="text-slate-600 dark:text-slate-400">
          {row.original.city}/{row.original.state}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
            Ativa
          </Badge>
        ) : (
          <Badge variant="secondary">Inativa</Badge>
        ),
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const s = row.original
        return (
          <DataTableRowActions vertical={false}>
            <button
              type="button"
              onClick={() => handleToggle(s.id, s.isActive)}
              title={s.isActive ? 'Desativar' : 'Ativar'}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              {s.isActive ? (
                <IconToggleRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <IconToggleLeft className="h-4 w-4" />
              )}
            </button>
            <a
              href={getStoreUrl(s.slug)}
              target="_blank"
              rel="noopener noreferrer"
              title="Ver site"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
            >
              <IconExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() => handleRegenerate(s.id, s.name)}
              disabled={regeneratingId === s.id}
              title="Regenerar conteúdo com IA"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-amber-950"
            >
              <IconSparkles className={`h-4 w-4 ${regeneratingId === s.id ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href={`/painel/${s.slug}`}
              title="Acessar painel"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <IconChartBar className="h-4 w-4" />
            </Link>
            <Link
              href={`/painel/${s.slug}/editar`}
              title="Editar"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <IconEdit className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() =>
                setTransferTarget({
                  id: s.id,
                  name: s.name,
                  ownerName: s.ownerName,
                  ownerEmail: s.ownerEmail,
                })
              }
              title="Transferir"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950"
            >
              <IconArrowsExchange className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteTarget({ id: s.id, name: s.name })}
              title="Excluir"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </DataTableRowActions>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          Lojas
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {total} lojas cadastradas
          {userIdFilter && (
            <>
              {' '}<span className="text-primary">(filtrado por usuário)</span>
              {' '}
              <Link href="/admin/lojas" className="text-xs text-primary hover:underline">
                Limpar filtro
              </Link>
            </>
          )}
        </p>
      </motion.div>

      {isExecuting && stores.length === 0 ? (
        <DataTableSkeleton columns={6} rows={8} />
      ) : (
        <DataTableRoot>
          <DataTableToolbar>
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome ou slug..."
            />
            <DataTableActions>
              <FilterChipGroup>
                {([
                  { value: 'all', label: 'Todas' },
                  { value: 'active', label: 'Ativas' },
                  { value: 'inactive', label: 'Inativas' },
                ] as const).map((s) => (
                  <FilterChip
                    key={s.value}
                    label={s.label}
                    isActive={status === s.value}
                    onClick={() => {
                      setStatus(s.value)
                      setPage(1)
                    }}
                  />
                ))}
              </FilterChipGroup>
            </DataTableActions>
          </DataTableToolbar>

          <div className="hidden lg:block">
            <DataTableContent stickyLastColumn>
              <DataTableTable
                columns={columns}
                data={stores}
                stickyLastColumn
                emptyState={
                  <DataTableEmptyState
                    icon={<IconBuildingStore className="h-8 w-8" />}
                    title="Nenhuma loja encontrada"
                    description={search ? 'Tente ajustar sua busca' : 'Ainda não há lojas cadastradas'}
                  />
                }
              />
            </DataTableContent>
          </div>

          {stores.length === 0 ? (
            <MobileCardEmptyState
              icon={<IconBuildingStore className="h-8 w-8" />}
              title="Nenhuma loja encontrada"
              description={search ? 'Tente ajustar sua busca' : 'Ainda não há lojas cadastradas'}
            />
          ) : (
            <MobileCardList>
              {stores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <MobileCard>
                    <MobileCardHeader
                      actions={
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleToggle(store.id, store.isActive)}
                            aria-label={store.isActive ? 'Desativar' : 'Ativar'}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            {store.isActive ? (
                              <IconToggleRight className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <IconToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                          <a
                            href={getStoreUrl(store.slug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Ver site"
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <IconExternalLink className="h-4 w-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRegenerate(store.id, store.name)}
                            disabled={regeneratingId === store.id}
                            aria-label="Regenerar IA"
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50 dark:hover:bg-amber-950"
                          >
                            <IconSparkles className={`h-4 w-4 ${regeneratingId === store.id ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
                      }
                    >
                      <MobileCardAvatar
                        initials={getStoreInitials(store.name)}
                        color="bg-primary"
                        statusColor={store.isActive ? 'bg-emerald-500' : 'bg-slate-400'}
                      />
                      <MobileCardTitle
                        title={store.name}
                        subtitle={store.slug}
                        badge={
                          store.isActive ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] px-1.5 py-0">
                              Ativa
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Inativa</Badge>
                          )
                        }
                      />
                    </MobileCardHeader>

                    <MobileCardContent>
                      <MobileCardRow
                        icon={<IconUser className="h-3.5 w-3.5" />}
                        label="Proprietário"
                        value={store.ownerName}
                      />
                      <MobileCardRow
                        icon={<IconCategory className="h-3.5 w-3.5" />}
                        label="Categoria"
                        value={store.category}
                      />
                      <MobileCardRow
                        icon={<IconMapPin className="h-3.5 w-3.5" />}
                        label="Cidade"
                        value={`${store.city}/${store.state}`}
                      />
                    </MobileCardContent>

                    <MobileCardFooter>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRegenerate(store.id, store.name)}
                          disabled={regeneratingId === store.id}
                          aria-label="Regenerar IA"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-500 disabled:opacity-50 dark:hover:bg-amber-950"
                        >
                          <IconSparkles className={`h-4 w-4 ${regeneratingId === store.id ? 'animate-spin' : ''}`} />
                        </button>
                        <Link
                          href={`/painel/${store.slug}`}
                          aria-label="Acessar painel"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                        >
                          <IconChartBar className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/painel/${store.slug}/editar`}
                          aria-label="Editar"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                        >
                          <IconEdit className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() =>
                            setTransferTarget({
                              id: store.id,
                              name: store.name,
                              ownerName: store.ownerName,
                              ownerEmail: store.ownerEmail,
                            })
                          }
                          aria-label="Transferir"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950"
                        >
                          <IconArrowsExchange className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ id: store.id, name: store.name })}
                          aria-label="Excluir"
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </MobileCardFooter>
                  </MobileCard>
                </motion.div>
              ))}
            </MobileCardList>
          )}

          {totalPages > 0 && (
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

      <Modal open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <ModalContent size="sm">
          <ModalHeader icon={<IconTrash className="h-5 w-5 text-red-500" />}>
            <ModalTitle>Excluir Loja</ModalTitle>
            <ModalDescription>
              Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>? Esta ação não pode ser desfeita.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <EnhancedButton variant="outline">Cancelar</EnhancedButton>
            </ModalClose>
            <ModalFooterActions>
              <EnhancedButton
                variant="destructive"
                onClick={handleDelete}
                loading={isDeleting}
              >
                Excluir
              </EnhancedButton>
            </ModalFooterActions>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {transferTarget && (
        <TransferStoreModal
          open={!!transferTarget}
          onOpenChange={() => setTransferTarget(null)}
          store={transferTarget}
          onSuccess={loadStores}
        />
      )}
    </div>
  )
}
