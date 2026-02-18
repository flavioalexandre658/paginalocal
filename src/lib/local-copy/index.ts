// lib/local-seo/index.ts
import type { CopyKey, LocalPageCtx, ModeCopy, StoreMode, TokenLine } from "./types"
import { DEFAULT_COPY } from "./defaults.copy"
import { buildSeed, pickVariant } from "./seed"
import { mergeModeCopy } from "./merge"

// módulos por seção
import { ABOUT_DEFAULT, ABOUT_BY_MODE } from "./sections/about.copy"
import { AREAS_DEFAULT, AREAS_BY_MODE } from "./sections/areas.copy"
import { CONTACT_DEFAULT, CONTACT_BY_MODE } from "./sections/contact.copy" // ✅ ADD
import { FAQ_DEFAULT, FAQ_BY_MODE } from "./sections/faq.copy"
import { GALLERY_DEFAULT, GALLERY_BY_MODE } from "./sections/gallery.copy"
import { SERVICES_DEFAULT, SERVICES_BY_MODE } from "./sections/services.copy"
import { TESTIMONIALS_DEFAULT, TESTIMONIALS_BY_MODE } from "./sections/testimonials.copy"
import { PRODUCTS_DEFAULT, PRODUCTS_BY_MODE } from "./sections/products.copy"
import { PLANS_DEFAULT, PLANS_BY_MODE } from "./sections/plans.copy"

// cache por MODE
const TABLE_CACHE: Partial<Record<StoreMode, ModeCopy>> = {}

function buildCopyForMode(mode: StoreMode): ModeCopy {
    return mergeModeCopy(
        // 1) fallback global (garante que nada quebra)
        DEFAULT_COPY,

        // 2) defaults por seção (opcionais)
        ABOUT_DEFAULT,
        AREAS_DEFAULT,
        CONTACT_DEFAULT, // ✅ ADD
        FAQ_DEFAULT, // ✅ ADD
        GALLERY_DEFAULT, // ✅ ADD
        SERVICES_DEFAULT, // ✅ ADD
        TESTIMONIALS_DEFAULT, // ✅ ADD
        PRODUCTS_DEFAULT, // ✅ ADD
        PLANS_DEFAULT, // ✅ ADD

        // 3) overrides por seção e MODE
        ABOUT_BY_MODE[mode] ?? {},
        AREAS_BY_MODE[mode] ?? {},
        CONTACT_BY_MODE[mode] ?? {}, // ✅ ADD
        FAQ_BY_MODE[mode] ?? {}, // ✅ ADD
        GALLERY_BY_MODE[mode] ?? {}, // ✅ ADD
        PRODUCTS_BY_MODE[mode] ?? {}, // ✅ ADD
        SERVICES_BY_MODE[mode] ?? {}, // ✅ ADD
        TESTIMONIALS_BY_MODE[mode] ?? {}, // ✅ ADD
        PLANS_BY_MODE[mode] ?? {}, // ✅ ADD
    )
}

function getModeTable(mode: StoreMode): ModeCopy {
    return (TABLE_CACHE[mode] ??= buildCopyForMode(mode))
}

export function getCopy(ctx: LocalPageCtx, key: CopyKey): TokenLine {
    const seed = buildSeed(ctx, key)
    const table = getModeTable(ctx.mode)

    const options = table[key] ?? DEFAULT_COPY[key] ?? [() => [{ t: "text", v: "" }]]

    if (process.env.NODE_ENV !== "production" && options.length < 5) {
        // eslint-disable-next-line no-console
        console.warn(
            `[local-copy] key "${key}" em mode "${ctx.mode}" tem só ${options.length} variações (mín 5 recomendado).`
        )
    }

    return pickVariant(seed, options)(ctx)
}
