import { Metadata } from 'next'
import { DashboardContent } from './_components/dashboard-content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Painel',
}

export default async function DashboardPage({ params }: PageProps) {
  const { storeSlug } = await params

  return <DashboardContent storeSlug={storeSlug} />
}
