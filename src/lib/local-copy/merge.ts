// lib/local-seo/merge.ts
import type { CopyKey, ModeCopy } from "./types"

export function mergeModeCopy(...packs: ModeCopy[]): ModeCopy {
    const out: ModeCopy = {}

    for (const pack of packs) {
        for (const k in pack) {
            out[k as CopyKey] = pack[k as CopyKey]
        }
    }

    return out
}
