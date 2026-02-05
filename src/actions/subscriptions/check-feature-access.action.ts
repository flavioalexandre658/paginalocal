'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { getUserPlanContext } from '@/lib/plan-middleware'

const checkFeatureAccessSchema = z.object({
  feature: z.enum(['customDomain', 'gmbSync', 'gmbAutoUpdate', 'unifiedDashboard']),
})

export const checkFeatureAccessAction = authActionClient
  .schema(checkFeatureAccessSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { feature } = parsedInput
    const planContext = await getUserPlanContext(ctx.userId)

    if (!planContext.hasActiveSubscription) {
      return {
        allowed: false,
        reason: 'Você precisa de uma assinatura ativa para acessar este recurso.',
        requiresSubscription: true,
        planType: null,
        planName: 'Gratuito',
      }
    }

    const featureAccess = planContext.features[feature as keyof typeof planContext.features]

    if (!featureAccess) {
      return {
        allowed: false,
        reason: `Seu plano ${planContext.planName} não inclui este recurso. Faça upgrade para o plano Pro ou superior.`,
        requiresSubscription: false,
        planType: planContext.planType,
        planName: planContext.planName,
      }
    }

    return {
      allowed: true,
      planType: planContext.planType,
      planName: planContext.planName,
    }
  })

export const getUserPlanContextAction = authActionClient
  .action(async ({ ctx }) => {
    const planContext = await getUserPlanContext(ctx.userId)
    return planContext
  })
