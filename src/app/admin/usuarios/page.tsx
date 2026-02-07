'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  IconUsers,
  IconLoader2,
  IconBrandWhatsapp,
  IconBuildingStore,
} from '@tabler/icons-react'

import { getAdminUsersAction } from '@/actions/admin/get-admin-users.action'
import { Badge } from '@/components/ui/badge'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
  DataTableRoot,
  DataTableToolbar,
  DataTableSearch,
  DataTableContent,
  DataTableTable,
  DataTableEmptyState,
  DataTableRowActions,
  DataTableSkeleton,
  ServerPagination,
  type ColumnDef,
} from '@/components/ui/data-table-blocks'
import {
  FilterBar,
  FilterBarRow,
  FilterSearch,
  FilterActions,
  FilterChipGroup,
  FilterChip,
} from '@/components/ui/filter-blocks'

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: string | null
  image: string | null
  banned: boolean | null
  createdAt: Date
  storeCount: number
  planName: string | null
  subscriptionStatus: string | null
}

function getStatusBadge(status: string | null) {
  switch (status) {
    case 'ACTIVE':
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Ativa</Badge>
    case 'TRIALING':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">Trial</Badge>
    case 'PAST_DUE':
      return <Badge variant="destructive">Inadimplente</Badge>
    default:
      return <Badge variant="secondary">Gratuito</Badge>
  }
}

const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: 'name',
    header: 'Usuário',
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{row.original.name}</p>
        <p className="text-xs text-slate-500">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    cell: ({ row }) => (
      <span className="text-slate-600 dark:text-slate-400">
        {row.original.phone || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) =>
      row.original.role === 'admin' ? (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">Admin</Badge>
      ) : (
        <Badge variant="secondary">Usuário</Badge>
      ),
  },
  {
    accessorKey: 'storeCount',
    header: 'Lojas',
    cell: ({ row }) => (
      <span className="font-medium text-slate-900 dark:text-white">
        {Number(row.original.storeCount)}
      </span>
    ),
  },
  {
    accessorKey: 'planName',
    header: 'Plano',
    cell: ({ row }) => (
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {row.original.planName || 'Gratuito'}
      </span>
    ),
  },
  {
    accessorKey: 'subscriptionStatus',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.original.subscriptionStatus),
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <DataTableRowActions vertical={false}>
        {row.original.phone && (
          <a
            href={`https://wa.me/${row.original.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="rounded-lg p-2 text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
          >
            <IconBrandWhatsapp className="h-4 w-4" />
          </a>
        )}
        <Link
          href={`/admin/lojas?userId=${row.original.id}`}
          title="Ver lojas"
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
        >
          <IconBuildingStore className="h-4 w-4" />
        </Link>
      </DataTableRowActions>
    ),
  },
]

export default function AdminUsersPage() {
  const { executeAsync, result, isExecuting } = useAction(getAdminUsersAction)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const loadUsers = useCallback(() => {
    executeAsync({ search: debouncedSearch || undefined, page, limit: pageSize })
  }, [executeAsync, debouncedSearch, page, pageSize])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

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
  const users = (data?.users || []) as AdminUser[]
  const total = data?.total || 0
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          Usuários
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {total} usuários cadastrados na plataforma
        </p>
      </motion.div>

      {isExecuting && users.length === 0 ? (
        <DataTableSkeleton columns={7} rows={8} />
      ) : (
        <DataTableRoot>
          <DataTableToolbar>
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Buscar por nome ou email..."
            />
          </DataTableToolbar>

          <DataTableContent stickyLastColumn>
            <DataTableTable
              columns={columns}
              data={users}
              stickyLastColumn
              emptyState={
                <DataTableEmptyState
                  icon={<IconUsers className="h-8 w-8" />}
                  title="Nenhum usuário encontrado"
                  description={search ? 'Tente ajustar sua busca' : 'Ainda não há usuários cadastrados'}
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
    </div>
  )
}
