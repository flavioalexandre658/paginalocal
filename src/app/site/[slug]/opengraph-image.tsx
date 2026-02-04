import { ImageResponse } from 'next/og'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'edge'
export const alt = 'Preview da página'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

interface OGImageProps {
  params: Promise<{ slug: string }>
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params

  const storeData = await db
    .select({
      name: store.name,
      category: store.category,
      city: store.city,
      state: store.state,
      googleRating: store.googleRating,
      googleReviewsCount: store.googleReviewsCount,
      primaryColor: store.primaryColor,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  const data = storeData[0]

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: 'sans-serif',
          }}
        >
          <span style={{ fontSize: 48, color: '#64748b' }}>Página não encontrada</span>
        </div>
      ),
      { ...size }
    )
  }

  const rating = data.googleRating ? parseFloat(data.googleRating) : null
  const reviewCount = data.googleReviewsCount || 0

  const initials = data.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '60px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              backgroundColor: data.primaryColor || '#3b82f6',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {initials}
            </span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              margin: 0,
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            {data.name}
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: '#64748b',
              textAlign: 'center',
              margin: 0,
              marginBottom: '24px',
            }}
          >
            {data.category} em {data.city}, {data.state}
          </p>

          {rating && rating >= 4.0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                backgroundColor: '#fef3c7',
                borderRadius: '999px',
              }}
            >
              <span style={{ fontSize: '24px' }}>⭐</span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#92400e',
                }}
              >
                {rating.toFixed(1)} ({reviewCount} avaliações)
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 60px',
            backgroundColor: '#0f172a',
          }}
        >
          <span
            style={{
              fontSize: '20px',
              color: '#94a3b8',
            }}
          >
            paginalocal.com.br
          </span>
          <span
            style={{
              fontSize: '20px',
              color: '#10b981',
              fontWeight: 600,
            }}
          >
            Fale conosco pelo WhatsApp
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
