import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Página Local - Presença Digital para Negócios Locais'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default function OGImage() {
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
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              backgroundColor: '#3b82f6',
              marginBottom: '32px',
              boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 700,
                color: 'white',
              }}
            >
              PL
            </span>
          </div>

          <h1
            style={{
              fontSize: '52px',
              fontWeight: 700,
              color: '#0f172a',
              textAlign: 'center',
              margin: 0,
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Página Local
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: '#64748b',
              textAlign: 'center',
              margin: 0,
              marginBottom: '24px',
              maxWidth: '700px',
            }}
          >
            Presença Digital para Negócios Locais
          </p>

          <p
            style={{
              fontSize: '20px',
              color: '#94a3b8',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Seu negócio no topo do Google em minutos
          </p>
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
          <span style={{ fontSize: '20px', color: '#94a3b8' }}>
            paginalocal.com.br
          </span>
          <span style={{ fontSize: '20px', color: '#10b981', fontWeight: 600 }}>
            SEO Local Otimizado
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
