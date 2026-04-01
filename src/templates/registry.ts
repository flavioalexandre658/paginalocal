/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentType } from "react";
import type { TemplateSectionProps, TemplateSectionMap } from "./types";

type LazyImport = () => Promise<{ default: ComponentType<TemplateSectionProps> }>;

function lazySection(loader: () => Promise<unknown>): LazyImport {
  return () =>
    (loader() as Promise<{ default: ComponentType<TemplateSectionProps> }>).catch(() => ({
      default: (() => null) as unknown as ComponentType<TemplateSectionProps>,
    }));
}

/**
 * TEMPLATE_REGISTRY — mapeia templateId → blockType → variant → componente
 *
 * Cada template tem suas proprias secoes. Os variant numbers sao INTERNOS
 * ao template (Grovia hero 1 != Default hero 1).
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateSectionMap> = {
  aurora: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/header").then((m) => ({ default: m.GroviaHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/hero").then((m) => ({ default: m.GroviaHero }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/process").then((m) => ({ default: m.GroviaProcess }))),
      // @ts-ignore
      2: lazySection(() => import("./grovia/sections/features").then((m) => ({ default: m.GroviaFeatures }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/integrations").then((m) => ({ default: m.GroviaIntegrations }))),
    },
    pricing: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/pricing").then((m) => ({ default: m.GroivaPricing }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/testimonials").then((m) => ({ default: m.GroviaTestimonials }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/faq").then((m) => ({ default: m.GroviaFaq }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./grovia/sections/footer").then((m) => ({ default: m.GroviaFooter }))),
    },
    // Blocos universais (usam about/contact/cta/gallery defaults)
    about: {
      // @ts-ignore
      1: lazySection(() => import("@/components/site-renderer/blocks/about/about-story-block").then((m) => ({ default: m.AboutStoryBlock }))),
    },
    contact: {
      // @ts-ignore
      1: lazySection(() => import("@/components/site-renderer/blocks/contact/contact-minimal-card").then((m) => ({ default: m.ContactMinimalCard }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("@/components/site-renderer/blocks/cta/cta-card-floating").then((m) => ({ default: m.CtaCardFloating }))),
    },
    "whatsapp-float": {
      // @ts-ignore
      1: lazySection(() => import("@/components/site-renderer/blocks/whatsapp-float/whatsapp-pill").then((m) => ({ default: m.WhatsappPill }))),
    },
  },

  roofora: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/header").then((m) => ({ default: m.RooforaHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/hero").then((m) => ({ default: m.RooforaHero }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/about").then((m) => ({ default: m.RooforaAbout }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/services").then((m) => ({ default: m.RooforaServices }))),
      // @ts-ignore
      2: lazySection(() => import("./roofora/sections/how-works").then((m) => ({ default: m.RooforaHowWorks }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/stats").then((m) => ({ default: m.RooforaStats }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/gallery").then((m) => ({ default: m.RooforaGallery }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/testimonials").then((m) => ({ default: m.RooforaTestimonials }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/faq").then((m) => ({ default: m.RooforaFaq }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/cta").then((m) => ({ default: m.RooforaCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./roofora/sections/footer").then((m) => ({ default: m.RooforaFooter }))),
    },
  },

  plumbflow: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/header").then((m) => ({ default: m.PlumbflowHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/hero").then((m) => ({ default: m.PlumbflowHero }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/about").then((m) => ({ default: m.PlumbflowAbout }))),
    },
    contact: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/quick-form").then((m) => ({ default: m.PlumbflowQuickForm }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/stats").then((m) => ({ default: m.PlumbflowStats }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/services").then((m) => ({ default: m.PlumbflowServices }))),
      // @ts-ignore
      2: lazySection(() => import("./plumbflow/sections/process").then((m) => ({ default: m.PlumbflowProcess }))),
      // @ts-ignore
      3: lazySection(() => import("./plumbflow/sections/why-choose").then((m) => ({ default: m.PlumbflowWhyChoose }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/testimonials").then((m) => ({ default: m.PlumbflowTestimonials }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/gallery").then((m) => ({ default: m.PlumbflowGallery }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/cta").then((m) => ({ default: m.PlumbflowCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./plumbflow/sections/footer").then((m) => ({ default: m.PlumbflowFooter }))),
    },
  },
};

/**
 * Resolve um componente de secao para um template.
 * Retorna null se nao encontrar.
 */
export async function resolveTemplateSection(
  templateId: string,
  blockType: string,
  variant: number
): Promise<ComponentType<TemplateSectionProps> | null> {
  const template = TEMPLATE_REGISTRY[templateId];
  if (!template) return null;

  const blockVariants = template[blockType];
  if (!blockVariants) return null;

  const loader = blockVariants[variant] ?? blockVariants[1];
  if (!loader) return null;

  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}
