// lib/local-seo/seed.ts
import type { LocalPageCtx } from "./types"

export function hashString(str: string): number {
    let h = 0
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
    return h
}

export function seedFrom(ctx: Pick<LocalPageCtx, "id" | "slug">): string {
    if (ctx.id !== undefined && ctx.id !== null && String(ctx.id).trim()) return String(ctx.id)
    if (ctx.slug && String(ctx.slug).trim()) return String(ctx.slug)
    return "seed"
}

export function pickVariant<T>(seed: string, options: T[]): T {
    if (!options.length) throw new Error("pickVariant: options vazio")
    const h = hashString(seed)
    return options[h % options.length]
}

export function buildSeed(ctx: LocalPageCtx, key: string) {
    // seed “forte”: estável, mas varia por site+contexto+key
    return `${seedFrom(ctx)}:${ctx.mode}:${ctx.city}:${ctx.category}:${key}`
}
