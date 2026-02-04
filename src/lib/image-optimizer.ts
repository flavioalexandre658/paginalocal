import sharp from 'sharp'

interface OptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

interface OptimizedImage {
  buffer: Buffer
  width: number
  height: number
  format: string
}

const DEFAULT_OPTIONS: OptimizeOptions = {
  maxWidth: 1200,
  maxHeight: 800,
  quality: 70,
}

export async function optimizeImage(
  inputBuffer: Buffer,
  options: OptimizeOptions = {}
): Promise<OptimizedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  const image = sharp(inputBuffer)
  const metadata = await image.metadata()

  let width = metadata.width || opts.maxWidth!
  let height = metadata.height || opts.maxHeight!

  if (width > opts.maxWidth! || height > opts.maxHeight!) {
    const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  const optimizedBuffer = await image
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: opts.quality,
      effort: 6,
      smartSubsample: true,
    })
    .toBuffer()

  const outputMetadata = await sharp(optimizedBuffer).metadata()

  return {
    buffer: optimizedBuffer,
    width: outputMetadata.width || width,
    height: outputMetadata.height || height,
    format: 'webp',
  }
}

export async function optimizeHeroImage(inputBuffer: Buffer): Promise<OptimizedImage> {
  return optimizeImage(inputBuffer, {
    maxWidth: 1600,
    maxHeight: 900,
    quality: 75,
  })
}

export async function optimizeGalleryImage(inputBuffer: Buffer): Promise<OptimizedImage> {
  return optimizeImage(inputBuffer, {
    maxWidth: 640,
    maxHeight: 480,
    quality: 70,
  })
}

export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
