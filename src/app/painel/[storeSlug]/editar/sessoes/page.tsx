import { Metadata } from 'next'
import { SessoesPageContent } from './content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Editar - Seções',
}

export default async function SessoesPage({ params }: PageProps) {
  const { storeSlug } = await params
  return <SessoesPageContent storeSlug={storeSlug} />
}
