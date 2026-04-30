export type ImageSource = "unsplash" | "gemini"

const VALID_SOURCES: readonly ImageSource[] = ["unsplash", "gemini"] as const

const DEFAULT_PRIMARY: ImageSource = "unsplash"

function readPrimary(): ImageSource {
  const raw = (process.env.IMAGE_SOURCE_PRIMARY || "").trim().toLowerCase()
  if (VALID_SOURCES.includes(raw as ImageSource)) {
    return raw as ImageSource
  }
  return DEFAULT_PRIMARY
}

function readFallbackEnabled(): boolean {
  const raw = (process.env.IMAGE_SOURCE_FALLBACK_ENABLED || "true").trim().toLowerCase()
  return raw !== "false" && raw !== "0" && raw !== "off"
}

export function getPrimaryImageSource(): ImageSource {
  return readPrimary()
}

export function getFallbackImageSource(): ImageSource {
  return getPrimaryImageSource() === "gemini" ? "unsplash" : "gemini"
}

export function isFallbackEnabled(): boolean {
  return readFallbackEnabled()
}

export function isImageSourceEnabled(source: ImageSource): boolean {
  if (source === "gemini") {
    return (
      !!process.env.GEMINI_API_KEY && process.env.IMAGE_GEN_ENABLED !== "false"
    )
  }
  if (source === "unsplash") {
    return !!process.env.UNSPLASH_ACCESS_KEY
  }
  return false
}

export function describeImageSourceConfig(): string {
  const primary = getPrimaryImageSource()
  const fallback = getFallbackImageSource()
  const fallbackOn = isFallbackEnabled()
  const primaryReady = isImageSourceEnabled(primary)
  const fallbackReady = isImageSourceEnabled(fallback)
  return (
    `primary=${primary}(ready=${primaryReady}) ` +
    `fallback=${fallbackOn ? `${fallback}(ready=${fallbackReady})` : "off"}`
  )
}
