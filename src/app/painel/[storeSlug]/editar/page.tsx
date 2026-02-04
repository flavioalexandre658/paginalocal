import { Metadata } from 'next'
import { EditStoreContent } from './_components/edit-store-content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
  searchParams: Promise<{ tab?: string }>
}

export const metadata: Metadata = {
  title: 'Editar Site | Página Local',
}

export default async function EditStorePage({ params, searchParams }: PageProps) {
  const { storeSlug } = await params
  const { tab } = await searchParams

  return <EditStoreContent storeSlug={storeSlug} initialTab={tab} />
}
