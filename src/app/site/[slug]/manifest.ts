import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface ManifestProps {
  params: Promise<{ slug: string }>
}

export default async function manifest({ params }: ManifestProps): Promise<MetadataRoute.Manifest> {
  const { slug } = await params

  const storeData = await db
    .select({
      name: store.name,
      description: store.description,
      category: store.category,
      city: store.city,
      primaryColor: store.primaryColor,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  const data = storeData[0]

  if (!data) {
    return {
      name: 'Página Local',
      short_name: 'PGL',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#3b82f6',
    }
  }

  const shortName = data.name.length > 12 ? data.name.substring(0, 12) : data.name
  const themeColor = data.primaryColor || '#3b82f6'

  return {
    name: data.name,
    short_name: shortName,
    description: data.description || `${data.category} em ${data.city}`,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: themeColor,
    orientation: 'portrait',
    categories: ['business', 'local'],
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
