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

  folioxa: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/header").then((m) => ({ default: m.FolioxaHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/hero").then((m) => ({ default: m.FolioxaHero }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/gallery").then((m) => ({ default: m.FolioxaGallery }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/about").then((m) => ({ default: m.FolioxaAbout }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/process").then((m) => ({ default: m.FolioxaProcess }))),
      // @ts-ignore
      2: lazySection(() => import("./folioxa/sections/services").then((m) => ({ default: m.FolioxaServices }))),
      // @ts-ignore
      3: lazySection(() => import("./folioxa/sections/how-works").then((m) => ({ default: m.FolioxaHowWorks }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/awards").then((m) => ({ default: m.FolioxaAwards }))),
    },
    pricing: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/pricing").then((m) => ({ default: m.FolioxaPricing }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/testimonials").then((m) => ({ default: m.FolioxaTestimonials }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/faq").then((m) => ({ default: m.FolioxaFaq }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/cta").then((m) => ({ default: m.FolioxaCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./folioxa/sections/footer").then((m) => ({ default: m.FolioxaFooter }))),
    },
  },

  bellezza: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/header").then((m) => ({ default: m.BellezzaHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/hero").then((m) => ({ default: m.BellezzaHero }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/about").then((m) => ({ default: m.BellezzaAbout }))),
    },
    catalog: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/catalog").then((m) => ({ default: m.BellezzaCatalog }))),
    },
    "featured-products": {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/bestsellers").then((m) => ({ default: m.BellezzaBestsellers }))),
      // @ts-ignore
      2: lazySection(() => import("./bellezza/sections/products").then((m) => ({ default: m.BellezzaProducts }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/benefits").then((m) => ({ default: m.BellezzaBenefits }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/blog").then((m) => ({ default: m.BellezzaBlog }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/instagram").then((m) => ({ default: m.BellezzaInstagram }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./bellezza/sections/footer").then((m) => ({ default: m.BellezzaFooter }))),
    },
  },

  vervedent: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/header").then((m) => ({ default: m.VerveHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/hero").then((m) => ({ default: m.VerveHero }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/about").then((m) => ({ default: m.VerveAbout }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/team").then((m) => ({ default: m.VerveTeam }))),
      // @ts-ignore
      2: lazySection(() => import("./vervedent/sections/services").then((m) => ({ default: m.VerveServices }))),
    },
    contact: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/contact").then((m) => ({ default: m.VerveContact }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/testimonials").then((m) => ({ default: m.VerveTestimonials }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/cta").then((m) => ({ default: m.VerveCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./vervedent/sections/footer").then((m) => ({ default: m.VerveFooter }))),
    },
  },

  realestic: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/header").then((m) => ({ default: m.RealesticHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/hero").then((m) => ({ default: m.RealesticHero }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/vision").then((m) => ({ default: m.RealesticVision }))),
      // @ts-ignore
      2: lazySection(() => import("./realestic/sections/features").then((m) => ({ default: m.RealesticFeatures }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/properties").then((m) => ({ default: m.RealesticProperties }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/quote").then((m) => ({ default: m.RealesticQuote }))),
      // @ts-ignore
      2: lazySection(() => import("./realestic/sections/testimonials").then((m) => ({ default: m.RealesticTestimonials }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/faq").then((m) => ({ default: m.RealesticFaq }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/about").then((m) => ({ default: m.RealesticAbout }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/blogs").then((m) => ({ default: m.RealesticBlogs }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/cta").then((m) => ({ default: m.RealesticCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./realestic/sections/footer").then((m) => ({ default: m.RealesticFooter }))),
    },
  },

  stratex: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/header").then((m) => ({ default: m.StratexHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/hero").then((m) => ({ default: m.StratexHero }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/partners").then((m) => ({ default: m.StratexPartners }))),
      // @ts-ignore
      2: lazySection(() => import("./stratex/sections/impacts").then((m) => ({ default: m.StratexImpacts }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/about").then((m) => ({ default: m.StratexAbout }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/features").then((m) => ({ default: m.StratexFeatures }))),
      // @ts-ignore
      2: lazySection(() => import("./stratex/sections/services").then((m) => ({ default: m.StratexServices }))),
      // @ts-ignore
      3: lazySection(() => import("./stratex/sections/how-works").then((m) => ({ default: m.StratexHowWorks }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/testimonials").then((m) => ({ default: m.StratexTestimonials }))),
    },
    pricing: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/pricing").then((m) => ({ default: m.StratexPricing }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/team").then((m) => ({ default: m.StratexTeam }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/faq").then((m) => ({ default: m.StratexFaq }))),
    },
    contact: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/contact").then((m) => ({ default: m.StratexContact }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./stratex/sections/footer").then((m) => ({ default: m.StratexFooter }))),
    },
  },

  cleanly: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/header").then((m) => ({ default: m.CleanlyHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/hero").then((m) => ({ default: m.CleanlyHero }))),
    },
    stats: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/partners").then((m) => ({ default: m.CleanlyPartners }))),
      // @ts-ignore
      2: lazySection(() => import("./cleanly/sections/stats").then((m) => ({ default: m.CleanlyStats }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/services").then((m) => ({ default: m.CleanlyServices }))),
      // @ts-ignore
      2: lazySection(() => import("./cleanly/sections/how-works").then((m) => ({ default: m.CleanlyHowWorks }))),
      // @ts-ignore
      3: lazySection(() => import("./cleanly/sections/benefits").then((m) => ({ default: m.CleanlyBenefits }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/about").then((m) => ({ default: m.CleanlyAbout }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/testimonials").then((m) => ({ default: m.CleanlyTestimonials }))),
    },
    faq: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/faq").then((m) => ({ default: m.CleanlyFaq }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/cta").then((m) => ({ default: m.CleanlyCta }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./cleanly/sections/footer").then((m) => ({ default: m.CleanlyFooter }))),
    },
  },

  larko: {
    header: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/header").then((m) => ({ default: m.LarkoHeader }))),
    },
    hero: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/hero").then((m) => ({ default: m.LarkoHero }))),
    },
    services: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/services").then((m) => ({ default: m.LarkoServices }))),
      // @ts-ignore
      2: lazySection(() => import("./larko/sections/solutions").then((m) => ({ default: m.LarkoSolutions }))),
    },
    gallery: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/gallery").then((m) => ({ default: m.LarkoGallery }))),
    },
    about: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/about").then((m) => ({ default: m.LarkoAbout }))),
    },
    cta: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/cta").then((m) => ({ default: m.LarkoCta }))),
    },
    testimonials: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/testimonials").then((m) => ({ default: m.LarkoTestimonials }))),
    },
    contact: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/contact").then((m) => ({ default: m.LarkoContact }))),
    },
    footer: {
      // @ts-ignore
      1: lazySection(() => import("./larko/sections/footer").then((m) => ({ default: m.LarkoFooter }))),
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
