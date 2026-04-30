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
  id: string;
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
    .replace(/[̀-ͯ]/g, "");

  const key = Object.keys(NICHE_QUERIES).find(
    (k) =>
      normalized.includes(k.replace(/-/g, " ")) || k.includes(normalized)
  );

  const queries = key ? NICHE_QUERIES[key] : ["business professional interior"];
  return queries[Math.floor(Math.random() * queries.length)];
}

// Quando recebemos 429 na invocação atual, paramos de bater no Unsplash
// e deixamos o fallback (Gemini) cobrir o resto. Este flag vive enquanto
// a função serverless está quente.
let unsplashRateLimited = false;

interface SearchResult {
  photos: UnsplashPhoto[];
  rateLimited: boolean;
  remaining?: number;
}

async function searchUnsplash(
  query: string,
  count: number = 8,
  page: number = 1
): Promise<SearchResult> {
  if (!UNSPLASH_ACCESS_KEY) {
    return { photos: [], rateLimited: false };
  }
  if (unsplashRateLimited) {
    return { photos: [], rateLimited: true };
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${count}&page=${page}&orientation=landscape&content_filter=high`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
    });

    const remaining = Number(
      response.headers.get("x-ratelimit-remaining") ?? "-1"
    );

    if (response.status === 429) {
      unsplashRateLimited = true;
      console.error(
        `[Unsplash] 429 rate limit atingido (query="${query}"); pulando próximas requisições nesta invocação`
      );
      return { photos: [], rateLimited: true, remaining: 0 };
    }

    if (!response.ok) {
      const body = await response.text();
      console.error(
        `[Unsplash] API error ${response.status} (query="${query}"): ${body.slice(0, 200)}`
      );
      return { photos: [], rateLimited: false, remaining };
    }

    const data = (await response.json()) as { results: UnsplashPhoto[] };
    return { photos: data.results || [], rateLimited: false, remaining };
  } catch (err) {
    console.error(
      `[Unsplash] Fetch error (query="${query}"):`,
      err instanceof Error ? err.message : err
    );
    return { photos: [], rateLimited: false };
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.status}`);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// ── Contextual query builder ─────────────────────────────────────────────────

const ROLE_KEYWORDS: Record<string, string> = {
  team: "professional people working",
  about: "workspace interior modern",
  testimonials: "happy customer portrait",
  services: "service in action",
  hero: "lifestyle scene",
  gallery: "lifestyle detail",
  pricing: "modern workspace clean",
};

function isInformative(text: string | undefined): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  if (trimmed.length < 4) return false;
  const lower = trimmed.toLowerCase();
  // Reject the default placeholder used in DEFAULT_IMAGE_SPEC.
  if (lower.includes("business environment, professional setting")) return false;
  return true;
}

interface ContextualQueryInput {
  category: string;
  businessName?: string;
  services?: string[];
  imageHint?: string;
  blockType?: string;
  fieldPath?: string;
}

function buildContextualQuery(input: ContextualQueryInput): string {
  const parts: string[] = [];
  const blockType = input.blockType?.toLowerCase() || "";
  const fieldPath = input.fieldPath?.toLowerCase() || "";

  // Priority 1: explicit imageHint when informative
  if (isInformative(input.imageHint)) {
    parts.push(input.imageHint!);
  } else if (input.services && input.services.length > 0) {
    // Priority 2: use first service
    parts.push(input.services[0]);
  } else {
    // Priority 3: niche-specific query
    parts.push(getNicheQuery(input.category));
  }

  // Add a role keyword if we can detect one — adds visual variety
  const roleKey = Object.keys(ROLE_KEYWORDS).find(
    (k) => blockType.includes(k) || fieldPath.includes(k)
  );
  if (roleKey && !parts[0].toLowerCase().includes(roleKey)) {
    parts.push(ROLE_KEYWORDS[roleKey]);
  }

  return parts.join(" ").slice(0, 80);
}

// ── New slot-based public API ────────────────────────────────────────────────

export interface UnsplashSlotInput {
  id: string;
  blockType: string;
  fieldPath: string;
  aspectRatio: string;
  imageHint?: string;
}

export interface UnsplashSlotsContext {
  storeId: string;
  slots: UnsplashSlotInput[];
  category: string;
  businessName?: string;
  services?: string[];
}

/**
 * For each slot: build a contextual query + pick a photo with a random page
 * within Unsplash, dedupe across slots, download → optimize → upload to S3.
 * Returns a map { slotId → s3Url } only for slots that succeeded.
 */
