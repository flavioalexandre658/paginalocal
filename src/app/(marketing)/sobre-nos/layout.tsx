import { Metadata } from 'next'
import { buildPlatformMetadata } from '@/lib/platform-seo'

export const metadata: Metadata = buildPlatformMetadata({
  path: '/sobre-nos',
  title: 'Sobre a Decolou — IA que constrói negócios',
  description:
    'A Decolou é a solução completa de IA para construção de negócios. Conheça nossa missão de ajudar empreendedores a lançar, atrair clientes e expandir mais rápido com inteligência artificial.',
  keywords: [
    'sobre Decolou',
    'missão Decolou',
    'plataforma de IA para negócios',
    'time Decolou',
    'história Decolou',
  ],
})

export default function SobreNosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
