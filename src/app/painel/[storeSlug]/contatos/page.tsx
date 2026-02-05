import { Suspense } from 'react'
import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { LeadsContent } from './_components/leads-content'
import { DataTableSkeleton } from '@/components/ui/data-table-blocks'

interface PageProps {
  params: Promise<{ storeSlug: string }>
  searchParams: Promise<{
    page?: string
    pageSize?: string
    source?: string
    device?: string
    referrer?: string
    startDate?: string
    endDate?: string
    search?: string
  }>
}

export default async function ContatosPage({ params, searchParams }: PageProps) {
  const { storeSlug } = await params
  const search = await searchParams

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/entrar')
  }

  const storeData = await db
    .select({ id: store.id, name: store.name, isActive: store.isActive })
    .from(store)
    .where(and(eq(store.slug, storeSlug), eq(store.userId, session.user.id)))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<DataTableSkeleton columns={6} rows={10} />}>
        <LeadsContent
          storeId={storeData[0].id}
          storeSlug={storeSlug}
          isDraft={!storeData[0].isActive}
          initialPage={search.page ? parseInt(search.page) : 1}
          initialPageSize={search.pageSize ? parseInt(search.pageSize) : 20}
          initialSource={search.source as 'whatsapp' | 'call' | 'all' | undefined}
          initialDevice={search.device as 'mobile' | 'desktop' | 'all' | undefined}
          initialReferrer={search.referrer}
          initialStartDate={search.startDate}
          initialEndDate={search.endDate}
          initialSearch={search.search}
        />
      </Suspense>
    </main>
  )
}
