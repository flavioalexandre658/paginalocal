import type { DesignTokens } from "@/types/ai-generation"

const PAIRING_MAP: Record<string, { heading: string; body: string }> = {
  "inter+merriweather": { heading: "inter", body: "merriweather" },
  "poppins+lora": { heading: "poppins", body: "lora" },
  "montserrat+opensans": { heading: "montserrat", body: "open-sans" },
  "playfair+source-sans": { heading: "playfair-display", body: "source-sans" },
  "dm-sans+dm-serif": { heading: "dm-sans", body: "dm-serif-display" },
  "raleway+roboto": { heading: "raleway", body: "roboto" },
  "oswald+roboto": { heading: "oswald", body: "roboto" },
  "space-grotesk+inter": { heading: "space-grotesk", body: "inter" },
}

/**
 * Converts legacy fontPairing to headingFont/bodyFont.
 * Returns tokens unchanged if already migrated.
 */
export function migrateFontPairing(tokens: DesignTokens): DesignTokens {
  if (tokens.headingFont && tokens.bodyFont) return tokens

  const mapped = PAIRING_MAP[tokens.fontPairing ?? ""] ?? { heading: "inter", body: "inter" }
  return {
    ...tokens,
    headingFont: mapped.heading,
    bodyFont: mapped.body,
  }
}
