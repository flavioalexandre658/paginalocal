export interface FontOption {
  slug: string
  name: string
  category: 'sans-serif' | 'serif' | 'display'
  weights: string[]
}

export const AVAILABLE_FONTS: FontOption[] = [
  { slug: 'inter', name: 'Inter', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'poppins', name: 'Poppins', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'open-sans', name: 'Open Sans', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'roboto', name: 'Roboto', category: 'sans-serif', weights: ['400', '500', '700', '900'] },
  { slug: 'montserrat', name: 'Montserrat', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'nunito', name: 'Nunito', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'raleway', name: 'Raleway', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'dm-sans', name: 'DM Sans', category: 'sans-serif', weights: ['400', '500', '600', '700'] },
  { slug: 'plus-jakarta-sans', name: 'Plus Jakarta Sans', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'work-sans', name: 'Work Sans', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'outfit', name: 'Outfit', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'playfair-display', name: 'Playfair Display', category: 'serif', weights: ['400', '500', '600', '700', '800'] },
  { slug: 'lora', name: 'Lora', category: 'serif', weights: ['400', '500', '600', '700'] },
  { slug: 'merriweather', name: 'Merriweather', category: 'serif', weights: ['400', '700'] },
  { slug: 'crimson-text', name: 'Crimson Text', category: 'serif', weights: ['400', '600', '700'] },
  { slug: 'bebas-neue', name: 'Bebas Neue', category: 'display', weights: ['400'] },
  { slug: 'oswald', name: 'Oswald', category: 'display', weights: ['400', '500', '600', '700'] },
]

export const DEFAULT_FONT_SLUG = 'inter'

export function getFontBySlug(slug: string | null | undefined): FontOption {
  if (!slug) return AVAILABLE_FONTS[0]
  return AVAILABLE_FONTS.find(f => f.slug === slug) || AVAILABLE_FONTS[0]
}

export function getGoogleFontUrl(fontName: string, weights: string[]): string {
  const family = fontName.replace(/\s+/g, '+')
  const wghts = weights.join(';')
  return `https://fonts.googleapis.com/css2?family=${family}:wght@${wghts}&display=swap`
}
