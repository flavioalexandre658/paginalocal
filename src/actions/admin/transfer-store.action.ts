'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, subscription, plan, storeTransfer } from '@/db/schema'
import { eq, and, or, count } from 'drizzle-orm'

const transferStoreSchema = z.object({
  storeId: z.string().uuid(),
  targetUserId: z.string().min(1),
})

export const transferStoreAction = adminActionClient
  .schema(transferStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, targetUserId } = parsedInput

    const [storeData] = await db
      .select({
        id: store.id,
        name: store.name,
        userId: store.userId,
        isActive: store.isActive,
      })
      .from(store)
      .where(eq(store.id, storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (storeData.userId === targetUserId) {
      throw new Error('A loja já pertence a este usuário')
    }

    const fromUserId = storeData.userId

    const [targetSubscription] = await db
      .select({
        subscription: subscription,
        plan: plan,
      })
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        and(
          eq(subscription.userId, targetUserId),
          or(
            eq(subscription.status, 'ACTIVE'),
            eq(subscription.status, 'TRIALING')
          )
        )
      )
      .limit(1)

    const [targetStoreCount] = await db
      .select({ count: count() })
      .from(store)
      .where(eq(store.userId, targetUserId))

    const currentStores = targetStoreCount?.count || 0
    let shouldActivate = false

    if (targetSubscription) {
      const maxStores = targetSubscription.plan.features.maxStores
      if (currentStores < maxStores) {
        shouldActivate = true
      }
    }

    const [updatedStore] = await db
      .update(store)
      .set({
        userId: targetUserId,
        isActive: shouldActivate,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    await db.insert(storeTransfer).values({
      storeId,
      fromUserId,
      toUserId: targetUserId,
      adminId: ctx.userId,
      wasActivated: shouldActivate,
    })

    return {
      store: updatedStore,
      wasActivated: shouldActivate,
      reason: shouldActivate
        ? 'Loja transferida e ativada com sucesso'
        : 'Loja transferida como inativa (usuário destino sem assinatura ou limite de lojas atingido)',
    }
  })
