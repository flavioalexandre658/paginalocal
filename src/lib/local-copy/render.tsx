// lib/local-seo/render.tsx
import React from "react"
import type { TokenLine } from "./types"

// ---------- render helper (mantém estilização) ----------
export function renderTokens(tokens: TokenLine) {
    return tokens.map((tk, i) => {
        if (tk.t === "text") return <React.Fragment key={i}>{tk.v}</React.Fragment>

        if (tk.t === "strong") {
            return (
                <strong key={i} className="font-semibold text-slate-900 dark:text-white">
                    {tk.v}
                </strong>
            )
        }

        if (tk.t === "normal") {
            return (
                <span key={i} className="font-normal">
                    {tk.v}
                </span>
            )
        }

        // primary
        return (
            <span key={i} className="text-primary font-semibold">
                {tk.v}
            </span>
        )
    })
}
