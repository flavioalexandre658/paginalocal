import type { Metadata } from "next";
import type { SiteBlueprint } from "@/types/ai-generation";
import { buildStoreUrl } from "@/lib/google-indexing";

const MAX_TITLE_LEN = 60;
const MAX_DESCRIPTION_LEN = 160;
const MAX_OG_DESCRIPTION_LEN = 200;

export interface StoreSeoInput {
  name: string;
  slug: string;
  category: string;
  city: string;
  state: string;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  customDomain?: string | null;
  faviconUrl?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  primaryColor?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  googleBusinessUrl?: string | null;
  website?: string | null;
  address?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  neighborhoods?: string[] | null;
  services?: string[] | null;
  siteBlueprintV2?: SiteBlueprint | null;
}

export interface PageSeoOverride {
  title?: string;
  description?: string;
  pathname?: string;
  imageUrl?: string;
  noindex?: boolean;
  keywords?: string[];
}

const FAVICON_FALLBACK = "/assets/images/icon/favicon.ico";

function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  const cut = input.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

function extractHeroImage(blueprint?: SiteBlueprint | null): string | null {
  if (!blueprint?.pages) return null;
  const homepage = blueprint.pages.find((p) => p.isHomepage) ?? blueprint.pages[0];
  if (!homepage?.sections) return null;

  const hero = homepage.sections.find((s) => s.blockType === "hero");
  const heroContent = hero?.content as Record<string, unknown> | undefined;
  const candidate =
    (heroContent?.backgroundImage as string | undefined) ||
    (heroContent?.image as string | undefined);
  if (candidate && typeof candidate === "string" && !candidate.startsWith("data:")) {
    return candidate;
  }

  const about = homepage.sections.find((s) => s.blockType === "about");
  const aboutContent = about?.content as Record<string, unknown> | undefined;
  const aboutImg =
    (aboutContent?.backgroundImage as string | undefined) ||
    (aboutContent?.image as string | undefined);
  if (aboutImg && typeof aboutImg === "string" && !aboutImg.startsWith("data:")) {
    return aboutImg;
  }

  return null;
}

function buildKeywords(input: StoreSeoInput, extra?: string[]): string[] {
  const set = new Set<string>();

  set.add(input.name);
  set.add(input.category);
  set.add(`${input.category} ${input.city}`);
  set.add(`${input.category} em ${input.city}`);
  set.add(`melhor ${input.category} ${input.city}`);
  set.add(`${input.category} próximo`);
  set.add(`${input.category} ${input.state}`);

  for (const n of input.neighborhoods?.slice(0, 5) ?? []) {
    set.add(`${input.category} ${n}`);
    set.add(`${input.category} em ${n}`);
  }
  for (const s of input.services?.slice(0, 8) ?? []) {
    set.add(s);
    set.add(`${s} ${input.city}`);
  }
  for (const e of extra ?? []) set.add(e);

  return Array.from(set)
    .filter(Boolean)
    .map((k) => k.trim())
    .filter((k) => k.length > 1 && k.length < 80)
    .slice(0, 16);
}

function buildSocialProfiles(input: StoreSeoInput): string[] {
  return [
    input.instagramUrl,
    input.facebookUrl,
    input.googleBusinessUrl,
    input.website,
  ].filter((u): u is string => typeof u === "string" && u.length > 0);
}

function defaultTitle(input: StoreSeoInput): string {
  return `${input.category} em ${input.city}, ${input.state} | ${input.name}`;
}

function defaultDescription(input: StoreSeoInput): string {
  const base = input.description?.trim();
  if (base && base.length >= 60) return truncate(base, MAX_DESCRIPTION_LEN);

  const services = input.services?.slice(0, 3).join(", ");
  const parts = [
    `${input.name}: ${input.category} em ${input.city}, ${input.state}.`,
  ];
  if (services) parts.push(`${services}.`);
  parts.push("Atendimento rápido pelo WhatsApp.");
  return truncate(parts.join(" "), MAX_DESCRIPTION_LEN);
}

