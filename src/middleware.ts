import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const NEW_DOMAIN = 'decolou.com'

const MAIN_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'decolou.com',
  process.env.NEXT_PUBLIC_MAIN_DOMAIN,
].filter(Boolean) as string[]

// Old domains that should 301 redirect to the new domain
const OLD_DOMAINS = [
  'paginalocal.com',
  'paginalocal.com.br',
  'www.paginalocal.com',
  'www.paginalocal.com.br',
]

const OLD_DOMAIN_SUFFIXES = [
  '.paginalocal.com',
  '.paginalocal.com.br',
]

const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'api', 'painel']

const STORE_REWRITABLE_PATHS = [
  '/sitemap.xml',
  '/robots.txt',
  '/manifest.webmanifest',
  '/favicon.ico',
]

const SOCIAL_CRAWLER_UA_TOKENS = [
  'facebookexternalhit',
  'facebot',
  'whatsapp',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'discordbot',
  'pinterestbot',
  'applebot',
  'iframely',
  'embedly',
  'skypeuripreview',
  'redditbot',
  'tumblr',
  'googlebot',
  'bingbot',
  'duckduckbot',
  'yandexbot',
]

function isSocialOrSearchBot(ua: string): boolean {
  if (!ua) return false
  const lower = ua.toLowerCase()
  return SOCIAL_CRAWLER_UA_TOKENS.some((t) => lower.includes(t))
}

interface DomainCacheEntry {
  slug: string | null
  timestamp: number
}

const domainCache = new Map<string, DomainCacheEntry>()
const CACHE_TTL = 1000 * 60 * 5
const ERROR_CACHE_TTL = 1000 * 30

async function resolveStoreSlug(domain: string, reqUrl: string): Promise<string | null> {
  const cached = domainCache.get(domain)

  if (cached) {
    if (cached.slug && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.slug
    }
    if (!cached.slug && Date.now() - cached.timestamp < ERROR_CACHE_TTL) {
      return null
    }
  }

  const url = new URL(reqUrl)
  const apiUrl = `${url.protocol}//${url.host}/api/domain/resolve?domain=${encodeURIComponent(domain)}`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      domainCache.set(domain, { slug: null, timestamp: Date.now() })
      return null
    }

    const data = await response.json()
    const slug = data?.slug || null

    domainCache.set(domain, { slug, timestamp: Date.now() })
    return slug
  } catch (error) {
    console.error('[Middleware] Error resolving domain:', error)
    const cachedEntry = domainCache.get(domain)
    if (cachedEntry?.slug) {
      return cachedEntry.slug
    }
    domainCache.set(domain, { slug: null, timestamp: Date.now() })
    return null
  }
}

/**
 * 301 redirect from old domain to new domain.
 * Preserves the full path and query string.
 * - paginalocal.com.br/planos → decolou.com/planos
 * - slug.paginalocal.com.br/about → slug.decolou.com/about
 */
function redirectOldDomain(request: NextRequest, cleanHost: string): NextResponse | null {
  // Skip redirects for API and static assets (avoid breaking existing integrations)
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return null
  }

  // Root old domain → new root domain
  if (OLD_DOMAINS.includes(cleanHost)) {
    const target = new URL(request.url)
    target.hostname = NEW_DOMAIN
    target.port = ''
    target.protocol = 'https:'
    return NextResponse.redirect(target.toString(), 301)
  }

  // Subdomain on old domain → same subdomain on new domain
  for (const suffix of OLD_DOMAIN_SUFFIXES) {
    if (cleanHost.endsWith(suffix)) {
      const subdomain = cleanHost.slice(0, -suffix.length)
      if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
        const target = new URL(request.url)
        target.hostname = `${subdomain}.${NEW_DOMAIN}`
        target.port = ''
        target.protocol = 'https:'
        return NextResponse.redirect(target.toString(), 301)
      }
      // Reserved subdomain on old domain → just redirect to new root
      const target = new URL(request.url)
      target.hostname = NEW_DOMAIN
      target.port = ''
      target.protocol = 'https:'
      return NextResponse.redirect(target.toString(), 301)
    }
  }

  return null
}

function extractSubdomain(host: string): string | null {
  const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0]

  if (cleanHost === 'decolou.com') {
    return null
  }

  if (cleanHost.endsWith('.decolou.com')) {
    const subdomain = cleanHost.replace('.decolou.com', '')
    return subdomain || null
  }

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0]
  const userAgent = request.headers.get('user-agent') || ''
  const isBot = isSocialOrSearchBot(userAgent)

  // Crawlers sociais/de busca em /robots.txt — atalho universal:
  // sempre responde permissivo (overrides cache e qualquer dynamic robots).
  // Garante que Facebook/WhatsApp não recebam 403 de bot protection.
  if (pathname === '/robots.txt' && isBot) {
    const isMain = MAIN_DOMAINS.some((d) => cleanHost === d)
    const body = isMain
      ? `User-agent: *\nAllow: /\nSitemap: https://decolou.com/sitemap.xml\n`
      : `User-agent: *\nAllow: /\n`
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'all',
      },
    })
  }

  // Skip static assets early
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    (pathname.includes('.') && !STORE_REWRITABLE_PATHS.includes(pathname))
  ) {
    return NextResponse.next()
  }

  // ── 301 redirect old domain → new domain ──
  const oldDomainRedirect = redirectOldDomain(request, cleanHost)
  if (oldDomainRedirect) {
    return oldDomainRedirect
  }

  // ── Normal routing on new domain ──
  const isMainDomain = MAIN_DOMAINS.some(d => cleanHost === d)
  const isSubdomain = cleanHost.endsWith('.decolou.com')

  let storeSlug: string | null = null
  let isCustomDomain = false

  if (isSubdomain) {
    const subdomain = extractSubdomain(cleanHost)

    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      storeSlug = subdomain
    }
  }

  if (!isMainDomain && !storeSlug) {
    storeSlug = await resolveStoreSlug(cleanHost, request.url)
    if (storeSlug) {
      isCustomDomain = true
    }
  }

  if (storeSlug) {
    if (pathname === '/favicon.ico') {
      return NextResponse.rewrite(new URL(`/api/stores/${storeSlug}/favicon`, request.url))
    }

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const adminPath = pathname.replace('/admin', '')
      const response = NextResponse.rewrite(new URL(`/painel/${storeSlug}${adminPath}`, request.url))
      response.headers.set('x-store-slug', storeSlug)
      if (isCustomDomain) {
        response.headers.set('x-custom-domain', cleanHost)
      }
      return response
    }

    const response = NextResponse.rewrite(new URL(`/site/${storeSlug}${pathname}`, request.url))
    response.headers.set('x-store-slug', storeSlug)
    if (isCustomDomain) {
      response.headers.set('x-custom-domain', cleanHost)
    }
    if (isBot) {
      response.headers.set('X-Robots-Tag', 'all')
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next).*)',
  ],
}