async function processSingleSlot(
  slot: UnsplashSlotInput,
  index: number,
  ctx: UnsplashSlotsContext,
  usedPhotoIds: Set<string>
): Promise<{ slotId: string; url: string | null; rateLimited: boolean }> {
  const { storeId, category, businessName, services } = ctx;
  const query = buildContextualQuery({
    category,
    businessName,
    services,
    imageHint: slot.imageHint,
    blockType: slot.blockType,
    fieldPath: slot.fieldPath,
  });

  const page = (index % 3) + 1;
  const search = await searchUnsplash(query, 8, page);

  if (search.rateLimited) {
    return { slotId: slot.id, url: null, rateLimited: true };
  }

  const chosen = search.photos.find((p) => !usedPhotoIds.has(p.id));
  if (!chosen) {
    console.warn(
      `[Unsplash] slot=${slot.id} sem foto (query="${query}", page=${page}, results=${search.photos.length})`
    );
    return { slotId: slot.id, url: null, rateLimited: false };
  }
  usedPhotoIds.add(chosen.id);

  const isHero = slot.aspectRatio === "16:9";
  const imageUrl = isHero
    ? `${chosen.urls.raw}&w=1600&h=900&fit=crop&q=80`
    : `${chosen.urls.raw}&w=800&h=600&fit=crop&q=80`;

  try {
    const buffer = await downloadImage(imageUrl);
    const optimized = isHero
      ? await optimizeHeroImage(buffer)
      : await optimizeGalleryImage(buffer);

    const filename = `unsplash-${slot.blockType}-${index}`;
    const s3Key = generateS3Key(storeId, filename);
    const { url } = await uploadToS3(optimized.buffer, s3Key);
    return { slotId: slot.id, url, rateLimited: false };
  } catch (err) {
    console.error(
      `[Unsplash] slot=${slot.id} optimize/upload falhou:`,
      err instanceof Error ? err.message : err
    );
    return { slotId: slot.id, url: null, rateLimited: false };
  }
}

const UNSPLASH_CONCURRENCY = 3;

export async function fetchUnsplashForSlots(
  ctx: UnsplashSlotsContext
): Promise<Record<string, string>> {
  const start = Date.now();
  const { slots } = ctx;

  if (!UNSPLASH_ACCESS_KEY) {
    console.warn(
      "[Unsplash] UNSPLASH_ACCESS_KEY ausente — pulando geração de imagens via Unsplash"
    );
    return {};
  }

  console.log(
    `[Unsplash] iniciando ${slots.length} slot(s) com concorrência=${UNSPLASH_CONCURRENCY}`
  );

  const result: Record<string, string> = {};
  const usedPhotoIds = new Set<string>();
  let succeeded = 0;
  let failed = 0;

  for (let i = 0; i < slots.length; i += UNSPLASH_CONCURRENCY) {
    if (unsplashRateLimited) {
      console.warn(
        `[Unsplash] abortando: rate limit atingido. ${i}/${slots.length} processados`
      );
      break;
    }
    const chunk = slots.slice(i, i + UNSPLASH_CONCURRENCY);
    const chunkResults = await Promise.all(
      chunk.map((s, j) => processSingleSlot(s, i + j, ctx, usedPhotoIds))
    );
    for (const r of chunkResults) {
      if (r.url) {
        result[r.slotId] = r.url;
        succeeded++;
      } else {
        failed++;
      }
    }
  }

  console.log(
    `[Unsplash] concluído ${succeeded}/${slots.length} slots (${failed} falhas, rateLimited=${unsplashRateLimited}) em ${Date.now() - start}ms`
  );
  return result;
}

// ── Legacy API kept for backward compatibility ──────────────────────────────

export async function fetchAndSaveUnsplashImages(
  storeId: string,
  category: string,
  count: number = 6
): Promise<{ hero: string | null; gallery: string[] }> {
  const query = getNicheQuery(category);
  console.log(`[Unsplash] Searching for "${query}" (category: ${category}, count: ${count})`);

  const search = await searchUnsplash(query, count);

  if (search.photos.length === 0) {
    console.warn("[Unsplash] No photos found");
    return { hero: null, gallery: [] };
  }

  let heroUrl: string | null = null;
  const galleryUrls: string[] = [];

  for (let i = 0; i < search.photos.length; i++) {
    const photo = search.photos[i];
    const isHero = i === 0;
    const role = isHero ? "hero" : "gallery";

    try {
      const imageUrl = isHero
        ? `${photo.urls.raw}&w=1600&h=900&fit=crop&q=80`
        : `${photo.urls.raw}&w=800&h=600&fit=crop&q=80`;

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
    } catch (error) {
      console.error(
        `[Unsplash] legacy slot ${i} failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  return { hero: heroUrl, gallery: galleryUrls };
}
