import { Metadata } from 'next'
import { GeralPageContent } from './content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Editar - Geral',
}

export default async function GeralPage({ params }: PageProps) {
  const { storeSlug } = await params
  return <GeralPageContent storeSlug={storeSlug} />
}
