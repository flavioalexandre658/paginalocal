import { ImageResponse } from 'next/og'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 32, height: 32 }

interface IconProps {
  params: Promise<{ slug: string }>
}

export default async function Icon({ params }: IconProps) {
  const { slug } = await params

  const storeData = await db
    .select({ name: store.name, primaryColor: store.primaryColor })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  const name = storeData[0]?.name || 'PL'
  const color = storeData[0]?.primaryColor || '#3b82f6'

  const initials = name
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
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: color,
          borderRadius: '6px',
          fontFamily: 'sans-serif',
        }}
      >
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.5px',
          }}
        >
          {initials}
        </span>
      </div>
    ),
    { ...size }
  )
}
