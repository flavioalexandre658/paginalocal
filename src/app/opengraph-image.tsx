import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "Decolou — Crie seu site profissional com IA em 30 segundos"
export const contentType = "image/png"
export const size = { width: 1200, height: 630 }

export default async function OGImage() {
  // Load Playfair Display font for heading
  const playfairFont = await fetch(
    "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtY.ttf"
  ).then((res) => res.arrayBuffer())

  // Load Inter for body text
  const interFont = await fetch(
    "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf"
  ).then((res) => res.arrayBuffer())


  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "60px",
            paddingRight: "20px",
          }}
        >
          {/* Brand name */}
          <span style={{ fontSize: "22px", fontWeight: 600, color: "rgba(0,0,0,0.8)", fontFamily: "Inter", letterSpacing: "-0.01em" }}>
            decolou
          </span>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(99,102,241,0.08)",
                borderRadius: "999px",
                padding: "6px 16px",
                alignSelf: "flex-start",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#6366f1", fontFamily: "Inter" }}>
                ✦ Inteligencia Artificial
              </span>
            </div>

            {/* Heading */}
            <span
              style={{
                fontSize: "52px",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "rgba(0,0,0,0.8)",
                maxWidth: "480px",
                fontFamily: "Playfair Display",
              }}
            >
              Crie seu site profissional em 30 segundos
            </span>

            {/* Subtitle */}
            <span style={{ fontSize: "17px", color: "rgba(0,0,0,0.45)", maxWidth: "400px", lineHeight: 1.5, fontFamily: "Inter" }}>
              Design, textos e SEO gerados por IA. Sem codigo, sem designer.
            </span>
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: "14px",
              padding: "14px 28px",
              alignSelf: "flex-start",
            }}
          >
            <span style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "Inter" }}>
              Comece gratis
            </span>
            <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", fontFamily: "Inter" }}>→</span>
          </div>
        </div>

        {/* Right column — site mockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "460px",
            justifyContent: "center",
            paddingRight: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "20px",
              border: "1px solid rgba(0,0,0,0.08)",
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.06)",
              backgroundColor: "#fff",
            }}
          >
            {/* Chrome bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                backgroundColor: "#fafafa",
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#f87171" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#fbbf24" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#34d399" }} />
              <div
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "160px",
                  height: "16px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,0,0,0.04)",
                }}
              />
            </div>

            {/* Nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 20px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ width: "90px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.08)" }} />
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ width: "44px", height: "10px", borderRadius: "5px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                <div style={{ width: "44px", height: "10px", borderRadius: "5px", backgroundColor: "rgba(0,0,0,0.05)" }} />
                <div style={{ width: "44px", height: "10px", borderRadius: "5px", backgroundColor: "rgba(0,0,0,0.05)" }} />
              </div>
            </div>

            {/* Hero */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(0,0,0,0.82), rgba(0,0,0,0.62))",
                padding: "48px 28px",
                gap: "12px",
              }}
            >
              <div style={{ width: "70px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.2)" }} />
              <div style={{ width: "220px", height: "20px", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.35)" }} />
              <div style={{ width: "150px", height: "12px", borderRadius: "6px", backgroundColor: "rgba(255,255,255,0.15)" }} />
              <div style={{ width: "110px", height: "32px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.8)", marginTop: "8px" }} />
            </div>

            {/* Content grid */}
            <div style={{ display: "flex", gap: "10px", padding: "16px" }}>
              <div style={{ flex: 1, height: "56px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.03)" }} />
              <div style={{ flex: 1, height: "56px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.03)" }} />
              <div style={{ flex: 1, height: "56px", borderRadius: "10px", backgroundColor: "rgba(0,0,0,0.03)" }} />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairFont,
          style: "normal",
          weight: 500,
        },
        {
          name: "Inter",
          data: interFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  )
}
