// lib/font-loader.ts
export function getSiteFontUrl(fontFamily?: string | null): string | null {
  const slug = fontFamily || 'inter'

  const fonts: Record<string, string> = {
    'inter': 'Inter:wght@400;500;600;700;800',
    'poppins': 'Poppins:wght@400;500;600;700;800',
    'open-sans': 'Open+Sans:wght@400;500;600;700;800',
    'roboto': 'Roboto:wght@400;500;700;900',
    'montserrat': 'Montserrat:wght@400;500;600;700;800',
    'nunito': 'Nunito:wght@400;500;600;700;800',
    'raleway': 'Raleway:wght@400;500;600;700;800',
    'dm-sans': 'DM+Sans:wght@400;500;600;700;800',
    'plus-jakarta-sans': 'Plus+Jakarta+Sans:wght@400;500;600;700;800',
    'work-sans': 'Work+Sans:wght@400;500;600;700;800',
    'outfit': 'Outfit:wght@400;500;600;700;800',
    'playfair-display': 'Playfair+Display:wght@400;500;600;700;800',
    'lora': 'Lora:wght@400;500;600;700',
    'merriweather': 'Merriweather:wght@400;700',
    'crimson-text': 'Crimson+Text:wght@400;600;700',
    'bebas-neue': 'Bebas+Neue:wght@400',
    'oswald': 'Oswald:wght@400;500;600;700',
  }

  const fontQuery = fonts[slug] || fonts['inter']
  return `https://fonts.googleapis.com/css2?family=${fontQuery}&display=optional`
}

export function getSiteFontFamily(fontFamily?: string | null): string {
  const slug = fontFamily || 'inter'

  const families: Record<string, string> = {
    'inter': 'Inter',
    'poppins': 'Poppins',
    'open-sans': 'Open Sans',
    'roboto': 'Roboto',
    'montserrat': 'Montserrat',
    'nunito': 'Nunito',
    'raleway': 'Raleway',
    'dm-sans': 'DM Sans',
    'plus-jakarta-sans': 'Plus Jakarta Sans',
    'work-sans': 'Work Sans',
    'outfit': 'Outfit',
    'playfair-display': 'Playfair Display',
    'lora': 'Lora',
    'merriweather': 'Merriweather',
    'crimson-text': 'Crimson Text',
    'bebas-neue': 'Bebas Neue',
    'oswald': 'Oswald',
  }

  return families[slug] || 'Inter'
}