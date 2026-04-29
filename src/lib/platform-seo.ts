import type { Metadata } from "next";

const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "decolou.com";

export const PLATFORM = {
  name: "Decolou",
  domain: MAIN_DOMAIN,
  url: `https://${MAIN_DOMAIN}`,
  twitter: "@decolou",

  tagline: "A solução completa de IA para construção de negócios",
  shortPitch:
    "Lance um site, conquiste clientes e expanda seus negócios mais rapidamente com IA. Fique online em 30 segundos.",

  longPitch:
    "Plataforma all-in-one que usa inteligência artificial para criar sites profissionais, gerar conteúdo otimizado para SEO e atrair clientes — em 30 segundos. Construa, lance e expanda seu negócio sem código e sem designer.",

  positioningKeywords: [
    "construtor de sites com IA",
    "criador de sites com IA",
    "site com inteligência artificial",
    "criar site em 30 segundos",
    "plataforma all-in-one de negócios com IA",
    "site profissional com IA",
    "ferramenta de IA para criar site",
    "lançar negócio online com IA",
    "site otimizado para SEO com IA",
    "Decolou",
  ],
} as const;

export const PLATFORM_DEFAULT_TITLE =
  "Decolou — Construtor de sites com IA | Lance seu negócio em 30 segundos";

export const PLATFORM_DEFAULT_DESCRIPTION =
  "A solução completa de IA para construção de negócios. Lance um site, conquiste clientes e expanda mais rapidamente com IA — fique online em 30 segundos.";

export const PLATFORM_OG_IMAGE = "/opengraph-image";

export interface PlatformPageSeo {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Gera Metadata para QUALQUER página da plataforma Decolou (`/`,
 * `/planos`, `/sobre-nos`, `/contato`, `/ia-que-cria-sites`, etc).
 * Garante posicionamento consistente "construtor de negócios com IA"
 * em toda a aplicação.
 */
export function buildPlatformMetadata(page: PlatformPageSeo): Metadata {
  const url = page.path
    ? `${PLATFORM.url}${page.path.startsWith("/") ? page.path : "/" + page.path}`
    : PLATFORM.url;

  const ogImage = page.ogImage || `${PLATFORM.url}${PLATFORM_OG_IMAGE}`;

  const keywords = Array.from(
    new Set([...(page.keywords ?? []), ...PLATFORM.positioningKeywords])
  ).slice(0, 18);

  return {
    title: page.title,
    description: page.description,
    keywords,
    metadataBase: new URL(PLATFORM.url),

    applicationName: PLATFORM.name,
    creator: PLATFORM.name,
    publisher: PLATFORM.name,
    authors: [{ name: PLATFORM.name, url: PLATFORM.url }],
    referrer: "origin-when-cross-origin",

    alternates: { canonical: url },

    icons: {
      icon: "/assets/images/icon/favicon.ico",
      shortcut: "/assets/images/icon/favicon.ico",
      apple: "/assets/images/icon/icon.svg",
    },

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

    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: PLATFORM.name,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${PLATFORM.name} — ${PLATFORM.tagline}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: PLATFORM.twitter,
      creator: PLATFORM.twitter,
      title: page.title,
      description: page.description,
      images: [
        {
          url: ogImage,
          alt: `${PLATFORM.name} — ${PLATFORM.tagline}`,
        },
      ],
    },

    category: "Technology",

    other: {
      "X-DNS-Prefetch-Control": "on",
    },

    appleWebApp: {
      capable: true,
      title: PLATFORM.name,
      statusBarStyle: "default",
    },

    formatDetection: {
      telephone: true,
      email: true,
      address: false,
    },
  };
}

export const PLATFORM_JSON_LD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${PLATFORM.url}/#organization`,
  name: PLATFORM.name,
  url: PLATFORM.url,
  description: PLATFORM.longPitch,
  logo: {
    "@type": "ImageObject",
    url: `${PLATFORM.url}/assets/images/icon/icon.svg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://www.instagram.com/decolou",
    "https://www.facebook.com/decolou",
    "https://www.linkedin.com/company/decolou",
  ],
} as const;

export const PLATFORM_JSON_LD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${PLATFORM.url}/#website`,
  url: PLATFORM.url,
  name: PLATFORM.name,
  description: PLATFORM.longPitch,
  inLanguage: "pt-BR",
  publisher: { "@id": `${PLATFORM.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${PLATFORM.url}/buscar?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

export const PLATFORM_JSON_LD_SOFTWARE = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${PLATFORM.url}/#software`,
  name: PLATFORM.name,
  url: PLATFORM.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: PLATFORM.longPitch,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    description: "Plano gratuito disponível",
  },
  publisher: { "@id": `${PLATFORM.url}/#organization` },
} as const;
