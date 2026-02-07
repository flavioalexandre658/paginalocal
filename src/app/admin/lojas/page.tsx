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
} from '@tabler/icons-react'

import { getAdminStoresAction } from '@/actions/admin/get-admin-stores.action'
import { toggleStoreStatusAction } from '@/actions/admin/toggle-store-status.action'
import { deleteStoreAdminAction } from '@/actions/admin/delete-store-admin.action'
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

export default function AdminStoresPage() {
  const searchParams = useSearchParams()
  const userIdFilter = searchParams.get('userId')

  const { executeAsync, result, isExecuting } = useAction(getAdminStoresAction)
  const { executeAsync: toggleAsync } = useAction(toggleStoreStatusAction)
  const { executeAsync: deleteAsync, isExecuting: isDeleting } = useAction(deleteStoreAdminAction)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState<StoreStatus>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
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
