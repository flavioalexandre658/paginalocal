import { createSafeActionClient } from 'next-safe-action'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message
    }
    return 'Erro no servidor'
  },
})

export const authActionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message
    }
    return 'Erro no servidor'
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Não autorizado')
  }

  return next({
    ctx: {
      userId: session.user.id,
      userEmail: session.user.email,
      userRole: (session.user as { role?: string }).role || 'user',
    },
  })
})

export const adminActionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message
    }
    return 'Erro no servidor'
  },
}).use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error('Não autorizado')
  }

  const role = (session.user as { role?: string }).role
  if (role !== 'admin') {
    throw new Error('Acesso negado: permissão de administrador necessária')
  }

  return next({
    ctx: {
      userId: session.user.id,
      userEmail: session.user.email,
    },
  })
})
