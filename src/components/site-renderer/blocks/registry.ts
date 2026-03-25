/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentType } from "react";
import type { BlockType } from "@/types/ai-generation";

type LazyImport = () => Promise<{ default: ComponentType<unknown> }>;

// Helper to create a lazy import that won't fail TypeScript compilation
// for modules that may not exist yet (created by other agents)
function lazyBlock(loader: () => Promise<unknown>): LazyImport {
  return () =>
    (loader() as Promise<{ default: ComponentType<unknown> }>).catch(() => ({
      default: (() => null) as unknown as ComponentType<unknown>,
    }));
}

export const BLOCK_REGISTRY: Record<BlockType, Record<number, LazyImport>> = {
  hero: {
    1: lazyBlock(() => import("./hero/hero-centered").then((m) => ({ default: m.HeroCentered }))),
    2: lazyBlock(() => import("./hero/hero-split-image").then((m) => ({ default: m.HeroSplitImage }))),
    3: lazyBlock(() => import("./hero/hero-video-background").then((m) => ({ default: m.HeroVideoBackground }))),
    4: lazyBlock(() => import("./hero/hero-minimal-text").then((m) => ({ default: m.HeroMinimalText }))),
    5: lazyBlock(() => import("./hero/hero-gradient-bold").then((m) => ({ default: m.HeroGradientBold }))),
  },
  services: {
    // @ts-ignore – module created by another agent
    1: lazyBlock(() => import("./services/services-icon-grid").then((m) => ({ default: m.ServicesIconGrid }))),
    // @ts-ignore
    2: lazyBlock(() => import("./services/services-alternating").then((m) => ({ default: m.ServicesAlternating }))),
    // @ts-ignore
    3: lazyBlock(() => import("./services/services-list-prices").then((m) => ({ default: m.ServicesListPrices }))),
    // @ts-ignore
    4: lazyBlock(() => import("./services/services-accordion").then((m) => ({ default: m.ServicesAccordion }))),
  },
  about: {
    // @ts-ignore
    1: lazyBlock(() => import("./about/about-story-block").then((m) => ({ default: m.AboutStoryBlock }))),
    // @ts-ignore
    2: lazyBlock(() => import("./about/about-mission-values").then((m) => ({ default: m.AboutMissionValues }))),
    // @ts-ignore
    3: lazyBlock(() => import("./about/about-timeline").then((m) => ({ default: m.AboutTimeline }))),
  },
  testimonials: {
    // @ts-ignore
    1: lazyBlock(() => import("./testimonials/testimonials-carousel").then((m) => ({ default: m.TestimonialsCarousel }))),
    // @ts-ignore
    2: lazyBlock(() => import("./testimonials/testimonials-grid").then((m) => ({ default: m.TestimonialsGrid }))),
    // @ts-ignore
    3: lazyBlock(() => import("./testimonials/testimonials-featured").then((m) => ({ default: m.TestimonialsFeatured }))),
  },
  gallery: {
    // @ts-ignore
    1: lazyBlock(() => import("./gallery/gallery-masonry").then((m) => ({ default: m.GalleryMasonry }))),
    // @ts-ignore
    2: lazyBlock(() => import("./gallery/gallery-grid-uniform").then((m) => ({ default: m.GalleryGridUniform }))),
    // @ts-ignore
    3: lazyBlock(() => import("./gallery/gallery-carousel-full").then((m) => ({ default: m.GalleryCarouselFull }))),
    // @ts-ignore
    4: lazyBlock(() => import("./gallery/gallery-before-after").then((m) => ({ default: m.GalleryBeforeAfter }))),
  },
  faq: {
    // @ts-ignore
    1: lazyBlock(() => import("./faq/faq-accordion").then((m) => ({ default: m.FaqAccordion }))),
    // @ts-ignore
    2: lazyBlock(() => import("./faq/faq-two-columns").then((m) => ({ default: m.FaqTwoColumns }))),
  },
  contact: {
    // @ts-ignore
    1: lazyBlock(() => import("./contact/contact-form-info").then((m) => ({ default: m.ContactFormInfo }))),
    // @ts-ignore
    2: lazyBlock(() => import("./contact/contact-split-map").then((m) => ({ default: m.ContactSplitMap }))),
    // @ts-ignore
    3: lazyBlock(() => import("./contact/contact-minimal-card").then((m) => ({ default: m.ContactMinimalCard }))),
  },
  cta: {
    // @ts-ignore
    1: lazyBlock(() => import("./cta/cta-banner").then((m) => ({ default: m.CtaBanner }))),
    // @ts-ignore
    2: lazyBlock(() => import("./cta/cta-gradient").then((m) => ({ default: m.CtaGradient }))),
    // @ts-ignore
    3: lazyBlock(() => import("./cta/cta-card-floating").then((m) => ({ default: m.CtaCardFloating }))),
  },
  catalog: {
    // @ts-ignore
    1: lazyBlock(() => import("./catalog/catalog-category-grid").then((m) => ({ default: m.CatalogCategoryGrid }))),
    // @ts-ignore
    2: lazyBlock(() => import("./catalog/catalog-product-grid").then((m) => ({ default: m.CatalogProductGrid }))),
    // @ts-ignore
    3: lazyBlock(() => import("./catalog/catalog-carousel").then((m) => ({ default: m.CatalogCarousel }))),
    // @ts-ignore
    4: lazyBlock(() => import("./catalog/catalog-list-categorized").then((m) => ({ default: m.CatalogListCategorized }))),
    // @ts-ignore
    5: lazyBlock(() => import("./catalog/catalog-masonry-showcase").then((m) => ({ default: m.CatalogMasonryShowcase }))),
  },
  "featured-products": {
    // @ts-ignore
    1: lazyBlock(() => import("./featured-products/featured-horizontal-scroll").then((m) => ({ default: m.FeaturedHorizontalScroll }))),
    // @ts-ignore
    2: lazyBlock(() => import("./featured-products/featured-highlight-grid").then((m) => ({ default: m.FeaturedHighlightGrid }))),
  },
  pricing: {
    // @ts-ignore
    1: lazyBlock(() => import("./pricing/pricing-cards").then((m) => ({ default: m.PricingCards }))),
    // @ts-ignore
    2: lazyBlock(() => import("./pricing/pricing-comparison").then((m) => ({ default: m.PricingComparison }))),
    // @ts-ignore
    3: lazyBlock(() => import("./pricing/pricing-simple-list").then((m) => ({ default: m.PricingSimpleList }))),
    // @ts-ignore
    4: lazyBlock(() => import("./pricing/pricing-toggle-cards").then((m) => ({ default: m.PricingToggleCards }))),
    // @ts-ignore
    5: lazyBlock(() => import("./pricing/pricing-feature-matrix").then((m) => ({ default: m.PricingFeatureMatrix }))),
  },
  menu: {
    // @ts-ignore
    1: lazyBlock(() => import("./menu/menu-categorized-list").then((m) => ({ default: m.MenuCategorizedList }))),
    // @ts-ignore
    2: lazyBlock(() => import("./menu/menu-cards-images").then((m) => ({ default: m.MenuCardsImages }))),
    // @ts-ignore
    3: lazyBlock(() => import("./menu/menu-tabs").then((m) => ({ default: m.MenuTabs }))),
  },
  team: {
    // @ts-ignore
    1: lazyBlock(() => import("./team/team-grid").then((m) => ({ default: m.TeamGrid }))),
    // @ts-ignore
    2: lazyBlock(() => import("./team/team-list").then((m) => ({ default: m.TeamList }))),
    // @ts-ignore
    3: lazyBlock(() => import("./team/team-featured").then((m) => ({ default: m.TeamFeatured }))),
  },
  stats: {
    // @ts-ignore
    1: lazyBlock(() => import("./stats/stats-counters").then((m) => ({ default: m.StatsCounters }))),
    // @ts-ignore
    2: lazyBlock(() => import("./stats/stats-cards").then((m) => ({ default: m.StatsCards }))),
  },
  location: {
    // @ts-ignore
    1: lazyBlock(() => import("./location/location-map-full").then((m) => ({ default: m.LocationMapFull }))),
    // @ts-ignore
    2: lazyBlock(() => import("./location/location-map-directions").then((m) => ({ default: m.LocationMapDirections }))),
  },
  hours: {
    // @ts-ignore
    1: lazyBlock(() => import("./hours/hours-table").then((m) => ({ default: m.HoursTable }))),
    // @ts-ignore
    2: lazyBlock(() => import("./hours/hours-visual").then((m) => ({ default: m.HoursVisual }))),
  },
  "whatsapp-float": {
    1: lazyBlock(() => import("./whatsapp-float/whatsapp-circle").then((m) => ({ default: m.WhatsappCircle }))),
    2: lazyBlock(() => import("./whatsapp-float/whatsapp-pill").then((m) => ({ default: m.WhatsappPill }))),
  },
  header: {
    // @ts-ignore
    1: lazyBlock(() => import("./header/header-transparent").then((m) => ({ default: m.HeaderTransparent }))),
    // @ts-ignore
    2: lazyBlock(() => import("./header/header-solid").then((m) => ({ default: m.HeaderSolid }))),
    // @ts-ignore
    3: lazyBlock(() => import("./header/header-minimal").then((m) => ({ default: m.HeaderMinimal }))),
    // @ts-ignore
    4: lazyBlock(() => import("./header/header-centered").then((m) => ({ default: m.HeaderCentered }))),
    // @ts-ignore
    5: lazyBlock(() => import("./header/header-split").then((m) => ({ default: m.HeaderSplit }))),
  },
  footer: {
    // @ts-ignore
    1: lazyBlock(() => import("./footer/footer-columns").then((m) => ({ default: m.FooterColumns }))),
    // @ts-ignore
    2: lazyBlock(() => import("./footer/footer-minimal").then((m) => ({ default: m.FooterMinimal }))),
    // @ts-ignore
    3: lazyBlock(() => import("./footer/footer-dark-premium").then((m) => ({ default: m.FooterDarkPremium }))),
    // @ts-ignore
    4: lazyBlock(() => import("./footer/footer-centered").then((m) => ({ default: m.FooterCentered }))),
    // @ts-ignore
    5: lazyBlock(() => import("./footer/footer-split").then((m) => ({ default: m.FooterSplit }))),
  },
};

export async function resolveBlock(
  blockType: BlockType,
  variant: number
): Promise<ComponentType<unknown> | null> {
  const blockVariants = BLOCK_REGISTRY[blockType];
  if (!blockVariants) return null;

  const loader = blockVariants[variant] ?? blockVariants[1];
  if (!loader) return null;

  try {
    const module = await loader();
    return module.default;
  } catch {
    return null;
  }
}
