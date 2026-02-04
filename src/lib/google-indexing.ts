import { google } from 'googleapis'

type IndexingType = 'URL_UPDATED' | 'URL_DELETED'

interface IndexingResult {
  success: boolean
  url: string
  error?: string
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

    console.log(`Google Indexing API: ${type} notification sent for ${url}`)

    return {
      success: true,
      url,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Google Indexing API error for ${url}:`, errorMessage)

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

export async function notifyStoreActivated(
  slug: string,
  customDomain?: string | null
): Promise<IndexingResult> {
  const url = buildStoreUrl(slug, customDomain)
  return notifyUrlUpdated(url)
}

export async function notifyStoreDeactivated(
  slug: string,
  customDomain?: string | null
): Promise<IndexingResult> {
  const url = buildStoreUrl(slug, customDomain)
  return notifyUrlDeleted(url)
}
