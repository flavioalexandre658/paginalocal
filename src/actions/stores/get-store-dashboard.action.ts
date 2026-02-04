'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, lead, service, testimonial, storeImage } from '@/db/schema'
import { eq, and, desc, gte, count, sql } from 'drizzle-orm'

const getStoreDashboardSchema = z.object({
  storeSlug: z.string().min(1),
})

interface HealthScoreItem {
  id: string
  label: string
  description: string
  score: number
  maxScore: number
  actionUrl: string
  actionLabel: string
  completed: boolean
}

interface DynamicTip {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionUrl: string
  actionLabel: string
  icon: 'photo' | 'description' | 'publish' | 'faq' | 'services' | 'domain' | 'seo'
}

export const getStoreDashboardAction = authActionClient
  .schema(getStoreDashboardSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug } = parsedInput

    const [storeData] = await db
      .select()
      .from(store)
      .where(and(eq(store.slug, storeSlug), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [images, services, testimonials] = await Promise.all([
      db
        .select({ id: storeImage.id })
        .from(storeImage)
        .where(eq(storeImage.storeId, storeData.id)),
      db
        .select({ id: service.id, description: service.description })
        .from(service)
        .where(eq(service.storeId, storeData.id)),
      db
        .select({
          id: testimonial.id,
          authorName: testimonial.authorName,
          content: testimonial.content,
          rating: testimonial.rating,
          imageUrl: testimonial.imageUrl,
          createdAt: testimonial.createdAt,
        })
        .from(testimonial)
        .where(eq(testimonial.storeId, storeData.id))
        .orderBy(desc(testimonial.createdAt))
        .limit(5),
    ])

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [leadsThisMonth, leadsLastWeek, recentLeads] = await Promise.all([
      db
        .select({ count: count() })
        .from(lead)
        .where(and(eq(lead.storeId, storeData.id), gte(lead.createdAt, thirtyDaysAgo))),
      db
        .select({ count: count() })
        .from(lead)
        .where(and(eq(lead.storeId, storeData.id), gte(lead.createdAt, sevenDaysAgo))),
      db
        .select({
          id: lead.id,
          name: lead.name,
          phone: lead.phone,
          source: lead.source,
          device: lead.device,
          referrer: lead.referrer,
          location: lead.location,
          touchpoint: lead.touchpoint,
          createdAt: lead.createdAt,
          isFromBlockedSite: lead.isFromBlockedSite,
        })
        .from(lead)
        .where(eq(lead.storeId, storeData.id))
        .orderBy(desc(lead.createdAt))
        .limit(10),
    ])

    const leadsPerDay = await db
      .select({
        date: sql<string>`DATE(${lead.createdAt})`.as('date'),
        count: count(),
      })
      .from(lead)
      .where(and(eq(lead.storeId, storeData.id), gte(lead.createdAt, thirtyDaysAgo)))
      .groupBy(sql`DATE(${lead.createdAt})`)
      .orderBy(sql`DATE(${lead.createdAt})`)

    const faq = (storeData.faq as Array<{ question: string; answer: string }>) || []
    const neighborhoods = (storeData.neighborhoods as string[]) || []

    const healthScoreItems: HealthScoreItem[] = []
    const dynamicTips: DynamicTip[] = []

    const hasEnoughPhotos = images.length >= 5
    healthScoreItems.push({
      id: 'photos',
      label: 'Fotos do negócio',
      description: hasEnoughPhotos ? `${images.length} fotos adicionadas` : `${images.length}/5 fotos`,
      score: Math.min(images.length, 5) * 4,
      maxScore: 20,
      actionUrl: `/painel/${storeSlug}/editar?tab=galeria`,
      actionLabel: 'Adicionar fotos',
      completed: hasEnoughPhotos,
    })

    if (!hasEnoughPhotos) {
      dynamicTips.push({
        id: 'photos',
        title: 'Adicione mais fotos',
        description: `Perfis com 5+ fotos recebem 2x mais contatos. Você tem ${images.length}.`,
        priority: 'high',
        actionUrl: `/painel/${storeSlug}/editar?tab=galeria`,
        actionLabel: 'Adicionar fotos',
        icon: 'photo',
      })
    }

    const hasDescription = (storeData.description?.length || 0) >= 100
    healthScoreItems.push({
      id: 'description',
      label: 'Descrição do negócio',
      description: hasDescription ? 'Descrição completa' : 'Descrição curta',
      score: hasDescription ? 15 : Math.min((storeData.description?.length || 0) / 100 * 15, 10),
      maxScore: 15,
      actionUrl: `/painel/${storeSlug}/editar?tab=geral`,
      actionLabel: 'Editar descrição',
      completed: hasDescription,
    })

    if (!hasDescription) {
      dynamicTips.push({
        id: 'description',
        title: 'Melhore sua descrição',
        description: 'Sua descrição está curta. Textos com 100+ caracteres melhoram seu SEO no Google.',
        priority: 'medium',
        actionUrl: `/painel/${storeSlug}/editar?tab=geral`,
        actionLabel: 'Editar descrição',
        icon: 'description',
      })
    }

    const isPublished = storeData.isActive
    healthScoreItems.push({
      id: 'published',
      label: 'Site publicado',
      description: isPublished ? 'Visível no Google' : 'Em rascunho',
      score: isPublished ? 20 : 0,
      maxScore: 20,
      actionUrl: `/planos`,
      actionLabel: 'Publicar site',
      completed: isPublished,
    })

    if (!isPublished) {
      dynamicTips.push({
        id: 'publish',
        title: 'Publique seu site',
        description: 'Seu site está invisível para clientes. Publique agora para começar a aparecer no Google.',
        priority: 'high',
        actionUrl: `/planos`,
        actionLabel: 'Publicar agora',
        icon: 'publish',
      })
    }

    const hasEnoughFAQ = faq.length >= 3
    healthScoreItems.push({
      id: 'faq',
      label: 'Perguntas frequentes',
      description: hasEnoughFAQ ? `${faq.length} perguntas` : `${faq.length}/3 perguntas`,
      score: Math.min(faq.length, 3) * 5,
      maxScore: 15,
      actionUrl: `/painel/${storeSlug}/editar?tab=secoes`,
      actionLabel: 'Adicionar FAQ',
      completed: hasEnoughFAQ,
    })

    if (!hasEnoughFAQ) {
      dynamicTips.push({
        id: 'faq',
        title: 'Tire dúvidas comuns (FAQ)',
        description: 'Adicione perguntas frequentes para reduzir atendimento no WhatsApp e passar mais confiança.',
        priority: 'medium',
        actionUrl: `/painel/${storeSlug}/editar?tab=secoes`,
        actionLabel: 'Adicionar FAQ',
        icon: 'faq',
      })
    }

    const servicesWithDescription = services.filter(s => (s.description?.length || 0) >= 30)
    const hasDetailedServices = services.length >= 3 && servicesWithDescription.length >= services.length * 0.7
    healthScoreItems.push({
      id: 'services',
      label: 'Serviços detalhados',
      description: hasDetailedServices ? `${services.length} serviços completos` : `${servicesWithDescription.length}/${services.length} detalhados`,
      score: hasDetailedServices ? 15 : Math.min(servicesWithDescription.length * 3, 10),
      maxScore: 15,
      actionUrl: `/painel/${storeSlug}/editar?tab=secoes`,
      actionLabel: 'Detalhar serviços',
      completed: hasDetailedServices,
    })

    if (!hasDetailedServices && services.length > 0) {
      dynamicTips.push({
        id: 'services',
        title: 'Detalhe seus serviços',
        description: 'Descreva detalhadamente cada serviço para que o Google entenda melhor sua especialidade.',
        priority: 'medium',
        actionUrl: `/painel/${storeSlug}/editar?tab=secoes`,
        actionLabel: 'Editar serviços',
        icon: 'services',
      })
    }

    const hasCustomDomain = !!storeData.customDomain
    healthScoreItems.push({
      id: 'domain',
      label: 'Domínio próprio',
      description: hasCustomDomain ? storeData.customDomain! : 'Usando subdomínio',
      score: hasCustomDomain ? 10 : 0,
      maxScore: 10,
      actionUrl: `/painel/${storeSlug}/configuracoes?tab=dominio`,
      actionLabel: 'Configurar domínio',
      completed: hasCustomDomain,
    })

    if (!hasCustomDomain) {
      dynamicTips.push({
        id: 'domain',
        title: 'Profissionalize seu link',
        description: 'Use um domínio próprio (ex: www.seunegocio.com.br) para aumentar sua autoridade.',
        priority: 'low',
        actionUrl: `/painel/${storeSlug}/configuracoes?tab=dominio`,
        actionLabel: 'Configurar domínio',
        icon: 'domain',
      })
    }

    const hasCustomSEO = storeData.seoDescription && storeData.seoDescription.length > 50
    healthScoreItems.push({
      id: 'seo',
      label: 'SEO personalizado',
      description: hasCustomSEO ? 'Meta tags personalizadas' : 'Meta tags padrão',
      score: hasCustomSEO ? 5 : 0,
      maxScore: 5,
      actionUrl: `/painel/${storeSlug}/editar?tab=seo`,
      actionLabel: 'Personalizar SEO',
      completed: !!hasCustomSEO,
    })

    if (!hasCustomSEO) {
      dynamicTips.push({
        id: 'seo',
        title: 'Melhore o SEO (Meta Tags)',
        description: 'Personalize a descrição do seu site que aparece no Google para atrair mais cliques.',
        priority: 'low',
        actionUrl: `/painel/${storeSlug}/editar?tab=seo`,
        actionLabel: 'Editar SEO',
        icon: 'seo',
      })
    }

    const totalScore = healthScoreItems.reduce((acc, item) => acc + item.score, 0)
    const maxScore = healthScoreItems.reduce((acc, item) => acc + item.maxScore, 0)
    const healthScore = Math.round((totalScore / maxScore) * 100)

    dynamicTips.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    const whatsappLeads = recentLeads.filter(l => l.source?.includes('whatsapp')).length
    const phoneLeads = recentLeads.filter(l => l.source?.includes('phone') || l.source?.includes('call')).length

    return {
      store: {
        id: storeData.id,
        name: storeData.name,
        slug: storeData.slug,
        isActive: storeData.isActive,
        googlePlaceId: storeData.googlePlaceId,
        googleRating: storeData.googleRating,
        googleReviewsCount: storeData.googleReviewsCount,
        customDomain: storeData.customDomain,
      },
      healthScore,
      healthScoreItems,
      dynamicTips: dynamicTips.slice(0, 4),
      allTipsCompleted: dynamicTips.length === 0,
      stats: {
        totalLeadsThisMonth: leadsThisMonth[0]?.count || 0,
        totalLeadsLastWeek: leadsLastWeek[0]?.count || 0,
        whatsappLeads,
        phoneLeads,
        leadsPerDay,
      },
      recentLeads: recentLeads.slice(0, 5),
      recentTestimonials: testimonials,
      counts: {
        images: images.length,
        services: services.length,
        faq: faq.length,
        neighborhoods: neighborhoods.length,
      },
    }
  })
