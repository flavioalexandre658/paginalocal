import { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { IAQueCriaSitesClient } from "./_components/ia-que-cria-sites-client"
import { buildPlatformMetadata } from "@/lib/platform-seo"

export const metadata: Metadata = buildPlatformMetadata({
  path: "/ia-que-cria-sites",
  title:
    "IA que constrói negócios — Crie um site profissional em 30 segundos | Decolou",
  description:
    "A solução completa de IA para construção de negócios. Lance um site, conquiste clientes e expanda mais rápido com inteligência artificial — fique online em 30 segundos.",
  keywords: [
    "IA que cria sites",
    "inteligência artificial cria site",
    "construtor de sites com IA",
    "site automático com IA",
    "criar site profissional em 30 segundos",
    "plataforma de IA para empreendedor",
    "site gerado por IA",
    "construir negócio com IA",
  ],
})

export default async function IAQueCriaSitesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  return <IAQueCriaSitesClient isLoggedIn={!!session?.user?.id} />
}
