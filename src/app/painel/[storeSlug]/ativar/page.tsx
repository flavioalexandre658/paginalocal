import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ storeSlug: string }>
}

export default async function ActivatePage({ params }: PageProps) {
  redirect('/planos')
}
