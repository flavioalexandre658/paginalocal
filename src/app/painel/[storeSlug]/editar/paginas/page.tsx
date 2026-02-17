import { Metadata } from 'next'
import { PaginasPageContent } from './content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Editar - Páginas',
}

export default async function PaginasPage({ params }: PageProps) {
  const { storeSlug } = await params
  return <PaginasPageContent storeSlug={storeSlug} />
}
