#!/usr/bin/env node
/**
 * Script de migração segura para PGL v3
 * Executa APÓS schemas estarem criados via drizzle-kit push
 */

import 'dotenv/config'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getDefaultSections } from '@/lib/store-sections'

async function migrateToV3() {
  console.log('🚀 Iniciando migração para PGL v3...')
  console.log('')

  try {
    // 1. Buscar todas as stores existentes
    const existingStores = await db.select().from(store)
    
    console.log(`📊 Encontradas ${existingStores.length} lojas no banco`)
    console.log('')

    // 2. Para cada store SEM sections, adicionar default
    let migratedCount = 0
    let skippedCount = 0

    for (const existingStore of existingStores) {
      if (!existingStore.sections) {
        console.log(`   Migrando: ${existingStore.name} (${existingStore.slug})`)
        
        await db
          .update(store)
          .set({
            mode: 'LOCAL_BUSINESS',
            sections: getDefaultSections(),
            templateId: 'default',
            templateConfig: null,
            updatedAt: new Date(),
          })
          .where(eq(store.id, existingStore.id))

        migratedCount++
      } else {
        skippedCount++
      }
    }

    console.log('')
    console.log(`✅ ${migratedCount} lojas migradas com sucesso`)
    console.log(`⏭️  ${skippedCount} lojas já estavam atualizadas`)
    console.log('')
    console.log('🎉 Migração concluída!')
    console.log('')
    console.log('📝 Próximos passos:')
    console.log('   1. Acesse os sites das lojas migradas e confirme que estão funcionando')
    console.log('   2. Rode: npm run db:seed:templates (para popular template default)')
    console.log('   3. Teste criar uma nova loja no onboarding')

    process.exit(0)
  } catch (error) {
    console.error('')
    console.error('💥 Erro fatal durante a migração:', error)
    console.error('')
    process.exit(1)
  }
}

migrateToV3()
