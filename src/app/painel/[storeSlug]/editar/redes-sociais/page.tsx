import { Metadata } from 'next'
import { RedesSociaisPageContent } from './content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Editar - Redes Sociais',
}

export default async function RedesSociaisPage({ params }: PageProps) {
  const { storeSlug } = await params
  return <RedesSociaisPageContent storeSlug={storeSlug} />
}
