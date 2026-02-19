'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { createActivationToken, buildActivationUrl } from '@/lib/checkout-helpers'

const generateActivationLinkSchema = z.object({
  userId: z.string().min(1),
})

export const generateActivationLinkAction = adminActionClient
  .schema(generateActivationLinkSchema)
  .action(async ({ parsedInput }) => {
    const [u] = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.id, parsedInput.userId))
      .limit(1)

    if (!u) {
      throw new Error('Usuário não encontrado')
    }

    const raw = await createActivationToken(u.email)
    const url = buildActivationUrl(raw)

    return { url }
  })
