import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { PlanType } from '@/db/schema'
import { TransferPlanContent } from './_components/transfer-plan-content'

export const metadata: Metadata = {
  title: 'Ative seu Plano',
}

const PLAN_PARAM_MAP: Record<string, PlanType> = {
  essencial: 'ESSENTIAL',
  pro: 'PRO',
  agencia: 'AGENCY',
}

interface PageProps {
  searchParams: Promise<{ p?: string; s?: string }>
}

export default async function PlanoTransferenciaPage({ searchParams }: PageProps) {
  const { p, s } = await searchParams

  const planType = p ? PLAN_PARAM_MAP[p.toLowerCase()] : null

  if (!planType) {
    redirect('/cadastro/aguardando-transferencia')
  }

  const [selectedPlan] = await db
    .select()
    .from(plan)
    .where(and(eq(plan.type, planType), eq(plan.isActive, true)))
    .limit(1)

  if (!selectedPlan) {
    redirect('/cadastro/aguardando-transferencia')
  }

  return <TransferPlanContent plan={selectedPlan} planParam={p!} storeSlug={s} />
}
