import { NextResponse } from 'next/server'
import { randomBytes, randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { db } from '@/db'
import { plan, verification } from '@/db/schema'
import { eq } from 'drizzle-orm'

const LINK_PREFIX = 'ck:'
const LINK_TTL_HOURS = 23

function generateShortToken(): string {
  return randomBytes(6).toString('base64url')
}

async function createShortLink(stripeUrl: string, appUrl: string): Promise<string> {
  const token = generateShortToken()
  const identifier = LINK_PREFIX + token
  const expiresAt = new Date(Date.now() + LINK_TTL_HOURS * 60 * 60 * 1000)

  await db.insert(verification).values({
    id: randomUUID(),
    identifier,
    value: stripeUrl,
    expiresAt,
  })

  return `${appUrl}/c/${token}`
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session?.user || role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { planId, billingInterval, storeSlug } = await req.json()

    if (!planId || !billingInterval) {
      return NextResponse.json(
        { error: 'planId e billingInterval são obrigatórios' },
        { status: 400 },
      )
    }

    if (billingInterval !== 'MONTHLY' && billingInterval !== 'YEARLY') {
      return NextResponse.json(
        { error: 'billingInterval inválido. Use MONTHLY ou YEARLY.' },
        { status: 400 },
      )
    }

    const [p] = await db.select().from(plan).where(eq(plan.id, planId)).limit(1)
    if (!p) {
      return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    }

    const priceId =
      billingInterval === 'YEARLY' ? p.stripeYearlyPriceId : p.stripeMonthlyPriceId

    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe priceId não configurado para esse plano/intervalo' },
        { status: 400 },
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!appUrl) {
      return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL não configurado' }, { status: 500 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      metadata: {
        planId: String(planId),
        billingInterval,
        storeSlug: storeSlug ? String(storeSlug) : '',
      },
      success_url: `${appUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pagamento/cancelado`,
    })

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: 'Stripe não retornou uma URL de checkout' },
        { status: 500 },
      )
    }

    const shortUrl = await createShortLink(checkoutSession.url, appUrl)

    return NextResponse.json({ url: shortUrl })
  } catch (err) {
    console.error('[create-checkout] error:', err)
    return NextResponse.json(
      { error: 'Falha ao criar sessão de checkout' },
      { status: 500 },
    )
  }
}
