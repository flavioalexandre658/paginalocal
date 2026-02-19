import { NextResponse } from 'next/server'
import { db } from '@/db'
import { verification } from '@/db/schema'
import { eq } from 'drizzle-orm'

const IDENTIFIER_PREFIX = 'ck:'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  if (!token) {
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL || '/'))
  }

  const identifier = IDENTIFIER_PREFIX + token

  const [link] = await db
    .select()
    .from(verification)
    .where(eq(verification.identifier, identifier))
    .limit(1)

  if (!link) {
    return NextResponse.redirect(new URL('/pagamento/cancelado', process.env.NEXT_PUBLIC_APP_URL || '/'))
  }

  if (new Date(link.expiresAt).getTime() < Date.now()) {
    await db.delete(verification).where(eq(verification.id, link.id))
    return NextResponse.redirect(new URL('/pagamento/cancelado', process.env.NEXT_PUBLIC_APP_URL || '/'))
  }

  return NextResponse.redirect(link.value, { status: 302 })
}
