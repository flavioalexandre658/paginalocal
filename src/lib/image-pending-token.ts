/**
 * Sentinel value used to mark image slots that are still being generated
 * by the AI pipeline. Stored in the blueprint as the slot's URL.
 *
 * The token is a self-contained data URI for an SVG that *looks* like a
 * skeleton: a soft warm-gray background ("#f5f5f4") with a centered,
 * pulsating "Gerando imagem…" label.  This means EVERY <img> in the
 * templates renders it correctly — no template-side changes required.
 *
 * Once the real image lands in S3, the pipeline replaces this token with
 * the real URL and the editor revalidates the page.
 */

const SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
  <defs>
    <linearGradient id='shimmer' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0%' stop-color='#f5f5f4'/>
      <stop offset='50%' stop-color='#ececea'/>
      <stop offset='100%' stop-color='#f5f5f4'/>
      <animate attributeName='x1' from='-1' to='1' dur='1.6s' repeatCount='indefinite'/>
      <animate attributeName='x2' from='0' to='2' dur='1.6s' repeatCount='indefinite'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#shimmer)'/>
  <g transform='translate(600,400)'>
    <rect x='-110' y='-22' width='220' height='44' rx='22' fill='rgba(255,255,255,0.85)' stroke='rgba(0,0,0,0.06)' stroke-width='1'/>
    <text x='0' y='6' fill='rgba(0,0,0,0.45)' font-family='system-ui,-apple-system,sans-serif' font-size='15' font-weight='500' text-anchor='middle'>Gerando imagem…</text>
  </g>
</svg>`;

const ENCODED = encodeURIComponent(SVG.replace(/\s+/g, " ").trim());

export const IMAGE_PENDING_TOKEN: string =
  `data:image/svg+xml;charset=utf-8,${ENCODED}`;

export function isPendingImage(value: unknown): boolean {
  return typeof value === "string" && value === IMAGE_PENDING_TOKEN;
}
