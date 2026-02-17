'use server'

import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, testimonial, service, storeImage, storePage } from '@/db/schema'
import { checkCanCreateStore, getUserPlanContext } from '@/lib/plan-middleware'
import {
  getPhotoUrl,
  downloadGooglePhoto,
} from '@/lib/google-places'
import { optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { notifyStoreActivated } from '@/lib/google-indexing'
import { generateInstitutionalPages } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'
import {
  buildStoreFromGoogle,
  generateSlugFromName,
  generateUniqueServiceSlugForStore,
  truncate,
} from '@/lib/store-builder'

// ===== Schema =====

const createStoreFromGoogleSchema = z.object({
  googlePlaceId: z.string().min(1),
  searchTerm: z.string().min(1),
  selectedCoverIndex: z.number().int().min(0).optional(),
  whatsappOverride: z.string().optional(),
  phoneOverride: z.string().optional(),
  mode: z.enum(['LOCAL_BUSINESS', 'PRODUCT_CATALOG', 'SERVICE_PRICING', 'HYBRID']).default('LOCAL_BUSINESS'),
})

// ===== Main Action =====

export const createStoreFromGoogleAction = authActionClient
  .schema(createStoreFromGoogleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const storeCheck = await checkCanCreateStore(ctx.userId)
    if (!storeCheck.allowed) {
      throw new Error(storeCheck.reason || 'Limite de lojas atingido. Assine um plano para criar mais lojas.')
    }

    const planContext = await getUserPlanContext(ctx.userId)
    const shouldActivateStore = planContext.hasActiveSubscription

    console.log('[Google Import] Plan context:', {
      userId: ctx.userId,
      hasActiveSubscription: planContext.hasActiveSubscription,
      planType: planContext.planType,
      planName: planContext.planName,
      shouldActivateStore,
    })

    const { googlePlaceId, searchTerm, selectedCoverIndex = 0 } = parsedInput

    const existingStore = await db.query.store.findFirst({
      where: (s, { eq }) => eq(s.googlePlaceId, googlePlaceId),
      columns: { id: true, name: true },
    })

    if (existingStore) {
      throw new Error('Esta empresa já está cadastrada na plataforma. Cada empresa do Google pode ser cadastrada apenas uma vez.')
    }

    // ===== Build store data from Google (shared logic) =====
    const result = await buildStoreFromGoogle(googlePlaceId, {
      phoneOverride: parsedInput.phoneOverride,
      whatsappOverride: parsedInput.whatsappOverride,
      selectedCoverIndex,
      searchTerm,
    })

    // ===== Generate unique slug =====
    const baseSlug = generateSlugFromName(result.displayName, result.city)
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, slug),
      })
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // ===== Create store =====
    const [newStore] = await db
      .insert(store)
      .values({
        userId: ctx.userId,
        name: result.displayName,
        slug,
        category: truncate(result.category.name, 100)!,
        categoryId: result.category.id,
        phone: result.phone,
        whatsapp: result.whatsapp,
        address: result.fullAddress,
        city: truncate(result.city, 100)!,
        state: truncate(result.state, 2)!,
        zipCode: result.zipCode,
        googlePlaceId,
        googleRating: result.rating?.toString(),
        googleReviewsCount: result.reviewCount,
        openingHours: result.openingHours,
        latitude: result.latitude?.toString(),
        longitude: result.longitude?.toString(),
        coverUrl: result.coverUrl,
        heroTitle: truncate(result.heroTitle, 100),
        heroSubtitle: truncate(result.heroSubtitle, 200),
        description: result.description,
        seoTitle: truncate(result.seoTitle, 70),
        seoDescription: truncate(result.seoDescription, 160),
        faq: result.faq,
        neighborhoods: result.neighborhoods,
        mode: parsedInput.mode,
        sections: null,
        templateId: 'default',
        templateConfig: null,
        isActive: shouldActivateStore,
      })
      .returning()

    // ===== Save reviews as testimonials =====
    if (result.placeDetails.reviews && result.placeDetails.reviews.length > 0) {
      console.log(`[Reviews] Total recebido do Google: ${result.placeDetails.reviews.length}`)

      const topReviews = result.placeDetails.reviews
        .filter(r => r.rating >= 4)
        .sort((a, b) => {
          const aHasText = a.text?.text && a.text.text.trim().length > 0 ? 1 : 0
          const bHasText = b.text?.text && b.text.text.trim().length > 0 ? 1 : 0
          if (bHasText !== aHasText) return bHasText - aHasText
          return b.rating - a.rating
        })

      console.log(`[Reviews] Salvando ${topReviews.length} reviews com rating >= 4`)

      for (const review of topReviews) {
        const reviewContent = review.text?.text && review.text.text.trim().length > 0
          ? review.text.text
          : `Avaliou com ${review.rating} estrelas`

        await db
          .insert(testimonial)
          .values({
            storeId: newStore.id,
            authorName: review.authorAttribution?.displayName || 'Anônimo',
            content: reviewContent,
            rating: review.rating,
            imageUrl: review.authorAttribution?.photoUri || null,
            isGoogleReview: true,
          })
          .onConflictDoNothing()
      }
    }

    // ===== Save services =====
    for (let i = 0; i < result.services.length; i++) {
      const svc = result.services[i]
      const svcSlug = await generateUniqueServiceSlugForStore(newStore.id, svc.name)
      await db
        .insert(service)
        .values({
          storeId: newStore.id,
          name: svc.name,
          slug: svcSlug,
          description: svc.description,
          seoTitle: truncate(svc.seoTitle, 70) || null,
          seoDescription: truncate(svc.seoDescription, 160) || null,
          longDescription: svc.longDescription || null,
          iconName: svc.iconName || null,
          position: i + 1,
          isActive: true,
        })
    }

    // ===== Process and upload images =====
    let imagesProcessed = 0
    let heroImageUrl = result.coverUrl

    const photos = result.placeDetails.photos
    console.log(`[Images] Google returned ${photos?.length ?? 0} photos`)

    if (photos && photos.length > 0) {
      const allPhotos = [...photos]
      const coverPhotoIndex = selectedCoverIndex < allPhotos.length ? selectedCoverIndex : 0
      if (coverPhotoIndex > 0 && coverPhotoIndex < allPhotos.length) {
        const [selectedPhoto] = allPhotos.splice(coverPhotoIndex, 1)
        allPhotos.unshift(selectedPhoto)
      }

      const altVariations = [
        'Fachada', 'Ambiente interno', 'Equipe', 'Estrutura', 'Atendimento',
        'Serviços', 'Instalações', 'Detalhes', 'Vista', 'Espaço',
        'Área externa', 'Recepção', 'Produtos', 'Interior', 'Entrada',
        'Vitrine', 'Salão', 'Área de trabalho', 'Decoração', 'Ambiente',
      ]

      for (let i = 0; i < allPhotos.length; i++) {
        const photoName = allPhotos[i].name
        const isHero = i === 0
        const role = isHero ? 'hero' : 'gallery'
        const altPrefix = altVariations[i % altVariations.length]

        try {
          console.log(`[Images] Downloading photo ${i + 1}/${allPhotos.length}: ${photoName.substring(0, 60)}...`)
          const imageBuffer = await downloadGooglePhoto(photoName, isHero ? 1200 : 800)
          console.log(`[Images] Downloaded ${imageBuffer.length} bytes, optimizing...`)

          const optimized = isHero
            ? await optimizeHeroImage(imageBuffer)
            : await optimizeGalleryImage(imageBuffer)

          const filename = `${role}-${i}`
          const s3Key = generateS3Key(newStore.id, filename)
          const { url } = await uploadToS3(optimized.buffer, s3Key)

          await db.insert(storeImage).values({
            storeId: newStore.id,
            url,
            alt: `${altPrefix} da ${result.displayName} em ${result.city}`,
            role,
            order: i,
            width: optimized.width,
            height: optimized.height,
            originalGoogleRef: photoName,
          })

          if (isHero) {
            heroImageUrl = url
            await db
              .update(store)
              .set({ coverUrl: url, updatedAt: new Date() })
              .where(eq(store.id, newStore.id))
          }

          imagesProcessed++
          console.log(`[Images] Photo ${i + 1} saved successfully (${role})`)
        } catch (error) {
          console.error(`[Images] FAILED to process photo ${i + 1}/${allPhotos.length} (${photoName}):`, error instanceof Error ? error.message : error)
        }
      }

      console.log(`[Images] Completed: ${imagesProcessed}/${allPhotos.length} photos saved`)
    } else {
      console.warn(`[Images] No photos available from Google for this place`)
    }

    // ===== Create subdomain =====
    let subdomainCreated = false
    const subdomain = `${newStore.slug}.paginalocal.com.br`
    try {
      const domainResult = await addDomainToVercel(subdomain)
      subdomainCreated = domainResult.success
      if (!domainResult.success) {
        console.error('[Google Import] Erro ao criar subdomínio na Vercel:', domainResult.error)
      }
    } catch (error) {
      console.error('[Google Import] Erro ao criar subdomínio na Vercel:', error)
    }

    // ===== Generate institutional pages =====
    let pagesGenerated = false
    try {
      const aiInput: MarketingCopyInput = {
        businessName: result.displayName,
        category: result.category.name,
        city: newStore.city,
        state: newStore.state,
        rating: result.placeDetails.rating,
        reviewCount: result.placeDetails.userRatingCount,
        googleAbout: result.placeDetails.editorialSummary?.text,
        address: newStore.address,
      }

      const institutionalPages = await generateInstitutionalPages(aiInput)

      await db.insert(storePage).values([
        {
          storeId: newStore.id,
          type: 'ABOUT' as const,
          slug: 'sobre-nos',
          title: institutionalPages.about.title,
          content: institutionalPages.about.content,
          seoTitle: institutionalPages.about.seoTitle,
          seoDescription: institutionalPages.about.seoDescription,
        },
        {
          storeId: newStore.id,
          type: 'CONTACT' as const,
          slug: 'contato',
          title: institutionalPages.contact.title,
          content: institutionalPages.contact.content,
          seoTitle: institutionalPages.contact.seoTitle,
          seoDescription: institutionalPages.contact.seoDescription,
        },
      ])

      pagesGenerated = true
      console.log(`[Google Import] Páginas institucionais geradas para "${result.displayName}"`)
    } catch (error) {
      console.error('[Google Import] Erro ao gerar páginas institucionais:', error)
    }

    // ===== Revalidate if active =====
    const pageSlugs = pagesGenerated ? ['sobre-nos', 'contato'] : undefined
    if (shouldActivateStore) {
      notifyStoreActivated(newStore.slug, newStore.customDomain, undefined, pageSlugs).catch((error) => {
        console.error('[Google Import] Erro ao notificar Google Indexing API:', error)
      })

      await revalidateSitemap()

      if (result.category.slug) {
        await revalidateCategoryPages(result.category.slug, generateCitySlug(newStore.city))
      }
    }

    return {
      store: newStore,
      slug: newStore.slug,
      brandName: result.displayName,
      displayName: result.displayName,
      marketingGenerated: result.marketingGenerated,
      reviewsSynced: result.placeDetails.reviews?.length || 0,
      servicesGenerated: result.services.length,
      faqGenerated: result.faq.length,
      neighborhoodsGenerated: result.neighborhoods.length,
      imagesProcessed,
      heroImageUrl,
      subdomainCreated,
    }
  })
