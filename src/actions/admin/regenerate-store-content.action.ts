'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, testimonial } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { generateMarketingCopy } from '@/lib/gemini'
import { generateSlug } from '@/lib/utils'
import {
  getPlaceDetails,
  summarizeReviews,
  summarizeTestimonials,
  extractBusinessAttributes,
  parseOpeningHours,
} from '@/lib/google-places'
import { fixOpeningHoursInFAQ } from '@/lib/faq-utils'

async function generateUniqueServiceSlug(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

const regenerateStoreContentSchema = z.object({
  storeId: z.string().uuid(),
})

export const regenerateStoreContentAction = adminActionClient
  .schema(regenerateStoreContentSchema)
  .action(async ({ parsedInput }) => {
    const [storeData] = await db
      .select()
      .from(store)
      .where(eq(store.id, parsedInput.storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    // Fetch fresh data from Google if available
    let googleAbout: string | undefined
    let businessAttributes: string[] | undefined
    let freshReviewHighlights: string | undefined
    let freshOpeningHours: Record<string, string> | undefined
    let freshRating: number | undefined
    let freshReviewCount: number | undefined

    if (storeData.googlePlaceId) {
      try {
        console.log(`[Regenerate] Fetching fresh data from Google for "${storeData.name}"...`)
        const placeDetails = await getPlaceDetails(storeData.googlePlaceId)

        if (placeDetails) {
          googleAbout = placeDetails.editorialSummary?.text
          businessAttributes = extractBusinessAttributes(placeDetails)
          freshReviewHighlights = summarizeReviews(placeDetails.reviews) || undefined
          freshRating = placeDetails.rating
          freshReviewCount = placeDetails.userRatingCount

          if (placeDetails.regularOpeningHours?.weekdayDescriptions) {
            freshOpeningHours = parseOpeningHours(placeDetails.regularOpeningHours.weekdayDescriptions)
          }

          // Update store with fresh Google data
          await db.update(store).set({
            googleRating: placeDetails.rating?.toString(),
            googleReviewsCount: placeDetails.userRatingCount,
            ...(freshOpeningHours ? { openingHours: freshOpeningHours } : {}),
            updatedAt: new Date(),
          }).where(eq(store.id, parsedInput.storeId))

          console.log(`[Regenerate] Google data fetched: rating=${freshRating}, reviews=${freshReviewCount}, attributes=${businessAttributes?.length || 0}`)
        }
      } catch (error) {
        console.error('[Regenerate] Error fetching Google data (continuing with DB data):', error)
      }
    }

    // Fallback to DB testimonials if no fresh Google reviews
    const openingHours = freshOpeningHours || (storeData.openingHours as Record<string, string>) || undefined
    let reviewHighlights = freshReviewHighlights

    if (!reviewHighlights) {
      const storeTestimonials = await db
        .select({ rating: testimonial.rating, content: testimonial.content })
        .from(testimonial)
        .where(eq(testimonial.storeId, parsedInput.storeId))
        .orderBy(desc(testimonial.rating))
        .limit(30)

      reviewHighlights = summarizeTestimonials(storeTestimonials) || undefined
    }

    const marketingCopy = await generateMarketingCopy({
      businessName: storeData.name,
      category: storeData.category,
      city: storeData.city,
      state: storeData.state,
      rating: freshRating || (storeData.googleRating ? parseFloat(storeData.googleRating) : undefined),
      reviewCount: freshReviewCount || storeData.googleReviewsCount || undefined,
      googleAbout,
      address: storeData.address || undefined,
      reviewHighlights,
      openingHours,
      businessAttributes: businessAttributes && businessAttributes.length > 0 ? businessAttributes : undefined,
    })

    let realNeighborhoods: string[] = []
    if (storeData.latitude && storeData.longitude) {
      const { fetchNearbyNeighborhoods } = await import('@/lib/google-places')
      realNeighborhoods = await fetchNearbyNeighborhoods(
        parseFloat(storeData.latitude),
        parseFloat(storeData.longitude),
        storeData.city,
      )
    }

    const fixedFaq = fixOpeningHoursInFAQ(
      marketingCopy.faq || [],
      openingHours,
      storeData.name
    )

    const [updatedStore] = await db
      .update(store)
      .set({
        heroTitle: marketingCopy.heroTitle,
        heroSubtitle: marketingCopy.heroSubtitle,
        description: marketingCopy.aboutSection,
        seoTitle: marketingCopy.seoTitle,
        seoDescription: marketingCopy.seoDescription,
        faq: fixedFaq,
        ...(realNeighborhoods.length > 0 ? { neighborhoods: realNeighborhoods } : {}),
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))
      .returning()

    await db
      .delete(service)
      .where(eq(service.storeId, parsedInput.storeId))

    if (marketingCopy.services && marketingCopy.services.length > 0) {
      for (let i = 0; i < marketingCopy.services.length; i++) {
        const svc = marketingCopy.services[i]
        const slug = await generateUniqueServiceSlug(parsedInput.storeId, svc.name)
        await db.insert(service).values({
          storeId: parsedInput.storeId,
          name: svc.name,
          slug,
          description: svc.description,
          seoTitle: svc.seoTitle || null,
          seoDescription: svc.seoDescription || null,
          longDescription: svc.longDescription || null,
          position: i + 1,
          isActive: true,
        })
      }
    }

    return {
      store: updatedStore,
      servicesCreated: marketingCopy.services?.length || 0,
    }
  })
