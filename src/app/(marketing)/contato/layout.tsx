import { Metadata } from 'next'
import { buildPlatformMetadata } from '@/lib/platform-seo'

export const metadata: Metadata = buildPlatformMetadata({
  path: '/contato',
  title: 'Contato Decolou — Fale com a equipe da plataforma de IA para negócios',
  description:
    'Tire dúvidas, faça parcerias ou peça suporte. Nossa equipe está pronta para ajudar você a construir, lançar e expandir seu negócio com IA.',
  keywords: [
    'contato Decolou',
    'falar com Decolou',
    'suporte Decolou',
    'parceria construtor de sites com IA',
  ],
})

export default function ContatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
