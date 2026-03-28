import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { IAQueCriaSitesClient } from "./_components/ia-que-cria-sites-client"

export const metadata: Metadata = {
  title: "IA que Cria Sites | Construtor de Sites com Inteligencia Artificial | Decolou",
  description:
    "Crie seu site profissional em 30 segundos com IA. O Decolou gera design, textos e SEO otimizado automaticamente. Sem codigo, sem designer. Comece gratis.",
  keywords: [
    "ia que cria site",
    "inteligencia artificial cria site",
    "construtor de sites com ia",
    "criar site com ia",
    "site gerado por ia",
    "ia para criar site",
    "criar site automatico",
    "site profissional com ia",
  ],
  openGraph: {
    title: "IA que Cria Sites | Decolou",
    description: "Crie seu site profissional em 30 segundos com inteligencia artificial. Design, textos e SEO gerados automaticamente.",
    type: "website",
    url: "https://decolou.com/ia-que-cria-sites",
  },
  alternates: {
    canonical: "https://decolou.com/ia-que-cria-sites",
  },
}

export default async function IAQueCriaSitesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  return <IAQueCriaSitesClient isLoggedIn={!!session?.user?.id} />
}
