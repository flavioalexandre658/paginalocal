'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'

const updateUserPhoneSchema = z.object({
  phone: z.string().min(10).max(20),
})

export const updateUserPhoneAction = authActionClient
  .schema(updateUserPhoneSchema)
  .action(async ({ parsedInput, ctx }) => {
    const cleanPhone = parsedInput.phone.replace(/\D/g, '')

    const [result] = await db
      .update(user)
      .set({ 
        phone: cleanPhone,
        updatedAt: new Date(),
      })
      .where(eq(user.id, ctx.userId))
      .returning()

    return result
  })
