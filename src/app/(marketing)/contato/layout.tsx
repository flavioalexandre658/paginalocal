import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com o Página Local. Estamos prontos para ajudar seu negócio a crescer.',
}

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