/**
 * Helper central para gerar `Metadata` do Next.js para qualquer página
 * de `/site/[slug]/...`. Garante:
 *  - Título e descrição otimizados (com fallback inteligente).
 *  - Open Graph completo com imagem (hero do site → cover → OG dinâmica).
 *  - Twitter cards `summary_large_image`.
 *  - Canonical correto (custom domain ou subdomínio).
 *  - Robots avançado (max-image-preview: large, max-snippet: -1).
 *  - Geo metadata (region, position, ICBM).
 *  - Keywords contextuais por categoria + cidade + bairros + serviços.
 *  - Apple touch icons + theme-color.
 *  - Verification tags (Google).
 *
 * @param input  Dados da loja (vindos do `store` table + blueprint).
 * @param page   Override por-página: título, descrição, pathname extra.
 */
export function buildStoreMetadata(
  input: StoreSeoInput,
  page: PageSeoOverride = {}
): Metadata {
  const baseUrl = buildStoreUrl(input.slug, input.customDomain ?? undefined);
  const canonical = page.pathname ? `${baseUrl}${page.pathname}` : baseUrl;

  const title = truncate(
    page.title || input.seoTitle || defaultTitle(input),
    MAX_TITLE_LEN
  );
  const description = truncate(
    page.description || input.seoDescription || defaultDescription(input),
    MAX_DESCRIPTION_LEN
  );
  const ogDescription = truncate(
    page.description || input.seoDescription || defaultDescription(input),
    MAX_OG_DESCRIPTION_LEN
  );

  const heroImage = extractHeroImage(input.siteBlueprintV2);
  const ogImage =
    page.imageUrl ||
    heroImage ||
    input.coverUrl ||
    input.logoUrl ||
    `${baseUrl}/opengraph-image`;

  const favicon = input.faviconUrl || input.logoUrl || FAVICON_FALLBACK;

  const keywords = buildKeywords(input, page.keywords);
  const sameAs = buildSocialProfiles(input);

  const themeColor = input.primaryColor || undefined;

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    keywords,

    icons: {
      icon: favicon,
      apple: favicon,
      shortcut: favicon,
    },

    authors: [{ name: input.name, url: baseUrl }],
    creator: input.name,
    publisher: input.name,

    applicationName: input.name,
    referrer: "origin-when-cross-origin",

    metadataBase: new URL(baseUrl),

    robots: page.noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },

    alternates: { canonical },

    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      siteName: input.name,
      title,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${input.name} — ${input.category} em ${input.city}, ${input.state}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@decolou",
      creator: "@decolou",
      title,
      description: ogDescription,
      images: [
        {
          url: ogImage,
          alt: `${input.name} — ${input.category} em ${input.city}, ${input.state}`,
        },
      ],
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
        : undefined,
    },

    category: input.category,

    other: {
      "geo.region": `BR-${input.state}`,
      "geo.placename": input.city,
      ...(input.latitude && input.longitude
        ? {
            "geo.position": `${input.latitude};${input.longitude}`,
            ICBM: `${input.latitude}, ${input.longitude}`,
          }
        : {}),
      ...(themeColor ? { "theme-color": themeColor } : {}),
      ...(sameAs.length > 0 ? { "og:see_also": sameAs.join(", ") } : {}),
    },

    appleWebApp: {
      capable: true,
      title: input.name,
      statusBarStyle: "default",
    },

    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
  };

  return metadata;
}

/**
 * JSON-LD `WebPage` schema — adicional ao `LocalBusiness` já existente.
 * Útil para sub-páginas (sobre-nos, contato, catálogo) e para melhor
 * estruturação da homepage.
 */
export function buildWebPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  businessId: string;
  inLanguage?: string;
  breadcrumbId?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${input.url}#webpage`,
    url: input.url,
    name: input.name,
    description: input.description,
    inLanguage: input.inLanguage || "pt-BR",
    isPartOf: { "@id": `${input.url}/#website` },
    about: { "@id": input.businessId },
    ...(input.imageUrl
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: input.imageUrl,
            width: 1200,
            height: 630,
          },
        }
      : {}),
    ...(input.breadcrumbId
      ? { breadcrumb: { "@id": input.breadcrumbId } }
      : {}),
  };
}

/**
 * Adiciona `sameAs` (perfis sociais) ao schema `LocalBusiness` existente.
 * Use junto com `generateLocalBusinessJsonLd` em `lib/local-seo.ts`.
 */
export function buildSameAsArray(input: StoreSeoInput): string[] {
  return buildSocialProfiles(input);
}

export const SEO_LIMITS = {
  title: MAX_TITLE_LEN,
  description: MAX_DESCRIPTION_LEN,
  ogDescription: MAX_OG_DESCRIPTION_LEN,
};
