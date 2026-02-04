'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { checkCanCreateStore } from '@/lib/plan-middleware'

const createStoreSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  slug: z.string().min(1, 'Slug é obrigatório').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  phone: z.string().min(10, 'Telefone inválido'),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  description: z.string().optional(),
  zipCode: z.string().optional(),
  primaryColor: z.string().optional(),
})

export const createStoreAction = authActionClient
  .schema(createStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const storeCheck = await checkCanCreateStore(ctx.userId)
    if (!storeCheck.allowed) {
      throw new Error(storeCheck.reason || 'Limite de lojas atingido')
    }

    const [result] = await db
      .insert(store)
      .values({
        ...parsedInput,
        userId: ctx.userId,
      })
      .returning()

    return result
  })
