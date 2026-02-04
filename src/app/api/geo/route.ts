import { NextRequest, NextResponse } from 'next/server'

interface GeoResponse {
  city: string | null
  region: string | null
  country: string | null
}

export async function GET(request: NextRequest): Promise<NextResponse<GeoResponse>> {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || ''

  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return NextResponse.json({
      city: null,
      region: null,
      country: null,
    })
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      return NextResponse.json({
        city: null,
        region: null,
        country: null,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
    })
  } catch {
    return NextResponse.json({
      city: null,
      region: null,
      country: null,
    })
  }
}
