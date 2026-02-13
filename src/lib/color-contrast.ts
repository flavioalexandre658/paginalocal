function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '')
  return {
    r: parseInt(cleaned.substring(0, 2), 16),
    g: parseInt(cleaned.substring(2, 4), 16),
    b: parseInt(cleaned.substring(4, 6), 16),
  }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function isLightColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex)
  return relativeLuminance(r, g, b) > 0.179
}

export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#ffffff'
}

export function getContrastTextClass(hex: string): string {
  return isLightColor(hex) ? 'text-black' : 'text-white'
}

export function getContrastMutedClass(hex: string): string {
  return isLightColor(hex) ? 'text-black/80' : 'text-white/90'
}

export function getContrastBorderClass(hex: string): string {
  return isLightColor(hex) ? 'border-black/15' : 'border-white/20'
}

export function getContrastBadgeClasses(hex: string): string {
  return isLightColor(hex)
    ? 'border-black/15 bg-black/10 text-black'
    : 'border-white/25 bg-white/15 text-white'
}
