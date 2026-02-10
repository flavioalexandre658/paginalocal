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
  IconRefresh,
  IconDotsVertical,
  IconWorldWww,
} from '@tabler/icons-react'

import { getAdminStoresAction } from '@/actions/admin/get-admin-stores.action'
import { toggleStoreStatusAction } from '@/actions/admin/toggle-store-status.action'
import { deleteStoreAdminAction } from '@/actions/admin/delete-store-admin.action'
import { purgeStoreCacheAction } from '@/actions/admin/purge-store-cache.action'
import { reindexStoreAction } from '@/actions/admin/reindex-store.action'
import { getStoreUrl } from '@/lib/utils'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  FilterChipGroup,
  FilterChip,
} from '@/components/ui/filter-blocks'
import { TransferStoreModal } from '../_components/transfer-store-modal'
import { RegenerateStoreModal } from '../_components/regenerate-store-modal'

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

function StoreActionsDropdown({
  store: s,
  onToggle,
  onRegenerate,
  onPurgeCache,
  onReindex,
  onTransfer,
  onDelete,
}: {
  store: AdminStore
  onToggle: () => void
  onRegenerate: () => void
  onPurgeCache: () => void
  onReindex: () => void
  onTransfer: () => void
  onDelete: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <IconDotsVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Ações rápidas</DropdownMenuLabel>
        <DropdownMenuItem onClick={onToggle}>
          {s.isActive ? (
            <IconToggleRight className="h-4 w-4 text-emerald-500" />
          ) : (
            <IconToggleLeft className="h-4 w-4" />
          )}
          {s.isActive ? 'Desativar' : 'Ativar'}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getStoreUrl(s.slug)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconExternalLink className="h-4 w-4" />
            Ver site
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/painel/${s.slug}`}>
            <IconChartBar className="h-4 w-4" />
            Acessar painel
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/painel/${s.slug}/editar`}>
            <IconEdit className="h-4 w-4" />
            Editar
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Ferramentas</DropdownMenuLabel>
        <DropdownMenuItem onClick={onRegenerate}>
          <IconSparkles className="h-4 w-4 text-amber-500" />
          Regenerar IA
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onPurgeCache}>
          <IconRefresh className="h-4 w-4 text-green-500" />
          Limpar cache
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReindex}>
          <IconWorldWww className="h-4 w-4 text-blue-500" />
          Indexar no Google
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Administração</DropdownMenuLabel>
        <DropdownMenuItem onClick={onTransfer}>
          <IconArrowsExchange className="h-4 w-4 text-blue-500" />
          Transferir
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <IconTrash className="h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AdminStoresPage() {
  const searchParams = useSearchParams()
  const userIdFilter = searchParams.get('userId')

  const { executeAsync, result, isExecuting } = useAction(getAdminStoresAction)
  const { executeAsync: toggleAsync } = useAction(toggleStoreStatusAction)
  const { executeAsync: deleteAsync, isExecuting: isDeleting } = useAction(deleteStoreAdminAction)
  const { executeAsync: purgeAsync } = useAction(purgeStoreCacheAction)
  const { executeAsync: reindexAsync } = useAction(reindexStoreAction)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<StoreStatus>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [regenerateTarget, setRegenerateTarget] = useState<{ id: string; name: string } | null>(null)
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

  function handleRegenerate(storeId: string, storeName: string) {
    setRegenerateTarget({ id: storeId, name: storeName })
  }

  async function handlePurgeCache(storeId: string, storeName: string) {
    const res = await purgeAsync({ storeId })
    if (res?.data) {
      toast.success(`Cache da loja "${storeName}" limpo!`)
    } else if (res?.serverError) {
      toast.error(res.serverError)
    }
  }

  async function handleReindex(storeId: string, storeName: string) {
    const loadingToast = toast.loading(`Indexando "${storeName}"...`)
    const res = await reindexAsync({ storeId })
    toast.dismiss(loadingToast)

    if (res?.data) {
      const { totalUrls, successCount, failedCount } = res.data
      if (failedCount === 0) {
        toast.success(`${successCount}/${totalUrls} URLs indexadas com sucesso!`)
      } else {
        toast.error(`${successCount}/${totalUrls} URLs indexadas. ${failedCount} falharam.`)
      }
    } else if (res?.serverError) {
      toast.error(res.serverError)
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
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary">
            {getStoreInitials(row.original.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-white">{row.original.name}</p>
            <p className="truncate text-xs text-slate-500">{row.original.slug}</p>
          </div>
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
        <Badge variant="outline" className="font-normal">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'city',
      header: 'Cidade',
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
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
      header: '',
      cell: ({ row }) => {
        const s = row.original
        return (
          <div className="flex items-center justify-end">
            <StoreActionsDropdown
              store={s}
              onToggle={() => handleToggle(s.id, s.isActive)}
              onRegenerate={() => handleRegenerate(s.id, s.name)}
              onPurgeCache={() => handlePurgeCache(s.id, s.name)}
              onReindex={() => handleReindex(s.id, s.name)}
              onTransfer={() =>
                setTransferTarget({
                  id: s.id,
                  name: s.name,
                  ownerName: s.ownerName,
                  ownerEmail: s.ownerEmail,
                })
              }
              onDelete={() => setDeleteTarget({ id: s.id, name: s.name })}
            />
          </div>
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
                manualPagination
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
              {stores.map((storeItem, index) => (
                <motion.div
                  key={storeItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <MobileCard>
                    <MobileCardHeader
                      actions={
                        <StoreActionsDropdown
                          store={storeItem}
                          onToggle={() => handleToggle(storeItem.id, storeItem.isActive)}
                          onRegenerate={() => handleRegenerate(storeItem.id, storeItem.name)}
                          onPurgeCache={() => handlePurgeCache(storeItem.id, storeItem.name)}
                          onReindex={() => handleReindex(storeItem.id, storeItem.name)}
                          onTransfer={() =>
                            setTransferTarget({
                              id: storeItem.id,
                              name: storeItem.name,
                              ownerName: storeItem.ownerName,
                              ownerEmail: storeItem.ownerEmail,
                            })
                          }
                          onDelete={() => setDeleteTarget({ id: storeItem.id, name: storeItem.name })}
                        />
                      }
                    >
                      <MobileCardAvatar
                        initials={getStoreInitials(storeItem.name)}
                        color="bg-primary"
                        statusColor={storeItem.isActive ? 'bg-emerald-500' : 'bg-slate-400'}
                      />
                      <MobileCardTitle
                        title={storeItem.name}
                        subtitle={storeItem.slug}
                        badge={
                          storeItem.isActive ? (
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
                        value={storeItem.ownerName}
                      />
                      <MobileCardRow
                        icon={<IconCategory className="h-3.5 w-3.5" />}
                        label="Categoria"
                        value={storeItem.category}
                      />
                      <MobileCardRow
                        icon={<IconMapPin className="h-3.5 w-3.5" />}
                        label="Cidade"
                        value={`${storeItem.city}/${storeItem.state}`}
                      />
                    </MobileCardContent>
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

      {regenerateTarget && (
        <RegenerateStoreModal
          open={!!regenerateTarget}
          onOpenChange={() => setRegenerateTarget(null)}
          store={regenerateTarget}
          onSuccess={loadStores}
        />
      )}
    </div>
  )
}
