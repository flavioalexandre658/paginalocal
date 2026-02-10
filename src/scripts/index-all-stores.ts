import 'dotenv/config'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notifyStoreActivated } from '@/lib/google-indexing'

async function indexAllActiveStores() {
  console.log('Buscando stores ativas...\n')

  const activeStores = await db
    .select({
      id: store.id,
      slug: store.slug,
      name: store.name,
      customDomain: store.customDomain,
    })
    .from(store)
    .where(eq(store.isActive, true))

  console.log(`Encontradas ${activeStores.length} stores ativas\n`)

  if (activeStores.length === 0) {
    console.log('Nenhuma store ativa encontrada.')
    return
  }

  let totalSuccess = 0
  let totalFailed = 0

  for (const s of activeStores) {
    const services = await db
      .select({ slug: service.slug })
      .from(service)
      .where(eq(service.storeId, s.id))

    const serviceSlugs = services
      .map(svc => svc.slug)
      .filter((slug): slug is string => !!slug)

    console.log(`Enviando: ${s.name} (${s.slug}) - ${serviceSlugs.length + 1} URLs`)

    const result = await notifyStoreActivated(s.slug, s.customDomain, serviceSlugs)

    totalSuccess += result.success
    totalFailed += result.failed

    console.log(`  -> ${result.success}/${result.total} URLs indexadas\n`)

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\nResumo:')
  console.log(`  Sucesso: ${totalSuccess}`)
  console.log(`  Erros: ${totalFailed}`)
  console.log(`  Stores: ${activeStores.length}`)
}

indexAllActiveStores()
  .then(() => {
    console.log('\n✨ Processo finalizado!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error)
    process.exit(1)
  })
