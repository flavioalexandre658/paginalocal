# Rebrand: Decolou → Decolou

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename the brand from "Decolou" / "decolou.com" to "Decolou" / "decolou.com" across the entire codebase, while preserving backward compatibility for existing customer sites on decolou.com subdomains.

**Architecture:**
- Phase 1: Environment + middleware (backward-compat redirects for old domain)
- Phase 2: Core brand text (user-facing strings)
- Phase 3: SEO metadata + schema.org
- Phase 4: Code references (utils, auth, checkout)
- Phase 5: Seed data + admin
- Phase 6: Documentation cleanup

**Tech Stack:** Next.js, TypeScript, Tailwind CSS

**Critical constraint:** Existing customer sites at `{slug}.decolou.com` MUST continue working. The middleware must accept BOTH domains.

---

### Task 1: Environment variables + backward compat

**Files:**
- Modify: `.env`
- Modify: `.env.example`

Update NEXT_PUBLIC_MAIN_DOMAIN to decolou.com but keep decolou.com recognized in middleware.

---

### Task 2: Middleware — accept both domains

**Files:**
- Modify: `src/middleware.ts`

The middleware resolves subdomains. It must:
- Accept `*.decolou.com` as the primary domain
- Continue accepting `*.decolou.com` for existing indexed sites
- Optionally redirect `decolou.com` (root, no subdomain) to `decolou.com`

---

### Task 3: Auth config — cookie domain + trusted origins

**Files:**
- Modify: `src/lib/auth.ts`

Add decolou.com to trusted origins and cookie domain.

---

### Task 4: URL utility functions

**Files:**
- Modify: `src/lib/utils.ts`
- Modify: `src/lib/checkout-helpers.ts`
- Modify: `src/lib/google-indexing.ts`
- Modify: `src/lib/local-seo.ts`

Update getStoreUrl() and other URL generators to use decolou.com.

---

### Task 5: Next.js config — image domains

**Files:**
- Modify: `next.config.ts`

Add `*.decolou.com` to image remote patterns alongside paginalocal.

---

### Task 6: Logo component

**Files:**
- Modify: `src/components/shared/logo.tsx`

Change brand text from "Decolou" to "Decolou".

---

### Task 7: Root layout metadata

**Files:**
- Modify: `src/app/layout.tsx`

Update title, description, OpenGraph, Twitter card, canonical URL.

---

### Task 8: Homepage schema.org

**Files:**
- Modify: `src/app/page.tsx`

Update JSON-LD structured data.

---

### Task 9: Marketing pages — all user-facing text

**Files:**
- All files in `src/app/(marketing)/`

Replace "Decolou" / "Decolou" with "Decolou" in all marketing pages.

---

### Task 10: Landing page sections

**Files:**
- All files in `src/app/(marketing)/_components/sections/`
- `src/app/(marketing)/_components/marketing-footer.tsx`

Replace brand name in testimonials, FAQ answers, CTA text, footer.

---

### Task 11: Auth pages

**Files:**
- `src/app/(auth)/entrar/page.tsx`
- `src/app/(auth)/cadastro/plano-transferencia/_components/transfer-plan-content.tsx`

Update "Decolou" references.

---

### Task 12: Editor + settings UI

**Files:**
- `src/app/editor/[storeSlug]/_components/site-settings-modal.tsx`

Update `.decolou.com` display text to `.decolou.com`.

---

### Task 13: Site renderer footers

**Files:**
- All footer block variants in `src/components/site-renderer/blocks/footer/`
- `src/app/site/[slug]/_components/site-footer.tsx`

Change "Desenvolvido por Decolou" to "Desenvolvido por Decolou".

---

### Task 14: Cookie consent + help modal + draft components

**Files:**
- `src/components/shared/cookie-consent.tsx`
- `src/components/shared/help-modal.tsx`
- `src/components/site/draft-modal.tsx`
- `src/app/site/[slug]/_components/draft-interceptor.tsx`

Update domain references.

---

### Task 15: Sitemap + robots

**Files:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/site/[slug]/sitemap.ts`
- `src/app/site/[slug]/robots.ts`

Update base URLs. Keep decolou.com entries for backward compat.

---

### Task 16: OG image + Twitter image generators

**Files:**
- `src/app/site/[slug]/opengraph-image.tsx`
- `src/app/site/[slug]/twitter-image.tsx`

Update brand text.

---

### Task 17: Store creation actions

**Files:**
- `src/actions/stores/create-store-manual.action.ts`
- `src/actions/stores/create-store-from-google.action.ts`
- `src/actions/stores/update-store.action.ts`

Update subdomain references.

---

### Task 18: Seed data + admin

**Files:**
- `src/db/seed.ts`
- `src/db/seed-stripe-plans.ts`
- `src/actions/admin/create-admin-category.action.ts`
- `src/actions/admin/update-admin-category.action.ts`
- `src/lib/store-builder.ts`

Replace brand references in seed data.

---

### Task 19: Dashboard + negocio pages

**Files:**
- `src/app/negocio/[storeSlug]/_components/negocio-home-content.tsx`
- `src/app/painel/[storeSlug]/editar/_components/seo-tab.tsx`

Update welcome messages and domain displays.

---

### Task 20: Email references

**Files:**
- `.env` (support email)
- Contact pages, privacy policy, terms, LGPD

Update email addresses from @decolou.com to @decolou.com.

---

### Task 21: GTM + analytics

**Files:**
- `src/components/shared/google-tag-manager.tsx`

Update domain filtering.

---

### Task 22: PWA manifest

**Files:**
- `src/app/site/[slug]/manifest.ts`

Update app name.

---

### Task 23: package.json

**Files:**
- `package.json`

Update project name.

---

### Task 24: Type check + verification

Run `npx tsc --noEmit` and grep for remaining "paginalocal" or "Decolou" references.
