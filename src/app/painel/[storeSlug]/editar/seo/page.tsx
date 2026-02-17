import { Metadata } from 'next'
import { SeoPageContent } from './content'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export const metadata: Metadata = {
  title: 'Editar - SEO',
}

export default async function SeoPage({ params }: PageProps) {
  const { storeSlug } = await params
  return <SeoPageContent storeSlug={storeSlug} />
}
