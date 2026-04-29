import { ImageResponse } from "next/og";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { SiteBlueprint } from "@/types/ai-generation";

export const runtime = "edge";
export const alt = "Preview do site";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

interface OGImageProps {
  params: Promise<{ slug: string }>;
}

function extractHero(
  blueprint?: SiteBlueprint | null
): { headline?: string; subheadline?: string; image?: string } {
  if (!blueprint?.pages) return {};
  const homepage = blueprint.pages.find((p) => p.isHomepage) ?? blueprint.pages[0];
  const hero = homepage?.sections?.find((s) => s.blockType === "hero");
  const c = hero?.content as Record<string, unknown> | undefined;
  if (!c) return {};
  const headline = (c.headline as string) || (c.title as string) || undefined;
  const subheadline =
    (c.subheadline as string) || (c.subtitle as string) || (c.tagline as string) || undefined;
  const imgRaw =
    (c.backgroundImage as string) || (c.image as string) || undefined;
  const image =
    typeof imgRaw === "string" && !imgRaw.startsWith("data:") ? imgRaw : undefined;
  return { headline, subheadline, image };
}

function stripAccentMarkers(input?: string): string {
  if (!input) return "";
  return input.replace(/\*([^*]+)\*/g, "$1");
}

export default async function OGImage({ params }: OGImageProps) {
  const { slug } = await params;

  const storeData = await db
    .select({
      name: store.name,
      category: store.category,
      city: store.city,
      state: store.state,
      googleRating: store.googleRating,
      googleReviewsCount: store.googleReviewsCount,
      primaryColor: store.primaryColor,
      secondaryColor: store.secondaryColor,
      accentColor: store.accentColor,
      logoUrl: store.logoUrl,
      coverUrl: store.coverUrl,
      siteBlueprintV2: store.siteBlueprintV2,
    })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1);

  const data = storeData[0];

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fafaf9",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 48, color: "#737373" }}>
            Página não encontrada
          </span>
        </div>
      ),
      { ...size }
    );
  }

  const blueprint = data.siteBlueprintV2 as SiteBlueprint | null;
  const hero = extractHero(blueprint);

  const heroImage = hero.image || data.coverUrl || null;
  const headline = stripAccentMarkers(hero.headline) || data.name;
  const subheadline =
    stripAccentMarkers(hero.subheadline) ||
    `${data.category} em ${data.city}, ${data.state}`;

  const primary = data.primaryColor || "#0f172a";
  const accent = data.accentColor || data.primaryColor || "#22c55e";

  const rating = data.googleRating ? parseFloat(data.googleRating) : null;
  const reviewCount = data.googleReviewsCount || 0;

  if (heroImage) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            backgroundColor: primary,
            fontFamily: "sans-serif",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "60px",
              width: "100%",
              gap: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.18)",
                color: "#fff",
                borderRadius: 999,
                fontSize: 22,
                fontWeight: 500,
                width: "fit-content",
                backdropFilter: "blur(10px)",
              }}
            >
              {data.category} · {data.city}, {data.state}
            </div>

            <h1
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                textShadow: "0 4px 32px rgba(0,0,0,0.4)",
              }}
            >
              {headline}
            </h1>

            <p
              style={{
                fontSize: 28,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
                lineHeight: 1.3,
                maxWidth: 900,
                textShadow: "0 2px 16px rgba(0,0,0,0.4)",
              }}
            >
              {subheadline}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 24,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: "#fff",
                    fontSize: 28,
                    fontWeight: 700,
                    color: primary,
                  }}
                >
                  {data.name.charAt(0).toUpperCase()}
                </div>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  {data.name}
                </span>
              </div>

              {rating && rating >= 4 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    background: "rgba(255,255,255,0.95)",
                    borderRadius: 999,
                    color: primary,
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  ⭐ {rating.toFixed(1)} · {reviewCount} avaliações
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 18px",
                    background: accent,
                    borderRadius: 999,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  Fale conosco no WhatsApp
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fafaf9",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: "60px",
            background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 132,
              height: 132,
              borderRadius: 28,
              backgroundColor: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              marginBottom: 36,
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {data.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <h1
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              margin: 0,
              marginBottom: 16,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {data.name}
          </h1>

          <p
            style={{
              fontSize: 30,
              color: "rgba(255,255,255,0.92)",
              textAlign: "center",
              margin: 0,
              marginBottom: 32,
            }}
          >
            {data.category} em {data.city}, {data.state}
          </p>

          {rating && rating >= 4 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 28px",
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 999,
                color: primary,
              }}
            >
              <span style={{ fontSize: 24 }}>⭐</span>
              <span style={{ fontSize: 24, fontWeight: 600 }}>
                {rating.toFixed(1)} · {reviewCount} avaliações
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 60px",
            backgroundColor: "#0f172a",
          }}
        >
          <span style={{ fontSize: 20, color: "#94a3b8" }}>decolou.com</span>
          <span
            style={{
              fontSize: 20,
              color: accent,
              fontWeight: 600,
            }}
          >
            Fale conosco pelo WhatsApp
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
