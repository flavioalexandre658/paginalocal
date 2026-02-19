import { NextResponse } from 'next/server'
import { createHash, randomUUID } from 'crypto'
import { hashPassword } from 'better-auth/crypto'
import { db } from '@/db'
import { verification, user, account } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

function sha256(input: string) {
  return createHash('sha256').update(input).digest('hex')
}

export async function POST(req: Request) {
  const body = await req.json()
  const { token, password } = body

  if (
    !token ||
    typeof token !== 'string' ||
    !password ||
    typeof password !== 'string' ||
    password.length < 8
  ) {
    return NextResponse.json(
      { error: 'Token inválido ou senha muito curta (mínimo 8 caracteres)' },
      { status: 400 },
    )
  }

  const hashedToken = sha256(token)

  const [v] = await db
    .select()
    .from(verification)
    .where(eq(verification.value, hashedToken))
    .limit(1)

  if (!v) {
    return NextResponse.json({ error: 'Link inválido ou já utilizado' }, { status: 400 })
  }

  if (new Date(v.expiresAt).getTime() < Date.now()) {
    await db.delete(verification).where(eq(verification.id, v.id))
    return NextResponse.json(
      { error: 'Link expirado. Solicite um novo link de ativação.' },
      { status: 400 },
    )
  }

  const email = v.identifier

  const [u] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1)

  if (!u) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const passHash = await hashPassword(password)

  const [existingAccount] = await db
    .select({ id: account.id })
    .from(account)
    .where(
      and(
        eq(account.userId, u.id),
        eq(account.providerId, 'credential'),
      ),
    )
    .limit(1)

  if (existingAccount) {
    await db
      .update(account)
      .set({ password: passHash, updatedAt: new Date() })
      .where(eq(account.id, existingAccount.id))
  } else {
    await db.insert(account).values({
      id: randomUUID(),
      userId: u.id,
      providerId: 'credential',
      accountId: email,
      password: passHash,
    })
  }

  await Promise.all([
    db
      .update(user)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(user.id, u.id)),
    db.delete(verification).where(eq(verification.id, v.id)),
  ])

  return NextResponse.json({ ok: true })
}
