'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  IconUsers,
  IconBrandWhatsapp,
  IconBuildingStore,
  IconMail,
  IconPhone,
  IconCrown,
  IconKey,
  IconLoader2,
} from '@tabler/icons-react'

import { getAdminUsersAction } from '@/actions/admin/get-admin-users.action'
import { generateActivationLinkAction } from '@/actions/admin/generate-activation-link.action'
import { Badge } from '@/components/ui/badge'
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

function getRoleBadge(role: string | null) {
  if (role === 'admin') {
    return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">Admin</Badge>
  }
  return <Badge variant="secondary">Usuário</Badge>
}

function CopyActivationLinkButton({ userId }: { userId: string }) {
  const { executeAsync, isExecuting } = useAction(generateActivationLinkAction)

  async function handleCopy() {
    const res = await executeAsync({ userId })
    if (res?.data?.url) {
      await navigator.clipboard.writeText(res.data.url)
      toast.success('Link de ativação copiado!')
    } else {
      toast.error('Erro ao gerar link de ativação')
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isExecuting}
      title="Copiar link de ativação de senha"
      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600 disabled:opacity-50 dark:hover:bg-amber-950 dark:hover:text-amber-400"
    >
      {isExecuting ? (
        <IconLoader2 className="h-4 w-4 animate-spin" />
      ) : (
        <IconKey className="h-4 w-4" />
      )}
    </button>
  )
}

function getUserInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
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
    cell: ({ row }) => getRoleBadge(row.original.role),
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
        <CopyActivationLinkButton userId={row.original.id} />
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

          <div className="hidden lg:block">
            <DataTableContent stickyLastColumn>
              <DataTableTable
                columns={columns}
                data={users}
                stickyLastColumn
                manualPagination
                emptyState={
                  <DataTableEmptyState
                    icon={<IconUsers className="h-8 w-8" />}
                    title="Nenhum usuário encontrado"
                    description={search ? 'Tente ajustar sua busca' : 'Ainda não há usuários cadastrados'}
                  />
                }
              />
            </DataTableContent>
          </div>

          {users.length === 0 ? (
            <MobileCardEmptyState
              icon={<IconUsers className="h-8 w-8" />}
              title="Nenhum usuário encontrado"
              description={search ? 'Tente ajustar sua busca' : 'Ainda não há usuários cadastrados'}
            />
          ) : (
            <MobileCardList>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <MobileCard>
                    <MobileCardHeader
                      actions={
                        <div className="flex items-center gap-1">
                          {user.phone && (
                            <a
                              href={`https://wa.me/${user.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="WhatsApp"
                              className="rounded-lg p-2 text-emerald-500 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950"
                            >
                              <IconBrandWhatsapp className="h-4 w-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/lojas?userId=${user.id}`}
                            aria-label="Ver lojas"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                          >
                            <IconBuildingStore className="h-4 w-4" />
                          </Link>
                          <CopyActivationLinkButton userId={user.id} />
                        </div>
                      }
                    >
                      <MobileCardAvatar
                        initials={getUserInitials(user.name)}
                        statusColor={
                          user.subscriptionStatus === 'ACTIVE'
                            ? 'bg-emerald-500'
                            : user.subscriptionStatus === 'TRIALING'
                              ? 'bg-blue-500'
                              : user.subscriptionStatus === 'PAST_DUE'
                                ? 'bg-red-500'
                                : 'bg-slate-400'
                        }
                      />
                      <MobileCardTitle
                        title={user.name}
                        subtitle={user.email}
                        badge={getRoleBadge(user.role)}
                      />
                    </MobileCardHeader>

                    <MobileCardContent>
                      <MobileCardRow
                        icon={<IconPhone className="h-3.5 w-3.5" />}
                        label="Telefone"
                        value={user.phone || '-'}
                      />
                      <MobileCardRow
                        icon={<IconBuildingStore className="h-3.5 w-3.5" />}
                        label="Lojas"
                        value={String(Number(user.storeCount))}
                      />
                      <MobileCardRow
                        icon={<IconCrown className="h-3.5 w-3.5" />}
                        label="Plano"
                        value={user.planName || 'Gratuito'}
                      />
                    </MobileCardContent>

                    <MobileCardFooter>
                      {getStatusBadge(user.subscriptionStatus)}
                      <Link
                        href={`/admin/lojas?userId=${user.id}`}
                        className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
                      >
                        Ver lojas →
                      </Link>
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
    </div>
  )
}
