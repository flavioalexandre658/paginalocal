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

async function searchUnsplash(
  query: string,
  count: number = 1,
  page: number = 1
): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn("[Unsplash] No access key configured");
    return [];
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=${count}&page=${page}&orientation=landscape&content_filter=high`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  });

  if (!response.ok) {
    console.error(
      "[Unsplash] API error:",
      response.status,
      await response.text()
    );
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
export async function fetchUnsplashForSlots(
  ctx: UnsplashSlotsContext
): Promise<Record<string, string>> {
  const { storeId, slots, category, businessName, services } = ctx;
  const result: Record<string, string> = {};
  const usedPhotoIds = new Set<string>();

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const query = buildContextualQuery({
      category,
      businessName,
      services,
      imageHint: slot.imageHint,
      blockType: slot.blockType,
      fieldPath: slot.fieldPath,
    });

    // Random page 1..5 for diversity. Use slot index for deterministic offset.
    const page = ((i + Math.floor(Math.random() * 5)) % 5) + 1;

    try {
      const photos = await searchUnsplash(query, 8, page);
      const fresh = photos.find((p) => !usedPhotoIds.has(p.id));
      if (!fresh) {
        console.warn(
          `[Unsplash] no fresh photo for slot=${slot.id} (query="${query}", page=${page})`
        );
        continue;
      }
      usedPhotoIds.add(fresh.id);

      const isHero = slot.aspectRatio === "16:9";
      const imageUrl = isHero
        ? `${fresh.urls.raw}&w=1600&h=900&fit=crop&q=80`
        : `${fresh.urls.raw}&w=800&h=600&fit=crop&q=80`;

      const buffer = await downloadImage(imageUrl);
      const optimized = isHero
        ? await optimizeHeroImage(buffer)
        : await optimizeGalleryImage(buffer);

      const filename = `unsplash-${slot.blockType}-${i}`;
      const s3Key = generateS3Key(storeId, filename);
      const { url } = await uploadToS3(optimized.buffer, s3Key);
      result[slot.id] = url;
    } catch (err) {
      console.error(
        `[Unsplash] slot ${slot.id} failed (query="${query}"):`,
        err instanceof Error ? err.message : err
      );
    }
  }

  console.log(
    `[Unsplash] slot-based: ${Object.keys(result).length}/${slots.length} succeeded`
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
