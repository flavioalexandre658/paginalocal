import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { service } from '../db/schema/services.schema'
import { store } from '../db/schema/stores.schema'
import { eq, or, isNull } from 'drizzle-orm'
import { guessIconByServiceName } from '../lib/service-icons'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function main() {
  console.log('[Backfill] Buscando serviços sem iconName ou com IconSparkles...')

  const services = await db
    .select({
      id: service.id,
      name: service.name,
      storeId: service.storeId,
      iconName: service.iconName,
    })
    .from(service)
    .where(or(isNull(service.iconName), eq(service.iconName, 'IconSparkles')))

  console.log(`[Backfill] Encontrados ${services.length} serviços para atualizar`)

  if (services.length === 0) {
    console.log('[Backfill] Nada para atualizar!')
    return
  }

  const storeIds = [...new Set(services.map(s => s.storeId))]
  const storeCategories = new Map<string, string>()

  for (const storeId of storeIds) {
    const [storeData] = await db
      .select({ id: store.id, category: store.category })
      .from(store)
      .where(eq(store.id, storeId))
      .limit(1)

    if (storeData) {
      storeCategories.set(storeId, storeData.category)
    }
  }

  let updated = 0
  let changed = 0
  for (const svc of services) {
    const category = storeCategories.get(svc.storeId)
    const newIconName = guessIconByServiceName(svc.name, category)

    if (newIconName !== svc.iconName) {
      await db
        .update(service)
        .set({ iconName: newIconName })
        .where(eq(service.id, svc.id))

      changed++
      console.log(`  [${++updated}/${services.length}] "${svc.name}" (${category || 'sem categoria'}) -> ${newIconName}`)
    } else {
      updated++
    }
  }

  console.log(`[Backfill] Concluído! ${changed} serviços atualizados de ${services.length} processados.`)
}

main().catch(console.error)
