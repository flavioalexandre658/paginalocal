'use client'

import { useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import {
  IconUsers,
  IconBuildingStore,
  IconCreditCard,
  IconTrendingUp,
  IconAlertTriangle,
  IconLoader2,
  IconCurrencyReal,
  IconChartBar,
  IconAlertCircle,
} from '@tabler/icons-react'

import { getAdminDashboardAction } from '@/actions/admin/get-admin-dashboard.action'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export default function AdminDashboardPage() {
  const { executeAsync, result, isExecuting } = useAction(getAdminDashboardAction)

  useEffect(() => {
    executeAsync()
  }, [executeAsync])

  if (isExecuting || !result?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const data = result.data

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          Dashboard Administrativo
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Visão geral da plataforma Página Local
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Usuários"
          value={data.totalUsers.toString()}
          icon={<IconUsers className="h-5 w-5 text-blue-500" />}
          iconBg="from-blue-500/20 to-blue-500/5"
          index={0}
        />
        <StatCard
          title="Lojas Ativas"
          value={`${data.activeStores}/${data.totalStores}`}
          icon={<IconBuildingStore className="h-5 w-5 text-emerald-500" />}
          iconBg="from-emerald-500/20 to-emerald-500/5"
          subtitle={`${data.inactiveStores} inativas`}
          index={1}
        />
        <StatCard
          title="Assinaturas Ativas"
          value={data.activeSubscriptions.toString()}
          icon={<IconCreditCard className="h-5 w-5 text-primary" />}
          iconBg="from-primary/20 to-primary/5"
          subtitle={`${data.canceledSubscriptions} canceladas`}
          index={2}
        />
        <StatCard
          title="Churn Rate"
          value={`${data.churnRate}%`}
          icon={<IconTrendingUp className="h-5 w-5 text-amber-500" />}
          iconBg="from-amber-500/20 to-amber-500/5"
          index={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="MRR (Receita Recorrente Mensal)"
          value={formatCurrency(data.mrrInCents)}
          icon={<IconCurrencyReal className="h-5 w-5 text-emerald-500" />}
          iconBg="from-emerald-500/20 to-emerald-500/5"
          index={4}
        />
        <StatCard
          title="ARR (Receita Recorrente Anual)"
          value={formatCurrency(data.arrInCents)}
          icon={<IconChartBar className="h-5 w-5 text-primary" />}
          iconBg="from-primary/20 to-primary/5"
          index={5}
        />
      </div>

      {data.revenueByPlan.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <GlassCard>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Receita por Plano
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.revenueByPlan.map((item) => (
                <div
                  key={item.planType}
                  className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {item.planName}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {item.count} assinantes
                    </Badge>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(Number(item.revenue))}/mês
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {data.expiringSubscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <GlassCard>
              <div className="mb-4 flex items-center gap-2">
                <IconAlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Assinaturas Expirando (7 dias)
                </h2>
              </div>
              <div className="space-y-3">
                {data.expiringSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200/60 px-4 py-3 dark:border-slate-700/60"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {sub.userName}
                      </p>
                      <p className="text-xs text-slate-500">{sub.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {sub.planName}
                      </Badge>
                      <p className="mt-1 text-xs text-amber-600">
                        {sub.currentPeriodEnd
                          ? new Date(sub.currentPeriodEnd).toLocaleDateString('pt-BR')
                          : '-'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {data.pastDueSubscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <GlassCard>
              <div className="mb-4 flex items-center gap-2">
                <IconAlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Pagamentos Atrasados
                </h2>
              </div>
              <div className="space-y-3">
                {data.pastDueSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-red-200/60 bg-red-50/30 px-4 py-3 dark:border-red-900/40 dark:bg-red-950/20"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {sub.userName}
                      </p>
                      <p className="text-xs text-slate-500">{sub.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">
                        Inadimplente
                      </Badge>
                      {sub.userPhone && (
                        <a
                          href={`https://wa.me/${sub.userPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs text-emerald-600 hover:underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>

      {data.recentUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <GlassCard>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Novos Usuários (30 dias)
            </h2>
            <div className="flex items-end gap-1">
              {data.recentUsers.map((day) => {
                const maxCount = Math.max(...data.recentUsers.map((d) => d.count), 1)
                const height = Math.max((day.count / maxCount) * 100, 4)
                return (
                  <div
                    key={day.date}
                    className="group relative flex-1"
                    title={`${day.date}: ${day.count} usuários`}
                  >
                    <div
                      className="w-full rounded-t bg-primary/70 transition-colors hover:bg-primary"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>30 dias atrás</span>
              <span>Hoje</span>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  subtitle,
  index = 0,
}: {
  title: string
  value: string
  icon: React.ReactNode
  iconBg: string
  subtitle?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-lg`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
