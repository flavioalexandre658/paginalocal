import { randomUUID, createHash, randomBytes } from 'crypto'
import { db } from '@/db'
import { user, verification } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getOrCreateUserByEmail(
  email: string,
  name?: string | null,
): Promise<{ id: string; email: string; isNew: boolean }> {
  const [existing] = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (existing) return { ...existing, isNew: false }

  const id = randomUUID()
  const safeName = name?.trim() || email.split('@')[0] || 'Usuário'

  await db.insert(user).values({
    id,
    name: safeName,
    email,
    emailVerified: false,
  })

  return { id, email, isNew: true }
}

export async function createActivationToken(email: string): Promise<string> {
  const raw = randomBytes(32).toString('hex')
  const hashed = createHash('sha256').update(raw).digest('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await db.delete(verification).where(eq(verification.identifier, email))

  await db.insert(verification).values({
    id: randomUUID(),
    identifier: email,
    value: hashed,
    expiresAt,
  })

  return raw
}

export function buildActivationUrl(rawToken: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paginalocal.com.br'
  return `${appUrl}/ativar-senha?token=${rawToken}`
}
