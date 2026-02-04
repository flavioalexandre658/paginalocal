import { Metadata } from 'next'
import { SettingsContent } from './_components/settings-content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
  searchParams: Promise<{ tab?: string }>
}

export const metadata: Metadata = {
  title: 'Configurações | Página Local',
}

export default async function SettingsPage({ params, searchParams }: PageProps) {
  const { storeSlug } = await params
  const { tab } = await searchParams

  return <SettingsContent storeSlug={storeSlug} initialTab={tab} />
}
