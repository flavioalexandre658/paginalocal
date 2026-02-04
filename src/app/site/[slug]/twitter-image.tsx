import { ImageResponse } from 'next/og'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'edge'
export const alt = 'Preview da página'
export const contentType = 'image/png'
export const size = { width: 1200, height: 600 }

interface TwitterImageProps {
  params: Promise<{ slug: string }>
}

export default async function TwitterImage({ params }: TwitterImageProps) {
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
          backgroundColor: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
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
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                backgroundColor: data.primaryColor || '#3b82f6',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                {initials}
              </span>
            </div>

            {rating && rating >= 4.0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '999px',
                }}
              >
                <span style={{ fontSize: '18px' }}>⭐</span>
                <span
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#92400e',
                  }}
                >
                  {rating.toFixed(1)} ({reviewCount})
                </span>
              </div>
            )}
          </div>

          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              marginBottom: '12px',
              lineHeight: 1.2,
            }}
          >
            {data.name}
          </h1>

          <p
            style={{
              fontSize: '24px',
              color: '#64748b',
              margin: 0,
              marginBottom: '32px',
            }}
          >
            {data.category} em {data.city}, {data.state}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              backgroundColor: '#10b981',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '20px', color: 'white', fontWeight: 600 }}>
              Fale no WhatsApp
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            width: '200px',
            backgroundColor: '#0f172a',
            padding: '24px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              color: '#94a3b8',
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            paginalocal.com.br
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
