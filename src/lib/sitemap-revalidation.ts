'use server'

import { revalidatePath } from 'next/cache'

/**
 * Revalida o sitemap para refletir mudanças em lojas ativas
 */
export async function revalidateSitemap() {
  try {
    revalidatePath('/sitemap.xml')
    console.log('[Sitemap] Sitemap revalidado com sucesso')
  } catch (error) {
    console.error('[Sitemap] Erro ao revalidar sitemap:', error)
  }
}

/**
 * Revalida páginas de categoria e categoria/cidade
 * @param categorySlug - Slug da categoria (ex: "borracharia")
 * @param citySlug - Slug opcional da cidade (ex: "guarulhos")
 */
export async function revalidateCategoryPages(categorySlug: string, citySlug?: string) {
  try {
    // Revalida página da categoria
    revalidatePath(`/${categorySlug}`)
    console.log(`[Sitemap] Página de categoria revalidada: /${categorySlug}`)

    // Revalida página de categoria/cidade se fornecido
    if (citySlug) {
      revalidatePath(`/${categorySlug}/${citySlug}`)
      console.log(`[Sitemap] Página de categoria/cidade revalidada: /${categorySlug}/${citySlug}`)
    }
  } catch (error) {
    console.error('[Sitemap] Erro ao revalidar páginas de categoria:', error)
  }
}

/**
 * Revalida sitemap e páginas de categoria de uma loja
 * Função utilitária que combina as duas operações
 */
export async function revalidateStoreRoutes(categorySlug: string, citySlug?: string) {
  await revalidateSitemap()
  await revalidateCategoryPages(categorySlug, citySlug)
}
