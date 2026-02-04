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

const domainCache = new Map<string, { slug: string | null; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 5

async function resolveStoreSlug(domain: string, reqUrl: string): Promise<string | null> {
  const cached = domainCache.get(domain)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.slug
  }

  const url = new URL(reqUrl)
  const apiUrl = `${url.protocol}//${url.host}/api/domain/resolve?domain=${encodeURIComponent(domain)}`

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 300 } })
    const data = await response.json()
    const slug = data?.slug || null
    domainCache.set(domain, { slug, timestamp: Date.now() })
    return slug
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const cleanHost = host.toLowerCase().replace(/^www\./, '').split(':')[0]

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  const isMainDomain = MAIN_DOMAINS.some(d => cleanHost === d)
  const isSubdomain = cleanHost.endsWith('.paginalocal.com.br') || cleanHost.endsWith('.paginalocal.com')

  let storeSlug: string | null = null

  if (isSubdomain) {
    const parts = cleanHost.split('.')
    const sub = parts[0]

    if (!RESERVED_SUBDOMAINS.includes(sub)) {
      storeSlug = sub
    }
  }

  if (!isMainDomain && !storeSlug) {
    storeSlug = await resolveStoreSlug(cleanHost, request.url)
  }

  if (storeSlug) {
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const adminPath = pathname.replace('/admin', '')
      return NextResponse.rewrite(new URL(`/painel/${storeSlug}${adminPath}`, request.url))
    }

    const response = NextResponse.rewrite(new URL(`/site/${storeSlug}${pathname}`, request.url))
    response.headers.set('x-store-slug', storeSlug)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|.*\\..*).*)'],
}
