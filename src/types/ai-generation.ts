import { z } from "zod";

export const BusinessContextSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  neighborhood: z.string().optional(),
  fullAddress: z.string().optional(),
  description: z.string().optional(),
  services: z.array(z.string()).default([]),
  differentials: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  tone: z.enum(["formal", "casual", "premium", "friendly"]).default("friendly"),
  pronoun: z.enum(["a", "o"]).default("a"),
  plurality: z.enum(["singular", "plural"]).default("singular"),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  googlePlaceId: z.string().optional(),
  reviews: z
    .array(
      z.object({
        text: z.string(),
        rating: z.number().min(1).max(5),
        author: z.string(),
        date: z.string().optional(),
      })
    )
    .default([]),
  photos: z.array(z.string()).default([]),
  hours: z.record(z.string(), z.string()).optional(),
  siteType: z.enum([
    "LOCAL_BUSINESS",
    "PRODUCT_CATALOG",
    "SERVICE_PRICING",
    "HYBRID",
  ]),
  products: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        category: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .optional(),
  plans: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        period: z.enum(["monthly", "yearly", "one-time"]).optional(),
        features: z.array(z.string()).optional(),
      })
    )
    .optional(),
});

export type BusinessContext = z.infer<typeof BusinessContextSchema>;

export const DesignTokensSchema = z.object({
  palette: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    textMuted: z.string(),
  }),
  fontPairing: z.enum([
    "inter+merriweather",
    "poppins+lora",
    "montserrat+opensans",
    "playfair+source-sans",
    "dm-sans+dm-serif",
    "raleway+roboto",
    "oswald+roboto",
    "space-grotesk+inter",
  ]),
  style: z.enum(["minimal", "bold", "elegant", "warm", "industrial"]),
  borderRadius: z.enum(["none", "sm", "md", "lg", "full"]),
  spacing: z.enum(["compact", "normal", "spacious"]).default("normal"),
});

export type DesignTokens = z.infer<typeof DesignTokensSchema>;

export const BlockTypeEnum = z.enum([
  "hero",
  "header",
  "footer",
  "about",
  "contact",
  "faq",
  "cta",
  "testimonials",
  "gallery",
  "team",
  "stats",
  "location",
  "hours",
  "whatsapp-float",
  "services",
  "catalog",
  "featured-products",
  "pricing",
  "menu",
]);

export type BlockType = z.infer<typeof BlockTypeEnum>;

export const HeroContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  tagline: z.string().default("Negocio local"),
  badgeText: z.string().default("Resultado garantido"),
  ctaText: z.string(),
  ctaLink: z.string().optional(),
  ctaType: z.enum(["whatsapp", "link", "scroll"]).default("whatsapp"),
  secondaryCtaText: z.string().optional(),
  secondaryCtaLink: z.string().optional(),
  backgroundImage: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1).default(0.5),
});

export const ServicesContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.string().optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional(),
      })
    )
    .min(1)
    .max(12),
});

export const AboutContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  paragraphs: z.array(z.string()).min(1).max(4),
  highlights: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  image: z.string().optional(),
});

export const TestimonialsContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        text: z.string(),
        author: z.string(),
        rating: z.number().min(1).max(5).optional(),
        role: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const GalleryContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string(),
        caption: z.string().optional(),
      })
    )
    .min(1)
    .max(20),
});

export const FaqContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .min(3)
    .max(10),
});

export const ContactContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  showMap: z.boolean().default(true),
  showForm: z.boolean().default(true),
  formFields: z
    .array(z.enum(["name", "email", "phone", "message"]))
    .default(["name", "email", "phone", "message"]),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  whatsapp: z.string().optional(),
});

export const CtaContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  ctaText: z.string(),
  ctaType: z.enum(["whatsapp", "link", "scroll"]).default("whatsapp"),
  ctaLink: z.string().optional(),
  backgroundColor: z
    .enum(["primary", "secondary", "accent", "gradient"])
    .default("primary"),
});

export const CatalogContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  categories: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        productCount: z.number().optional(),
      })
    )
    .min(1)
    .max(12),
  ctaText: z.string().default("Ver produtos"),
  ctaType: z.enum(["whatsapp", "link", "page"]).default("whatsapp"),
  layout: z.enum(["grid", "carousel", "list"]).default("grid"),
});

