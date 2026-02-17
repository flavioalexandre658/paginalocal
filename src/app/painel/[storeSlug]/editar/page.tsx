import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function EditarPage({ params }: PageProps) {
  const { storeSlug } = await params
  redirect(`/painel/${storeSlug}/editar/geral`)
}
