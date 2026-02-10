'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { category } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { truncate } from '@/lib/store-builder'

function buildCategorySeoContent(name: string) {
  const lower = name.toLowerCase()
  return {
    seoTitle: truncate(`${name} Perto de Mim - Encontre a Melhor`, 70)!,
    seoDescription: truncate(`Encontre ${lower} perto de você com avaliações reais de clientes. Compare serviços, veja endereços e entre em contato pelo WhatsApp.`, 160)!,
    seoKeywords: [`${lower} perto de mim`, lower, `melhor ${lower}`],
    heroTitle: truncate(`Encontre ${name} Perto de Você`, 100)!,
    heroSubtitle: `Compare avaliações reais, veja endereços e entre em contato pelo WhatsApp com ${lower} da sua cidade.`,
    longDescription: `Procurando ${lower} perto de você? No Página Local você encontra ${lower} com avaliações reais de clientes, endereço completo e contato direto por WhatsApp. Compare preços e serviços, veja quem atende na sua região e escolha a melhor opção para você.`,
    faqs: [
      {
        question: `Qual a melhor ${lower} perto de mim?`,
        answer: `No Página Local você encontra ${lower} com avaliações reais de clientes na sua cidade. Compare notas, serviços e localização para escolher a melhor opção perto de você.`,
      },
      {
        question: `Como entrar em contato com ${lower}?`,
        answer: `Você pode entrar em contato pelo WhatsApp ou telefone, disponíveis no perfil de cada estabelecimento no Página Local.`,
      },
      {
        question: `${name} aceita cartão de crédito?`,
        answer: `A maioria aceita cartões de crédito e débito, além de PIX. Consulte as formas de pagamento no perfil de cada estabelecimento.`,
      },
      {
        question: `Como avaliar ${lower}?`,
        answer: `Após utilizar o serviço, você pode deixar sua avaliação no perfil do estabelecimento. Avaliações reais ajudam outros clientes a escolher.`,
      },
    ],
    suggestedServices: ['Atendimento Especializado', 'Orçamento Gratuito', 'Atendimento Rápido', 'Garantia de Satisfação'],
  }
}

const updateAdminCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
})

export const updateAdminCategoryAction = adminActionClient
  .schema(updateAdminCategorySchema)
  .action(async ({ parsedInput }) => {
    const { id, name } = parsedInput

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
    const slug = generateSlug(capitalizedName)

    const duplicate = await db.query.category.findFirst({
      where: (c, { eq: eqOp, and: andOp, ne: neOp }) =>
        andOp(eqOp(c.slug, slug), neOp(c.id, id)),
    })

    if (duplicate) {
      throw new Error(`Já existe outra categoria com o slug "${slug}"`)
    }

    const seo = buildCategorySeoContent(capitalizedName)

    const [updated] = await db
      .update(category)
      .set({
        name: capitalizedName,
        slug,
        description: `Serviços de ${capitalizedName.toLowerCase()}`,
        suggestedServices: seo.suggestedServices,
        seoTitle: seo.seoTitle,
        seoDescription: seo.seoDescription,
        seoKeywords: seo.seoKeywords,
        heroTitle: seo.heroTitle,
        heroSubtitle: seo.heroSubtitle,
        longDescription: seo.longDescription,
        faqs: seo.faqs,
      })
      .where(eq(category.id, id))
      .returning()

    if (!updated) {
      throw new Error('Categoria não encontrada')
    }

    console.log(`[Admin] Category "${capitalizedName}" updated with regenerated SEO (slug: "${slug}")`)

    return updated
  })
