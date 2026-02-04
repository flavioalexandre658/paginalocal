import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notifyStoreActivated } from '@/lib/google-indexing'

async function indexAllActiveStores() {
  console.log('🔍 Buscando stores ativas...\n')

  const activeStores = await db
    .select({
      slug: store.slug,
      name: store.name,
      customDomain: store.customDomain,
    })
    .from(store)
    .where(eq(store.isActive, true))

  console.log(`📊 Encontradas ${activeStores.length} stores ativas\n`)

  if (activeStores.length === 0) {
    console.log('Nenhuma store ativa encontrada.')
    return
  }

  let successCount = 0
  let errorCount = 0

  for (const s of activeStores) {
    console.log(`📤 Enviando: ${s.name} (${s.slug})`)

    const result = await notifyStoreActivated(s.slug, s.customDomain)

    if (result.success) {
      console.log(`   ✅ Sucesso: ${result.url}\n`)
      successCount++
    } else {
      console.log(`   ❌ Erro: ${result.error}\n`)
      errorCount++
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  console.log('\n📈 Resumo:')
  console.log(`   ✅ Sucesso: ${successCount}`)
  console.log(`   ❌ Erros: ${errorCount}`)
  console.log(`   📊 Total: ${activeStores.length}`)
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
