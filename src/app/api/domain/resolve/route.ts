import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return NextResponse.json({ slug: null }, { status: 400 })
  }

  try {
    const result = await db
      .select({ slug: store.slug })
      .from(store)
      .where(eq(store.customDomain, domain))
      .limit(1)

    return NextResponse.json({ slug: result[0]?.slug || null })
  } catch {
    return NextResponse.json({ slug: null }, { status: 500 })
  }
}
