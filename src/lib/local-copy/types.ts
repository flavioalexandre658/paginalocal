// lib/local-seo/types.ts
export type StoreMode = "LOCAL_BUSINESS" | "PRODUCT_CATALOG" | "SERVICE_PRICING" | "HYBRID"

export type LocalPageCtx = {
    id?: string | number
    slug?: string

    mode: StoreMode

    name: string
    category: string
    city: string
    state: string

    servicesCount?: number
    // ✅ service detail context (opcional)
    serviceName?: string
    serviceDesc?: string | null
}

export type Token =
    | { t: "text"; v: string }
    | { t: "strong"; v: string }
    | { t: "normal"; v: string }
    | { t: "primary"; v: string }

export type TokenLine = Token[]

/**
 * Keys (blocos) usados pelos templates.
 * Você pode adicionar novos keys SEM quebrar templates existentes.
 */
export type CopyKey =
    // --- AboutSection ---
    | "about.heading"
    | "about.desc"
    | "services.title"
    | "hours.hint"
    | "neigh.header"
    | "neigh.intro"
    | "neigh.footer"
    // --- AreasSection ---
    | "areas.kicker"
    | "areas.heading"
    | "areas.intro"
    | "areas.heroTitle"
    | "areas.heroDesc"
    | "areas.footer"
    // --- ContactSection ---
    | "contact.kicker"
    | "contact.heading"
    | "contact.intro"
    | "contact.mapCta"
    | "contact.noMapCta"
    | "contact.addressTitle"
    | "contact.phoneTitle"
    | "contact.hoursTitle"
    // --- FAQSection ---
    | "faq.kicker"
    | "faq.heading"
    | "faq.intro"
    // --- GallerySection ---
    | "gallery.kicker"
    | "gallery.heading"
    | "gallery.intro"
    // --- ServicesSection ---
    | "services.kicker"
    | "services.heading"
    | "services.intro"
    | "services.cardCta"
    // --- TestimonialsSection ---
    | "testimonials.kicker"
    | "testimonials.heading"
    | "testimonials.intro"
    | "testimonials.counter"
    // --- ProductsSection ---
    | "products.kicker"
    | "products.heading"
    | "products.intro"
    | "products.catalogCta"
    // --- PricingPlansSection ---
    | "plans.kicker"
    | "plans.heading"
    | "plans.intro"
    | "plans.badgePopular"
    | "plans.viewAllCta"
    // --- ContactPage (page-level) ---
    | "contactPage.kicker"
    | "contactPage.heading"
    | "contactPage.intro"
    | "contactPage.cardsLead"
    | "contactPage.whatsTitle"
    | "contactPage.phoneTitle"
    | "contactPage.addressTitle"
    // --- AboutPage (page-level) ---
    | "aboutPage.kicker"
    | "aboutPage.heading"
    | "aboutPage.intro"
    | "aboutPage.servicesTitle"
    | "aboutPage.ctaTitle"
    | "aboutPage.ctaLead"
    | "aboutPage.ctaButton"
    // --- Service Detail Page ---
    | "service.kicker"
    | "service.heading"
    | "service.intro"
    | "service.priceHint"
    | "service.ctaTitle"
    | "service.ctaDesc"
    | "service.ctaWhatsapp"
    | "service.ctaPhone"




export type VariantFn = (ctx: LocalPageCtx) => TokenLine
export type ModeCopy = Partial<Record<CopyKey, VariantFn[]>>
