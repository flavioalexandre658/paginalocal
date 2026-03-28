/**
 * migrate-domains-to-vercel.ts
 *
 * Adiciona todos os subdominios de stores ativos como dominios
 * no projeto Vercel para decolou.com
 *
 * Uso:
 *   npx tsx scripts/migrate-domains-to-vercel.ts
 *
 * Ou dry-run (só lista, não adiciona):
 *   npx tsx scripts/migrate-domains-to-vercel.ts --dry-run
 *
 * Env vars necessárias:
 *   DATABASE_URL       — conexão com o banco Neon
 *   VERCEL_TOKEN       — token da API Vercel
 *   VERCEL_PROJECT_ID  — ID do projeto na Vercel
 *   VERCEL_TEAM_ID     — (opcional) ID do time na Vercel
 */

import { neon } from "@neondatabase/serverless"
import "dotenv/config"

// ─── Config ──────────────────────────────────────────────────────────────────

const NEW_DOMAIN = "decolou.com"
const VERCEL_TOKEN = process.env.VERCEL_TOKEN
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID // opcional
const DATABASE_URL = process.env.DATABASE_URL

const DRY_RUN = process.argv.includes("--dry-run")

if (!VERCEL_TOKEN) throw new Error("VERCEL_TOKEN não encontrado no .env")
if (!VERCEL_PROJECT_ID) throw new Error("VERCEL_PROJECT_ID não encontrado no .env")
if (!DATABASE_URL) throw new Error("DATABASE_URL não encontrado no .env")

// ─── Vercel API helpers ──────────────────────────────────────────────────────

const VERCEL_API = "https://api.vercel.com"

function vercelUrl(path: string): string {
  const teamQuery = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
  return `${VERCEL_API}${path}${teamQuery}`
}

async function getExistingDomains(): Promise<Set<string>> {
  const domains = new Set<string>()
  let hasNext = true
  let url = vercelUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains`)

  while (hasNext) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Erro ao listar domínios: ${res.status} ${body}`)
    }

    const data = await res.json()

    for (const d of data.domains || []) {
      domains.add(d.name)
    }

    if (data.pagination?.next) {
      url = vercelUrl(`/v9/projects/${VERCEL_PROJECT_ID}/domains`) +
        (VERCEL_TEAM_ID ? "&" : "?") + `until=${data.pagination.next}`
    } else {
      hasNext = false
    }
  }

  return domains
}

async function addDomain(domain: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(vercelUrl(`/v10/projects/${VERCEL_PROJECT_ID}/domains`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: domain }),
  })

  if (res.ok) {
    return { ok: true }
  }

  const body = await res.json().catch(() => ({}))
  const errorCode = body?.error?.code || ""

  // Domain already exists — not an error
  if (errorCode === "domain_already_in_use" || errorCode === "domain_already_exists") {
    return { ok: true }
  }

  return { ok: false, error: `${res.status} ${errorCode}: ${body?.error?.message || JSON.stringify(body)}` }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗")
  console.log("║  Migração de domínios → Vercel (decolou.com)            ║")
  console.log("╚══════════════════════════════════════════════════════════╝")
  console.log("")

  if (DRY_RUN) {
    console.log("⚠️  Modo DRY-RUN: nenhum domínio será adicionado\n")
  }

  // 1. Buscar stores ativos no banco
  console.log("📦 Buscando stores ativos no banco...")
  const sql = neon(DATABASE_URL!)
  const stores = await sql`
    SELECT slug, custom_domain
    FROM store
    WHERE is_active = true
    ORDER BY slug
  `

  console.log(`   Encontrados: ${stores.length} stores ativos\n`)

  if (stores.length === 0) {
    console.log("Nenhum store ativo. Nada a fazer.")
    return
  }

  // 2. Listar domínios já existentes na Vercel
  console.log("🔍 Listando domínios existentes na Vercel...")
  const existingDomains = await getExistingDomains()
  console.log(`   Existentes: ${existingDomains.size} domínios\n`)

  // 3. Montar lista de domínios a adicionar
  const domainsToAdd: { slug: string; domain: string }[] = []

  for (const s of stores) {
    const slug = s.slug as string
    const customDomain = s.custom_domain as string | null

    // Subdomínio no novo domínio
    const newSubdomain = `${slug}.${NEW_DOMAIN}`
    if (!existingDomains.has(newSubdomain)) {
      domainsToAdd.push({ slug, domain: newSubdomain })
    }

    // Custom domain (se existir, manter também)
    if (customDomain && !existingDomains.has(customDomain)) {
      domainsToAdd.push({ slug, domain: customDomain })
    }
  }

  console.log(`📋 Domínios a adicionar: ${domainsToAdd.length}\n`)

  if (domainsToAdd.length === 0) {
    console.log("✅ Todos os domínios já estão configurados na Vercel!")
    return
  }

  // 4. Adicionar domínios
  let success = 0
  let failed = 0
  let skipped = 0

  for (const { slug, domain } of domainsToAdd) {
    if (DRY_RUN) {
      console.log(`   [DRY-RUN] ${domain} (store: ${slug})`)
      skipped++
      continue
    }

    const result = await addDomain(domain)

    if (result.ok) {
      console.log(`   ✅ ${domain}`)
      success++
    } else {
      console.log(`   ❌ ${domain} — ${result.error}`)
      failed++
    }

    // Rate limiting: 100ms entre requests
    await new Promise((r) => setTimeout(r, 100))
  }

  // 5. Resumo
  console.log("\n════════════════════════════════════════")
  console.log("📊 Resumo:")
  console.log(`   Stores ativos:     ${stores.length}`)
  console.log(`   Já existentes:     ${existingDomains.size}`)
  console.log(`   A adicionar:       ${domainsToAdd.length}`)
  if (DRY_RUN) {
    console.log(`   Dry-run (skip):    ${skipped}`)
  } else {
    console.log(`   Adicionados:       ${success}`)
    console.log(`   Falhas:            ${failed}`)
  }
  console.log("════════════════════════════════════════\n")

  if (failed > 0) {
    console.log("⚠️  Alguns domínios falharam. Verifique os erros acima.")
    process.exit(1)
  }

  console.log("✅ Migração concluída!")
}

main().catch((err) => {
  console.error("❌ Erro fatal:", err)
  process.exit(1)
})