export const FeaturedProductsContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
        originalPrice: z.string().optional(),
        image: z.string().optional(),
        badge: z.string().optional(),
        ctaText: z.string().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const PricingContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  showBillingToggle: z.boolean().default(false),
  plans: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        priceAnnual: z.string().optional(),
        description: z.string(),
        features: z.array(z.string()),
        highlighted: z.boolean().default(false),
        ctaText: z.string(),
        ctaType: z.enum(["whatsapp", "link"]).default("whatsapp"),
      })
    )
    .min(2)
    .max(4),
});

export const MenuContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  categories: z
    .array(
      z.object({
        name: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            price: z.string(),
            image: z.string().optional(),
            badge: z.string().optional(),
          })
        ),
      })
    )
    .min(1),
});

export const TeamContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .min(1)
    .max(8),
});

export const StatsContentSchema = z.object({
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        icon: z.string().optional(),
      })
    )
    .min(2)
    .max(4),
});

export const LocationContentSchema = z.object({
  title: z.string(),
  address: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  instructions: z.string().optional(),
});

export const HoursContentSchema = z.object({
  title: z.string(),
  schedule: z.record(z.string(), z.string()),
  note: z.string().optional(),
});

export const HeaderContentSchema = z.object({
  storeName: z.string().optional(),
  logoUrl: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const FooterContentSchema = z.object({
  copyrightText: z.string().optional(),
  showSocial: z.boolean().default(true),
});

export const WhatsappFloatContentSchema = z.object({
  number: z.string(),
  message: z
    .string()
    .default("Olá! Vi seu site e gostaria de mais informações."),
  position: z
    .enum(["bottom-right", "bottom-left"])
    .default("bottom-right"),
});

export const CONTENT_SCHEMAS = {
  header: HeaderContentSchema,
  footer: FooterContentSchema,
  hero: HeroContentSchema,
  services: ServicesContentSchema,
  about: AboutContentSchema,
  testimonials: TestimonialsContentSchema,
  gallery: GalleryContentSchema,
  faq: FaqContentSchema,
  contact: ContactContentSchema,
  cta: CtaContentSchema,
  catalog: CatalogContentSchema,
  "featured-products": FeaturedProductsContentSchema,
  pricing: PricingContentSchema,
  menu: MenuContentSchema,
  team: TeamContentSchema,
  stats: StatsContentSchema,
  location: LocationContentSchema,
  hours: HoursContentSchema,
  "whatsapp-float": WhatsappFloatContentSchema,
} as const;

export type ContentForBlock<T extends BlockType> = z.infer<
  (typeof CONTENT_SCHEMAS)[T]
>;

export const SectionBlockSchema = z.object({
  id: z.string().uuid(),
  blockType: BlockTypeEnum,
  variant: z.number().min(1).max(5),
  content: z.record(z.string(), z.unknown()),
  order: z.number().min(0),
  visible: z.boolean().default(true),
});

export type SectionBlock = z.infer<typeof SectionBlockSchema>;

export const PageBlueprintSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: z.string(),
  metaDescription: z.string().max(160),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  sections: z.array(SectionBlockSchema),
  isHomepage: z.boolean().default(false),
});

export type PageBlueprint = z.infer<typeof PageBlueprintSchema>;

export const SiteBlueprintSchema = z.object({
  version: z.literal("2.0"),
  generatedAt: z.string().datetime(),
  siteType: z.enum([
    "LOCAL_BUSINESS",
    "PRODUCT_CATALOG",
    "SERVICE_PRICING",
    "HYBRID",
  ]),
  designTokens: DesignTokensSchema,
  globalContent: z.object({
    brandVoice: z.string(),
    tagline: z.string(),
    ctaDefaultText: z.string(),
    ctaDefaultType: z
      .enum(["whatsapp", "link", "scroll"])
      .default("whatsapp"),
    footerText: z.string().optional(),
    socialProof: z.string().optional(),
  }),
  pages: z.array(PageBlueprintSchema).min(1),
  navigation: z.array(
    z.object({
      label: z.string(),
      href: z.string(),
      isExternal: z.boolean().default(false),
    })
  ),
  jsonLd: z.object({
    type: z.string(),
    name: z.string(),
    description: z.string(),
    address: z.unknown().optional(),
    geo: z.unknown().optional(),
    telephone: z.string().optional(),
    openingHours: z.array(z.string()).optional(),
    priceRange: z.string().optional(),
  }),
});

export type SiteBlueprint = z.infer<typeof SiteBlueprintSchema>;
