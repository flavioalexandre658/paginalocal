import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MAIN_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'paginalocal.com.br',
  'paginalocal.com',
  process.env.NEXT_PUBLIC_MAIN_DOMAIN,
].filter(Boolean) as string[]

const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'api', 'painel']

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

function extractSubdomain(host: string): string | null {
  const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0]

  if (cleanHost === 'paginalocal.com' || cleanHost === 'paginalocal.com.br') {
    return null
  }

  if (cleanHost.endsWith('.paginalocal.com.br')) {
    const subdomain = cleanHost.replace('.paginalocal.com.br', '')
    return subdomain || null
  }

  if (cleanHost.endsWith('.paginalocal.com')) {
    const subdomain = cleanHost.replace('.paginalocal.com', '')
    return subdomain || null
  }

  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0]

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const isMainDomain = MAIN_DOMAINS.some(d => cleanHost === d)
  const isSubdomain = cleanHost.endsWith('.paginalocal.com.br') || cleanHost.endsWith('.paginalocal.com')

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
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
