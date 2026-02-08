import 'dotenv/config'
import { db } from '@/db'
import { service } from '@/db/schema'
import { isNull, eq, and } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'

async function backfillServiceSlugs() {
  console.log('Starting service slug backfill...')

  const servicesWithoutSlug = await db
    .select({
      id: service.id,
      storeId: service.storeId,
      name: service.name,
    })
    .from(service)
    .where(isNull(service.slug))

  console.log(`Found ${servicesWithoutSlug.length} services without slugs`)

  let updated = 0

  for (const svc of servicesWithoutSlug) {
    const baseSlug = generateSlug(svc.name)
    let slug = baseSlug
    let counter = 1

    while (true) {
      const [existing] = await db
        .select({ id: service.id })
        .from(service)
        .where(and(eq(service.storeId, svc.storeId), eq(service.slug, slug)))
        .limit(1)

      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    await db
      .update(service)
      .set({ slug, updatedAt: new Date() })
      .where(eq(service.id, svc.id))

    updated++
    if (updated % 50 === 0) {
      console.log(`Updated ${updated}/${servicesWithoutSlug.length} services`)
    }
  }

  console.log(`Backfill complete: ${updated} services updated`)
}

backfillServiceSlugs()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Backfill failed:', err)
    process.exit(1)
  })
