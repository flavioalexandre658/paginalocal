// lib/font-loader.ts
import { getFontBySlug, type FontOption } from "./fonts"

export function getSiteFontUrl(fontFamily?: string | null): string | null {
  const slug = fontFamily || "inter"
  const font = getFontBySlug(slug)

  if (!font) {
    // Fallback to Inter from Google
    return "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=optional"
  }

  // Local fonts don't need a Google Fonts URL
  if (font.source === "local") return null

  // Google fonts: build the URL
  const family = font.name.replace(/\s+/g, "+")
  const wghts = font.weights.join(";")
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${wghts}&display=optional`
}

export function getSiteFontFamily(fontFamily?: string | null): string {
  const slug = fontFamily || "inter"
  const font = getFontBySlug(slug)
  return font?.name ?? "Inter"
}
