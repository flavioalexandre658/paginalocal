import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a história do Página Local e nossa missão de ajudar negócios locais a crescer no digital.',
}

export default function SobreNosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
