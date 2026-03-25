import { uploadToS3, generateS3Key } from "@/lib/s3";
import { optimizeHeroImage, optimizeGalleryImage } from "@/lib/image-optimizer";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || "";

const NICHE_QUERIES: Record<string, string[]> = {
  "lava-car": ["car detailing professional", "car wash premium", "auto detailing studio"],
  "estetica-automotiva": ["car polish professional", "auto detailing"],
  barbearia: ["barber shop interior", "men haircut professional", "barber chair"],
  restaurante: ["restaurant interior elegant", "food plating professional"],
  pizzaria: ["pizza oven restaurant", "italian restaurant interior"],
  hamburgueria: ["gourmet burger", "burger restaurant interior"],
  clinica: ["medical clinic modern", "healthcare interior clean"],
  dentista: ["dental office modern", "dentist clinic interior"],
  academia: ["gym interior modern", "fitness equipment", "crossfit box"],
  salao: ["beauty salon interior", "hair styling professional"],
  spa: ["spa interior luxury", "massage room", "wellness center"],
  advocacia: ["law office interior", "modern office professional"],
  floricultura: ["flower shop colorful", "flower arrangement"],
  oficina: ["auto repair shop", "mechanic professional"],
  borracharia: ["tire shop professional", "wheel alignment"],
  "pet-shop": ["pet grooming professional", "pet store interior"],
  hotel: ["luxury hotel room", "hotel lobby elegant"],
  pousada: ["cozy inn room", "bed breakfast interior"],
  fotografo: ["photography studio", "camera equipment professional"],
  padaria: ["bakery interior", "fresh bread artisan"],
  cafeteria: ["coffee shop interior", "barista coffee"],
  "loja-roupas": ["clothing store interior", "fashion boutique"],
  imobiliaria: ["real estate modern", "house interior design"],
  escola: ["school classroom modern", "education learning"],
  farmacia: ["pharmacy modern interior", "drugstore clean"],
  contabilidade: ["accounting office", "financial workspace"],
  "parque-aquatico": ["water park fun", "water slides", "aqua park"],
};

interface UnsplashPhoto {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
  };
  alt_description: string | null;
  description: string | null;
}

function getNicheQuery(category: string): string {
  const normalized = category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const key = Object.keys(NICHE_QUERIES).find(
    (k) =>
      normalized.includes(k.replace(/-/g, " ")) || k.includes(normalized)
  );

  const queries = key ? NICHE_QUERIES[key] : ["business professional interior"];
  return queries[Math.floor(Math.random() * queries.length)];
}

async function searchUnsplash(
  query: string,
  count: number = 1
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("[Unsplash] No access key configured");
    return [];
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (!response.ok) {
    console.error("[Unsplash] API error:", response.status, await response.text());
    return [];
  }

  const data = (await response.json()) as { results: UnsplashPhoto[] };
  return data.results || [];
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function fetchAndSaveUnsplashImages(
  storeId: string,
  category: string,
  count: number = 6
): Promise<{ hero: string | null; gallery: string[] }> {
  const query = getNicheQuery(category);
  console.log(`[Unsplash] Searching for "${query}" (category: ${category}, count: ${count})`);

  const photos = await searchUnsplash(query, count);

  if (photos.length === 0) {
    console.warn("[Unsplash] No photos found");
    return { hero: null, gallery: [] };
  }

  let heroUrl: string | null = null;
  const galleryUrls: string[] = [];

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const isHero = i === 0;
    const role = isHero ? "hero" : "gallery";

    try {
      const imageUrl = isHero
        ? `${photo.urls.raw}&w=1600&h=900&fit=crop&q=80`
        : `${photo.urls.raw}&w=800&h=600&fit=crop&q=80`;

      console.log(`[Unsplash] Downloading photo ${i + 1}/${photos.length} (${role})...`);
      const buffer = await downloadImage(imageUrl);

      const optimized = isHero
        ? await optimizeHeroImage(buffer)
        : await optimizeGalleryImage(buffer);

      const filename = `unsplash-${role}-${i}`;
      const s3Key = generateS3Key(storeId, filename);
      const { url } = await uploadToS3(optimized.buffer, s3Key);

      if (isHero) {
        heroUrl = url;
      } else {
        galleryUrls.push(url);
      }

      console.log(`[Unsplash] Photo ${i + 1} saved to S3 (${role})`);
    } catch (error) {
      console.error(
        `[Unsplash] Failed to process photo ${i + 1}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[Unsplash] Complete: hero=${heroUrl ? "yes" : "no"}, gallery=${galleryUrls.length}`
  );
  return { hero: heroUrl, gallery: galleryUrls };
}
