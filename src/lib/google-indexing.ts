import { google } from 'googleapis'

type IndexingType = 'URL_UPDATED' | 'URL_DELETED'

export interface IndexingResult {
  success: boolean
  url: string
  error?: string
}

export interface BatchIndexingResult {
  total: number
  success: number
  failed: number
  results: IndexingResult[]
}

function getServiceAccountCredentials() {
  const credentials = process.env.GOOGLE_INDEXING_CREDENTIALS

  if (!credentials) {
    return null
  }

  try {
    return JSON.parse(credentials)
  } catch {
    console.error('Failed to parse GOOGLE_INDEXING_CREDENTIALS')
    return null
  }
}

async function getAuthClient() {
  const credentials = getServiceAccountCredentials()

  if (!credentials) {
    return null
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/indexing'],
  })

  return auth
}

async function notifyGoogle(url: string, type: IndexingType): Promise<IndexingResult> {
  const auth = await getAuthClient()

  if (!auth) {
    console.warn('Google Indexing API not configured - skipping notification')
    return {
      success: false,
      url,
      error: 'Google Indexing API not configured',
    }
  }

  try {
    const indexing = google.indexing({ version: 'v3', auth })

    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type,
      },
    })

    console.log(`[Indexing] ${type} -> ${url}`)

    return {
      success: true,
      url,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[Indexing] Error for ${url}:`, errorMessage)

    return {
      success: false,
      url,
      error: errorMessage,
    }
  }
}

export async function notifyUrlUpdated(url: string): Promise<IndexingResult> {
  return notifyGoogle(url, 'URL_UPDATED')
}

export async function notifyUrlDeleted(url: string): Promise<IndexingResult> {
  return notifyGoogle(url, 'URL_DELETED')
}

export function buildStoreUrl(slug: string, customDomain?: string | null): string {
  if (customDomain) {
    return `https://${customDomain}`
  }

  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'
  return `https://${slug}.${mainDomain}`
}

export function buildServiceUrl(storeSlug: string, serviceSlug: string, customDomain?: string | null): string {
  const baseUrl = buildStoreUrl(storeSlug, customDomain)
  return `${baseUrl}/servicos/${serviceSlug}`
}

export function buildPageUrl(storeSlug: string, pageSlug: string, customDomain?: string | null): string {
  const baseUrl = buildStoreUrl(storeSlug, customDomain)
  return `${baseUrl}/${pageSlug}`
}

export async function notifyBatchUrlsUpdated(urls: string[]): Promise<BatchIndexingResult> {
  const results: IndexingResult[] = []

  for (const url of urls) {
    const result = await notifyUrlUpdated(url)
    results.push(result)
  }

  const success = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length

  console.log(`[Indexing] Batch complete: ${success}/${urls.length} URLs indexed successfully`)

  return {
    total: urls.length,
    success,
    failed,
    results,
  }
}

export async function notifyStoreActivated(
  slug: string,
  customDomain?: string | null,
  serviceSlugs?: string[],
  pageSlugs?: string[],
): Promise<BatchIndexingResult> {
  const urls: string[] = [buildStoreUrl(slug, customDomain)]

  if (serviceSlugs && serviceSlugs.length > 0) {
    for (const serviceSlug of serviceSlugs) {
      urls.push(buildServiceUrl(slug, serviceSlug, customDomain))
    }
  }

  if (pageSlugs && pageSlugs.length > 0) {
    for (const pageSlug of pageSlugs) {
      urls.push(buildPageUrl(slug, pageSlug, customDomain))
    }
  }

  const serviceCount = serviceSlugs?.length || 0
  const pageCount = pageSlugs?.length || 0
  console.log(`[Indexing] Indexing store "${slug}" with ${urls.length} URLs (1 store + ${serviceCount} services + ${pageCount} pages)`)
  return notifyBatchUrlsUpdated(urls)
}

export async function notifyStoreDeactivated(
  slug: string,
  customDomain?: string | null
): Promise<IndexingResult> {
  const url = buildStoreUrl(slug, customDomain)
  return notifyUrlDeleted(url)
}
