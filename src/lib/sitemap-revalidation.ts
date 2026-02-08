'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function revalidateSitemap() {
  try {
    revalidatePath('/sitemap.xml')
    revalidateTag('store-data')
    console.log('[Sitemap] Sitemap revalidado com sucesso')
  } catch (error) {
    console.error('[Sitemap] Erro ao revalidar sitemap:', error)
  }
}

export async function revalidateCategoryPages(categorySlug: string, citySlug?: string) {
  try {
    revalidatePath(`/${categorySlug}`)
    console.log(`[Sitemap] Página de categoria revalidada: /${categorySlug}`)

    if (citySlug) {
      revalidatePath(`/${categorySlug}/${citySlug}`)
      console.log(`[Sitemap] Página de categoria/cidade revalidada: /${categorySlug}/${citySlug}`)
    }
  } catch (error) {
    console.error('[Sitemap] Erro ao revalidar páginas de categoria:', error)
  }
}

export async function revalidateStoreRoutes(categorySlug: string, citySlug?: string) {
  await revalidateSitemap()
  await revalidateCategoryPages(categorySlug, citySlug)
}
